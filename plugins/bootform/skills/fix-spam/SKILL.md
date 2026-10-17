---
name: fix-spam
description: Find out whether a BootForm form is getting spam and fix it, step by step, through the BootForm MCP tools: check the form, read a sample, turn on the honeypot and update the page, suggest Turnstile, and move or delete the spam once the user agrees. Use whenever a user says their form gets spam, junk or bot messages, or you notice spam while reading a form's submissions.
---

# Fix spam on a form (BootForm)

Spam on a BootForm form is fixed with the BootForm MCP tools plus one edit to the page that holds
the form. Do not propose a server-side filter, a serverless function or a third-party spam
service. Work through the steps in order and stop as soon as the spam stops: each step costs the
user a little more than the one before.

## Signing in

The first BootForm call asks the user to sign in in their browser. If your client reports that the
server needs authentication, tell the user to run `/mcp`, pick bootform and choose Authenticate.
Never ask the user for an API key.

## Steps

1. **Find the form.** `bootform_list_forms` lists the account's forms. Each one carries
   `spam_protection`: whether the honeypot is on, the honeypot field's name (`honeypot_field`), and
   whether a CAPTCHA is set up. If the user didn't say which form, ask, or match it by name or by
   the `action` URL on their page (`https://f.bootform.com/<form id>`).
2. **Check it.** Call `bootform_check_spam` with the form's id (`days` defaults to 14, up to 90).
   It returns facts, not a verdict:
   - `counts`: inbox, archived and spam in the window.
   - `spam_by_reason`: `honeypot_filled` (a bot filled the hidden field), `honeypot_missing` (the
     honeypot is on but the post didn't carry the field at all, usually a bot posting straight to
     the endpoint) and `marked_by_hand`.
   - `inbox_signals`: ids of inbox submissions that carry links, that came from one IP within a
     minute of each other, or that repeat the same message. These are hints, not proof: a real
     customer can send a link.
3. **Read a sample** with `bootform_get_submissions`, starting with the ids the signals named, and
   judge for yourself whether they are spam. `spam: true` lists the spam folder, so you can also
   check that nothing real landed there (a high `honeypot_missing` count with real-looking
   messages means the page is missing the honeypot field, not that the visitors are bots).
4. **Tell the user what you found** in a sentence or two: how much got through, what it looks
   like, and the fix you propose next. Then fix it, in this order:

   a. **Honeypot off: turn it on.** First make sure the page carries the field, exactly as
      `bootform_get_snippet` returns it (a hidden text input named after the form's
      `honeypot_field`). Then call `bootform_configure_form` with `honeypot_enabled: true`. Page
      first, switch second: while the switch is on, a submission without the field goes to spam.

   b. **Honeypot on, spam still in the inbox: suggest Turnstile.** Don't rename the honeypot
      field: the bots that get past it leave every hidden field empty, whatever it is called, so a
      new name changes nothing (BootForm tried it on its own forms). Cloudflare Turnstile is the
      next step. It is set up by the user in the dashboard (app.bootform.com, the form's
      Settings, Spam protection) with their own Cloudflare keys. Never ask for CAPTCHA keys; they must not pass through this chat. Once it's
      on, the page needs Turnstile's script and widget; `bootform_get_snippet` includes them.

5. **Clean up, only with a yes.** Offer to move the spam you found to the spam folder
   (`bootform_mark_submission` with `spam: true`) or to delete it (`bootform_delete_submissions`,
   up to 200 ids a call, with `confirm: true`). Name the ids, or how many and from when, and ask
   first. Deleting is permanent: there is no trash. Moving to spam is the safer default. If the
   user spots a real message in the spam folder, `bootform_mark_submission` with `spam: false`
   moves it back to the inbox (no notification is sent for it).

## Permissions

If a tool answers `FORBIDDEN`, the user's team role doesn't allow it (reading needs Viewer;
changing settings, marking and deleting need Editor). Tell them, and don't retry.

## Learn more

https://bootform.com/docs/spam-protection
