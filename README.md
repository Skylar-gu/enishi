# personal site

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Edit it

Everything that is content lives in `src/data/`:

| File          | What it holds                                       |
| ------------- | --------------------------------------------------- |
| `site.ts`     | Name, intro, about paragraphs, links                |
| `projects.ts` | Project cards, plus the `math` list for curiosities |
| `writing.ts`  | Essays (link out to Substack) and their art         |
| `art.ts`      | Pieces on the art page                              |
| `moments.ts`  | Photographs in the Rooms section                    |

### Adding images

Every image slot shows a soft placeholder until it has a file.

1. Drop the file in `public/images/projects/`, `public/images/art/` or
   `public/images/moments/` (the portrait can sit in `public/images/`).
2. Set the path on the entry, e.g. `image: '/images/projects/enishi.jpg'`
   (for an essay's picture the field is `art`).

Project images are shown at 4:3; art keeps whatever `ratio` you give it.

## Look and motion

- `src/styles/global.css` — colours, type and layout. The palette is the
  set of custom properties at the top.
- `src/scripts/site.ts` — scroll reveals, the cloud shader in the hero,
  pointer parallax, and the cycling word.

All motion is switched off for visitors who ask for reduced motion.

## Deploy

The site is static, so Vercel needs no configuration:

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project**, import the repo, and deploy. The
   Astro preset is detected automatically.

Every push to `main` then redeploys. Once a domain is settled, update
`site` in `astro.config.mjs` and `url` in `src/data/site.ts`.
