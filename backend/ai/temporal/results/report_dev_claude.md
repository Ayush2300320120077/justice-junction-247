# JJ-StatQA v2 results (split=dev, n=3, generator=claude, date=2026-10-11)
Tuned on dev only: theta=0.44, tau=0.6, k=5.


## Resolver (date -> applicable code), independent of configuration
Overall: regime accuracy 100.0%, date-extraction exact match 100.0% (n=3)

| Slice | n | regime acc % | date acc % |
|---|---|---|---|
| type: temporal_lookup | 3 | 100.0 | 100.0 |
| date format fmt6 | 1 | 100.0 | 100.0 |
| date format fmt4 | 1 | 100.0 | 100.0 |
| date format fmt5 | 1 | 100.0 | 100.0 |

## Reader cites top-1 provision(s) per question segment

| Metric | C0 |
|---|---|
| Answer accuracy, all questions % (95% CI) | 0.0 (0.0-0.0) |
| Answer accuracy, dated answerable (strict) % | 0.0 |
| Gold provision cited (lenient) % | 0.0 |
| Citation precision CP (exists & applicable) % | n/a |
| Temporally-inapplicable citation rate TIR % | n/a |
| Answers with >=1 inapplicable citation % | n/a |
| Gold-match precision % | n/a |
| Gold-match recall % | 0.0 |
| API/request errors (counted as wrong; must be 0 for a valid run) | 3 |
| Unsupported-claim rate UCR (lexical entailment, all cited claims) % | n/a |
| Fabricated (non-existent) citations | 0 |
| Wrong-code provision cited % | 0.0 |
| Retroactivity traps handled safely % | n/a |
| Retrieval Recall@5 % | 0.0 |
| Retrieval MRR | 0.000 |
| Abstains on unanswerable % | n/a |
| Wrongly abstains on answerable % | 0.0 |
| Asks for dates on ambiguous % | n/a |
| Asks for dates although dates were given % | 0.0 |
| June 2024 (month-only) accuracy % | n/a |
| August 2024 (month-only) accuracy % | n/a |
| Boundary: before 1 Jul 2024 % | n/a |
| Boundary: on/after 1 Jul 2024 % | n/a |
| Mean latency (ms/question) | 320.5 |

Accuracy by question type (%):

| Type | n | C0 |
|---|---|---|
| temporal_lookup | 3 | 0.0 |

Paired McNemar (exact), C4 vs each config on per-question correctness:
