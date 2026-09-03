# Handoff — Curtis "Action" Jackson + RWU BMX

Branch: `claude/curtis-action-jackson-site-49czo2` · everything below is pushed.

## What exists

**1. `curtis/` — Curtis "Action" Jackson personal site.** Finished, single-page,
vanilla HTML/CSS/JS. Two WebGL scenes: a hero track flythrough (bloom, film
grade, ACES, wall-clock camera entry) and a six-carton CWENCH carousel with
drag/snap and per-flavour colour morph. Self-hosted fonts, vendored three.js,
no CDN. See `curtis/README.md`.

**2. `rwu/` — RWU cinematic hero, reference build.** The gate-drop concept for
rwubmx.com: held behind a BMX start gate, the gate falls at 1.5s, the camera
accelerates down the straight. RWU palette and the four logo swoosh arcs.
Shares `curtis/assets` (three.js, jsm postprocessing, fonts) via import map.
Not yet ported to Lovable.

**3. Lovable projects** (workspace `0QevYE9XkgdHJ22fWIeE`, Mona J H)
- Action Jackson Portfolio — `ee840d29-cf88-47f3-b7b3-33431a31d6f0`
  React port of `curtis/`, in sync with branch head. ~19 credits spent.
- RWU BMX League — `1498bb32-031b-452b-a8ae-09376dca36ce`
  Phase 1 of the league platform: 12 routes, real logo, no invented content,
  Stripe stubbed, no minors' data collected. ~2 messages spent of 5.
Neither is deployed or published.

**4. Build plan artifact** — phased roadmap for the full RWU platform:
https://claude.ai/code/artifact/78749bf8-e59f-40d3-ad4e-11f9dbdb0b09

## Source documents
- `RWUBMX-spec.md` (sent to Mona) — the client's 28-section spec, decoded from
  a PDF whose text was locked in subset-encoded fonts.
- RWU logo extracted from that PDF to transparent PNG: `rwu/assets/rwu-logo.png`
  (+ mono white). It is stored as JPEG plus an inverted alpha mask, so a naive
  extraction yields a white block.

## ON HOLD — the enrolment app (per Curtis)

Paused until further notice. Do not resume without the client asking. What
exists and is paid for:
- `rwu/enroll/` — the standalone questionnaire (vanilla HTML, works, tested)
- `/join` in the Lovable RWU project (commit df72d3b) — the same flow in React
- JotForm "RWU BMX League — Rider Enrollment", id 262445653643057, live at
  https://form.jotform.com/262445653643057 and able to accept submissions
- Every enrolment CTA on the RWU site points at `/join`; `/register` redirects
  there and the old "opening soon" page is deleted

Not done, deliberately: mid-flow lead capture for drop-offs, a square
home-screen icon (the current one is the 1241x433 logo and iOS will crop it),
the JotForm Sign waiver path (needs a real waiver document).

Two couplings to remember before publishing anything:
- Publishing the RWU site sends every "Join" button into a live enrolment
  flow. If the app is still on hold then, those CTAs need parking first.
- The JotForm form is reachable by anyone with its link. If nobody is
  monitoring submissions during the hold, disable it in JotForm.

## Open decisions
- **Race results data source** — blocks the entire points/leaderboard system.
  USA BMX feed, admin key-in, or track submission?
- **Minors' data** — DECIDED: no legal review at this stage (client's call, do
  not re-litigate). Risk reduced instead by collecting less: the enrolment form
  takes no rider photo, contacts only the adult, and its checkboxes state facts
  rather than claiming to be a release. A real waiver is signed at the track or
  through the sanctioning body. Revisit if the league starts holding photos or
  issuing its own waivers.
- **The app** — Mona wants a companion app for Curtis, referencing
  thinkboxaistudios-dashboard.netlify.app (blocked by egress here; needs a
  screenshot). Undecided: operator dashboard for Curtis vs rider/parent app.
  Recommendation either way: PWA on the same Supabase backend as the website.
- **Domain** — rwubmx.com is at GoDaddy, to point at the league site. Delete
  GoDaddy's default parked A/CNAME records first or it won't resolve.

## Content still needed from the client
Real contact inbox (both builds use placeholders) · photography of Curtis
(the personal site has none) · social handles · track listings · season
schedule · athlete photos with consent for under-18s · sponsor logos and tiers
· division fee schedule · rulebook · Stripe account under the RWU entity.

## Security
A GoDaddy customer number and password were shared as a screenshot in the
session. That password must be changed and 2FA enabled; assume it is exposed.
