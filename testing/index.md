# Testing Guide

Grounding principles for writing tests in this app — for humans and agents alike.
Read Part A before writing any test. The goal is tests that **prove something**,
not tests that merely **do something**.

## Part A — General Principles

These apply regardless of layer.

### 1. State the claim before you write the test

Every test should be traceable to an explicit answer to two questions:

- **What user-observable behavior does this prove works?**
- **What is this test explicitly *not* proving — and what (if anything) covers that gap?**

If you can't answer both, you don't know what you're building yet. A test that
passes without anyone being able to say what it verified is worse than no test —
it's false confidence that survives code review and quietly stops meaning anything
the moment the implementation changes underneath it.

Write the claim as a comment at the top of the test, or in the test name itself.
Not "logs in successfully" — "a rep who has never logged in before is routed to
goal-setting, and that routing decision survives a brand new session (proves
persistence, not just client state)."

### 2. Know which layer you're testing, and why

Unit tests prove a function or module is correct in isolation — they say
nothing about whether the pieces work together. Integration tests prove a real
slice of the stack is wired correctly (a mutation talking to a real data
layer, for example) — they don't prove a user can actually complete a journey
through the UI. E2E tests prove a real browser can complete a real user
journey against real running code — they don't substitute for unit coverage
of complex internal logic, and they can't tell you anything about code paths
they don't happen to exercise.

See the per-layer docs below for what each one actually requires in practice.

### 3. Test data is part of the claim

The data behind a test is part of the claim, not scaffolding around it. If you
don't know exactly what data exists and why, you don't actually know what your
test proved — an assertion can pass against the wrong data just as easily as
the right data, and you'd have no way to tell the difference.

## Part B — By Layer

- [Unit Testing](./testing/unit.md)
- [Integration Testing](./testing/integration.md)
- [E2E Testing](./testing/e2e.md)

## Before you write any test

1. What user-observable behavior am I proving works?
2. What am I explicitly *not* testing here, and what (if anything) covers that gap?
3. What layer does this claim belong at?
4. What data does this test depend on, and do I know exactly why it's there?

Then check the doc for that specific layer — each one has its own sharper
rules (naming, environment, data sourcing) that build on these fundamentals.
