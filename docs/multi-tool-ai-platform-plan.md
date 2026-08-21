# Building an "All AI Tools in One Place" Platform

Planning doc for a ThinkBox-branded multi-tool AI platform, written against
the Cre-AI-Tor Universe model ($14.99/mo, "140+ tools", video-first).

## 1. What this product actually is

Two corrections to the obvious reading.

**It is not an LLM.** Nobody in this category trained a model. The homepage says
so directly: "Powered by the world's leading AI — Anthropic, Gemini, ..." It is
a front end over other people's APIs.

**It is not a chat product either.** The flagship is AI Video (Seedance 2.0),
then OmniReels, Long Video, Cinematic VFX, Voice Agents. Text chat is a
side dish; the Knowledge Base (chat-with-your-PDF) is the only text surface.

This is a **generative media platform**. That distinction drives everything
below, because media generation is asynchronous, storage-heavy, and one to two
orders of magnitude more expensive per action than text.

**"140+ tools" is presets, not integrations.** The full suite is **11 surfaces**:

Create Video · Long Video · Create Image · Audio Studio · OmniReels ·
Podcast · PDF Report · Presentation · AI Chat (50+ models) · Voice Agents ·
Knowledge Base

Plus four feature tabs: Video, Image, **Edit**, **Effects**. Edit and Effects
are where the count inflates — "Explore All Presets" is the tell. Eleven
surfaces over ~15 model endpoints, multiplied by named presets, becomes
"140+ tools." Build the preset library, not 140 backends.

The model grid they advertise:

- **Video (8):** Seedance 2.0 (ByteDance), Kling 3 (Kuaishou), Veo 3.1
  (Google DeepMind), Sora 2 (OpenAI), MiniMax Hailuo, LTX Video (Lightricks),
  PixVerse V6, Wan 2.7 (Alibaba)
- **Image (8):** Nano Banana 2 (Google), Flux Pro (Black Forest Labs),
  Imagen 3, Midjourney v6, Seedream 4.5 (ByteDance), Stable Diffusion 3,
  DALL-E 3, Recraft V3

**Two entries in that grid are not straightforwardly obtainable.**

- **Midjourney has no official public API** as of 2026 — no REST endpoint, no
  documented key system. Every "Midjourney API" automates the Discord or web
  client, which violates Midjourney's ToS and gets the underlying account
  banned. Note also that they list **v6** while Midjourney has moved on, which
  suggests part of this grid is decorative rather than wired up. Do not promise
  Midjourney without a legitimate route.
- **Sora 2's API is scheduled to end September 24, 2026** — weeks from now.
  Their grid is about to develop a hole.

Treat that as free evidence for the architecture argument in section 3: model
churn in video is fast, and the grid must degrade gracefully when an endpoint
disappears. Never hard-code a model into a preset; map presets to a
capability, and let the capability resolve to whichever endpoint is live.

## 2. The economics — read this before anything else

The advertised ceilings are **1080p, 30-second clips, 4K upscale**, and
**Long Video up to 10 minutes**. Price those out at Seedance 2.0 list rates on
fal.ai:

| Tier | $/sec | 5-sec | 30-sec | 10-min |
|---|---|---|---|---|
| Seedance 2.0 1080p | $0.682 | $3.41 | **$20.46** | $409.20 |
| Seedance 2.0 720p | $0.303 | $1.52 | $9.10 | $182.04 |
| Seedance 2.0 720p fast | $0.242 | $1.21 | $7.26 | $145.14 |
| Seedance Mini 720p | $0.093 | $0.46 | $2.79 | $55.80 |
| Seedance Mini 480p | $0.043 | $0.22 | $1.30 | $25.98 |

Other models for comparison: Kling 3 $0.09–0.14/s, Veo 3.1 Fast ~$0.15/s
(native audio), Sora 2 $0.10/s at 720p standard.

Now against $14.99/month:

```
Gross revenue                        $14.99
Stripe (2.9% + $0.30)               - $0.73
Net                                  $14.26
```

| Config | Cost / 30s clip | Break-even clips/mo | At 70% margin |
|---|---|---|---|
| 1080p | $20.46 | **0.70** | 0.21 |
| 720p | $9.10 | 1.57 | 0.47 |
| Mini 720p | $2.79 | 5.11 | 1.53 |
| Mini 480p | $1.30 | 10.97 | 3.29 |

**One 30-second 1080p clip costs more than the entire monthly subscription.**
Break-even is under a single clip per month. A 10-minute Long Video at 720p is
roughly twelve months of that user's revenue in one job.

Real-time voice agents add $0.05–0.15/minute on top; a hundred minutes is
$5–15 — one user, one feature, the whole subscription.

**So the advertised ceilings are not what the $14.99 tier delivers.** They are
sold as ceilings and gated by credits. The $14.99 buys the funnel; the revenue
is credit top-ups, annual prepay, and tier upgrades. The "30% OFF" on Seedance
is a credit promotion, not a subscription discount.

This is a legitimate pattern — but it only works if the meter exists on day
one. Ship the ceilings without the gate and the heaviest 5% of your users will
consume more than the other 95% pay.

### Design the meter first

- 1 credit = a fixed cost slice; publish a visible cost per action
- Price credits at 3–5x underlying API cost
- **Reserve credits before dispatching the job, settle on completion, refund
  on provider failure.** Failed generations are common and you eat them.
- Cap concurrent jobs per user (2–3). Without this, one user queues 50 videos.
- Hard monthly spend ceiling per account, enforced server-side
- Show remaining balance permanently in the UI — it self-regulates demand

## 3. Architecture

Media generation is **asynchronous** — 30 seconds to 5 minutes per job. This
is the single biggest structural difference from a chat wrapper. You cannot
hold an HTTP request open.

