# E2E Failure Triage: Environment vs Flaky vs Real

> **Portfolio sample.** A sanitised version of a triage page I wrote after standing up a local end-to-end environment. Spec names, internal services, people and ticket numbers are generalised. The method and the findings are mine.

**TL;DR:** A local run of the Playwright suite gave **46 passed / 37 failed / 6 skipped** of 89. The instinct was "the suite is flaky". After reading every failure's actual error message, **only 6 of 37 were genuinely flaky**. 20 were environment or test data problems, and most of the rest already had fixes waiting.

## The split

| Category | Tests | Fails on CI too? | Who should look |
| --- | --- | --- | --- |
| **Environment** (local stack only) | 12 | No | Whoever owns the local environment |
| **Site / data config** | 8 | Probably not | **QA: start here, no code needed** |
| **Stale spec** (fix already written) | 9 | Yes | Test authors |
| **Flaky** (timing / fragile helper) | 6 | Intermittently | Test authors |
| **Open** (needs a product call) | 2 | Yes | Product + dev |

## Key findings

**One environment bug caused 7 failures.** An auth key path was set nowhere in the local stack, so a product search API returned errors and no product ever landed on an invoice line. Seven different specs, one root cause. I raised it as a question for the environment owner rather than probing their setup.

**Two failures shared one locator and one likely cause.** Both failed because a cost price field was hidden. My hypothesis: the field is permission-gated and the test user had no permission groups. Cheap to check, and it would fix two specs at once.

**Five "flaky" tests were one bug.** All five failed on the same line: a shared toast helper with a **1 second timeout**. One fragile helper, not five bugs. A one-line fix for five tests. (Reproduced in this repo: the demo app's save takes 1.5 seconds. See `tests/e2e/helpers/toast.ts`.)

**One earlier diagnosis was wrong, and I corrected it.** A failure had been put down to missing configuration. Reading the actual error showed it was a stale test ID after a product change. Fixing the config would have been wasted effort.

**Only one failure was a true race condition.** It passed 19 of 20 runs, but not the same 19 each time. The failure moved. That pattern means timing, not data, so I flagged it to the spec author rather than chasing any single run.

**Two failures I deliberately did not "fix".** A dropdown never became stable after a focus change in the product. It was unclear whether this was a real regression users would hit, or a test assumption. If it's a real regression, the test is right to fail. I left it open for a product decision.

## Action list I handed over

- [ ] QA, no code: check the test user's permission groups (may clear 2 tests)
- [ ] QA, no code: populate missing partner data in the test site (3 tests)
- [ ] Test authors: raise the shared toast helper timeout (5 tests, one line)
- [ ] Test authors: apply the scoped test ID patch (5 tests, already written)
- [ ] Merge three waiting fixes (4 tests)
- [ ] Ask the environment owner how the auth keys are meant to reach the app locally (7 tests)

## Caveat I included on the numbers

This run was taken while the auth bug was open, so it was **not a clean baseline**. I flagged that the numbers should be re-baselined once it was fixed, before anyone read anything into per-spec results.

## What this shows

Root-cause analysis over symptom-chasing, grouping failures by cause rather than by spec, knowing when to ask instead of dig, and handing over a prioritised plan that separates "QA can fix this now" from "this needs a developer".
