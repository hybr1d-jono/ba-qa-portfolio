# Discovery: Invoice-Level Sales Tax Cap

> **Portfolio sample.** A sanitised version of a discovery page I wrote for a veterinary practice management SaaS. Product names, internal code paths, people, customers and usage figures have been removed or generalised. The structure, the reasoning and the worked scenarios are mine.

**Status:** Discovery

**Role:** QA lead on the feature, preparing it for the developers who will build it

**Audience:** Product owner, tech lead, developers

## Summary

A US borough charges 6% sales tax on **only the first $500 of each sale**. The product taxes the whole invoice today, so practices there would overcharge their clients. Tax is calculated per line in several separate places and then summed, so a per-invoice cap needs new logic, not a settings tweak.

This page records how tax works today, what the customer needs, and the questions that had to be answered before the behaviour could be written up as product rules.

## How tax works today

Tax is worked out line by line, rounded per line, then added up. Three separate parts of the system do this:

- **The invoice screen** calculates tax in the browser.
- **A financial backend service** recalculates it, but only for a small subset of sites behind a feature flag.
- **The legacy core application** has around 15 separate paths that create invoices (recurring invoices, imports, the public API, estimate conversion and more).

The invoice's tax total is then forced to equal the sum of its line tax. Reports and the accounting export both read tax **from the lines**. Nothing ever looks at the invoice total before taxing it.

**Worked example:** Item A $400 + Item B $300 = $700.
Today: $24.00 + $18.00 = **$42.00** tax. The borough's rule: **$30.00**.

## The scenarios

All at 6%. "Today" is what the product charges with no cap.

| Scenario | Taxable total | Tax today | Tax with cap |
| --- | --- | --- | --- |
| 1. Under the cap ($100 + $200) | $300 | $18.00 | $18.00 |
| 2. Over the cap ($400 + $300) | $700 | $42.00 | **$30.00** |
| 3. Return that stays over the cap ($800 invoice, $200 item returned) | $800 → $600 | refund $12.00 | **refund $0.00** |
| 4. Return that drops under the cap ($600 invoice, $200 item returned) | $600 → $400 | refund $12.00 | **refund $6.00** |

Scenarios 3 and 4 showed a gap nobody had raised: a credit has no link back to the original invoice's lines, so it can't know whether the invoice was still over the cap.

## Options for applying the capped tax

Because reports read tax from the lines, the capped tax has to show up on the lines somehow. I laid out the options for the team to choose from:

| Option | Item A ($400) | Item B ($300) | Total | Trade-off |
| --- | --- | --- | --- | --- |
| Pro rata | $17.14 | $12.86 | $30.00 | Every line looks partly taxed |
| Fill in line order | $24.00 | $6.00 | $30.00 | Result changes if lines are reordered |
| **Adjustment line** | $24.00 | $18.00 | $30.00 via a **-$12.00** adjustment | Line tax unchanged; reports must handle the adjustment |

**Decision:** calculate tax on the invoice total and add a single tax adjustment line. This avoids deciding which lines make up "the first $500" and keeps existing reports intact. The demo app and tests in this repo implement this rule.

## What the cap touches

- **Every calculator.** A cap in one place leaves the others overcharging.
- **Returns and credits.** They need to know the original invoice's total.
- **Configuration.** There was nowhere to set a cap. Options: an amount in financial settings, or attached to a specific tax rate.
- **Integrations.** Accounting exports and reporting partners read line tax.

## Decision log (abridged)

I ran this as a living decision log. Each row had a status, an owner, the evidence, and who decided what and when.

| # | Question | Decision |
| --- | --- | --- |
| 1 | Where does the cap live? | In the backend financial service, behind its own new feature flag |
| 2 | How is it configured? | A cap amount in financial settings. The flag only controls whether the setting is visible |
| 3 | How do returns work? | Recalculate the tax on a return. A full credit refunds exactly the tax charged |
| 4 | How is capped tax split across lines? | Not split. One adjustment line on the invoice total |
| 5 | Mixed rates on one invoice: one cap or per rate? | One cap on the invoice total, **confirmed against the ordinance text** |
| 6 | Should estimates show the capped tax? | Yes |
| 7 | Tax-inclusive pricing? | Support both inclusive and exclusive |
| 8 | Is one invoice always one sale? | Yes, with an open question on periodic account billing (e.g. hospital stays) |
| 9 | How do invoices reach the backend service? | Merge two existing flags; the cap gets its own flag. Pilot depends on another feature going GA |

## How I backed it up

- Read the code paths for every calculator, so the "three calculators" claim was evidence, not assumption.
- Pulled usage data to size the impact (how many sites use each path, how often credits are raised).
- Read the borough's sales tax ordinance myself, and used it to settle two debates with the actual wording.
- Wrote **characterisation tests** that lock in today's tax behaviour, so the cap work shows exactly what it changes. See `tests/` in this repo.

## What this shows

Requirements discovery, stakeholder facilitation, decision tracking, domain research and test design, all before a line of feature code was written.
