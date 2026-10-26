# Becoming an Automation Champion: A Guide for Manual Testers

> **Portfolio sample.** A sanitised version of an onboarding guide I wrote for manual testers moving into automation. I wrote it because I'd made that move myself and remembered what it felt like.

## "Where do I even start?"

> **Q:** I'm keen to learn, but I feel out of my depth and have no idea where to start.
>
> **A:** Totally normal. Here's a step-by-step path that gets you to the point where it makes sense and you're adding value.

The guide is built in four stages, in the order you actually need them.

---

## 1. The Preparation

**Why:** Before you automate anything, you need to know *what* you're automating. Don't open an IDE yet.

Work through [Deciding What to Automate](deciding-what-to-automate.md) first. You should come out of it with a prioritised list of candidates and a written test case for each.

---

## 2. The Tools

What you need installed, and why each one matters:

| Tool | Why you need it |
| --- | --- |
| **VS Code** (plus the Playwright extension) | Writing and running test scripts |
| **Node.js** | The runtime that runs JavaScript and installs libraries |
| **Git** | Getting the code, and sharing your changes |
| **Playwright** | The test framework itself |
| **A database client** | Querying test data to check what the app actually saved |

**Access you'll need:**
- The code repository, with permission to push branches
- The CI pipeline, so you can see your tests run
- The test management tool, for test cases

---

## 3. The Setup

1. Clone the repository
2. Install dependencies (`npm install`)
3. Install the browsers (`npx playwright install`)
4. Authenticate with any tools the suite reports into
5. Run one existing test and watch it pass **before** you write your own

That last step matters. If an existing test won't run, the problem is your setup, not your code. Fix that first.

---

## 4. Navigating the "Techie Speak"

> **Q:** All this technical stuff is over my head. What's the minimum I need to know to follow the conversation?
>
> **A:** JavaScript fundamentals. You don't need to be a developer, but knowing variables, functions, `async`/`await` and how imports work makes test code readable instead of scary.

**What worked for me:** a structured online Playwright course that starts from zero and teaches the JavaScript as you go. Learning the language *through* testing kept it relevant.

**Then build up in phases:**

| Phase | Goal |
| --- | --- |
| **Phase 1: Read** | Open existing tests and explain to yourself what each line does |
| **Phase 2: Modify** | Change an existing test (new data, extra assertion) and get it passing |
| **Phase 3: Create** | Write a new test from one of your Gherkin scenarios |

**And the layers of automation:** unit tests at the bottom (fast, many), API tests in the middle, end-to-end UI tests at the top (slow, few). It'll make more sense once you start automating. That's fine.

---

## What this shows

Coaching and enablement. Making automation approachable for people without a dev background, which is how a QA team scales beyond one "automation person".
