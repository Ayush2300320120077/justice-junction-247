# JJ-StatQA v2 results (split=dev, well-posed subset, n=140, generator=offline, date=2026-10-10)
Tuned on dev only: theta=0.44, tau=0.6, k=5.

> Offline extractive generator: it copies the provisions it is given, so these numbers isolate retrieval, temporal filtering and citation verification. They do NOT measure LLM hallucination (T2/T5/T6) or the no-retrieval LLM (C0); rerun with `--generator claude` for that.

## Resolver (date -> applicable code), independent of configuration
Overall: regime accuracy 100.0%, date-extraction exact match 100.0% (n=132)

| Slice | n | regime acc % | date acc % |
|---|---|---|---|
| type: temporal_lookup | 69 | 100.0 | 100.0 |
| type: boundary | 21 | 100.0 | 100.0 |
| type: month_only | 15 | 100.0 | 100.0 |
| type: explicit_trap | 14 | 100.0 | 100.0 |
| type: two_axis | 6 | 100.0 | 100.0 |
| type: ambiguous_no_date | 3 | 100.0 | 100.0 |
| type: retroactivity_trap | 4 | 100.0 | 100.0 |
| boundary-new | 9 | 100.0 | 100.0 |
| boundary-old | 12 | 100.0 | 100.0 |
| June 2024 | 7 | 100.0 | 100.0 |
| August 2024 | 8 | 100.0 | 100.0 |
| date format fmt6 | 7 | 100.0 | 100.0 |
| date format fmt4 | 16 | 100.0 | 100.0 |
| date format fmt5 | 13 | 100.0 | 100.0 |
| date format fmt7 | 18 | 100.0 | 100.0 |
| date format fmt2 | 16 | 100.0 | 100.0 |
| date format fmt3 | 8 | 100.0 | 100.0 |
| date format fmt1 | 16 | 100.0 | 100.0 |
| date format fmt0 | 10 | 100.0 | 100.0 |

## Reader cites top-1 provision(s) per question segment

| Metric | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|
| Answer accuracy, all questions % (95% CI) | 43.6 (35.0-51.4) | 41.4 (32.9-49.3) | 95.0 (91.4-98.6) | 92.9 (88.6-97.1) | 95.0 (91.4-98.6) |
| Answer accuracy, dated answerable (strict) % | 41.6 | 39.2 | 94.4 | 92.8 | 94.4 |
| Gold provision cited (lenient) % | 41.6 | 39.2 | 94.4 | 92.8 | 94.4 |
| Citation precision CP (exists & applicable) % | 43.0 | 45.4 | 100.0 | 98.4 | 100.0 |
| Temporally-inapplicable citation rate TIR % | 57.0 | 54.6 | 0.0 | 1.6 | 0.0 |
| Answers with >=1 inapplicable citation % | 57.0 | 54.6 | 0.0 | 1.6 | 0.0 |
| Gold-match precision % | 42.2 | 43.7 | 96.1 | 97.6 | 96.1 |
| Gold-match recall % | 41.2 | 39.7 | 94.7 | 93.1 | 94.7 |
| Fabricated (non-existent) citations | 0 | 0 | 0 | 0 | 0 |
| Wrong-code provision cited % | 54.4 | 48.8 | 0.0 | 0.0 | 0.0 |
| Retroactivity traps handled safely % | 25.0 | 25.0 | 100.0 | 75.0 | 100.0 |
| Retrieval Recall@5 % | 85.6 | 42.0 | 95.2 | 85.6 | 95.2 |
| Retrieval MRR | 0.647 | 0.432 | 0.944 | 0.647 | 0.944 |
| Abstains on unanswerable % | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| Wrongly abstains on answerable % | 0.0 | 7.2 | 1.6 | 0.8 | 1.6 |
| Asks for dates on ambiguous % | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| Asks for dates although dates were given % | 0.0 | 0.0 | 0.0 | 1.6 | 0.0 |
| June 2024 (month-only) accuracy % | 85.7 | 0.0 | 85.7 | 100.0 | 85.7 |
| August 2024 (month-only) accuracy % | 12.5 | 87.5 | 75.0 | 87.5 | 75.0 |
| Boundary: before 1 Jul 2024 % | 91.7 | 0.0 | 100.0 | 100.0 | 100.0 |
| Boundary: on/after 1 Jul 2024 % | 22.2 | 100.0 | 88.9 | 88.9 | 88.9 |
| Mean latency (ms/question) | 14.5 | 13.8 | 9.9 | 13.2 | 15.1 |

Accuracy by question type (%):

