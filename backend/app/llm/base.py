from abc import ABC, abstractmethod
from typing import Optional


class BaseLLM(ABC):
    """Abstract interface for LLM providers."""

    @abstractmethod
    def generate_answer(self, system_prompt: str, prompt: str) -> str:
        """Generates a text answer given system and user prompts."""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Returns True if the LLM provider is properly configured."""
        pass
