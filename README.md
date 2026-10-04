# Forge landing page

Production-candidate landing page for Forge, a bespoke business operating system for trade businesses.

## Run locally

Serve the repository root with any static file server, then open `index.html`.

## Structure

- `index.html` — production landing-page narrative and Blueprint
- `styles.css` — Forge brand, responsive layouts and reduced-motion behaviour
- `cinematic.js` — cause-and-effect interactions and analytics event hooks
- `public/` — approved brand, product, workflow, document and integration assets
- `docs/` — authoritative positioning, copy, UX and asset specifications

## Blueprint submission

The Blueprint provides its tailored result before contact fields, then posts the full Blueprint and enquiry context to `/api/blueprint`. The serverless function validates and forwards the enquiry without exposing a destination or secret in the browser.

One deployment setting is required: configure `BLUEPRINT_WEBHOOK_URL` in the Vercel Preview and Production environments with the approved first-party CRM, automation or secure form-ingestion webhook. No private address or third-party endpoint is embedded in the public source.

Successful submissions emit `forge:contact_form_submit` plus the matching `dataLayer` event. Delivery failures remain on the completed Blueprint and show a retryable error state.
