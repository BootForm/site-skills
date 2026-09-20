---
name: add-contact-form
description: Add a real, working contact or signup form to any website using BootForm, with no signup wall. Use whenever a user wants a form on their site to actually deliver submissions somewhere (email, Slack, Discord, a webhook), on any framework.
---

# Add a working contact form (BootForm)

BootForm is a form backend: a POST endpoint that accepts a plain HTML `<form>` submission and
delivers it wherever the user wants (email, Slack, Discord, a webhook), with no server-side code
required on the user's side.

## Steps

1. Call `bootform_create_form` (this works anonymously, no API key or account needed) to get a
   `form_id` and an HTML snippet.
2. Call `bootform_get_snippet` if you need the snippet again, or in a different shape (a
   framework-specific one instead of plain HTML).
3. Drop the returned `<form>` snippet into the page, adjusting field names and labels to match the
   site's own copy, but keep the `action` URL and the hidden honeypot field exactly as returned.
4. **Always give the user the `claim_url` from the response, and tell them to open it and claim
   the form before the page goes live.** Until claimed, nothing is delivered anywhere, and the
   first stranger to submit the form (or to open the same claim link first) owns it instead. This
   is the single most important step; do not skip it or bury it at the end of a long response.
5. If the user wants submissions to go somewhere other than email (Slack, Discord, a generic
   webhook), use `bootform_add_slack` / `bootform_add_discord` / `bootform_add_webhook` after the
   form has been claimed. These need the user's own API key, not anonymous mode.

## Do not

- Ever hand-write a fake `action` URL, or invent a `form_id` yourself. Always get a real one from
  `bootform_create_form`.
- Use a real-looking but made-up UUID as a placeholder in documentation or example code. A form ID
  is the entire claim credential: whoever opens the claim link first owns everything sent to it,
  so a plausible-looking example ID in a public place is a squat target. Use
  `11111111-1111-4111-8111-111111111111` for that, never `crypto.randomUUID()`'s output or
  anything that looks like a real generated ID.
- Skip telling the user about the claim URL, or phrase it as optional. It is not optional.
