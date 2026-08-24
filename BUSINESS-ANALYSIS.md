# ThinkBox AI Intensive — What This Is, What's Leaking, and Where the Profit Actually Is

**Repo:** `mjunlimitedessentials/thinkbox-ai-intensive`
**Live at:** `training.mjunlimitedessentialmktg.com` (GitHub Pages, per `CNAME`)
**Audit date:** 2026-08-24
**Scope:** All 13 files in the repository. Financial figures below are *illustrative scenarios* built on
stated assumptions, not measured results — the site has almost no analytics, so real numbers don't exist yet.

---

## Part 1 — What This Is

A hand-built static marketing and sales site for a solo AI-education business operating under two names:
**MJUnlimited Essential Mktg Co.** and **ThinkBox AI Studios**, run by Mona Jackson-Ham.

There is no application, no framework, no build step. Ten standalone HTML files, each with inline CSS and
inline JavaScript, deployed straight to GitHub Pages.

### The product ladder currently on the site

| Product | Price | Where | Status |
|---|---|---|---|
| ThinkBox AI Intensive — Replay only | $27 | `index.html`, `funnel.html`, `checkout.html` | Event date has passed |
| ThinkBox AI Intensive — Live Zoom | $47 | same | Event date has passed |
| ThinkBox AI Intensive — Live + Replay bundle | $67 | same | Event date has passed |
| AI SEO Prompt Pack (6 modules, 30+ prompts) | $37 | `seo-prompt-pack.html` | Evergreen, sellable today |
| ThinkBox AI Prompt Vault (100 RCTF prompts) | $37 | order bump in `funnel.html` | Evergreen, buried in a dead funnel |
| 20 Claude Command Codes | $27 | `claude-command-codes.html` | Evergreen, but paywall is bypassable |
| n8n Automation Course (12 units + certificate) | — | `n8n/index.html` | Waitlist only, never launched |

Highest price point anywhere on the site: **$67.**

### The technology stack it's glued together from

- **Payments:** Stripe Payment Links (11 distinct links hardcoded across the HTML)
- **Lead capture:** Jotform form `261395894134163` posted to via `fetch(..., {mode:'no-cors'})`
- **Backend:** Base44 serverless functions — `thinkboxConfirm`, `n8nWaitlist`, `claudeCodeAccess`
- **Confirmation email:** Resend, called from a Supabase Edge Function (per commit `cc15db3`)
- **n8n waitlist storage:** Supabase project `wujsdplmnorwmoltwdut`, via RPCs `add_to_n8n_waitlist` / `get_n8n_waitlist_count`
- **Live delivery:** Zoom (meeting ID and passcode hardcoded into `funnel.html`)
- **Analytics:** Microsoft Clarity on `seo-prompt-pack.html` only. Nothing anywhere else.

### The business model, stated plainly

Low-ticket digital products ($27–$67) sold to a warm audience, with one $37 order bump, delivered as
PDFs and Zoom sessions. No recurring revenue. No CRM. No email sequences. No back end above $67.

That is the core structural problem, and everything in Part 3 flows from it.

---

## Part 2 — What's Leaking Money Right Now

Ranked by revenue impact, worst first.

### 1. The live homepage sells an event that already happened

`index.html` — the page served at the root of the custom domain — advertises **July 11, 2026**. Today is
**August 24, 2026**. The funnel pages carry two *other* past dates: `funnel.html` and
`thinkbox_onestep.html` say **June 27, 2026**; `checkout.html` says **July 20, 2026**. The n8n waitlist
page says the course launches **June 27, 2026** and runs a countdown hardcoded to "16 Days."

Three different dead dates across four pages of the same funnel. Every visitor who reads carefully sees a
dead event; every one who doesn't buys a live session that will never run — which is a chargeback waiting
to happen.

**Conversion impact: effectively total.** Nothing else on this list matters until this is fixed.

### 2. There is zero email capture on the live homepage

`index.html` contains this JavaScript:

```js
document.getElementById('regForm').addEventListener('submit', function(e) { ... });
```

