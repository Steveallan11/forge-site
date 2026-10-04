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

The Blueprint provides its tailored result before contact fields and emits `forge:contact_form_submit` plus a matching `dataLayer` event. Connect that event to the approved first-party enquiry endpoint before production launch; no private address or third-party form endpoint is embedded in the public source.
