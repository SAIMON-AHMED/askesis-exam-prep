"""Tests for per-exam scoring strategies (Phase 1 step 5 / plan verification item 2)."""
from app.services.scoring_strategies import estimate_scaled_score


def test_sat_perfect_score_hits_1600_ceiling():
    estimate = estimate_scaled_score("sat", 20, 20)
    assert estimate.scaled_score_high == 1600
    assert estimate.scaled_score_low >= 400
    assert estimate.is_readiness_estimate is True


def test_act_zero_score_hits_composite_floor():
    estimate = estimate_scaled_score("act", 0, 20)
    assert estimate.scaled_score_low == 1
    assert estimate.scaled_score_high <= 36


def test_gre_uses_verbal_plus_quant_range_not_sat_scale():
    estimate = estimate_scaled_score("gre", 10, 20)
    # Informal verbal(130-170)+quant(130-170) sum range, never SAT's 400-1600.
    assert 260 <= estimate.scaled_score_low <= 340
    assert 260 <= estimate.scaled_score_high <= 340


def test_gmat_total_range_matches_205_805():
    estimate = estimate_scaled_score("gmat", 20, 20)
    assert estimate.scaled_score_high == 805
    assert estimate.scaled_score_low >= 205


def test_regents_requires_subject_and_uses_0_100_scale():
    with_subject = estimate_scaled_score("regents", 65, 100, subject_id="algebra-i")
    assert with_subject.scaled_score_high <= 100
    assert with_subject.label == "Algebra I"

    without_subject = estimate_scaled_score("regents", 65, 100)
    assert without_subject.is_readiness_estimate is True
    assert without_subject.label == "Readiness (%)"


def test_unknown_exam_id_falls_back_to_percentage_not_sat_scale():
    estimate = estimate_scaled_score("unknown-exam", 5, 10)
    assert estimate.scaled_score_high <= 100
    assert estimate.is_readiness_estimate is True
