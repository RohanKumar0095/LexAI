# LexAI India Legal Corpus Setup

## Real Legal Documents
To populate your LexAI legal knowledge base with real Indian legal authorities:

1. Download authentic legal documents in PDF format from official repositories:
   - **Supreme Court of India**: [https://main.sci.gov.in](https://main.sci.gov.in) or [https://judgments.ecourts.gov.in](https://judgments.ecourts.gov.in)
   - **India Code (Statutes & Acts)**: [https://www.indiacode.nic.in](https://www.indiacode.nic.in) (e.g., Bharatiya Nyaya Sanhita 2023, Bharatiya Nagarik Suraksha Sanhita 2023, Bharatiya Sakshya Adhiniyam 2023, Constitution of India)
   - **High Courts of India**: Official High Court portals.

2. Place your `.pdf` judgment or statute files directly into:
   ```
   backend/data/raw/
   ```

3. Run the ingestion command:
   ```bash
   python -m backend.scripts.ingest_documents
   ```

## Note on Synthetic Testing
For unit tests, the system uses programmatically generated test documents with clearly marked non-confidential test fixtures. No real judgments are fabricated or mocked as real case citations.
