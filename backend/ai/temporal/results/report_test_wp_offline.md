# JJ-StatQA v2 results (split=test, well-posed subset, n=344, generator=offline, date=2026-10-10)
Tuned on dev only: theta=0.44, tau=0.6, k=5.

> Offline extractive generator: it copies the provisions it is given, so these numbers isolate retrieval, temporal filtering and citation verification. They do NOT measure LLM hallucination (T2/T5/T6) or the no-retrieval LLM (C0); rerun with `--generator claude` for that.

## Resolver (date -> applicable code), independent of configuration
Overall: regime accuracy 99.4%, date-extraction exact match 99.4% (n=330)

| Slice | n | regime acc % | date acc % |
|---|---|---|---|
| type: temporal_lookup | 197 | 99.5 | 99.5 |
| type: boundary | 39 | 97.4 | 97.4 |
| type: month_only | 26 | 100.0 | 100.0 |
| type: explicit_trap | 30 | 100.0 | 100.0 |
| type: two_axis | 19 | 100.0 | 100.0 |
| type: ambiguous_no_date | 13 | 100.0 | 100.0 |
| type: retroactivity_trap | 6 | 100.0 | 100.0 |
| boundary-new | 18 | 100.0 | 100.0 |
| boundary-old | 21 | 95.2 | 95.2 |
| June 2024 | 15 | 100.0 | 100.0 |
| August 2024 | 11 | 100.0 | 100.0 |
| date format fmt3 | 39 | 100.0 | 100.0 |
| date format fmt6 | 36 | 100.0 | 100.0 |
| date format fmt2 | 33 | 100.0 | 100.0 |
| date format fmt4 | 25 | 100.0 | 100.0 |
| date format fmt5 | 38 | 97.4 | 97.4 |
| date format fmt1 | 23 | 100.0 | 100.0 |
| date format fmt0 | 36 | 100.0 | 100.0 |
| date format fmt7 | 36 | 97.2 | 97.2 |

## Reader cites top-1 provision(s) per question segment

| Metric | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|
| Answer accuracy, all questions % (95% CI) | 42.2 (36.9-47.4) | 36.6 (31.7-41.9) | 90.4 (87.2-93.3) | 91.9 (89.0-94.8) | 90.4 (87.2-93.3) |
| Answer accuracy, dated answerable (strict) % | 43.7 | 37.0 | 89.7 | 92.6 | 89.7 |
| Gold provision cited (lenient) % | 43.7 | 37.0 | 89.7 | 92.9 | 89.7 |
| Citation precision CP (exists & applicable) % | 46.4 | 44.8 | 99.4 | 99.7 | 99.4 |
| Temporally-inapplicable citation rate TIR % | 53.6 | 55.2 | 0.6 | 0.3 | 0.6 |
| Answers with >=1 inapplicable citation % | 53.6 | 55.2 | 0.7 | 0.3 | 0.7 |
| Gold-match precision % | 46.1 | 41.5 | 94.6 | 99.0 | 94.6 |
| Gold-match recall % | 44.2 | 37.6 | 90.3 | 93.3 | 90.3 |
| Fabricated (non-existent) citations | 0 | 0 | 0 | 0 | 0 |
| Wrong-code provision cited % | 52.4 | 48.9 | 0.0 | 0.3 | 0.0 |
| Retroactivity traps handled safely % | 0.0 | 33.3 | 100.0 | 100.0 | 100.0 |
| Retrieval Recall@5 % | 86.7 | 41.3 | 91.3 | 86.7 | 91.3 |
| Retrieval MRR | 0.664 | 0.408 | 0.905 | 0.664 | 0.905 |
| Abstains on unanswerable % | 64.3 | 64.3 | 100.0 | 64.3 | 100.0 |
| Wrongly abstains on answerable % | 0.0 | 6.1 | 5.5 | 0.0 | 5.5 |
| Asks for dates on ambiguous % | 0.0 | 0.0 | 92.3 | 100.0 | 92.3 |
| Asks for dates although dates were given % | 0.0 | 0.0 | 1.3 | 0.6 | 1.3 |
| June 2024 (month-only) accuracy % | 93.3 | 0.0 | 100.0 | 100.0 | 100.0 |
| August 2024 (month-only) accuracy % | 9.1 | 100.0 | 100.0 | 100.0 | 100.0 |
| Boundary: before 1 Jul 2024 % | 85.7 | 0.0 | 81.0 | 95.2 | 81.0 |
| Boundary: on/after 1 Jul 2024 % | 22.2 | 83.3 | 88.9 | 100.0 | 88.9 |
| Mean latency (ms/question) | 14.6 | 14.2 | 12.6 | 14.4 | 11.1 |

Accuracy by question type (%):

