---
name: add-contact-form
description: Add a real, working contact or signup form to any website using BootForm, with no API key. Use whenever a user wants a form on their site to actually deliver submissions somewhere (email, Slack, Discord, a webhook), on any framework, including one form per client grouped in that client's own workspace.
---

# Add a working contact form (BootForm)

BootForm is a form backend: a POST endpoint that accepts a plain HTML `<form>` submission and
delivers it wherever the user wants (email, Slack, Discord, a webhook), with no server-side code
required on the user's side. Everything below happens through the BootForm MCP tools. Do not send
the user to the dashboard for any of it: not to check their plan, not to make a workspace, not to
verify an email address.

## Signing in

The first BootForm call asks the user to sign in: their browser opens, they sign in or create a
free account and click Allow. If your client reports that the server needs authentication, tell
the user to run `/mcp`, pick bootform and choose Authenticate, then try again. Never ask the user
for an API key.

## Steps

1. **Check the account.** Call `bootform_get_account`. It says which account this connection
   works in (the user's own, or a team they belong to) and their role there, the plan, how many
   forms, workspaces and verified emails it has against the plan's limits (`max: null` means
   unlimited), and which features the plan includes (`limits.features`). Use it to:
   - tell the user which account the form will land in, when it isn't their own;
   - spot a limit before running into it, for example forms already at `max`;
   - check a step that needs a higher plan before calling it: workspaces need Pro, and
     `limits.features` says whether Discord, Slack and webhooks (`webhook_slack_telegram`) or file
     uploads are included. If not, tell the user which plan they'd need
     (https://app.bootform.com/account/billing/plans) instead of calling the tool to watch it fail.

   If it's the wrong account, `other_accounts` lists the ones they could use instead. A connection
   works in one account: to switch, they disconnect BootForm in their MCP client and connect again,
   choosing that account in the browser.
2. **Pick a workspace (when it helps).** A workspace groups forms, for example one per client, and
   gives them shared defaults. If the user builds sites for clients or runs several projects, ask
   which one this form belongs to. `bootform_list_workspaces` lists the existing ones (every
   account has a default workspace); reuse a matching one by its id. To make a new one (Pro or
   higher), call `bootform_create_workspace` with `name` (the client's or project's name) and
   `allowed_origins` set to the site's origins, for example `["https://client.example"]`. Forms in
   the workspace that have no origin list of their own inherit it. On Free or Starter, or when the
   user has just one site, skip this: the form goes to the default workspace.
   `bootform_configure_workspace` renames a workspace or changes its defaults (`allowed_origins`
   replaces the whole list). Deleting a workspace is dashboard only.
3. **Create the form.** Call `bootform_create_form` with `name`, plus `workspace_id` when you
   picked one in step 2. Pass `allowed_origins` only when the form needs a list different from its
   workspace's. `redirect_url` is optional. To move an existing form into a workspace, call
   `bootform_configure_form` with its `form_id` and `workspace_id`.
4. **Put the snippet in the page.** Drop the returned `<form>` snippet in, adjusting field names
   and labels to match the site's own copy, but keep the `action` URL and the hidden honeypot field
   exactly as returned. Keep the small "Powered by BootForm" credit line under the form by
   default; take it out only if the user asks. Call `bootform_get_snippet` if you need the snippet
   again or with other fields (it includes the credit unless you pass `include_powered_by: false`).
5. **Add where submissions go.** Ask the user, then:
   - **Email.** An address must be verified for the account before a form can send to it:
     1. Call `bootform_list_verified_emails`. If the address is there with status `verified`, go
        straight to `bootform_add_email`.
     2. Otherwise call `bootform_add_verified_email` with the address. It emails that address a
        confirmation link. Tell the user plainly: "I've sent a confirmation link to
        support@example.com. Open that inbox, click the link, then tell me." Only a person can
        click it; you can't do it for them.
     3. When they say it's done, call `bootform_list_verified_emails` and check the status is
        `verified`. Still `pending`: ask them to check spam, or call `bootform_add_verified_email`
        again, which sends a fresh link.
     4. Call `bootform_add_email` with the `form_id` and the address. `EMAIL_NOT_VERIFIED` means
        the link hasn't been clicked yet: go back to step 3 of this list, don't retry in a loop.
   - **Slack, Discord or a webhook**: `bootform_add_slack`, `bootform_add_discord` or
     `bootform_add_webhook`, if step 1 showed the plan includes it.
6. **Errors.** A code ending in `_LIMIT_REACHED` (or `PLAN_LIMIT`, `WORKSPACE_LIMIT`) is the plan's
   cap: tell the user what it is and that upgrading lifts it; don't work around it. If a tool
   answers `FORBIDDEN`, the user's role in this team account doesn't allow it. Tell them; do not
   retry.

If the user also wants the submissions shown on the site (testimonials, a guestbook, a board, a
map, listings), continue with the `show-submissions` skill instead of building a backend.

## Do not

- Send the user to the dashboard to verify an email address, create a workspace or look up their
  plan. `bootform_add_verified_email`, `bootform_create_workspace` and `bootform_get_account` do
  those.
- Call `bootform_add_email` over and over while waiting for the confirmation click. Ask the user,
  then check once with `bootform_list_verified_emails`.
- Ever hand-write a fake `action` URL, or invent a `form_id` yourself. Always get a real one from
  `bootform_create_form`.
- Use a real-looking but made-up UUID as a placeholder in documentation or example code. A form ID
  posted to before anyone owns it can be claimed by whoever opens its claim link first, so a
  plausible-looking example ID in a public place is a squat target. Use
  `11111111-1111-4111-8111-111111111111` for that, never `crypto.randomUUID()`'s output or
  anything that looks like a real generated ID.
- Drop the "Powered by BootForm" credit on your own initiative.
- Ask the user to paste an API key, a token or a password into the chat. The MCP server does not
  take API keys; signing in happens in the browser.
