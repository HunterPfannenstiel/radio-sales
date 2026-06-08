# Error Handling

Standards for surfacing validation errors, server failures, and network loss. Error state colors belong in [color.md](color.md). Input field anatomy belongs in [components.md](components.md).

---

## Client-Side / Inline Validation

- Validate **on blur** — after the user leaves a field, not while they type
- Never validate on keystroke: real-time red borders while typing create unnecessary friction
- Error message appears directly below the field it describes
- The field receives a `--color-status-warning` border (see [color.md](color.md))
- Message is plain language — describes what to do, not just what went wrong

**Good:** *"Enter a business name"*
**Bad:** *"This field is required"*

If multiple fields in a form have errors, each field shows its own inline message. No consolidated error summary at the top.

---

## Form Submission Errors (Server-Side)

- After a failed submission, an alert banner appears **above the submit button** — not as a toast, not at the top of the page
- Placement above the submit button ensures the user sees it without scrolling back up
- Message describes what went wrong and offers a next step: *"Couldn't save this call. Check your connection and try again."*
- No technical error codes or status numbers are shown to the user

---

## 500 / Network Errors

When the server fails or connectivity is lost during a page load:

- Show a **full-screen error state** (replaces page content)
- Plain-language explanation — not "500 Internal Server Error"
- A primary **Retry** CTA
- A secondary link to support

The offline sync bar in [motion-loading.md](motion-loading.md) handles lost connectivity during normal use. The full-screen error state is reserved for failures where the entire page cannot render.

---

## What Not to Do

- Do not use toast notifications for form or submission errors — they disappear before the user finishes reading
- Do not use a modal to display an error that originated from a form — keep it in the form context
- Do not show a field error before the user has interacted with that field
