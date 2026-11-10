# Agent guide

Static Astro site (Node >= 22.12). All content lives in `src/data/`; pages are
rendered from it, so adding a project page rarely means touching components.

## Setup and checks

```bash
npm install
npm run build   # must pass before you push
npm run dev     # http://localhost:4321
```

## Adding or editing a project

1. Edit `src/data/projects.ts`. Each entry is `{ title, meta, blurb, href?, image?, credit?, tone }`.
   - `meta`: one short line, e.g. `Paper · NeurIPS 2026 workshop`.
   - `blurb`: 2-4 plain sentences on what was done and found. Say what is still
     uncertain. Do not invent results; use only what the repo, paper or notes state.
   - `href`: link to the GitHub repo or paper.
   - `tone`: one of `sky | dusk | sage | clay | blush | sand` (placeholder colour).
2. Put the image in `public/images/projects/` and set `image: '/images/projects/<file>'`.
   Prefer `.webp`, about 1200px wide, shown at 4:3. No toolbars, panel letters or
   screenshots of UI chrome.
3. Run `npm run build`, then commit.

Other data files: `site.ts` (name, bio, links), `writing.ts`, `art.ts`,
`company.ts`, `moments.ts` (Salons; currently "Coming soon").

## Rules

- Work on a branch and open a PR; do not push to `main`.
- Never commit `.env*` or `.vercel/` (already gitignored).
- Do not edit `src/styles/global.css` or components for content changes.
- Keep the author's voice: plain, specific, no marketing language.
