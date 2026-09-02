"""Canonical exam configuration loader (Phase 0 of the multi-exam redesign).

Authored once in ``shared/exam-config.json`` at the repo root; ``app/data/exam-config.json``
is a synced deployment copy so the file ships inside the backend Docker image (whose build
context is ``backend/`` only, per ``COPY . .`` in the Dockerfile). When editing exam config,
update ``shared/exam-config.json`` first and copy it here to keep both in sync.
"""
import json
from functools import lru_cache
from pathlib import Path
from typing import Any

_BACKEND_COPY = Path(__file__).resolve().parent.parent / "data" / "exam-config.json"
_REPO_ROOT_CANONICAL = Path(__file__).resolve().parents[3] / "shared" / "exam-config.json"


@lru_cache
def _load_raw() -> dict[str, Any]:
    # Prefer the repo-root canonical copy in local dev; fall back to the bundled
    # deployment copy when the repo root isn't present (e.g. inside the Docker image).
    path = _REPO_ROOT_CANONICAL if _REPO_ROOT_CANONICAL.exists() else _BACKEND_COPY
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def get_all_exam_configs() -> dict[str, dict[str, Any]]:
    return _load_raw()["exams"]


def get_exam_ids() -> frozenset[str]:
    return frozenset(get_all_exam_configs().keys())


def is_valid_exam_id(exam_id: str | None) -> bool:
    return bool(exam_id) and exam_id.lower().strip() in get_exam_ids()


def normalize_exam_id(raw: str | None) -> str | None:
    """Canonical lowercase exam id, or None if not a recognized exam."""
    if not raw:
        return None
    candidate = raw.lower().strip()
    return candidate if candidate in get_exam_ids() else None


def get_exam_config(exam_id: str) -> dict[str, Any]:
    normalized = normalize_exam_id(exam_id)
    if normalized is None:
        raise KeyError(f"Unknown exam id: {exam_id!r}")
    return get_all_exam_configs()[normalized]


def get_regents_subject_config(subject_id: str) -> dict[str, Any] | None:
    regents = get_exam_config("regents")
    for subject in regents.get("subjects", []):
        if subject["id"] == subject_id:
            return subject
    return None
