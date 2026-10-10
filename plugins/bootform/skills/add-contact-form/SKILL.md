---
name: add-contact-form
description: Add a real, working contact or signup form to any website using BootForm, with no API key. Use whenever a user wants a form on their site to actually deliver submissions somewhere (email, Slack, Discord, a webhook), on any framework.
---

# Add a working contact form (BootForm)

BootForm is a form backend: a POST endpoint that accepts a plain HTML `<form>` submission and
delivers it wherever the user wants (email, Slack, Discord, a webhook), with no server-side code
required on the user's side.

## Steps

1. Call `bootform_create_form` to get a `form_id` and an HTML snippet. The form is created on the
   user's BootForm account. The first time, the BootForm MCP server asks the user to sign in: their
   browser opens, they sign in or create a free account and click Allow. If your client reports that
   the server needs authentication, tell the user to run `/mcp`, pick bootform and choose
   Authenticate, then try again. Never ask the user for an API key.
2. Call `bootform_get_snippet` if you need the snippet again, or in a different shape (a
   framework-specific one instead of plain HTML).
3. Drop the returned `<form>` snippet into the page, adjusting field names and labels to match the
   site's own copy, but keep the `action` URL and the hidden honeypot field exactly as returned.
4. Ask where submissions should go and add it: `bootform_add_email` (the address must already be
   verified on the account), `bootform_add_slack`, `bootform_add_discord` or `bootform_add_webhook`.
5. If a tool answers `FORBIDDEN`, the user is connected to a team account with a role that does not
   allow it. Tell them; do not retry. To work in another account they disconnect and connect again,
   choosing that account in the browser.

If the user also wants the submissions shown on the site (testimonials, a guestbook, a board, a
map, listings), continue with the `show-submissions` skill instead of building a backend.

## Do not

- Ever hand-write a fake `action` URL, or invent a `form_id` yourself. Always get a real one from
  `bootform_create_form`.
- Use a real-looking but made-up UUID as a placeholder in documentation or example code. A form ID
  posted to before anyone owns it can be claimed by whoever opens its claim link first, so a
  plausible-looking example ID in a public place is a squat target. Use
  `11111111-1111-4111-8111-111111111111` for that, never `crypto.randomUUID()`'s output or
  anything that looks like a real generated ID.
- Ask the user to paste an API key, a token or a password into the chat. The MCP server does not
  take API keys; signing in happens in the browser.
