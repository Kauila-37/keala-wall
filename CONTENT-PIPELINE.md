# Content Pipeline — one post, four channels

How a single monthly post becomes the website Journal entry, the Follow Up Boss newsletter,
the Google Business Profile post, and the social captions.

---

## The rule that shapes everything: hub and spoke

**The full post lives in exactly one place — the website.** Every other channel gets a short,
native-feeling teaser that *links back* to it.

Do not paste the full article into Google Business Profile, into the newsletter body, or into
a Facebook post. Two reasons:

1. **SEO.** Google picks one canonical version of duplicated text. If the full article also sits
   on the Google Business Profile, we're competing with ourselves and the site — the asset Keala
   actually owns — can lose.
2. **Attribution and lead capture.** The contact form, the guide gate, and the FUB lead route all
   live on the site. A reader who finishes the article on Instagram never enters the funnel.

So: **website = the article. Everything else = the invitation.**

---

## Cadence

One post per month, rotating pillars:

| Month | Pillar | |
|---|---|---|
| Jul 2026 | **Land** | ✅ Published |
| Aug 2026 | **Life** | Choosing your side of the island |
| Sep 2026 | **Legacy** | Selling land that's been in the family |
| Oct 2026 | **Land** | → rotation repeats |

Target: live in the first week of the month.

---

## Anatomy of a post

Every post has two zones, and keeping them separate is what makes this sustainable:

- **Evergreen body** — the actual article. Written once, still true in three years. This is what
  earns search traffic and what we link to forever.
- **`This Month` block** — a dated, clearly-fenced section near the bottom holding the 2–3
  hand-picked listings and any current market note. In the HTML it's marked with a comment banner.

Each month Keala refreshes the `This Month` block. The evergreen body is not touched. When a post
is a year old, the `This Month` block can simply be deleted — the article still stands.

### About the listings

They are **hand-picked and static** — Keala chooses two or three, and they're written into the page
as cards linking to her search site. There is deliberately no automated MLS/IDX feed here. Pulling
live listing data into the site would require an IDX license, and Hawaii Information Service rules
govern how MLS data may be republished. Not worth the exposure for three cards a month.

---

## The monthly workflow

**Step 1 — Draft the source of truth.**
Write `content/YYYY-MM-slug/source.md`. This is the single canonical text everything else derives
from. Include the sources list as you write, not after.

**Step 2 — Verify every factual claim.**
Non-negotiable, and it applies to blog posts exactly as it applies to the site pages. Any number,
date, statute, or dollar range gets checked against a primary source (USGS, Hawaiʻi County, DOH,
EPA, EIA) *before* it goes live. Log new claims in `research/FACT-REGISTER.md` and mirror them onto
`sources.html`. Time-sensitive figures get a date stamp.

If a claim can't be sourced, cut it. A good post with four facts beats a great post with one wrong one.

**Step 3 — Build the page.**
Copy the previous month's post HTML as the skeleton. Update the pillar chip
(`pillar-life` / `pillar-land` / `pillar-legacy`), the `<title>`, meta description, canonical URL,
Open Graph tags, and the JSON-LD `BlogPosting` block. Add the card to `blog.html` with the right
`data-pillar` so the filter picks it up.

**Step 4 — Derive the channel variants.**
Write the three spokes from the source. Each has its own file and its own constraints (below).

**Step 5 — Ship the site, then distribute.**
Push to `staging`, let Keala review, then push to `main`. Only once the post is live at its real URL
do the other three channels go out — they all point at that URL, and a 404 in a newsletter is
forever.

---

## Channel specs

### 1. Website Journal — the hub
- **File:** `blog/YYYY-MM-slug.html`
- Full evergreen article + `This Month` block + numbered sources.
- Canonical URL, OG tags, and `BlogPosting` JSON-LD are set here and nowhere else.

### 2. Follow Up Boss newsletter
- **File:** `content/YYYY-MM-slug/newsletter-fub.html`
- **How to send:** FUB → Email Templates → paste the HTML → send as a mass email to a smart list.
  Doing it by hand is intentional. Keala's FUB is a **shared team account**, so an API key would
  grant read/write over the whole team's CRM. We route leads in by email and send campaigns by hand
  rather than hold that key. (See the FUB integration notes for the full reasoning.)
- **Shape:** a warm 150–250 word intro in Keala's voice, the single strongest idea from the post,
  the featured listings, one button to the full article. Not the whole article.
- Link with `?utm_source=fub&utm_medium=email&utm_campaign=YYYY-MM-slug`.

### 3. Google Business Profile
- **File:** `content/YYYY-MM-slug/google-business.md`
- **Hard limit ~1,500 characters**, and realistically only the first ~100 show before "Read more" —
  front-load the hook.
- One CTA button: **Learn more** → the post URL.
- GBP posts age out of prominence after a few months, which is fine: this is a local-SEO and
  freshness signal, not an archive.
- Link with `?utm_source=gbp&utm_medium=organic&utm_campaign=YYYY-MM-slug`.

### 4. Social
- **File:** `content/YYYY-MM-slug/social.md`
- **Instagram:** links aren't clickable in captions — drive to link-in-bio. Carousel: one slide per
  section heading works well, since each post is built around 3 numbered points.
- **Facebook:** links are clickable; post the link with a 2–3 sentence hook.
- **LinkedIn:** the most "expertise" framing — lead with the correction or the counterintuitive fact.
- Link with `?utm_source=ig|fb|li&utm_medium=social&utm_campaign=YYYY-MM-slug`.

---

## Compliance checklist (every channel, every month)

- [ ] Keala M. Wall · Realtor · **RB-21841** · eXp Realty appears on the piece
- [ ] Every factual claim traced to a primary source and logged in the fact register
- [ ] Time-sensitive figures date-stamped
- [ ] No MLS data republished beyond the hand-picked cards linking to her IDX search site
- [ ] Newsletter has a working unsubscribe (FUB handles this on mass emails)
- [ ] The post URL is actually live before any spoke goes out

---

## Where things live

```
content/
  _templates/          # copy these to start a month
  2026-07-before-you-buy-land/
    source.md          # canonical text + sources — write this first
    newsletter-fub.html
    google-business.md
    social.md
blog.html              # index, with pillar filter
blog/                  # the published articles
research/
  FACT-REGISTER.md     # every claim, status, source
sources.html           # the public mirror of the register
```