```
Browser
  |  submit job
  v
Supabase Edge Function
  - auth + plan check
  - estimate cost, RESERVE credits
  - insert row into jobs (status=queued)
  - dispatch to provider with webhook_url
  |
  v
Media aggregator (fal.ai or Replicate)
  video  -> Seedance, Kling, Veo, Wan
  image  -> Flux, SDXL, Nano Banana
  audio  -> music / SFX models
  |
  |  webhook callback on completion
  v
Supabase Edge Function (webhook receiver)
  - verify signature
  - copy output -> Cloudflare R2
  - SETTLE or REFUND credits
  - update jobs row
  |
  v
Supabase Realtime -> browser updates live, no polling
```

Separate providers, because aggregators don't cover these well:
- **Voice agents (real-time):** ElevenLabs Agents, Vapi, or LiveKit + OpenAI Realtime
- **Knowledge Base (chat-with-PDF):** Supabase pgvector + an embedding model +
  Claude/Gemini for synthesis. Cheap. Build this early — it is the one feature
  here with near-zero marginal cost.
- **Text/LLM:** OpenRouter or LiteLLM if you want a chat surface too

### Storage is a real line item

Video files are large and users re-watch and re-download them. **Use
Cloudflare R2 — zero egress fees.** S3 egress on a video product is a bill
that arrives without warning. Set a retention policy (e.g. 30 days on the
entry tier) and say so in the plan description.

## 4. What carries over from this repo

| Have | Role |
|---|---|
| Supabase (RPCs + `send-waitlist-confirmation` Edge Function) | Auth, DB, jobs table, Realtime, webhook receiver |
| Stripe checkout | Subscription + credit packs |
| Resend | Transactional + lifecycle email |
| n8n | Multi-step chains (OmniReels-style: script → shots → clips → stitch) |
| GitHub Pages + funnel pages | Marketing site stays put |
| ThinkBox training list | Distribution |

n8n is a genuinely good fit for the "OmniReels" pattern — a marketing video
factory is a workflow, not a single API call.

The app needs server-side secrets and webhooks, so it moves off GitHub Pages
to Vercel at `app.` — funnel stays where it is.

## 5. Build sequence

**Phase 1 — one job type, end to end (1–2 weeks).** Auth, credits ledger,
jobs table, text-to-video via fal.ai, webhook, R2 storage, Realtime progress
UI. Getting the async + credit-settlement loop right once means every later
tool is a variation on it.

**Phase 2 — breadth (2–3 weeks).** Image gen, image-to-video, upscale,
voice/TTS, Knowledge Base (pgvector RAG). Each reuses the Phase 1 pipeline.

**Phase 3 — the preset library (1–2 weeks).** This is where "140+ tools" comes
from and where your existing prompt work (`claude-command-codes.html`) becomes
product. Named presets with thumbnails, organized by outcome, one click to run.
Highest perceived value per hour of build time in the entire plan.

**Phase 4 — monetize (1 week).** Stripe subscription + credit packs, plan
gating, onboarding sequence via Resend, referral loop into the training funnel.

Fast path to v1: **Lovable** (React + Supabase from a description) to validate
demand before hand-building.

## 5b. Two features worth copying outright

**URL-to-Video.** Paste a product or landing-page URL, get a finished ad. It is
listed as "one-click professional ad generation" and it is the single feature
here most aligned with the ThinkBox audience — marketers and entrepreneurs who
have a product page and no video team. Mechanically it is a chain, not a model
call: scrape the URL, extract offer and imagery, LLM writes the script and shot
list, generate scenes, stitch, add voiceover. **That is an n8n workflow**, which
you already run. If you build one differentiated thing, build this one.

**The community gallery ("Mixed Media").** User generations displayed publicly,
filterable by style chips (Sketch, Canvas, Flash comic, Overexposed). This is
close to free: your users produce your marketing content, the style chips double
as preset discovery, and new visitors see proof of output before signing up. Add
an explicit opt-in and a takedown path, then ship it.

## 6. Risks specific to this category

- **Moderation is not optional.** Image/video/voice generation attracts NSFW
  content and non-consensual likenesses. Providers require filtering; you carry
  the liability and the App Store / payment-processor risk. Voice cloning plus
  video is the highest-risk combination in this product. Budget for a
  moderation pass and a reporting path from day one.
- **Stripe risk.** Payment processors treat AI media generation as elevated
  risk. Sudden volume on a new account can trigger a review or hold.
- **Advertising claims.** "#1", "world's most advanced", "500,000+ creators"
  are unverifiable puffery. Do not copy claims you cannot substantiate — the
  FTC has been active on AI marketing claims, and this is avoidable exposure.
- **Never say "our AI."** "Powered by leading AI models" is accurate and safe.
  Their site does this correctly — the second screen lists Anthropic and Gemini
  by name.
- **Model churn.** Video model endpoints get deprecated and repriced faster
  than text. An aggregator absorbs this; direct integrations break in prod.
- **Provider ToS.** Check resale terms per provider before launch.

## 7. Honest read

The competitor is executing well: video-first (where the demand and the
willingness to pay actually are), a low headline price for acquisition, credits
for monetization, and preset-count as the breadth story. That's a coherent,
well-understood playbook.

It's also capital-intensive in a way a chat wrapper is not. Every signup
carries real marginal cost from the first click, and mispriced credits lose
money on volume. This is not a "launch it and see" product — the meter has to
be right on day one.

Where ThinkBox has an actual edge: not the tooling, which is commodity, but the
audience and the training. A creator who has been through the AI Intensive and
lands in a workspace with ThinkBox presets already loaded is a fundamentally
different retention profile than a cold $14.99 ad signup. Lead with the
training, attach the platform.
