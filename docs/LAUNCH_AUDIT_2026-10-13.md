# Forge v1 landing page audit — 13 October 2026

## Scope
Reviewed the current `redesign/forge-v1` production-candidate HTML, JavaScript, landing-page PRD/copy, asset manifest, Blueprint endpoint and Vercel preview response. This is a source/HTTP audit; it is not a substitute for final human visual QA on real desktop and mobile browsers.

## Current state
- Current candidate is isolated on `redesign/forge-v1`; `main` remains untouched.
- Vercel auto-deploys the branch preview. Latest preview commit: `d69526597c6d65b381853d3ded65d618da9e99d5`.
- Checked local assets referenced in the landing-page markup across desktop/mobile photography, brand SVGs, product SVGs, document SVGs, stylesheet, script and legal pages: all tested paths returned HTTP 200.
- The primary CTA is consistently “Map my business”; the page follows one canonical Job 02841 story (J. Smith, 17 Hawthorn Close, £8,200 quote, £4,840 invoice).
- Image alternatives are present throughout the core photography and product examples; mobile-specific image compositions are used for key sections.
- The page includes reduced-motion handling, a skip link, semantic sections/headings, responsive navigation, explicit human approval messaging and a four-question interactive Blueprint.

## Changes made during this audit
- Added explicit, accessible demo status copy and handlers to the invoice Review/Send controls. These were previously inert buttons. They now clarify that this is illustrative demo behaviour and do not imply that an invoice is actually sent.
- Added analytics events for those two demo actions.
- Changes were committed to `redesign/forge-v1` and Vercel created READY branch previews.

## Launch blockers — do not send cold traffic to this as a production lead funnel until resolved
1. **Blueprint lead delivery is not proven/configured.** `api/blueprint.js` requires `BLUEPRINT_WEBHOOK_URL`. If missing, submissions return 503 and the UI correctly says the answers have not been sent. Configure the approved HTTPS destination in Vercel Preview and Production, redeploy, and verify a test lead end-to-end.
2. **Production origin / canonical metadata is blank.** `index.html` has an empty `forge:production-origin` value. Set it to the approved public HTTPS domain before launch so canonical and social metadata become absolute. Do not guess the domain.
3. **Privacy page is explicitly a placeholder.** `privacy.html` says the approved company identity, enquiry destination, retention period and data-controller contact still need configuring. Replace it with accurate approved information before collecting real prospect data.
4. **No final cross-device visual sign-off yet.** Review the whole page at common desktop widths and a narrow iPhone viewport, including sticky header/menu, hero text contrast, image crops, interactive panels, Blueprint validation/error/success states, and footer/legal links.
5. **No live production merge yet.** Keep the redesign branch isolated until the above checks pass. A READY Vercel preview only confirms deployment, not conversion quality or lead delivery.

## Conversion and content audit
- **Positioning:** Strong, differentiated owner-dependency message. Keep “Your business shouldn’t need you to hold it together” as the hero promise.
- **Primary action:** “Map my business” is specific and repeated consistently; the four-question explanation reduces uncertainty.
- **Narrative:** Pain → bespoke workflow → one job journey → attention/AI → trade-specific examples → product proof → documents → pricing → Blueprint is coherent, though long. Validate scroll depth and CTA clicks after launch; do not cut story sections based on taste alone.
- **Proof language:** Keep product screens labelled as demo data and avoid implying every integration or autonomous action is already live. “Keep Xero / keep WhatsApp” must be explained as subject to the agreed implementation and available integrations, not a blanket guarantee.
- **Pricing:** £399/month and implementation from £995 are visible. Ensure this is the approved launch offer and clarify scope/fit during the mapping call rather than promising a universal fixed implementation.
- **Trust:** Human review and permission boundaries are strong differentiators. Maintain clear distinction between prepared drafts and actions actually executed.
- **Accessibility:** Preserve reduced-motion behaviour, keyboard focus, semantic labels and meaningful image alt text. Run a keyboard-only pass and automated accessibility scan before production.

## Image and asset audit
- The markup has descriptive alt text for the main physical-world and product images, and responsive `picture/source` variants for the hero, workday, workflow and trade imagery.
- Product screenshots use SVG and follow the canonical demo story. The page keeps documentary photography separate from product proof.
- Tested image and supporting asset URLs returned HTTP 200 on the current preview.
- Remaining visual checks: inspect each crop at desktop and mobile sizes, verify subject placement behind overlaid text, ensure screenshots are legible at actual display size, check SVG text at mobile scale, and ensure no visual falsely presents generated photography as a real customer/product screen.

## Go-live acceptance checklist
- [ ] Confirm public domain and set `forge:production-origin`.
- [ ] Configure `BLUEPRINT_WEBHOOK_URL` for Preview and Production.
- [ ] Submit a test Blueprint; confirm all expected fields reach the intended CRM/inbox.
- [ ] Verify failure/retry state with an intentionally unavailable test destination.
- [ ] Replace privacy placeholder with approved company and data-handling details.
- [ ] Test all buttons, tabs, mobile navigation, anchors and form validation.
- [ ] Visual review at desktop, tablet and narrow mobile widths.
- [ ] Confirm production robots/canonical/Open Graph/Twitter metadata on the final domain.
- [ ] Review the PR, merge only after acceptance, then verify the production deployment and perform one final live enquiry test.
