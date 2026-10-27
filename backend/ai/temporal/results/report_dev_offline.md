# JJ-StatQA v2 results (split=dev, n=165, generator=offline, date=2026-10-11)
Tuned on dev only: theta=0.44, tau=0.6, k=5.

> Offline extractive generator: it copies the provisions it is given, so these numbers isolate retrieval, temporal filtering and citation verification. They do NOT measure LLM hallucination (T2/T5/T6) or the no-retrieval LLM (C0); rerun with `--generator claude` for that.

## Resolver (date -> applicable code), independent of configuration
Overall: regime accuracy 100.0%, date-extraction exact match 100.0% (n=157)

| Slice | n | regime acc % | date acc % |
|---|---|---|---|
| type: temporal_lookup | 85 | 100.0 | 100.0 |
| type: boundary | 21 | 100.0 | 100.0 |
| type: month_only | 18 | 100.0 | 100.0 |
| type: explicit_trap | 14 | 100.0 | 100.0 |
| type: two_axis | 10 | 100.0 | 100.0 |
| type: ambiguous_no_date | 5 | 100.0 | 100.0 |
| type: retroactivity_trap | 4 | 100.0 | 100.0 |
| boundary-new | 9 | 100.0 | 100.0 |
| boundary-old | 12 | 100.0 | 100.0 |
| June 2024 | 9 | 100.0 | 100.0 |
| August 2024 | 9 | 100.0 | 100.0 |
| date format fmt6 | 9 | 100.0 | 100.0 |
| date format fmt4 | 19 | 100.0 | 100.0 |
| date format fmt5 | 13 | 100.0 | 100.0 |
| date format fmt7 | 20 | 100.0 | 100.0 |
| date format fmt2 | 17 | 100.0 | 100.0 |
| date format fmt3 | 10 | 100.0 | 100.0 |
| date format fmt1 | 19 | 100.0 | 100.0 |
| date format fmt0 | 13 | 100.0 | 100.0 |

## Reader cites top-1 provision(s) per question segment

| Metric | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|
| Answer accuracy, all questions % (95% CI) | 41.8 (34.5-49.1) | 41.2 (33.9-49.1) | 94.5 (90.9-97.6) | 90.9 (86.1-95.2) | 94.5 (90.9-97.6) |
| Answer accuracy, dated answerable (strict) % | 40.5 | 39.9 | 93.9 | 90.5 | 93.9 |
| Gold provision cited (lenient) % | 40.5 | 39.9 | 93.9 | 90.5 | 93.9 |
| Citation precision CP (exists & applicable) % | 43.0 | 47.2 | 100.0 | 98.6 | 100.0 |
| Temporally-inapplicable citation rate TIR % | 57.0 | 52.8 | 0.0 | 1.4 | 0.0 |
| Answers with >=1 inapplicable citation % | 57.0 | 52.8 | 0.0 | 1.4 | 0.0 |
| Gold-match precision % | 41.7 | 45.8 | 95.5 | 97.3 | 95.5 |
| Gold-match recall % | 39.9 | 41.1 | 94.3 | 91.1 | 94.3 |
| API/request errors (counted as wrong; must be 0 for a valid run) | 0 | 0 | 0 | 0 | 0 |
| Unsupported-claim rate UCR (lexical entailment, all cited claims) % | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Fabricated (non-existent) citations | 0 | 0 | 0 | 0 | 0 |
| Wrong-code provision cited % | 54.7 | 47.3 | 0.0 | 0.0 | 0.0 |
| Retroactivity traps handled safely % | 25.0 | 25.0 | 100.0 | 75.0 | 100.0 |
| Retrieval Recall@5 % | 85.8 | 43.6 | 95.9 | 85.8 | 95.9 |
| Retrieval MRR | 0.634 | 0.445 | 0.949 | 0.634 | 0.949 |
| Abstains on unanswerable % | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| Wrongly abstains on answerable % | 0.0 | 6.1 | 1.4 | 0.7 | 1.4 |
| Asks for dates on ambiguous % | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| Asks for dates although dates were given % | 0.0 | 0.0 | 0.0 | 1.4 | 0.0 |
| June 2024 (month-only) accuracy % | 77.8 | 0.0 | 77.8 | 88.9 | 77.8 |
| August 2024 (month-only) accuracy % | 11.1 | 88.9 | 77.8 | 88.9 | 77.8 |
| Boundary: before 1 Jul 2024 % | 91.7 | 0.0 | 100.0 | 100.0 | 100.0 |
| Boundary: on/after 1 Jul 2024 % | 22.2 | 100.0 | 88.9 | 88.9 | 88.9 |
| Mean latency (ms/question) | 8.6 | 7.4 | 13.4 | 16.6 | 17.8 |

Accuracy by question type (%):

| Type | n | C1 | C1L | C2 | C3 | C4 |
|---|---|---|---|---|---|---|
| temporal_lookup | 85 | 45.9 | 49.4 | 96.5 | 98.8 | 96.5 |
| boundary | 21 | 61.9 | 42.9 | 95.2 | 95.2 | 95.2 |
| month_only | 18 | 44.4 | 44.4 | 77.8 | 88.9 | 77.8 |
| explicit_trap | 14 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| two_axis | 10 | 0.0 | 0.0 | 90.0 | 0.0 | 90.0 |
| ambiguous_no_date | 5 | 0.0 | 0.0 | 100.0 | 100.0 | 100.0 |
| unanswerable | 8 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |
| retroactivity_trap | 4 | 25.0 | 25.0 | 100.0 | 75.0 | 100.0 |

Paired McNemar (exact), C4 vs each config on per-question correctness:

- C4_vs_C1: C4-only-correct=90, other-only-correct=3, p=<0.0001
- C4_vs_C1L: C4-only-correct=91, other-only-correct=3, p=<0.0001
- C4_vs_C2: C4-only-correct=0, other-only-correct=0, p=1.0000
- C4_vs_C3: C4-only-correct=12, other-only-correct=6, p=0.2379