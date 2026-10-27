# JJ-StatQA v2 – results for the paper (auto-generated; 2026-10-10)

Dataset: 570 questions (dev 165 / test 405) in 8 types. Hyper-parameters (theta=0.44, tau=0.6, k=5) were tuned on dev only; every number below is on the **held-out test split** unless stated.
Reader: deterministic *extractive* generator (cites top-1 provision per question segment). These runs therefore isolate retrieval + temporal filtering + citation verification. They do **not** measure free-text LLM hallucination or the no-retrieval LLM (C0) – see "What is still missing".
*Temporal acc.* = accuracy on the date-dependent types (temporal_lookup, boundary, month_only, two_axis, explicit_trap).

## Table A. Main comparison, test split, all questions (n=405)
| Configuration | Answer acc. % (95% CI) | Temporal acc.* % | Citation precision % | Temporally-inapplicable cit. % | Wrong-code cited % | Recall@5 % | MRR | Abstain on unanswerable % |
|---|---|---|---|---|---|---|---|---|
| C1 Standard RAG (date-blind) | 38.3 (33.6–43.0) | 39.9 | 45.2 | 54.8 | 52.2 | 85.4 | 0.639 | 64.3 |
| C1L RAG + "always latest law" | 36.3 (31.9–41.0) | 37.2 | 48.0 | 52.0 | 44.8 | 43.6 | 0.425 | 64.3 |
| C2 + date resolver/filter | 86.9 (83.7–90.1) | 85.8 | 99.5 | 0.5 | 0.0 | 89.9 | 0.886 | 100.0 |
| C3 RAG + citation verifier | 87.4 (84.2–90.6) | 87.4 | 98.9 | 1.1 | 0.3 | 85.4 | 0.639 | 64.3 |
| C4 Full (filter + verifier) | 86.9 (83.7–90.4) | 85.8 | 99.5 | 0.5 | 0.0 | 89.9 | 0.886 | 100.0 |

Paired tests (per-question correctness):
- C4 vs C1: C4-only-correct 213, other-only-correct 16, McNemar exact p < 0.0001
- C4 vs C1L: C4-only-correct 218, other-only-correct 13, McNemar exact p < 0.0001
- C4 vs C2: C4-only-correct 0, other-only-correct 0, McNemar exact p 1.000
- C4 vs C3: C4-only-correct 29, other-only-correct 31, McNemar exact p 0.897

## Table B. Same, test split, well-posed subset (n=344; drops questions whose gold section title is non-unique or <3 words, rule fixed before evaluation)
| Configuration | Answer acc. % (95% CI) | Temporal acc.* % | Citation precision % | Temporally-inapplicable cit. % | Wrong-code cited % | Recall@5 % | MRR | Abstain on unanswerable % |
|---|---|---|---|---|---|---|---|---|
| C1 Standard RAG (date-blind) | 42.2 (36.9–47.4) | 43.7 | 46.4 | 53.6 | 52.4 | 86.7 | 0.664 | 64.3 |
| C1L RAG + "always latest law" | 36.6 (31.7–41.9) | 37.0 | 44.8 | 55.2 | 48.9 | 41.3 | 0.408 | 64.3 |
| C2 + date resolver/filter | 90.4 (87.2–93.3) | 89.7 | 99.4 | 0.6 | 0.0 | 91.3 | 0.905 | 100.0 |
| C3 RAG + citation verifier | 91.9 (89.0–94.8) | 92.6 | 99.7 | 0.3 | 0.3 | 86.7 | 0.664 | 64.3 |
| C4 Full (filter + verifier) | 90.4 (87.2–93.3) | 89.7 | 99.4 | 0.6 | 0.0 | 91.3 | 0.905 | 100.0 |

Paired tests:
- C4 vs C1: C4-only-correct 180, other-only-correct 14, McNemar exact p < 0.0001
- C4 vs C1L: C4-only-correct 196, other-only-correct 11, McNemar exact p < 0.0001
- C4 vs C2: C4-only-correct 0, other-only-correct 0, McNemar exact p 1.000
- C4 vs C3: C4-only-correct 22, other-only-correct 27, McNemar exact p 0.568

## Table C. Accuracy by question type (test, all questions)
| Question type | n | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|
| temporal_lookup | 220 | 47.7 | 45.9 | 85.9 | 96.4 | 85.9 |
| boundary | 44 | 52.3 | 40.9 | 84.1 | 95.5 | 84.1 |
| month_only | 42 | 42.9 | 40.5 | 85.7 | 85.7 | 85.7 |
| explicit_trap | 30 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| two_axis | 30 | 0.0 | 0.0 | 73.3 | 0.0 | 73.3 |
| ambiguous_no_date | 19 | 0.0 | 0.0 | 94.7 | 100.0 | 94.7 |
| unanswerable | 14 | 64.3 | 64.3 | 100.0 | 64.3 | 100.0 |
| retroactivity_trap | 6 | 0.0 | 33.3 | 100.0 | 100.0 | 100.0 |

