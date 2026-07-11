# Starting a new month

1. **Copy the most recent month's folder**, don't start from scratch:

   ```
   cp -r content/2026-07-before-you-buy-land content/2026-08-your-slug
   ```

   The four files there are already shaped correctly. `_templates/source.md` is here as a clean
   skeleton if you'd rather start empty.

2. **Write `source.md` first.** Everything else derives from it. Verify every fact as you write —
   see the fact-checking step in [`CONTENT-PIPELINE.md`](../../CONTENT-PIPELINE.md).

3. **Build the article** by copying the previous month's HTML from `blog/`. Things that must change:

   - `<title>`, `<meta name="description">`
   - `<link rel="canonical">` and the three `og:` URLs
   - the JSON-LD `BlogPosting` block (headline, datePublished, image, mainEntityOfPage)
   - the pillar chip class — `pillar-life`, `pillar-land`, or `pillar-legacy`
   - the `This Month` block (it's fenced with a comment banner)
   - the numbered sources list

4. **Add the card to `blog.html`** with the right `data-pillar` so the filter picks it up. Promote
   the "Coming soon" placeholder card for that pillar into a real linked card.

5. **Ship the site first** — `staging`, review, then `main`. Only once the URL is live do the
   newsletter, GBP post, and social captions go out.

## Pillar rotation

Land → Life → Legacy → repeat. First week of the month.
