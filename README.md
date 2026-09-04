# enishi

A personal site. The arrival is the point of it, for now.

**Sequence:** black screen with a single luminous button → **swipe up** and the
circle opens with your finger, expanding to fill the screen → it **rests** on an
ephemeral, multicoloured swirl holding the phrase *building intelligent
co-evolution* with *demo incubating…* small beneath it.

The zoom-into-centre → bare peachy page is built but gated off
(`CONTINUE_PAST_HOLD` in `main.js`); flip it on to run the full arrival.

A faint *emerging…* sits under the button; after `AUTO_DELAY` (~2.2s) the
circle opens on its own and the sequence runs to the end.

You can also do it yourself: an upward swipe *scrubs* the expansion — the
circle's edge tracks your finger. Release past ~half a pull (or flick) and it
commits to full screen; release short and it snaps back. Trackpad scroll-up, a
click, and Enter / Space / ↑ all open it too.

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
| `main.js`    | the gesture + timeline: `idle → expand → hold → zoom → site` |

## Tuning

- **Swipe feel:** `main.js` — `threshold()` (px of pull = full open), `COMMIT`
  (release fraction that locks in), `FLICK` (flick velocity), `EASE` (snap rate).
- **Auto-open:** `AUTO_DELAY` in `main.js` (how long *emerging…* holds first).
- **Pace:** `EASE` in `main.js` (lower = the circle opens more slowly) and the
  `transition:` durations in `styles.css` (`#swirl`, `#phrase`, `#orb`, `#pulse`).
- **Timings:** `T` in `main.js` (`hold` / `zoom`, in ms — only used if
  `CONTINUE_PAST_HOLD`).
- **Colours of the swirl:** `palette()` in `swirl.js` (iq cosine palette — the four
  `vec3`s are offset / amplitude / frequency / phase).
- **Page colour:** `--peach` / `--peach-deep` in `styles.css`, and the matching
  `vec3(0.964, 0.913, 0.866)` in `swirl.js` (`u_peach` tint).
- **Phrase:** the text lives in `index.html` (`#phrase`); its look is in `styles.css`.
- The peachy page is deliberately near-empty — just a faint `enishi` wordmark
  bottom-left. Build the actual site into `#site`.

`prefers-reduced-motion` collapses the sequence to short fades; no-WebGL falls
back to a plain fade into the page.
