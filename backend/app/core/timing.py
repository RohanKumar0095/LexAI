import time
import logging
from contextlib import contextmanager
from typing import Dict, Generator, Optional

logger = logging.getLogger("lexai_perf")


class StageTimer:
    """
    Lightweight, high-resolution performance tracker for Legal RAG requests.
    Measures duration of individual stages using time.perf_counter().
    Guarantees no sensitive data (query, text, tokens, keys) is logged.
    """

    def __init__(self, operation_name: str = "request"):
        self.operation_name = operation_name
        self.timings: Dict[str, float] = {}
        self._start_time = time.perf_counter()

    @contextmanager
    def measure(self, stage_name: str) -> Generator[None, None, None]:
        t0 = time.perf_counter()
        try:
            yield
        finally:
            elapsed_ms = (time.perf_counter() - t0) * 1000.0
            self.timings[stage_name] = round(elapsed_ms, 2)

    def record(self, stage_name: str, duration_ms: float) -> None:
        self.timings[stage_name] = round(duration_ms, 2)

    def finish(self, log_output: bool = True) -> Dict[str, float]:
        total_ms = (time.perf_counter() - self._start_time) * 1000.0
        self.timings["total_ms"] = round(total_ms, 2)
        if log_output:
            parts = [f"{k}={v:.2f}ms" for k, v in self.timings.items()]
            logger.info(f"[PERF] op={self.operation_name} {' '.join(parts)}")
        return self.timings