The file contains **zero `<form>` elements and zero `<input>` elements**. `getElementById('regForm')`
returns `null`, `.addEventListener` throws a `TypeError`, and the entire script block dies on line 1 —
taking the smooth-scroll handler below it with it.

Even if the form existed, look at what it was written to do:

```js
console.log('Registration:', { name, email, phone, role });
```

It logs to the browser console. It sends nothing anywhere.

So on the primary page of the business, **100% of visitors who don't immediately click Stripe are lost
permanently.** At a typical 2–3% cold-traffic purchase rate, that is 97–98 of every 100 visitors, gone,
unrecoverable, unremarketable.

### 3. The Claude Command Codes paywall is cosmetic — the product is free to anyone who views source

`claude-command-codes.html` sells 20 prompt codes for $27, gated behind an email + access-code form that
calls the `claudeCodeAccess` Base44 function.

All 20 codes are already in the HTML. The gate only flips `display:none` on a div that's already rendered:

```js
document.getElementById('codesUnlocked').style.display = 'block';
```

`/Blindspot`, `/Stresstest`, `/Brainstorm`, `/Blueprint`, `/Refine`, `/Translate`, `/Outline`,
`/Simplify`, `/Email`, `/Summary`, `/Counter`, `/Metaphor`, `/Checklist`, `/Rewrite`, `/Coach` — every
one, with its description, sitting in plain text in the page source. Ctrl+U, or right-click → Inspect, or
disabling JavaScript, delivers the full $27 product for free.

### 4. Nothing verifies that payment actually happened

In `funnel.html`, `proceedToCheckout()` builds a success URL and then never uses it:

```js
const successUrl = base + '?payment=success&pkg=' + selectedPkg.type + '&vault=0';  // dead variable
window.location.href = stripeLinks[selectedPkg.type];
```

Below it sits a button labeled **"✅ I've Completed My Payment"** wired to `goConfirmation()`, which
advances the buyer to the thank-you step containing the live Zoom link, meeting ID, and passcode.

There is no Stripe webhook. Fulfillment is entirely self-attested. Anyone can click that button without
paying and receive the same access a paying customer gets.

### 5. No conversion tracking anywhere — paid traffic is unbuyable

One Clarity tag, on one page that isn't the homepage. No Meta Pixel, no Google Analytics, no TikTok
pixel, no Stripe → ad-platform conversion feedback.

This means you cannot run paid acquisition profitably, because you cannot see which ad produced which
sale. Meta's algorithm optimizes on conversion signal; with no pixel it has nothing to optimize toward.
Every ad dollar spent against this site is spent blind.

### 6. Fabricated purchase notifications create real legal exposure

`claude-command-codes.html` ships a ticker and toast system with 44 invented buyers — "Keisha M. ·
Waldorf, MD just unlocked the Command Codes," rotating every 12–18 seconds.

The FTC's Rule on Consumer Reviews and Testimonials (16 CFR Part 465, effective October 2024) prohibits
fake consumer reviews and testimonials, including fabricated indicators of social proof, with civil
penalties assessed per violation. These names are not customers.

Separately, the funnel footer's **Privacy Policy**, **Terms**, and **Disclaimer** links are all
`href="#"` — dead. And the policies contradict each other: `funnel.html` promises "100% Satisfaction
Guaranteed… we'll make it right," while `claude-command-codes.html` states all purchases are
"non-refundable and non-exchangeable." Stripe uses accessible, consistent terms as dispute-defense
evidence. Right now you'd lose those disputes.

### 7. The n8n waitlist — your warmest asset — is decaying untouched

`n8n/index.html` is the best-built page in the repo: clean design, a real Supabase backend, a Content
Security Policy header, 12 units mapped out, a certificate promised, "Unit 1 Always Free."

It collected emails for a launch date that passed roughly eight weeks ago. No product shipped. No
notification sent. No apology, no new date.

People who hand you their email for a course that never arrives don't just go cold — they stop opening.
This is the single most valuable list in the business and it is actively depreciating.

### 8. Stripe purchases can't be matched back to leads

Every Stripe Payment Link is a bare URL:

