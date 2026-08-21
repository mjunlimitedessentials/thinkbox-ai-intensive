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

**"140+ tools" is presets, not integrations.** The Cinematic VFX card says
"Explore All Presets." The real integration count is likely under 15 model
endpoints, wrapped in 140+ named, thumbnailed presets. This is the correct
move — presets are cheap to build and remove the prompt-engineering burden
that stops non-technical users. Build the preset library, not 140 backends.

## 2. The economics — read this before anything else

Video API pricing, mid-2026, directional (verify current rate cards):

| Model | ~Cost/sec | 5-sec clip |
|---|---|---|
| Seedance 2.0 (fal, 720p) | $0.24–0.30 | $1.20–1.50 |
| Seedance 2.0 (volume/3rd-party) | ~$0.09 | ~$0.45 |
| Seedance 2.0 Mini (720p) | ~$0.093 | ~$0.47 |
| Seedance 2.0 Mini (480p) | ~$0.043 | ~$0.22 |
| Kling 3.0 | $0.09–0.14 | $0.45–0.70 |
| Veo 3.1 Fast (native audio) | ~$0.15 | ~$0.75 |

Now run $14.99/month:

```
Gross revenue                        $14.99
Stripe (2.9% + $0.30)               - $0.73
Net                                  $14.26

At $0.45 per 5-sec clip:
  Break-even                        ~31 clips/month   (0% margin)
  At 70% gross margin                ~9 clips/month
```

Real-time voice agents run roughly $0.05–0.15/minute all-in. A hundred minutes
is $5–15 — one user, one feature, the entire subscription gone.

**Conclusion: "Every AI You Need for $14.99/month" cannot mean unlimited.**
There is a credit meter underneath. The $14.99 is a customer-acquisition
price; the actual revenue is credit top-ups, annual prepay, and tier upgrades.
The 30% OFF badge on Seedance is a credit promotion, not a subscription
discount.

If you copy the headline without the meter, the heaviest 5% of your users will
consume more than the other 95% pay, and you will fund their content business
out of your own pocket.

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
