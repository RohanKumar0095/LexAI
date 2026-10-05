import logging
from typing import List, Dict, Any, Tuple
from backend.app.schemas.rag import RetrievedChunk, LegalSource
from backend.app.legal.citations import format_citation

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are LexAI India, an objective, rigorous, AI-powered legal information assistant specializing in Indian Law (Supreme Court, High Courts, Bharatiya Nyaya Sanhita / IPC, BNSS / CrPC, BSA / Evidence Act, Constitution of India, and Indian statutes).

Your instructions:
1. Primary Basis: Use the supplied Grounded Legal Evidence as the primary factual and authoritative basis for your answer.
2. Strict Truthfulness: Do NOT fabricate, invent, or hallucinate cases, statutory sections, legal citations, judicial quotes, or legal authorities. If the provided evidence does not contain the answer, explicitly state that the available legal corpus contains insufficient evidence.
3. Clarity and Explanation: Explain complex Indian legal terminology in clear, plain language so the user can understand the underlying legal concepts without distortion.
4. Professional Boundary: Provide clear legal information, not formal legal advice. Do NOT claim certainty where the evidence or law is unsettled or ambiguous.
5. Grounding & Citations: Reference the specific source documents, cases, statutory sections, or paragraphs provided in the evidence when making legal claims.
6. Sources Section: Conclude your answer with a clearly structured "Sources:" section listing the referenced legal documents and sections."""


class LegalPromptBuilder:
    """
    Constructs grounded prompts and formats sources for Gemini LLM.
    """

    @staticmethod
    def build_grounded_prompt(query: str, chunks: List[RetrievedChunk], explain_mode: str = "simple") -> Tuple[str, str, List[LegalSource]]:
        """
        Builds the system prompt, user prompt with structured evidence, and returns structured sources.
        """
        sources: List[LegalSource] = []

        mode_instructions = {
            "simple": "Explain the legal position in simple, easily understandable language for an Indian citizen, without excessive legalese.",
            "detailed": "Provide a comprehensive, detailed legal analysis with structured sections, requirements, and remedies.",
            "case-analysis": "Focus specifically on judicial precedents, legal principles, ratios, and findings of the courts.",
            "technical": "Provide a formal, technically precise legal analysis citing exact statutory sections and procedural requirements."
        }.get(explain_mode, "Provide a clear and accurate legal explanation.")

        if not chunks:
            # Controlled response scenario when no evidence is available
            evidence_context = "NO RELEVANT LEGAL EVIDENCE FOUND IN THE INDEXED CORPUS."
            user_prompt = f"""User Legal Query: {query}
Explanation Preference: {explain_mode} ({mode_instructions})

Grounded Legal Evidence:
{evidence_context}

Please respond to the user query by explaining clearly that the indexed legal knowledge base does not currently contain relevant documents or evidence to answer this question accurately, and advise them on what statutory provisions or documents may need to be indexed."""
            return SYSTEM_PROMPT, user_prompt, []

        evidence_blocks = []
        for idx, chunk in enumerate(chunks, 1):
            meta = chunk.metadata
            doc_title = meta.case_name or meta.extra.get("title") if meta.extra else "Legal Document"
            court = meta.court or "Court / Authority"
            citation = meta.citation or "N/A"
            section = meta.section_reference or "N/A"
            para = meta.paragraph_reference or f"Page {meta.page_number}" if meta.page_number else "N/A"

            evidence_block = f"""--- EVIDENCE [{idx}] ---
Document / Case: {doc_title}
Court: {court}
Citation: {citation}
Section/Provision: {section}
Reference: {para}
Text:
{chunk.chunk_text}
--------------------"""
            evidence_blocks.append(evidence_block)

            # Build structured source
            sources.append(LegalSource(
                document_id=chunk.document_id,
                chunk_id=chunk.chunk_id,
                title=meta.extra.get("title") if meta.extra else doc_title,
                case_name=meta.case_name,
                court=meta.court,
                citation=meta.citation,
                judgment_date=meta.judgment_date,
                section_reference=meta.section_reference,
                paragraph_reference=meta.paragraph_reference,
                page_number=meta.page_number,
                source_url=meta.source_url,
                relevance_score=chunk.score,
                snippet=chunk.chunk_text[:300] + ("..." if len(chunk.chunk_text) > 300 else "")
            ))

        full_evidence_str = "\n\n".join(evidence_blocks)

        user_prompt = f"""User Legal Query: {query}
Explanation Preference: {explain_mode} ({mode_instructions})

Grounded Legal Evidence:
{full_evidence_str}

Based ONLY on the provided legal evidence above, please provide a clear, accurate, and well-structured answer explaining the legal position, relevant sections/provisions, and judicial reasoning tailored to the {explain_mode} perspective. At the end, include a "Sources:" list."""

        return SYSTEM_PROMPT, user_prompt, sources
