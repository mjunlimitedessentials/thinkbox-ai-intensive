# Building an "All AI Tools in One Place" Platform

Planning doc for a ThinkBox-branded multi-model AI workspace.

## 1. The core correction

You are not building an LLM. Training a frontier model costs $100M+ in compute
and a research team. Fine-tuning an open model is also unnecessary here — it
solves a problem you don't have.

Every "all AI tools, one login, one price" product on the market is the same
four things:

1. A chat UI
2. A **router** that forwards the prompt to somebody else's model API
3. A few task-specific surfaces (image, video, voice, transcription)
4. Auth + credits + Stripe

The product is packaging, not modeling. Your moat is UX, curation, and
audience — not the weights.

## 2. Architecture

```
Browser (chat + tool tabs)
   |
   v
Supabase Edge Function  <-- auth check, credit check, logging
   |
   +--> Model gateway (OpenRouter / Vercel AI Gateway / LiteLLM)
   |        -> Claude, GPT, Gemini, Llama, Mistral, ...
   +--> Replicate or fal.ai      -> image + video generation
   +--> ElevenLabs               -> voice / TTS
   +--> Whisper (OpenAI)         -> transcription
   +--> n8n webhook              -> multi-step automations
   |
   v
Supabase Postgres: users, credit_balance, usage_log, conversations
   |
   v
Stripe: subscription + credit top-ups
```

### Why a gateway instead of direct API keys

One key, one request shape, hundreds of models. Adding "we now support model X"
becomes a dropdown entry instead of an integration sprint.

| Option | Shape | Cost | Best when |
|---|---|---|---|
| **OpenRouter** | Managed, 400+ models | Provider rates + ~5.5% credit fee; BYOK ~5% past the free tier | Fastest launch. Start here. |
| **Vercel AI Gateway** | Managed, ~45 providers | Managed SaaS | Already deploying on Vercel / Next.js |
| **LiteLLM** | Self-hosted OSS proxy (MIT) | Infra only | Volume is high enough that 5.5% hurts |

Migration path: launch on OpenRouter, move to LiteLLM when the fee exceeds the
cost of running the proxy. Both speak an OpenAI-compatible API, so it's a base
URL change.

**Never put provider keys in browser JavaScript.** Every call goes through the
Edge Function. A leaked key is an unmetered bill against your card.

## 3. Reuse from this repo

| Already have | Role in the platform |
|---|---|
| Supabase (n8n waitlist RPCs, `send-waitlist-confirmation` fn) | Auth, DB, Edge Functions |
| Stripe checkout (funnel pages) | Subscriptions + credit packs |
| Resend | Transactional email |
| n8n | Multi-step "agent" workflows behind a webhook |
| Static HTML + GitHub Pages | Marketing / funnel front end |
| ThinkBox audience + training list | Distribution — the actual hard part |

The app itself outgrows GitHub Pages (needs server-side secrets). Put it on
Vercel as a subdomain — `app.` — and keep the funnel where it is.

## 4. Unit economics — decide this before writing code

This is what kills these products. "Unlimited AI for $29/mo" is a business
where the heaviest 5% of users consume more than the other 95% combined.

Sell **credits**, not unlimited:

- 1 credit = a fixed cost slice (e.g. $0.01 of underlying API spend)
- Price credits at a 3–5x markup to cover the gateway fee, infra, support,
  Stripe fees, and failed generations you eat
- Plan includes N credits/month; overage is a top-up pack
- Show the balance in the UI at all times — it self-regulates abuse

Hard requirements from day one:
- Per-user monthly spend cap enforced in the Edge Function, before the API call
- Every call written to `usage_log` with model, tokens, and computed cost
- A dashboard you check weekly for the users who are underwater

Verify the current rate card for every provider before setting prices — model
pricing moves quarterly and the numbers above are structural, not quotes.

## 5. Build sequence

**Phase 1 — chat that works (~1 week)**
Supabase auth. Edge Function proxying to OpenRouter. Model picker with 4–5
curated models. Conversation history. Credit decrement + usage log.

**Phase 2 — the "all tools" promise (~2 weeks)**
Image (Replicate/fal.ai), voice (ElevenLabs), transcription (Whisper), file
upload → context. Each is a tab, each debits the same credit balance.

**Phase 3 — the actual differentiator (~1 week)**
Prompt library. This is where your existing `claude-command-codes.html` work
becomes product: one-click prompts, saved as templates, organized by job.
Generic model access is a commodity; a curated ThinkBox prompt system is not.

**Phase 4 — monetize (~1 week)**
Stripe subscription + credit packs, plan gating, Resend onboarding sequence,
referral/affiliate loop back into the training funnel.

## 6. Faster paths

- **Lovable** — describe the app, it builds React + Supabase. Best fit for
  going from zero to a working v1 in days.
- **Open-source fork** — LibreChat or Open WebUI, both self-hostable multi-model
  chat with auth. Ship a branded instance in a weekend; you inherit a large
  codebase you didn't write.
- **From scratch** — Next.js + Vercel AI SDK. Most control, most time.

Recommendation: Lovable for v1 to validate demand, then rebuild whatever earns
its keep.

## 7. Things that will bite

- **Provider ToS on resale.** Most allow building products on the API;
  restrictions cluster around misrepresenting whose model it is and around
  reselling raw API access. Read the terms for each provider you route to.
- **Don't imply you trained it.** "Powered by leading AI models" is honest and
  legally safe. "Our AI" invites a problem.
- **Abuse.** Rate limit, cap spend, require email verification. Open AI
  endpoints get scraped and resold within days.
- **Model deprecation.** Providers retire model IDs. A gateway with fallback
  routing absorbs this; direct integrations break in production.
- **Compliance.** Storing user conversations means a privacy policy, a
  retention decision, and a deletion path.

## 8. Honest read on the opportunity

The technical build is genuinely small. The market is saturated — dozens of
identical multi-model wrappers, all competing on price against ChatGPT Plus and
Claude Pro at $20/mo, where users already are.

What sells is not access. It's the packaging: a curated workspace for a
specific audience with prompts, workflows, and training already attached. You
have the audience and the training. Lead with those, and let the multi-model
access be the delivery mechanism rather than the pitch.