## Table D. Date resolver (test split, independent of configuration)
| Slice | n | Applicable-code accuracy % | Date-extraction exact match % |
|---|---|---|---|
| **Overall** | 391 | 99.5 | 99.5 |
| temporal_lookup | 220 | 99.5 | 99.5 |
| boundary | 44 | 97.7 | 97.7 |
| month_only | 42 | 100.0 | 100.0 |
| explicit_trap | 30 | 100.0 | 100.0 |
| two_axis | 30 | 100.0 | 100.0 |
| ambiguous_no_date | 19 | 100.0 | 100.0 |
| retroactivity_trap | 6 | 100.0 | 100.0 |
| boundary-new | 21 | 100.0 | 100.0 |
| boundary-old | 23 | 95.7 | 95.7 |
| June 2024 | 21 | 100.0 | 100.0 |
| August 2024 | 21 | 100.0 | 100.0 |

## Table E. Verifier stress test (synthetic error injection, test split; NOT a measure of LLM behaviour)
```
split=test tau=0.6 items=1783
clean  n=306 flagged=0.0% 
T1     n=306 flagged=100.0% label-correct=100.0%
T2     n=306 flagged=98.0% label-correct=62.4%
T3     n=306 flagged=99.3% label-correct=99.3%
T4     n=253 flagged=100.0% label-correct=100.0%
T5     n=306 flagged=94.8% label-correct=94.8%
{ avgRecall: 0.9843137254901961, fpr: 0, J: 0.9843137254901961 }
```
Each correct answer is corrupted with one error of each taxonomy class; "flagged" = verifier rejects the corrupted citation, "clean flagged" = false-positive rate on untouched correct citations.

## Dev split (for reference, n=165)
| Configuration | Answer acc. % (95% CI) | Temporal acc.* % | Citation precision % | Temporally-inapplicable cit. % | Wrong-code cited % | Recall@5 % | MRR | Abstain on unanswerable % |
|---|---|---|---|---|---|---|---|---|
| C1 Standard RAG (date-blind) | 41.8 (34.5–49.1) | 40.5 | 43.0 | 57.0 | 54.7 | 85.8 | 0.634 | 100.0 |
| C1L RAG + "always latest law" | 41.2 (33.9–49.1) | 39.9 | 47.2 | 52.8 | 47.3 | 43.6 | 0.445 | 100.0 |
| C2 + date resolver/filter | 94.5 (90.9–97.6) | 93.9 | 100.0 | 0.0 | 0.0 | 95.9 | 0.949 | 100.0 |
| C3 RAG + citation verifier | 90.9 (86.1–95.2) | 90.5 | 98.6 | 1.4 | 0.0 | 85.8 | 0.634 | 100.0 |
| C4 Full (filter + verifier) | 94.5 (90.9–97.6) | 93.9 | 100.0 | 0.0 | 0.0 | 95.9 | 0.949 | 100.0 |

## What is still missing / must be fixed before submission
1. **LLM run (C0, unsupported-claim rate, T2/T5/T6).** Not run: no ANTHROPIC_API_KEY in this session. Run locally: `ANTHROPIC_API_KEY=... node eval/run_eval.js --split test --generator claude --m 1` (~405 q x 6 configs; responses are cached in results/cache_*). Only that run can support claims about LLM hallucination, C0 and UCR.
2. **Paper Table III does not match this code.** The 60-question numbers in the PDF (e.g. C1 TIR 38.6%, C4 CP 97.8%, UCR 3.5%, C0 CP 18.2%) cannot be reproduced here (offline C1 TIR on the 405-question test split is 54.8%). Replace them with the tables above, or with the Claude-generator run, and describe the benchmark as 570 questions.
3. **Crosswalk provenance.** data/anchors.json was hand-curated (see its `_note`), not taken from the official MHA table, and has not been signed off by a law reviewer. The paper currently says it is built from official MHA/NCRB correspondence and reviewer-verified: either have the reviewer verify it (tools/validate_anchors.js lists the lowest-similarity pairs first) or reword.
4. **Circularity.** Gold provisions for crosswalk-derived questions come from the same crosswalk the system uses for bridging/repair. Independent review of a sample of gold labels is needed; the 60 "expert-reviewed" questions are not the same as these 570.
5. **Verifier value.** With the extractive reader C4 == C2 (the reader never emits a wrong citation once the filter is applied), so the verifier's benefit is shown only by the injected-error stress test (Table E) until the LLM run is done. Note C3 vs C4 is not significantly different (p = 0.90).
6. **Known weaknesses (report them):** residual C4 errors are mostly retrieval of the wrong section (generic titles), not wrong-code errors; C3/C1 two_axis = 0% (no per-axis dates); T2 label accuracy in Table E is 62.4%.
