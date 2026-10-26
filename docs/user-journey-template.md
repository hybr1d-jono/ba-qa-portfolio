# User Journey Template for Test Automation

> **Portfolio sample.** A sanitised version of a template I created so every team documented automation journeys the same way. Our cross-team overview page was built from it: every journey, colour-coded by team, on one page.

**How to use it:** copy the skeleton once per user journey. Group journeys under a role heading. Replace every `<placeholder>`.

---

## 1. Template skeleton

```markdown
## <Role Name> Role

### <n>. <Journey Title> [<Step → Step → Step>]

**Scenario:** <One or two plain-language sentences about a realistic
situation that triggers this journey. Use a named persona and pet.>

**Journey**
- <Step the user takes, in order>
- <Next step>
- <Through to the end state>

**Automation Steps**

| Workflow Step | Status | Story Link |
| --- | --- | --- |
| <Discrete automatable step> | NOT STARTED | <ticket> |
| <...> | IN PROGRESS | <ticket> |
| <...> | DONE | <ticket> |

**Overall Status:** <✅ MERGED / 🚧 IN PROGRESS / ⛔ BLOCKED> <optional note>

**Related Story:** <primary ticket link>
```

---

## 2. What each heading means

| Heading | Purpose |
| --- | --- |
| **Role** | Who does the work (Receptionist, Vet, Practice Manager). The page reads by *person*, not by feature. |
| **Title [Flow]** | The journey name, plus the happy path in shorthand: `[A → B → C]` |
| **Scenario** | The real-world *why*. A short story with a named person and pet, so anyone reading recognises it instantly. Not technical. |
| **Journey** | The steps as a person experiences them. This is the manual walkthrough the automation mirrors. |
| **Automation Steps** | The journey broken into automatable steps, each with a status and a ticket. This doubles as the coverage tracker. |
| **Overall Status** | Rollup for the whole journey, plus caveats (e.g. folded into another journey). |
| **Related Story** | The primary ticket the journey traces back to. |

---

## 3. Worked example (ClinicBill demo app)

### Receptionist Role

### 1. Invoice with Capped Tax [Consult → Invoice → Payment]

**Scenario:** John brings his dog Milo in for an annual check-up and vaccination. The clinic is in a borough that only taxes the first $500 of each sale.

**Journey**
- John books an appointment by phone
- The vet carries out the check-up and vaccination
- The receptionist creates an invoice with both items
- Tax is calculated, capped at the first $500
- John pays at reception
- The payment is recorded and the invoice is closed

**Automation Steps**

| Workflow Step | Status | Story Link |
| --- | --- | --- |
| Add invoice lines | DONE | [invoice-tax.spec.ts](../tests/e2e/invoice-tax.spec.ts) |
| Per-line tax calculation | DONE | [invoice-tax.spec.ts](../tests/e2e/invoice-tax.spec.ts) |
| Tax cap applied | DONE | [invoice-tax.spec.ts](../tests/e2e/invoice-tax.spec.ts) |
| Save invoice | DONE | [invoice-tax.spec.ts](../tests/e2e/invoice-tax.spec.ts) |
| Take payment | NOT STARTED | n/a (not in demo app) |

**Overall Status:** 🚧 IN PROGRESS. Payment isn't built in the demo app.

**Related Story:** [Discovery: Invoice-Level Sales Tax Cap](discovery-invoice-tax-cap.md)

---

## Why I designed it this way

- **Personas first.** Product owners, support staff and new starters can all read it. A journey about "John and Milo" lands better than one about "invoice_create_v2".
- **One page answers two questions.** What does this journey do, and how much of it is automated?
- **Consistency across teams** meant one overview page could pull everything together.

## What this shows

Documentation design, making test coverage visible to non-technical stakeholders, and process standardisation across teams. Writing journeys from the user's point of view is also core BA work.
