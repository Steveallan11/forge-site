# Blueprint webhook production setup

The Blueprint posts to `/api/blueprint`. The serverless handler validates the contact fields and Blueprint answers, rejects the honeypot field, and only then forwards the lead to the configured destination.

## Required environment variable

Set `BLUEPRINT_WEBHOOK_URL` in both the Vercel **Preview** and **Production** environments.

1. Open the Forge project in Vercel.
2. Open **Settings → Environment Variables**.
3. Add `BLUEPRINT_WEBHOOK_URL` with the HTTPS URL for the approved first-party CRM, automation, or secure form-ingestion webhook.
4. Select Preview and Production.
5. Redeploy each environment so the function receives the variable.

Do not put the destination URL in browser code or commit it to the repository.

## Delivery contract

Forge sends JSON containing `name`, `company`, `email`, optional `phone`, `trade`, `teamSize`, `tools`, `pain`, `modules`, `priorities`, `source`, and `submittedAt`.

The destination must return an HTTP `2xx` response. Any non-`2xx` response is treated as a failed delivery and the form remains visible with a retryable error. If the variable is missing, the endpoint returns `503` with `enquiry_destination_not_configured`; no lead is silently accepted.

## Verification

After deployment, submit a non-customer test Blueprint and verify:

- the browser shows the explicit success state;
- the destination received every Blueprint and contact field;
- a deliberately unavailable test destination produces the visible retry state;
- no destination URL or secret appears in page source or the browser payload beyond the first-party `/api/blueprint` request.
