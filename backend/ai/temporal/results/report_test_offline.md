# JJ-StatQA v2 results (split=test, n=405, generator=offline, date=2026-10-10)
Tuned on dev only: theta=0.44, tau=0.6, k=5.

> Offline extractive generator: it copies the provisions it is given, so these numbers isolate retrieval, temporal filtering and citation verification. They do NOT measure LLM hallucination (T2/T5/T6) or the no-retrieval LLM (C0); rerun with `--generator claude` for that.

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

| Metric | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|
| Answer accuracy, all questions % (95% CI) | 38.3 (33.6-43.0) | 36.3 (31.9-41.0) | 86.9 (83.7-90.1) | 87.4 (84.2-90.6) | 86.9 (83.7-90.4) |
| Answer accuracy, dated answerable (strict) % | 39.9 | 37.2 | 85.8 | 87.4 | 85.8 |
| Gold provision cited (lenient) % | 39.9 | 37.2 | 85.8 | 87.7 | 85.8 |
| Citation precision CP (exists & applicable) % | 45.2 | 48.0 | 99.5 | 98.9 | 99.5 |
| Temporally-inapplicable citation rate TIR % | 54.8 | 52.0 | 0.5 | 1.1 | 0.5 |
| Answers with >=1 inapplicable citation % | 54.8 | 52.0 | 0.6 | 1.1 | 0.6 |
| Gold-match precision % | 43.3 | 43.2 | 90.8 | 96.4 | 90.8 |
| Gold-match recall % | 40.7 | 38.6 | 86.9 | 88.6 | 86.9 |
| Fabricated (non-existent) citations | 0 | 0 | 0 | 0 | 0 |
| Wrong-code provision cited % | 52.2 | 44.8 | 0.0 | 0.3 | 0.0 |
| Retroactivity traps handled safely % | 0.0 | 33.3 | 100.0 | 100.0 | 100.0 |
| Retrieval Recall@5 % | 85.4 | 43.6 | 89.9 | 85.4 | 89.9 |
| Retrieval MRR | 0.639 | 0.425 | 0.886 | 0.639 | 0.886 |
| Abstains on unanswerable % | 64.3 | 64.3 | 100.0 | 64.3 | 100.0 |
| Wrongly abstains on answerable % | 0.0 | 5.2 | 5.2 | 0.5 | 5.2 |
| Asks for dates on ambiguous % | 0.0 | 0.0 | 94.7 | 100.0 | 94.7 |
| Asks for dates although dates were given % | 0.0 | 0.0 | 1.1 | 2.2 | 1.1 |
| June 2024 (month-only) accuracy % | 76.2 | 0.0 | 85.7 | 85.7 | 85.7 |
| August 2024 (month-only) accuracy % | 9.5 | 81.0 | 85.7 | 85.7 | 85.7 |
| Boundary: before 1 Jul 2024 % | 82.6 | 0.0 | 78.3 | 91.3 | 78.3 |
| Boundary: on/after 1 Jul 2024 % | 19.0 | 85.7 | 90.5 | 100.0 | 90.5 |
| Mean latency (ms/question) | 14.6 | 12.7 | 10.1 | 13.0 | 10.5 |

Accuracy by question type (%):

| Type | n | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|
| temporal_lookup | 220 | 47.7 | 45.9 | 85.9 | 96.4 | 85.9 |
| boundary | 44 | 52.3 | 40.9 | 84.1 | 95.5 | 84.1 |
| month_only | 42 | 42.9 | 40.5 | 85.7 | 85.7 | 85.7 |
| explicit_trap | 30 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| two_axis | 30 | 0.0 | 0.0 | 73.3 | 0.0 | 73.3 |
| ambiguous_no_date | 19 | 0.0 | 0.0 | 94.7 | 100.0 | 94.7 |
| unanswerable | 14 | 64.3 | 64.3 | 100.0 | 64.3 | 100.0 |
| retroactivity_trap | 6 | 0.0 | 33.3 | 100.0 | 100.0 | 100.0 |

Paired McNemar (exact), C4 vs each config on per-question correctness:

