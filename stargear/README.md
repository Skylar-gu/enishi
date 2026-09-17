# ✦ STAR☆GEAR ✦ 星の歯車

a personal website shaped like a girly-pop **antikythera mechanism**, with a 2001 flip phone inside.

plain HTML/CSS/JS. no build step, no dependencies. it runs straight on GitHub Pages.

## what's in the world

| world | what it is |
|---|---|
| ☾ **STATUS** | the about-me page as an RPG status screen: stats, equipment, a typewriter bio |
| ✎ **DIARY** | a `/now` page: what i'm making, reading and listening to right now |
| ♃ **RESEARCH WORLDS** | projects as a star map. land on a planet to explore it |
| ✆ **KEITAI** | a flip phone that opens: mail, contacts, snake, a ringtone composer, fortunes, wallpapers |
| ✿ **GACHAPON** | spend stardust on capsule phone charms (16 to collect) |
| ⚙ **CALIBRATE** | a meshed-gear puzzle |
| ☆ **WISH TREE** | tanabata bamboo: hang a wish on a paper strip |
| ♡ **SHRINE** | favorite things, a "which planet are you?" quiz, and an 88×31 button |

plus: 7 hidden **star shards** (one for each classical planet on the real mechanism), a gear-bunny guide named Hoshi, chiptune sound effects and optional music, a sparkle cursor, and a **☾ calm mode** that turns off most motion. calm mode is on by default for anyone whose device is set to reduce motion.

<details><summary>shard spoilers</summary>

- ☉ sun: konami code (↑↑↓↓←→←→ B A)
- ☾ moon: poke the moon on the hub 3 times
- ☿ mercury: compose and play an 8+ note melody on the phone
- ♀ venus: hang a wish
- ♂ mars: score 10+ in snake
- ♃ jupiter: collect 5 different charms
- ♄ saturn: solve the calibration puzzle
</details>

## making it yours

almost everything personal lives in **`js/config.js`**: name, bio, stats, now-list, research worlds, contacts and favorites. anything marked `✎` is placeholder text.

### adding a research world

1. add an entry to `researchWorlds` in `js/config.js` (name, color, summary, sections, links).
2. that's enough for a planet on the star map with its own landing page.
3. want a fully custom, explorable world? copy `worlds/_template/` to `worlds/<id>/`, build it however you like, and set `page: "worlds/<id>/"` in the config. the planet then gets an **ENTER FULL WORLD** button.

### portrait + mascot

both are pixel art drawn from strings in `js/sprites.js`. each letter is a palette color (see `SG.PAL`). the portrait is stored as its left half and mirrored.

## run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## deploy to GitHub Pages

```sh
# 1. make an empty repo on github.com
#    name it <username>.github.io to host at https://<username>.github.io/
git remote add origin git@github.com:<username>/<username>.github.io.git
git push -u origin main
# 2. on GitHub: Settings → Pages → Source: "Deploy from a branch" → main / (root)
```

if you use a different repo name (e.g. `website`), the site lives at `https://<username>.github.io/website/`. everything uses relative paths, so it still works. the only exception is the "return" link in `404.html`, which points to `/`; change it to `/website/`.

## notes

- saves (stardust, charms, shards, wishes) live in the visitor's own browser `localStorage`, so nothing is shared between visitors.
- fonts: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) and [DotGothic16](https://fonts.google.com/specimen/DotGothic16) via Google Fonts.
