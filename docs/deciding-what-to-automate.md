# Deciding What to Automate: WHAT, WHICH, WHERE

> **Portfolio sample.** A sanitised version of a guide I wrote to help QA teams start test automation without wasting effort on the wrong things. Company-specific tools and boards have been generalised.

Most automation efforts fail in the same way: people start writing scripts before they know what's worth scripting. This framework is three steps you do **before** writing any code.

---

## Step 1: WHAT

**Question:** What does my team own, and what could be automated?

**How:** Map out every product area and feature your team owns. Keep it to what's in your team's control, not the whole product.

**Method:** A mind map. It breaks a big product down into something you can see on one page.

**Outcome:**
1. A visual map of automation candidates
2. A clear boundary around what your team is actually responsible for

**Example (ClinicBill demo app):**

```
ClinicBill (team-owned)
├── Invoicing
│   ├── Create invoice
│   ├── Add / remove lines
│   ├── Tax calculation
│   └── Tax cap
├── Estimates
│   ├── Create estimate
│   └── Convert estimate to invoice
├── Payments
│   ├── Card payment
│   └── Cash payment
└── Reports
    └── Statements report
```

**Tip:** Free mind map templates in Miro, FigJam or similar are plenty.

---

## Step 2: WHICH

**Question:** Which candidate gives the best value for the effort?

**How:** Plot each candidate on a priority matrix:
- **X axis: Importance.** How bad is it for the business if this breaks?
- **Y axis: Effort.** How hard is it to automate reliably?

You're looking for the **high importance, low effort** corner. Start there.

**Example:**

| Candidate | Importance | Effort | Verdict |
| --- | --- | --- | --- |
| Tax calculation | High | Low | **Automate first** |
| Create invoice | High | Low | **Automate first** |
| Card payment | High | High | Plan it, needs a payment sandbox |
| Statements report | Medium | Medium | Next wave |
| Convert estimate to invoice | Medium | Low | Quick win |

*(Illustrative ratings for the demo app.)*

**Tip:** Talk to your customer support team. They know which features generate the most calls, and that's real evidence of importance, not a guess.

---

## Step 3: WHERE

**Question:** Where do I write down the tests before I automate them?

**How:** Create a regression test case in your test management tool (Xray, Zephyr, TestRail) for each candidate, with a naming convention that makes the area obvious from the title.

**Outcome:**
1. One test case per candidate with a clear title
2. The intent written in basic Gherkin, so whoever automates it knows exactly what it should prove

**Example:**

```gherkin
Feature: Invoice tax cap

  Scenario: Invoice over the cap is only taxed on the first $500
    Given the tax rate is 6%
    And the tax cap is $500
    When I add a $400 line and a $300 line
    Then the tax adjustment is -$12.00
    And the total tax is $30.00
```

This exact scenario is automated in [`tests/e2e/invoice-tax.spec.ts`](../tests/e2e/invoice-tax.spec.ts).

**Tip:** Gherkin isn't mandatory, but it's a handy bridge between manual and automated testing. Watch out for tools that wipe a test's manual steps when you switch its type to "automated". Copy the steps somewhere first.

---

## What this shows

Risk-based prioritisation, stakeholder input (support team), and planning automation as an investment decision instead of a coding exercise.
