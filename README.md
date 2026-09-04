# enishi

A personal site. The arrival is the point of it, for now.

**Sequence:** black screen with a single luminous button → click → an ephemeral,
multicoloured swirl blooms out from the centre with the phrase *building
intelligent co-evolution* held in it → the view flies into the centre → it
resolves into a bare, peachy page.

## Run

No build, no dependencies. Serve the folder over HTTP (WebGL + local scripts
don't love `file://`):

```sh
cd enishi
python3 -m http.server 5173
# open http://localhost:5173
```

or `npx serve .` if you prefer.

## Files

| file | role |
| --- | --- |
| `index.html` | the three stacked layers: swirl canvas, phrase, button, site shell |
| `styles.css` | phase-driven transitions (`#stage[data-phase=...]`), the button, the peachy shell |
| `swirl.js`   | the swirl — one WebGL fragment shader, domain-warped fbm noise, no libraries |
| `main.js`    | the timeline: `idle → bloom → hold → zoom → site` |

## Tuning

- **Timings:** `T` in `main.js` (`bloom` / `hold` / `zoom`, in ms).
- **Colours of the swirl:** `palette()` in `swirl.js` (iq cosine palette — the four
  `vec3`s are offset / amplitude / frequency / phase).
- **Page colour:** `--peach` / `--peach-deep` in `styles.css`, and the matching
  `vec3(0.964, 0.913, 0.866)` in `swirl.js` (`u_peach` tint).
- **Phrase:** the text lives in `index.html` (`#phrase`); its look is in `styles.css`.
- The peachy page is deliberately near-empty — just a faint `enishi` wordmark
  bottom-left. Build the actual site into `#site`.

`prefers-reduced-motion` collapses the sequence to short fades; no-WebGL falls
back to a plain fade into the page.