```html
<a href="https://buy.stripe.com/cNi28q0X5dfNf3E0TPaVa0g">
```

No `client_reference_id`, no `prefilled_email`, no UTM passthrough. So a Jotform lead and a Stripe
customer are two unconnected records. You cannot segment buyers from non-buyers, cannot suppress buyers
from "you haven't bought yet" emails, and cannot compute the lifetime value of any traffic source.

### 9. Four copies of the same funnel, drifting apart

`checkout.html` and `thinkbox_onestep.html` are byte-identical except for the event date.
`funnel.html` and `thinkbox_funnel.html` are near-identical. `n8n-prelaunch.html` and `n8n/index.html`
have the same MD5 hash — literal duplicates.

This is why three different dead dates exist simultaneously: there is no single source of truth, so
every edit has to be made four times and one always gets missed.

---

## Part 3 — How to Implement the Fixes

Ordered so that each step is shippable on its own. Days 1–2 cost nothing but time and stop the bleeding.

### Day 1 — Stop selling a dead event (2 hours)

Pick one canonical funnel file. Recommended: keep `index.html` as the sales page and `funnel.html` as the
multi-step flow. Delete `thinkbox_funnel.html`, `thinkbox_onestep.html`, `checkout.html`, and
`n8n-prelaunch.html`. Fewer files means dates can't drift.

Then pull the date out of the markup entirely so it can never be stale in three places again:

```html
<!-- config.js — one file, loaded by every page -->
<script src="/config.js"></script>
```

```js
// config.js
window.TB = {
  eventDate:  '2026-09-19T18:00:00-04:00',
  eventLabel: 'September 19, 2026 · 6:00 PM EDT',
  zoomUrl:    'https://us06web.zoom.us/j/…'
};
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-tb-date]').forEach(el => el.textContent = window.TB.eventLabel);
});
```

Replace every hardcoded date string in the HTML with `<span data-tb-date></span>`. One edit updates the
whole site forever.

### Day 1 — Turn on email capture (2 hours)

This is the highest-ROI two hours available to you. Add a real form to `index.html` above the pricing
section, and post it to the Supabase table you already have running for the n8n waitlist:

```html
<form id="regForm">
  <input id="fullName" name="name"  type="text"  placeholder="First name" required>
  <input id="email"    name="email" type="email" placeholder="Email address" required>
  <button type="submit">Send Me the Free AI Starter Kit →</button>
</form>
<p id="successMsg" hidden>Check your inbox — it's on the way.</p>
```

```js
document.getElementById('regForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const payload = {
    first_name: document.getElementById('fullName').value.trim(),
    email:      document.getElementById('email').value.trim(),
    source:     'homepage_lead_magnet',
    utm:        location.search
  };
  try {
    await fetch('https://wujsdplmnorwmoltwdut.supabase.co/rest/v1/rpc/add_lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: window.TB.supabaseAnonKey },
      body: JSON.stringify(payload)
    });
  } catch (err) { console.warn('lead capture failed', err); }
  this.hidden = true;
  document.getElementById('successMsg').hidden = false;
});
```

Offer something real in exchange — 5 of the 20 Command Codes as a free sampler works, because it seeds
the $27 upsell. Guard the RPC with row-level security so the anon key can insert but never read.

### Day 2 — Close the Command Codes paywall (3 hours)

Stop shipping the product in the page. Move the 20 codes into the Base44 function and return them only
after verification:

```js
// claudeCodeAccess — server side
if (action === 'verify') {
  const purchase = await db.purchases.findOne({ email, access_code: code });
  if (!purchase) return { valid: false };
  return { valid: true, codes: CODES };   // codes live here, never in the HTML
}
```

```js
// client side — render only what the server sends back
.then(data => {
  if (!data.valid) { showError(); return; }
  document.getElementById('codesUnlocked').innerHTML =
    data.codes.map(c => `<div class="code"><b>${c.name}</b><p>${c.desc}</p></div>`).join('');
});
```

Delete the 15 hidden codes from `claude-command-codes.html` in the same commit. Until that markup is
gone, the product is still free.

