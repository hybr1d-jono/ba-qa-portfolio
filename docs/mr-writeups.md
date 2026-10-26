# Merge Request Write-ups

> **Portfolio sample.** Write-ups of real changes I merged into a production monorepo for a veterinary practice management SaaS. I can't share the original code, so each write-up explains the problem, what I changed and why. Where useful, the pattern is recreated in this repo against a fictional demo app.

In total I merged **45+ changes** across the product monorepo and supporting services: new E2E journeys, reliability fixes, test infrastructure and internal QA tooling.

---

## MR 1: Characterisation tests for invoice tax

**Problem:** A new tax cap feature was about to change how invoice tax is calculated. There were no tests pinning down today's behaviour, so nobody could prove what the change would and wouldn't affect.

**What I did:** Wrote tests that lock in current behaviour: per-line tax, the summed invoice tax total, and tax on negative-quantity (returned) lines.

**Why it matters:** When the cap lands, any test that changes is an intended change. Any test that breaks unexpectedly is a regression caught before release.

**In this repo:** `tests/unit/tax.test.mjs` and `tests/e2e/invoice-tax.spec.ts`

---

## MR 2: One shared helper, five flaky tests

**Problem:** Five unrelated specs failed intermittently. They looked like five separate bugs.

**Root cause:** All five failed on the same line in a shared helper: a hard-coded 1 second wait for a success toast. Whenever the save took longer than a second, every test using the helper failed.

**What I did:** Replaced the fixed wait with a web-first assertion and a realistic timeout.

**Why it matters:** One-line fix, five tests stabilised. And the team stopped treating "flaky" as normal.

**In this repo:** `tests/e2e/helpers/toast.ts`. The demo app's save deliberately takes 1.5 seconds, so a 1 second wait would fail.

---

## MR 3: Drop the force click

**Problem:** A test used `click({ force: true })` on a dropdown. Force clicks skip Playwright's checks that an element is visible, enabled and not covered, so the test could pass while a real user couldn't click the control.

**What I did:** Removed the force click and waited for the element to be ready, so the test exercises the same path a user does.

**Why it matters:** A test that can't fail isn't testing anything.

---

## MR 4: Stable test IDs instead of positional picks

**Problem:** After a product change, several specs used bare test IDs plus `.nth(1)` / `.last()` to pick between ambiguous matches. They started matching nothing.

**What I did:** Moved locators to scoped, unique test IDs.

**Why it matters:** Tests now fail for product reasons, not because the layout shifted.

**In this repo:** `tests/e2e/pages/InvoicePage.ts` uses only stable `data-testid` locators.

---

## MR 5: Pin seeded test data

**Problem:** A test for mobile number formatting depended on whatever country the seeded contact happened to have, so it passed or failed depending on test data.

**What I did:** Pinned the seeded contact's country inside the test setup.

**Why it matters:** Tests own their data. No hidden dependencies on the state of a shared environment.

---

## MR 6: Retire dead specs and orphaned helpers

**Problem:** The suite carried specs that were never going to run in CI and helper files no test imported.

**What I did:** Removed them, after confirming nothing referenced them.

**Why it matters:** Less noise in reviews and coverage reports, and less code for the next person to misread.

---

## Other work (summarised)

- **E2E journeys:** invoice creation and approval, estimates, statements reports, price adjustment rules, financial lockdown, payment terms, revenue and commission reports, invoice PDF printing, email and SMS communications, bookings, contact records, time clock
- **Test catalogue:** re-catalogued the automated suite across 37 product areas
- **Coverage tracker:** two-way sync between the test suite and planning docs, with per-team counts
- **Bug analysis tool:** containerised service and dashboard over the defect history, designed so the data can't be misread. It showed the backlog was blind to most of one major code area
- **Cross-platform fix:** made a tool's test suite runnable on Windows clones (line ending normalisation)
