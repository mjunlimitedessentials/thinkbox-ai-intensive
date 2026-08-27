# Curtis "Action" Jackson — site

Single-page cinematic site with two real WebGL scenes. Lives at `/curtis/`
(e.g. `https://training.mjunlimitedessentialmktg.com/curtis/`).

No build step, no framework, no CDN. Open `index.html` and edit.

## Before it goes live — three things to change

1. **Contact inbox.** Line near the top of the first `<script>`:
   ```js
   const CONTACT_EMAIL = 'booking@curtisactionjackson.com';
   ```
   That address is a placeholder. It drives the email shown in the Contact
   section *and* where the form sends. Replace it with Curtis's real inbox.

2. **Stat tiles** (Story section, marked `TODO(Curtis)` in the markup). Three of
   the four are drawn from what Curtis told us — the $50M raise, the four CWENCH
   flavours, Olympic-level athletes on the packaging, five business lanes. Swap
   any of them for verified program numbers (riders coached, events produced,
   years in the sport) once Curtis confirms them.

3. **Social links.** None are in the footer yet because we don't have the
   handles. Add them next to the footer logo when we do.

## What's interactive

| Section | What it does |
|---|---|
| Hero | WebGL night straightaway — rolling light rails to the vanishing point, start gates streaming past, grid rushing under. Mouse moves the camera; scrolling accelerates it. |
| CWENCH | WebGL carousel of the four real cartons. Drag to spin, chips to jump, and the whole section's colour, glow, dust and ghost wordmark morph to the selected flavour. |
| Pillars | Cards tilt in 3D under the cursor with a light that follows it. |
| Academy | Facility blueprint with hover/tap hotspots; phase tracker; investor-brief modal. |
| Programs | Four-lane tabbed panel. |
| The Track | Drag/swipe rail of the five rider gates. |
| Throughout | Custom cursor, magnetic buttons, scroll reveals, count-ups, progress bar. |

Everything degrades: no WebGL → `body.nogl` swaps in a static carton row and a
CSS hero. `prefers-reduced-motion` cuts animation and slows the 3D to a drift.

## Contact form

The form composes a `mailto:` with every field filled in — no backend, nothing to
host. To move it to Formspree, GoHighLevel or similar, replace the body of the
`form.addEventListener('submit', …)` handler with a `fetch()` POST to the
endpoint; the field names (`name`, `email`, `lane`, `org`, `message`) are already
set for it.

## Assets

```
assets/
  sunset-spin.webp  patriot-pulse.webp        cartons, backgrounds removed
  skyline-surge.webp  neon-circuit.webp       and shadows stripped, 620px wide
  og-cover.jpg                                1200×630 social share card
  three.module.min.js                         three.js r169, vendored
  fonts/                                      Anton, Barlow Condensed, Inter (woff2)
favicon.svg
```

Fonts and three.js are self-hosted on purpose: the page makes zero third-party
requests, so it can't be slowed or broken by someone else's CDN.

CWENCH packaging artwork belongs to the brand partner — keep the credit line in
the footer, and check with them before using the cartons anywhere else.
