# JJ-StatQA v2 results (split=test, n=405, generator=claude, date=2026-10-11)
Tuned on dev only: theta=0.44, tau=0.6, k=5.


## Resolver (date -> applicable code), independent of configuration
Overall: regime accuracy 99.5%, date-extraction exact match 99.5% (n=391)

| Slice | n | regime acc % | date acc % |
|---|---|---|---|
| type: temporal_lookup | 220 | 99.5 | 99.5 |
| type: boundary | 44 | 97.7 | 97.7 |
| type: month_only | 42 | 100.0 | 100.0 |
| type: explicit_trap | 30 | 100.0 | 100.0 |
| type: two_axis | 30 | 100.0 | 100.0 |
| type: ambiguous_no_date | 19 | 100.0 | 100.0 |
| type: retroactivity_trap | 6 | 100.0 | 100.0 |
| boundary-new | 21 | 100.0 | 100.0 |
| boundary-old | 23 | 95.7 | 95.7 |
| June 2024 | 21 | 100.0 | 100.0 |
| August 2024 | 21 | 100.0 | 100.0 |
| date format fmt3 | 40 | 100.0 | 100.0 |
| date format fmt6 | 41 | 100.0 | 100.0 |
| date format fmt2 | 36 | 100.0 | 100.0 |
| date format fmt4 | 27 | 100.0 | 100.0 |
| date format fmt5 | 43 | 97.7 | 97.7 |
| date format fmt1 | 24 | 100.0 | 100.0 |
| date format fmt0 | 40 | 100.0 | 100.0 |
| date format fmt7 | 43 | 97.7 | 97.7 |

## Reader cites top-1 provision(s) per question segment

| Metric | C0 | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|
| Answer accuracy, all questions % (95% CI) | 1.5 (0.5-2.7) | 1.5 (0.5-2.7) | 1.5 (0.5-2.7) | 1.5 (0.5-2.7) | 1.5 (0.5-3.0) | 1.5 (0.5-2.7) |
| Answer accuracy, dated answerable (strict) % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Gold provision cited (lenient) % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Citation precision CP (exists & applicable) % | n/a | n/a | n/a | n/a | n/a | n/a |
| Temporally-inapplicable citation rate TIR % | n/a | n/a | n/a | n/a | n/a | n/a |
| Answers with >=1 inapplicable citation % | n/a | n/a | n/a | n/a | n/a | n/a |
| Gold-match precision % | n/a | n/a | n/a | n/a | n/a | n/a |
| Gold-match recall % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| API/request errors (counted as wrong; must be 0 for a valid run) | 405 | 405 | 405 | 405 | 405 | 405 |
| Unsupported-claim rate UCR (lexical entailment, all cited claims) % | n/a | n/a | n/a | n/a | n/a | n/a |
| Fabricated (non-existent) citations | 0 | 0 | 0 | 0 | 0 | 0 |
| Wrong-code provision cited % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Retroactivity traps handled safely % | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| Retrieval Recall@5 % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Retrieval MRR | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |
| Abstains on unanswerable % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Wrongly abstains on answerable % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Asks for dates on ambiguous % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Asks for dates although dates were given % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| June 2024 (month-only) accuracy % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| August 2024 (month-only) accuracy % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Boundary: before 1 Jul 2024 % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Boundary: on/after 1 Jul 2024 % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Mean latency (ms/question) | 121.3 | 117.0 | 117.0 | 116.6 | 116.8 | 117.3 |

Accuracy by question type (%):

| Type | n | C0 | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|---|
| temporal_lookup | 220 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| boundary | 44 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| month_only | 42 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| explicit_trap | 30 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| two_axis | 30 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| ambiguous_no_date | 19 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| unanswerable | 14 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| retroactivity_trap | 6 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |

Paired McNemar (exact), C4 vs each config on per-question correctness:

- C4_vs_C0: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C1: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C1L: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C2: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C3: C4-only-correct=0, other-only-correct=0, p=1.0000