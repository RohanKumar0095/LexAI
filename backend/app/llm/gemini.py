import os
import logging
from typing import Optional
from backend.app.core.config import get_settings
from backend.app.llm.base import BaseLLM

logger = logging.getLogger(__name__)


class GeminiService(BaseLLM):
    """
    Google Gemini client using current 'google-genai' SDK.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        settings = get_settings()
        if api_key is not None:
            raw_key = api_key
        else:
            raw_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
        self.api_key = raw_key.strip() if (raw_key and raw_key.strip()) else None
        self.model_name = model or settings.GEMINI_MODEL or "gemini-3.5-flash-lite"
        self._client = None
        self._initialize_client()

    def _initialize_client(self):
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set. Gemini generation will fail unless mocked or configured.")
            return

        try:
            from google import genai
            self._client = genai.Client(api_key=self.api_key)
            logger.info(f"Gemini client initialized with model '{self.model_name}'")
        except Exception as e:
            logger.error(f"Failed to initialize Google GenAI Client: {e}", exc_info=True)
            self._client = None

    def is_available(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    def generate_answer(self, system_prompt: str, prompt: str) -> str:
        """
        Sends grounded legal prompt to Gemini and returns the generated answer.
        """
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing. Please set it in .env.")

        if self._client is None:
            self._initialize_client()
        if self._client is None:
            raise RuntimeError("Could not connect to Gemini API Client.")

        primary = self.model_name or "gemini-3.5-flash-lite"
        candidates = [primary]
        for fallback in ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.8-flash", "gemini-flash-latest"]:
            if fallback not in candidates:
                candidates.append(fallback)

        last_error = None
        for current_model in candidates:
            logger.info(f"Sending generation request to Gemini model '{current_model}'")
            try:
                from google.genai import types

                response = self._client.models.generate_content(
                    model=current_model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=0.1,  # Low temperature for factual precision
                    )
                )

                if response and response.text:
                    return response.text.strip()
                return "No response generated from Gemini."
            except Exception as e:
                logger.warning(f"Error calling Gemini model '{current_model}': {e}. Trying fallback if available...")
                last_error = e

        logger.error(f"All candidate Gemini models failed. Last error: {last_error}", exc_info=True)
        raise RuntimeError(f"Gemini API Error: {str(last_error)}")


_cached_gemini_service: Optional[GeminiService] = None


def get_gemini_service() -> GeminiService:
    global _cached_gemini_service
    if _cached_gemini_service is None:
        _cached_gemini_service = GeminiService()
    return _cached_gemini_service
