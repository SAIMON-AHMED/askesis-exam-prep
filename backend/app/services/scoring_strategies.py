"""Per-exam scoring strategies (Phase 1 step 5).

Replaces the old single ``_estimate_scaled_score()`` that hardcoded SAT's 200-800 range
for every exam. Each exam reads its own range from the shared exam config
(``app/core/exam_config.py``). Until a real, validated raw->scaled conversion table
exists for an exam, results are always returned with ``is_readiness_estimate=True`` and
must be labeled "readiness estimate" in the UI, never "official scaled score".
"""
from dataclasses import dataclass

from app.core.exam_config import get_exam_config, get_regents_subject_config, normalize_exam_id


@dataclass
class ScoreEstimate:
    scaled_score_low: int
    scaled_score_high: int
    label: str
    is_readiness_estimate: bool
    provenance: str


def _range_estimate(pct: float, low: int, high: int, spread_fraction: float = 0.05) -> tuple[int, int]:
    span = high - low
    center = int(low + pct * span)
    spread = max(1, int(span * spread_fraction))
    return max(low, center - spread), min(high, center + spread)


def estimate_scaled_score(
    exam_id: str, raw_score: int, total_questions: int, subject_id: str | None = None
) -> ScoreEstimate:
    """Dispatch to the correct exam's scoring strategy and return a readiness estimate."""
    normalized = normalize_exam_id(exam_id)
    if normalized is None:
        # Unknown/legacy exam_type value: fall back to a neutral 0-100 percentage
        # rather than silently reusing SAT's scale.
        pct = 0.0 if total_questions == 0 else raw_score / total_questions
        low, high = _range_estimate(pct, 0, 100)
        return ScoreEstimate(low, high, "Readiness (%)", True, "No exam config match; generic percentage fallback.")

    config = get_exam_config(normalized)
    scoring = config["scoring"]
    pct = 0.0 if total_questions == 0 else raw_score / total_questions

    if normalized == "regents":
        subject = get_regents_subject_config(subject_id) if subject_id else None
        if subject is None:
            # No subject specified/known: cannot produce a subject-specific estimate.
            return ScoreEstimate(0, 100, "Readiness (%)", True, "Regents subject not specified.")
        scale = subject["scale"]
        low, high = _range_estimate(pct, scale["min"], scale["max"])
        return ScoreEstimate(low, high, subject["name"], True, scoring["provenance"])

    if normalized == "gre":
        # ETS never publishes one combined GRE score; this is an informal
        # verbal+quant sum shown only as a rough readiness range, not an official score.
        verbal = next(s for s in scoring["sections"] if s["id"] == "verbal")
        quant = next(s for s in scoring["sections"] if s["id"] == "quant")
        combined_min = verbal["min"] + quant["min"]
        combined_max = verbal["max"] + quant["max"]
        low, high = _range_estimate(pct, combined_min, combined_max)
        return ScoreEstimate(low, high, "Verbal+Quant (informal)", True, scoring["provenance"])

    combined = scoring.get("combined")
    if combined is None:
        low, high = _range_estimate(pct, 0, 100)
        return ScoreEstimate(low, high, "Readiness (%)", True, scoring.get("provenance", ""))

    low, high = _range_estimate(pct, combined["min"], combined["max"])
    label = combined.get("label", "Composite")
    # SAT/ACT/GMAT/SHSAT have real published scales, but this app's raw->scaled mapping
    # is still a linear approximation, not the exam-owner's validated conversion table.
    return ScoreEstimate(low, high, label, True, scoring["provenance"])