| Type | n | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|
| temporal_lookup | 69 | 46.4 | 47.8 | 95.7 | 98.6 | 95.7 |
| boundary | 21 | 61.9 | 42.9 | 95.2 | 95.2 | 95.2 |
| month_only | 15 | 46.7 | 46.7 | 80.0 | 93.3 | 80.0 |
| explicit_trap | 14 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| two_axis | 6 | 0.0 | 0.0 | 100.0 | 0.0 | 100.0 |
| ambiguous_no_date | 3 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| unanswerable | 8 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| retroactivity_trap | 4 | 25.0 | 25.0 | 100.0 | 75.0 | 100.0 |

Paired McNemar (exact), C4 vs each config on per-question correctness:

- C4_vs_C1: C4-only-correct=75, other-only-correct=3, p=<0.0001
- C4_vs_C1L: C4-only-correct=78, other-only-correct=3, p=<0.0001
- C4_vs_C2: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C3: C4-only-correct=9, other-only-correct=6, p=0.6072

## Reader cites top-3 provision(s) per question segment

| Metric | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|
| Answer accuracy, all questions % (95% CI) | 9.3 (5.0-14.3) | 41.4 (33.6-49.3) | 95.7 (92.1-98.6) | 91.4 (86.4-95.7) | 95.7 (92.1-98.6) |
| Answer accuracy, dated answerable (strict) % | 1.6 | 39.2 | 95.2 | 91.2 | 95.2 |
| Gold provision cited (lenient) % | 81.6 | 39.2 | 95.2 | 96.0 | 95.2 |
| Citation precision CP (exists & applicable) % | 46.2 | 48.1 | 100.0 | 97.4 | 100.0 |
| Temporally-inapplicable citation rate TIR % | 53.8 | 51.9 | 0.0 | 2.6 | 0.0 |
| Answers with >=1 inapplicable citation % | 98.4 | 54.6 | 0.0 | 3.2 | 0.0 |
| Gold-match precision % | 32.6 | 19.9 | 43.9 | 65.6 | 44.3 |
| Gold-match recall % | 82.4 | 40.5 | 95.4 | 96.2 | 95.4 |
| Fabricated (non-existent) citations | 0 | 0 | 0 | 0 | 0 |
| Wrong-code provision cited % | 98.4 | 48.8 | 0.0 | 0.0 | 0.0 |
| Retroactivity traps handled safely % | 25.0 | 25.0 | 100.0 | 75.0 | 100.0 |
| Retrieval Recall@5 % | 85.6 | 42.0 | 95.2 | 85.6 | 95.2 |
| Retrieval MRR | 0.647 | 0.432 | 0.944 | 0.647 | 0.944 |
| Abstains on unanswerable % | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| Wrongly abstains on answerable % | 0.0 | 7.2 | 1.6 | 0.0 | 1.6 |
| Asks for dates on ambiguous % | 66.7 | 0.0 | 100.0 | 100.0 | 100.0 |
| Asks for dates although dates were given % | 0.0 | 0.0 | 0.0 | 4.8 | 0.0 |
| June 2024 (month-only) accuracy % | 0.0 | 0.0 | 85.7 | 100.0 | 85.7 |
| August 2024 (month-only) accuracy % | 0.0 | 87.5 | 87.5 | 100.0 | 87.5 |
| Boundary: before 1 Jul 2024 % | 8.3 | 0.0 | 100.0 | 100.0 | 100.0 |
| Boundary: on/after 1 Jul 2024 % | 0.0 | 100.0 | 88.9 | 88.9 | 88.9 |
| Mean latency (ms/question) | 12.8 | 12.2 | 10.5 | 17.4 | 12.1 |

Accuracy by question type (%):

| Type | n | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|
| temporal_lookup | 69 | 1.4 | 47.8 | 95.7 | 92.8 | 95.7 |
| boundary | 21 | 4.8 | 42.9 | 95.2 | 95.2 | 95.2 |
| month_only | 15 | 0.0 | 46.7 | 86.7 | 100.0 | 86.7 |
| explicit_trap | 14 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| two_axis | 6 | 0.0 | 0.0 | 100.0 | 16.7 | 100.0 |
| ambiguous_no_date | 3 | 66.7 | 0.0 | 100.0 | 100.0 | 100.0 |
| unanswerable | 8 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| retroactivity_trap | 4 | 25.0 | 25.0 | 100.0 | 75.0 | 100.0 |

Paired McNemar (exact), C4 vs each config on per-question correctness:

- C4_vs_C1: C4-only-correct=121, other-only-correct=0, p=<0.0001
- C4_vs_C1L: C4-only-correct=79, other-only-correct=3, p=<0.0001
- C4_vs_C2: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C3: C4-only-correct=12, other-only-correct=6, p=0.2379