- C4_vs_C1: C4-only-correct=213, other-only-correct=16, p=<0.0001
- C4_vs_C1L: C4-only-correct=218, other-only-correct=13, p=<0.0001
- C4_vs_C2: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C3: C4-only-correct=29, other-only-correct=31, p=0.8974

## Reader cites top-3 provision(s) per question segment

| Metric | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|
| Answer accuracy, all questions % (95% CI) | 8.6 (6.2-11.6) | 37.8 (33.1-42.7) | 89.4 (86.4-92.3) | 84.7 (81.0-88.1) | 89.4 (86.2-92.3) |
| Answer accuracy, dated answerable (strict) % | 2.5 | 38.8 | 88.5 | 84.4 | 88.5 |
| Gold provision cited (lenient) % | 77.0 | 38.8 | 88.5 | 89.9 | 88.5 |
| Citation precision CP (exists & applicable) % | 47.5 | 49.0 | 99.8 | 97.1 | 99.8 |
| Temporally-inapplicable citation rate TIR % | 52.5 | 51.0 | 0.2 | 2.9 | 0.2 |
| Answers with >=1 inapplicable citation % | 97.3 | 52.6 | 0.6 | 3.8 | 0.6 |
| Gold-match precision % | 33.3 | 20.5 | 42.3 | 65.3 | 42.3 |
| Gold-match recall % | 78.8 | 40.2 | 89.4 | 90.7 | 89.4 |
| Fabricated (non-existent) citations | 0 | 0 | 0 | 0 | 0 |
| Wrong-code provision cited % | 93.2 | 46.2 | 0.0 | 0.5 | 0.0 |
| Retroactivity traps handled safely % | 0.0 | 33.3 | 100.0 | 100.0 | 100.0 |
| Retrieval Recall@5 % | 85.4 | 43.6 | 89.9 | 85.4 | 89.9 |
| Retrieval MRR | 0.639 | 0.425 | 0.886 | 0.639 | 0.886 |
| Abstains on unanswerable % | 64.3 | 64.3 | 100.0 | 64.3 | 100.0 |
| Wrongly abstains on answerable % | 0.0 | 5.2 | 5.2 | 0.8 | 5.2 |
| Asks for dates on ambiguous % | 89.5 | 0.0 | 94.7 | 100.0 | 94.7 |
| Asks for dates although dates were given % | 0.0 | 0.0 | 1.1 | 6.6 | 1.1 |
| June 2024 (month-only) accuracy % | 0.0 | 0.0 | 90.5 | 85.7 | 90.5 |
| August 2024 (month-only) accuracy % | 0.0 | 85.7 | 90.5 | 85.7 | 90.5 |
| Boundary: before 1 Jul 2024 % | 4.3 | 0.0 | 82.6 | 78.3 | 82.6 |
| Boundary: on/after 1 Jul 2024 % | 0.0 | 85.7 | 95.2 | 95.2 | 95.2 |
| Mean latency (ms/question) | 12.0 | 12.4 | 11.2 | 13.3 | 11.0 |

Accuracy by question type (%):

| Type | n | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|
| temporal_lookup | 220 | 3.6 | 47.3 | 87.7 | 91.8 | 87.7 |
| boundary | 44 | 2.3 | 40.9 | 88.6 | 86.4 | 88.6 |
| month_only | 42 | 0.0 | 42.9 | 90.5 | 85.7 | 90.5 |
| explicit_trap | 30 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| two_axis | 30 | 0.0 | 6.7 | 80.0 | 10.0 | 80.0 |
| ambiguous_no_date | 19 | 89.5 | 0.0 | 94.7 | 100.0 | 94.7 |
| unanswerable | 14 | 64.3 | 64.3 | 100.0 | 64.3 | 100.0 |
| retroactivity_trap | 6 | 0.0 | 33.3 | 100.0 | 100.0 | 100.0 |

Paired McNemar (exact), C4 vs each config on per-question correctness:

- C4_vs_C1: C4-only-correct=330, other-only-correct=3, p=<0.0001
- C4_vs_C1L: C4-only-correct=222, other-only-correct=13, p=<0.0001
- C4_vs_C2: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C3: C4-only-correct=44, other-only-correct=25, p=0.0295