### Day 2 — Verify payment before fulfilling (3 hours)

Delete the "I've Completed My Payment" button. Replace the honor system with Stripe's own signal.

In each Stripe Payment Link's settings, set the confirmation page to
`https://training.mjunlimitedessentialmktg.com/thank-you.html?session_id={CHECKOUT_SESSION_ID}`.

Then verify it server-side before releasing the Zoom credentials:

```js
// thank-you.html
const sessionId = new URLSearchParams(location.search).get('session_id');
const res  = await fetch('/api/verify-session', {
  method: 'POST', body: JSON.stringify({ sessionId })
});
const { paid, email, product } = await res.json();
if (!paid) { location.href = '/?payment=failed'; }
else { revealAccess(product); fireConfirmationEmail(email, product); }
```

Add a Stripe webhook on `checkout.session.completed` as the authoritative fulfillment trigger, so
delivery still happens if the buyer closes the tab before redirect.

### Day 3 — Instrument everything (2 hours)

Add to the `<head>` of every page — a Meta Pixel, GA4, and one `Purchase` event fired from
`thank-you.html` only after verification returns `paid: true`:

```js
fbq('track', 'Purchase', { value: price, currency: 'USD', content_name: product });
gtag('event', 'purchase', { value: price, currency: 'USD', items: [{ item_name: product }] });
```

Append `?client_reference_id=<lead_id>&prefilled_email=<email>` to every Stripe link so buyers reconcile
against leads automatically.

Without this step you are guessing. With it, every decision after this becomes measurable.

### Day 3 — Clean up the legal exposure (1 hour)

Remove the 44 fabricated buyer names from `claude-command-codes.html`. If you want live social proof,
render real purchase counts from your Stripe data instead — "312 people have unlocked the codes" is both
true and more persuasive than invented names.

Write `privacy.html`, `terms.html`, and `refund.html`, and point the footer links at them. Pick one
refund policy and use the identical wording on every page.

### Week 2 — Re-activate the n8n waitlist

Send this before anything else, because the list is cooling every day:

> Subject: I owe you an update on the n8n course
>
> The launch date I gave you came and went. Here's what happened and what's actually shipping —
> plus Unit 1, free, right now, as an apology.

Ship Unit 1 as a real deliverable in that email. It re-opens the relationship, proves the course is real,
and gives you a clean list of who's still engaged before you price the full course.

---

## Part 4 — Where This Would Be Most Profitable

The fixes above recover revenue you're already losing. This section is about where the business should
be pointed.

The structural problem is that the highest price on the entire site is $67. At that price you need
roughly 150 sales a month to clear $10K — and every one of those 150 customers generates support email,
refund risk, and payment-processing overhead. Volume businesses need traffic infrastructure you don't
have yet. Price businesses don't.

Here is where the margin actually lives, ranked by profit per hour of your time.

### 1. Corporate, church, and nonprofit workshop licensing — highest margin by a wide gap

You already have the asset. The ThinkBox AI Intensive is a two-hour live training with a swipe file, a
playbook, and a notes PDF. Sold to individuals it's $67. Sold to an organization it's a completely
different product with a completely different price.

The market rate for a half-day AI-literacy workshop delivered to a professional team runs in the low
four figures and up, and organizational buyers pay from a training budget rather than from personal
discretionary income — which means they don't price-shop the way a $67 consumer does.

Your existing audience segments are exactly the right buyers: **churches and ministries** (staff training
on AI for content, communications, admin), **schools and educators** (already in your funnel dropdowns),
**small-business associations and chambers**, and **nonprofits** with professional-development budgets.

*Illustrative:* one workshop per month at $2,500 is $30,000 a year from roughly 24 hours of delivery
time. Reaching the same $30,000 at $67 requires 448 individual sales and hundreds of support
interactions. Same content. Same you.

**How to start:** build `corporate.html` — no price on the page, just outcomes, a two-page agenda, your
credentials, and a "Request a Quote" form. Email your existing Jotform list and ask one question: *"Does
your organization need AI training for your team?"* The people who raise their hands are your pipeline.

