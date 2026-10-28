import re
import json
import logging
from typing import List, Dict, Any, Tuple, Optional
from backend.app.schemas.rag import RetrievedChunk, LegalSource, StructuredLegalAnswer, KeyPointItem

logger = logging.getLogger(__name__)


def extract_statutory_section_from_text(text: str) -> Optional[str]:
    """
    Extracts statutory section numbers (e.g. 'Section 35', 'Section 482') from chunk text
    when metadata is missing section references.
    """
    if not text:
        return None
    # Pattern for statutory section start in legislative drafting:
    # e.g. "35. (1) Any police officer...", "45. A police officer...", "482. (1)"
    m = re.search(r"(?:^|\n)\s*([0-9]{1,3})\.\s*(?:\([0-9a-zA-Z]+\)|[A-Z])", text)
    if m:
        sec_num = m.group(1)
        # Avoid treating solitary digit 1 on page 1 as section if no statutory text
        if int(sec_num) > 0:
            return f"Section {sec_num}"
    # Secondary check for explicit 'Section X' mentions
    m2 = re.search(r"\bSection\s+([0-9]{1,3}[A-Z]?)\b", text, re.IGNORECASE)
    if m2:
        return f"Section {m2.group(1)}"
    return None


TRANSFORMATION_SYSTEM_PROMPT = """You are a legal information formatting and simplification engine for LexAI India. You are NOT an independent source of legal knowledge.

CRITICAL CONSTRAINTS:
1. USE EXCLUSIVELY THE SUPPLIED ACCEPTED EVIDENCE: Every single factual statement, condition, exception, and procedural step you produce must originate directly and strictly from the supplied evidence passages.
2. DO NOT USE PRETRAINED KNOWLEDGE: Do not introduce external laws, acts, cases, statutory sections, legal citations, penalties, time limits, procedures, or interpretations not present in the supplied evidence.
3. DIRECT PROVISION RELEVANCE & ISOLATION:
   - Focus EXCLUSIVELY on the specific legal provision(s) and passages that directly answer the user's specific inquiry.
   - DO NOT bundle or mix peripheral or incidental provisions into the answer. For example, if the user asks about the conditions for arresting without a warrant, do not include provisions concerning cross-state pursuit, post-arrest magistrate remand, or bail procedures, unless the user specifically asked about them.
   - If multiple distinct provisions are genuinely required to answer a multi-part question, address each part under its specific provision and cite only that provision's evidence ID.
4. NO DUPLICATION:
   - Do not repeat identical facts across summary, key points, conditions, and notes. State each fact once in its single most appropriate structured section.
5. PRESERVE MATERIAL QUALIFICATIONS:
   - Retain all statutory conditions, provisos, exceptions, and limitations that qualify the rule (e.g. 'offence punishable with imprisonment up to 7 years requires satisfaction of specific criteria'). Do not simplify away crucial legal qualifications.
6. ACCURATE DOCUMENT PROVENANCE:
   - The Bharatiya Nagarik Suraksha Sanhita document in the corpus is the Bill 'As Introduced in Lok Sabha' (Bill No. 122 of 2023). When referencing it, represent it accurately as the Lok Sabha Bill version, not as an unreferenced definitive amended code.
7. EXPLICIT UNAVAILABLE FIELDS:
   - If the user's question asks for specific details (such as penalties, deadlines, bail criteria, or exceptions) that are NOT established by the supplied evidence, do NOT guess or invent them. You MUST explicitly list them in the "unavailable_information" array.
8. MANDATORY JSON OUTPUT: You must output ONLY a valid JSON object matching the exact schema below. Do not include markdown code block backticks (like ```json), commentary, or surrounding text.

JSON OUTPUT SCHEMA:
{
  "status": "supported" (or "partially_supported"),
  "summary": "Clear, concise 1-2 sentence plain-language summary answering the specific question.",
  "summary_source_ids": ["EVIDENCE_1"],
  "key_points": [
    {
      "text": "Plain-language factual legal point supported by the evidence.",
      "source_ids": ["EVIDENCE_1"]
    }
  ],
  "steps": [
    {
      "text": "Step 1 description (only if procedural steps are in evidence, else empty list)",
      "source_ids": ["EVIDENCE_1"]
    }
  ],
  "conditions": [
    {
      "text": "Condition or statutory requirement explicitly stated in the evidence (else empty list)",
      "source_ids": ["EVIDENCE_1"]
    }
  ],
  "exceptions": [
    {
      "text": "Exception or proviso explicitly stated in the evidence (else empty list)",
      "source_ids": ["EVIDENCE_1"]
    }
  ],
  "important_notes": [
    {
      "text": "Practical clarification or statutory boundary from the evidence (else empty list)",
      "source_ids": ["EVIDENCE_1"]
    }
  ],
  "unavailable_information": [
    "Specific aspect requested by user but absent from the supplied evidence (e.g. 'Bail conditions for this section are not in the provided excerpt')"
  ]
}"""


