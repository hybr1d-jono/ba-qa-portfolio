# BA & QA Portfolio: Jonathan Flavell

![tests](https://github.com/hybr1d-jono/ba-qa-portfolio/actions/workflows/tests.yml/badge.svg)

Samples of my work across business analysis and quality assurance: requirements discovery, product and process documentation, and runnable test code.

Most of my professional work lives in private company repos, so everything here is either **recreated against a fictional demo app** or **sanitised** to remove company code, names and data. The approach and reasoning are the real thing.

## What's in here

Grouped from analysis and product thinking, through quality strategy, to hands-on testing.

### 1. Business Analysis & Product Thinking

| Sample | Shows |
| --- | --- |
| [Discovery: Invoice-Level Sales Tax Cap](docs/discovery-invoice-tax-cap.md) | Requirements discovery, decision logs, domain research, stakeholder facilitation |
| [User Journey Template](docs/user-journey-template.md) | Persona-driven journeys written from the user's point of view, doubling as a coverage tracker |
| [FQI Metrics](docs/fqi-metrics.md) | Designing a quality metric and building repeatable reporting from source data |
| [Retro Facilitation](docs/retro-facilitation.md) | Scrum master practice: turning team discussion into owned, measurable actions |

### 2. Quality Strategy & Leadership

| Sample | Shows |
| --- | --- |
| [Deciding What to Automate](docs/deciding-what-to-automate.md) | Risk-based prioritisation framework: WHAT, WHICH, WHERE |
| [E2E Failure Triage](docs/e2e-failure-triage.md) | Root-cause analysis, separating environment issues from flaky tests from real bugs |
| [Automation Champion Guide](docs/automation-champion-guide.md) | Coaching manual testers into automation |

### 3. Hands-on Testing & Engineering

| Sample | Shows |
| --- | --- |
| [Merge Request Write-ups](docs/mr-writeups.md) | Real changes I merged: what the problem was, what I did, why it mattered |
| [XSS Testing Guide](docs/xss-testing-guide.md) | Security testing method for verifying XSS fixes |
| [Playwright E2E tests](tests/e2e/) | Page objects, stable locators, shared helpers, data-driven scenarios |
| [Unit tests](tests/unit/) | Characterisation tests for tax logic, including edge cases |

**How it connects:** the **tax cap discovery** defines the business rules, the **user journey** describes them from the customer's side, and the **tests** prove them.

## Run it (under 5 minutes)

Needs Node 20+.

```bash
git clone https://github.com/hybr1d-jono/ba-qa-portfolio.git
cd ba-qa-portfolio
npm install
npx playwright install chromium
npm test
```

`npm test` runs the unit tests, starts the demo app, and runs the Playwright suite against it. To poke at the app yourself, run `npm run demo` and open http://localhost:4173.

## Project layout

```
demo-app/            Fictional "ClinicBill" invoice app the tests run against
  tax.js             Tax logic: per-line tax, optional invoice-level cap
tests/
  unit/              Node test runner, no browser needed
  e2e/
    pages/           Page objects
    helpers/         Shared helpers (e.g. a toast wait that won't flake)
    *.spec.ts        Playwright specs
docs/                Sanitised documentation samples
.github/workflows/   CI: runs everything on every push
```

## Things worth looking at in the code

- **No force clicks, no sleeps.** Every wait is an assertion on something real.
- **Stable locators only.** Every element is found by `data-testid`.
- **The toast helper.** The demo app's save takes 1.5 seconds on purpose. A 1 second wait would fail. This mirrors a real fix I made that stabilised five tests at once.
- **Scenarios as data.** The tax cap tests loop over a scenario table that matches the discovery doc.