### 2. The n8n certificate course — your best unbuilt asset

This is the only product in the repo with genuine course economics: 12 units, real projects, quiz
checkpoints, and a certificate. Certification is what justifies a price 5–15× your current ceiling,
because a credential is a career asset, not an information purchase.

Automation skills also sit in front of a second revenue stream: people who learn n8n hire someone to
build their workflows, and that someone can be you at implementation rates.

*Illustrative:* 40 students at $497 is $19,880 from a course built once. The same course sold to a
workforce-development program or a school district as a cohort license is a single invoice.

**How to start:** don't build all 12 units. Sell a live cohort at a founding-member price to the existing
waitlist, then build each unit the week before you teach it. The cohort funds the build, and student
questions tell you what the units should actually contain. Ship Unit 1 free this week regardless.

### 3. Recurring revenue — the change that compounds

Every product on this site is one-time. That means your revenue resets to zero on the first of every
month and you re-earn it from scratch.

A membership at $27–$47/month — monthly live AI training, a growing prompt library, community, office
hours — converts your existing catalog into an annuity. The Prompt Vault, the SEO Prompt Pack, and the
Command Codes stop being three separate $27–$37 transactions and become the member library that justifies
the subscription.

*Illustrative:* 100 members at $37/month is $44,400 a year in predictable revenue, from an audience size
you may already be able to reach. Predictable revenue is also what makes paid acquisition safe to run:
you can afford to spend more than $37 to acquire a member, because you're buying twelve months, not one.

### 4. Fix the low-ticket ladder — but treat it as lead generation, not as the business

Keep the $27–$67 products. Stop expecting them to be the revenue. Their job is to convert a stranger into
a buyer so you can sell them the $497 course or the $2,500 workshop later.

Reframed that way, the correct sequence is: free lead magnet → $27 Command Codes → $37 Prompt Pack →
$97–$197 intensive → $497 certificate course → $2,500+ organizational engagement. Right now the ladder
stops dead at $67 and there is nothing above it to climb to.

Also: bundle the Command Codes and the Prompt Vault into one "AI Operator Toolkit" at $47. You already
own both. Bundling raises average order value with no new production work.

### What I would do in the next 30 days, in order

1. **Days 1–3:** every fix in Part 3. Dates, email capture, paywall, payment verification, tracking,
   legal cleanup. This is triage — the site currently cannot convert.
2. **Week 2:** re-activate the n8n waitlist with Unit 1 free and an honest update. Simultaneously email
   your Jotform list the one-question corporate-training survey.
3. **Week 3:** publish `corporate.html` and follow up personally with every survey response. One booked
   workshop out-earns a month of $27 sales.
4. **Week 4:** open the n8n cohort to the waitlist at a founding price. Build as you teach.

The fastest path to real profit here is not more traffic to $27 products. It is charging organizations
what the training you already deliver is actually worth to them.

---

## Appendix — File-by-File Reference

| File | Purpose | Verdict |
|---|---|---|
| `index.html` | Live homepage / sales page | Dead date; broken JS; no lead capture — **fix first** |
| `funnel.html` | 5-step funnel with $37 order bump | Best funnel logic; dead date; unverified payment |
| `thinkbox_funnel.html` | Near-duplicate of `funnel.html` | Delete |
| `checkout.html` | One-step checkout, July 20 date | Delete |
| `thinkbox_onestep.html` | Byte-identical to `checkout.html` bar the date | Delete |
| `cover.html` | Welcome / cover page | Low value; consolidate |
| `seo-prompt-pack.html` | $37 SEO Prompt Pack | Evergreen and sellable — only page with analytics |
| `claude-command-codes.html` | $27 Command Codes | Paywall bypassable; fake social proof — **fix urgently** |
| `n8n/index.html` | n8n course waitlist | Best-built page; launch date passed; **biggest opportunity** |
| `n8n-prelaunch.html` | Identical MD5 to `n8n/index.html` | Delete |
| `flyer_june13.png` | 1.3 MB promo flyer | Stale; compress or remove |
