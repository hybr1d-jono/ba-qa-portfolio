# Feature Quality Index (FQI): Monthly Quality Reporting

> **Portfolio sample.** The method I used to report monthly quality metrics for a product team. All team figures have been removed; the numbers below are illustrative.

## The problem

"How's quality going?" usually gets a gut-feel answer. I wanted one number, reported monthly, that answered it the same way every time and could be traced back to real tickets.

## The metric

**FQI = (F - D) / F**

- **F:** features released this month
- **D:** customer-raised bugs this month

| FQI | Meaning |
| --- | --- |
| **100%** | Features shipped, no customer bugs |
| **0%** | One customer bug for every feature shipped |
| **Negative** | Customers found more bugs than we shipped features |

**How it evolved:** the first version was simply **F - D**. The problem was that it couldn't compare a month with 1 release against a month with 10. Dividing by F turned it into a rate, so months and teams could be compared.

## How the data is gathered

Each number comes from a saved ticket filter, so it's repeatable and auditable:

| Measure | Source |
| --- | --- |
| All work done this month | Filter: resolved this month, excluding release notes |
| Features delivered (F) | Filter: label `FEATURE` |
| Customer bugs (D) | Filter: label `CUSTOMER_BUG` |
| Change failures | Rollbacks or incidents caused by a release |

**Labelling is the discipline that makes it work.** If tickets aren't labelled consistently, the metric is meaningless.

## Splitting by codebase

I reported the team's newer services separately from the legacy core application. Legacy bugs drowned out the signal from new work, so a single combined figure hid whether the new work was healthy.

## Example report (illustrative)

**Team summary**
- Features released (F): 3
- Customer bugs (D): 1
- FQI: (3 - 1) / 3 = **67%**
- Change failures: 0

**Legacy core summary**
- Features released (F): 4
- Customer bugs (D): 7
- FQI: (4 - 7) / 4 = **-75%**

## What I'd add next

- **Trend over time.** One month is noise; six months is a story.
- **Severity weighting.** A data-loss bug and a typo shouldn't count the same.
- **Pair it with DORA metrics** (deployment frequency, change failure rate) for a fuller picture.

## What this shows

Defining a quality metric, building repeatable reporting from source data, and knowing a metric's limits. Turning data into a decision tool is also core BA work.