class LegalPromptBuilder:
    """
    Constructs strict transformation-only prompts and maps structured sources for Gemini LLM.
    """

    @staticmethod
    def build_grounded_prompt(
        query: str,
        chunks: List[RetrievedChunk],
        explain_mode: str = "simple",
        is_partial: bool = False
    ) -> Tuple[str, str, List[LegalSource]]:
        """
        Builds the transformation system prompt, user prompt with structured evidence IDs,
        and returns structured source objects for provenance tracking.
        """
        sources: List[LegalSource] = []

        mode_instructions = {
            "simple": "Explain in simple, everyday language for an ordinary citizen without legalese.",
            "detailed": "Provide structured breakdown with all requirements, conditions, and distinctions from the evidence.",
            "case-analysis": "Focus on judicial rulings, ratios, findings of the court, and section interpretations in the text.",
            "technical": "Preserve formal statutory terminology and precise procedural wording from the text."
        }.get(explain_mode, "Provide a clear and accurate explanation.")

        evidence_blocks = []
        for idx, chunk in enumerate(chunks, 1):
            evidence_id = f"EVIDENCE_{idx}"
            meta = chunk.metadata
            raw_title = meta.case_name or (meta.extra.get("title") if meta.extra else "Legal Document")
            
            # Format title accurately reflecting Lok Sabha bill status where applicable
            if "Bharatiya Nagarik Suraksha" in raw_title:
                doc_title = "Bharatiya Nagarik Suraksha Sanhita, 2023 (Bill No. 122 of 2023 - As Introduced in Lok Sabha)"
            elif "Bharatiya Nyaya Sanhita" in raw_title:
                doc_title = "Bharatiya Nyaya Sanhita, 2023 (Bill No. 121 of 2023 - As Introduced in Lok Sabha)"
            else:
                doc_title = raw_title

            court = meta.court or ("Parliament of India (Lok Sabha)" if ("Bharatiya Nagarik" in raw_title or "Bharatiya Nyaya" in raw_title) else "Court / Authority")
            citation = meta.citation or "N/A"
            
            # Detect section reference if empty in metadata
            section = meta.section_reference
            if not section:
                section = extract_statutory_section_from_text(chunk.chunk_text) or "N/A"

            para = meta.paragraph_reference or (f"Page {meta.page_number}" if meta.page_number else "N/A")
            page_num_str = f"PDF Page {meta.page_number}" if meta.page_number else "N/A"

            evidence_block = f"""--- [{evidence_id}] ---
Evidence ID: {evidence_id}
Chunk ID: {chunk.chunk_id}
Document: {doc_title}
Authority / Court: {court}
Citation: {citation}
Section / Provision: {section}
Location: {para} ({page_num_str})
Text:
{chunk.chunk_text}
--------------------"""
            evidence_blocks.append(evidence_block)

            sources.append(LegalSource(
                evidence_id=evidence_id,
                document_id=chunk.document_id,
                chunk_id=chunk.chunk_id,
                title=doc_title,
                case_name=meta.case_name,
                court=court,
                citation=meta.citation,
                judgment_date=meta.judgment_date,
                section_reference=section if section != "N/A" else None,
                paragraph_reference=meta.paragraph_reference,
                page_number=meta.page_number,
                source_url=meta.source_url,
                relevance_score=chunk.score,
                snippet=chunk.chunk_text[:350] + ("..." if len(chunk.chunk_text) > 350 else "")
            ))

        full_evidence_str = "\n\n".join(evidence_blocks)

        status_directive = (
            "NOTE: The retrieved evidence provides only PARTIAL coverage of the user's question. "
            "You MUST set status to 'partially_supported' and explicitly list all unaddressed aspects in 'unavailable_information'."
            if is_partial else
            "Transform the supported facts into the JSON schema. Focus strictly on the provision(s) that directly answer the inquiry. If any requested aspect is missing from the evidence, include it in 'unavailable_information'."
        )

        user_prompt = f"""User Legal Question: {query}
Explanation Preference: {explain_mode} ({mode_instructions})

{status_directive}

ACCEPTED EVIDENCE PASSAGES:
{full_evidence_str}

Remember:
1. Base your output ONLY on the accepted evidence passages above.
2. Focus exclusively on the provision(s) that directly answer the question. Do not bundle unrelated provisions.
3. Every item in key_points, steps, conditions, exceptions, and important_notes MUST specify its exact source_ids (e.g. ["EVIDENCE_1"]).
4. Output ONLY the JSON object. No Markdown code fences, no conversational prose."""

        return TRANSFORMATION_SYSTEM_PROMPT, user_prompt, sources

    @staticmethod
    def parse_structured_transformation(
        raw_text: str,
        sources: List[LegalSource],
        fallback_query: str = ""
    ) -> StructuredLegalAnswer:
        """
        Parses and validates Gemini's structured JSON transformation output.
        Normalizes items to KeyPointItem and validates source provenance against accepted evidence.
        """
        cleaned = raw_text.strip()
        # Strip markdown fences if present
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        # Find first { and last }
        start_idx = cleaned.find("{")
        end_idx = cleaned.rfind("}")
        if start_idx != -1 and end_idx != -1:
            cleaned = cleaned[start_idx:end_idx + 1]

        valid_source_ids = {s.evidence_id for s in sources if s.evidence_id}
        valid_chunk_ids = {s.chunk_id for s in sources}
        # Fallback default source ID if none is supplied
        default_src_id = [sources[0].evidence_id] if sources and sources[0].evidence_id else []

        def sanitize_item_list(raw_list: Any) -> List[KeyPointItem]:
            items: List[KeyPointItem] = []
            if not isinstance(raw_list, list):
                return items
            for elem in raw_list:
                if isinstance(elem, dict) and "text" in elem:
                    text_str = str(elem["text"]).strip()
                    if not text_str:
                        continue
                    src_ids = elem.get("source_ids", [])
                    if isinstance(src_ids, list):
                        valid_ids = [s for s in src_ids if s in valid_source_ids or s in valid_chunk_ids]
                    else:
                        valid_ids = []
                    items.append(KeyPointItem(
                        text=text_str,
                        source_ids=valid_ids if valid_ids else default_src_id
                    ))
                elif isinstance(elem, str):
                    text_str = elem.strip()
                    if text_str:
                        items.append(KeyPointItem(
                            text=text_str,
                            source_ids=default_src_id
                        ))
            return items

        try:
            data = json.loads(cleaned)
            summary_str = str(data.get("summary", "")).strip()
            summary_srcs = data.get("summary_source_ids", [])
            valid_summary_srcs = [s for s in summary_srcs if s in valid_source_ids or s in valid_chunk_ids] if isinstance(summary_srcs, list) else default_src_id

            return StructuredLegalAnswer(
                status=data.get("status", "supported"),
                summary=summary_str,
                summary_source_ids=valid_summary_srcs if valid_summary_srcs else default_src_id,
                key_points=sanitize_item_list(data.get("key_points", [])),
                steps=sanitize_item_list(data.get("steps", [])),
                conditions=sanitize_item_list(data.get("conditions", [])),
                exceptions=sanitize_item_list(data.get("exceptions", [])),
                important_notes=sanitize_item_list(data.get("important_notes", [])),
                unavailable_information=[str(u).strip() for u in data.get("unavailable_information", []) if str(u).strip()],
            )
        except Exception as e:
            logger.warning(f"Could not parse structured JSON response: {e}. Building fallback structured format from text.")
            clean_lines = [l.strip() for l in raw_text.splitlines() if l.strip() and not l.startswith("```")]
            summary_candidate = clean_lines[0] if clean_lines else "Information extracted from indexed legal documents."
            points = [
                KeyPointItem(text=line.lstrip("*-#0123456789. "), source_ids=default_src_id)
                for line in clean_lines[1:6]
            ]
            return StructuredLegalAnswer(
                status="supported",
                summary=summary_candidate,
                summary_source_ids=default_src_id,
                key_points=points,
                steps=[],
                conditions=[],
                exceptions=[],
                important_notes=[],
                unavailable_information=[]
            )

    @staticmethod
    def format_structured_answer_to_markdown(structured: StructuredLegalAnswer, is_partial: bool = False) -> str:
        """
        Converts the structured legal answer into clean, accessible markdown for display.
        Uses double newlines to ensure headings and list items never concatenate into literal asterisks.
        """
        parts = []

        if is_partial or structured.status == "partially_supported":
            parts.append("> **Note on Corpus Coverage:** The indexed legal documents answer *part* of this inquiry. Unsupported aspects are identified below and excluded from substantive findings.\n")

        if structured.summary:
            parts.append(f"{structured.summary}\n")

        if structured.key_points:
            parts.append("### Key Legal Findings\n")
            for kp in structured.key_points:
                parts.append(f"* {kp.text}")
            parts.append("")

        if structured.steps:
            parts.append("### Procedure & Steps\n")
            for idx, step in enumerate(structured.steps, 1):
                parts.append(f"{idx}. {step.text}")
            parts.append("")

        if structured.conditions:
            parts.append("### Conditions & Requirements\n")
            for cond in structured.conditions:
                parts.append(f"* {cond.text}")
            parts.append("")

        if structured.exceptions:
            parts.append("### Exceptions & Provisos\n")
            for exc in structured.exceptions:
                parts.append(f"* {exc.text}")
            parts.append("")

        if structured.important_notes:
            parts.append("### Important Notes\n")
            for note in structured.important_notes:
                parts.append(f"* {note.text}")
            parts.append("")

        if structured.unavailable_information:
            parts.append("### Information Not Available in Indexed Documents\n")
            for unavail in structured.unavailable_information:
                parts.append(f"* ⚠️ {unavail}")
            parts.append("")

        return "\n\n".join(p.strip() for p in parts if p.strip()).strip()