| Type | n | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|
| temporal_lookup | 197 | 50.3 | 45.2 | 87.8 | 98.5 | 87.8 |
| boundary | 39 | 56.4 | 38.5 | 84.6 | 97.4 | 84.6 |
| month_only | 26 | 57.7 | 42.3 | 100.0 | 100.0 | 100.0 |
| explicit_trap | 30 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| two_axis | 19 | 0.0 | 0.0 | 89.5 | 0.0 | 89.5 |
| ambiguous_no_date | 13 | 0.0 | 0.0 | 92.3 | 100.0 | 92.3 |
| unanswerable | 14 | 64.3 | 64.3 | 100.0 | 64.3 | 100.0 |
| retroactivity_trap | 6 | 0.0 | 33.3 | 100.0 | 100.0 | 100.0 |

Paired McNemar (exact), C4 vs each config on per-question correctness:

- C4_vs_C1: C4-only-correct=180, other-only-correct=14, p=<0.0001
- C4_vs_C1L: C4-only-correct=196, other-only-correct=11, p=<0.0001
- C4_vs_C2: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C3: C4-only-correct=22, other-only-correct=27, p=0.5682

## Reader cites top-3 provision(s) per question segment

| Metric | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|
| Answer accuracy, all questions % (95% CI) | 9.0 (6.1-12.2) | 37.8 (32.8-42.7) | 91.6 (88.7-94.5) | 89.2 (86.0-92.2) | 91.6 (88.4-94.5) |
| Answer accuracy, dated answerable (strict) % | 2.9 | 38.3 | 91.0 | 89.7 | 91.0 |
| Gold provision cited (lenient) % | 80.7 | 38.3 | 91.0 | 94.9 | 91.0 |
| Citation precision CP (exists & applicable) % | 47.8 | 45.4 | 99.7 | 97.9 | 99.7 |
| Temporally-inapplicable citation rate TIR % | 52.2 | 54.6 | 0.3 | 2.1 | 0.3 |
| Answers with >=1 inapplicable citation % | 97.2 | 55.6 | 0.7 | 2.9 | 0.7 |
| Gold-match precision % | 34.3 | 20.0 | 44.9 | 66.7 | 44.9 |
| Gold-match recall % | 81.8 | 38.8 | 91.5 | 95.2 | 91.5 |
| Fabricated (non-existent) citations | 0 | 0 | 0 | 0 | 0 |
| Wrong-code provision cited % | 95.5 | 49.8 | 0.0 | 0.6 | 0.0 |
| Retroactivity traps handled safely % | 0.0 | 33.3 | 100.0 | 100.0 | 100.0 |
| Retrieval Recall@5 % | 86.7 | 41.3 | 91.3 | 86.7 | 91.3 |
| Retrieval MRR | 0.664 | 0.408 | 0.905 | 0.664 | 0.905 |
| Abstains on unanswerable % | 64.3 | 64.3 | 100.0 | 64.3 | 100.0 |
| Wrongly abstains on answerable % | 0.0 | 6.1 | 5.5 | 0.0 | 5.5 |
| Asks for dates on ambiguous % | 100.0 | 0.0 | 92.3 | 100.0 | 92.3 |
| Asks for dates although dates were given % | 0.0 | 0.0 | 1.3 | 5.1 | 1.3 |
| June 2024 (month-only) accuracy % | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| August 2024 (month-only) accuracy % | 0.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| Boundary: before 1 Jul 2024 % | 4.8 | 0.0 | 81.0 | 81.0 | 81.0 |
| Boundary: on/after 1 Jul 2024 % | 0.0 | 83.3 | 94.4 | 94.4 | 94.4 |
| Mean latency (ms/question) | 12.4 | 14.1 | 11.6 | 15.2 | 11.3 |

Accuracy by question type (%):

| Type | n | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|
| temporal_lookup | 197 | 4.1 | 46.2 | 89.3 | 94.4 | 89.3 |
| boundary | 39 | 2.6 | 38.5 | 87.2 | 87.2 | 87.2 |
| month_only | 26 | 0.0 | 42.3 | 100.0 | 100.0 | 100.0 |
| explicit_trap | 30 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| two_axis | 19 | 0.0 | 10.5 | 89.5 | 15.8 | 89.5 |
| ambiguous_no_date | 13 | 100.0 | 0.0 | 92.3 | 100.0 | 92.3 |
| unanswerable | 14 | 64.3 | 64.3 | 100.0 | 64.3 | 100.0 |
| retroactivity_trap | 6 | 0.0 | 33.3 | 100.0 | 100.0 | 100.0 |

Paired McNemar (exact), C4 vs each config on per-question correctness:

- C4_vs_C1: C4-only-correct=287, other-only-correct=3, p=<0.0001
- C4_vs_C1L: C4-only-correct=196, other-only-correct=11, p=<0.0001
- C4_vs_C2: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C3: C4-only-correct=29, other-only-correct=21, p=0.3222