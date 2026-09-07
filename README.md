# fudgejarcheh.com

A cinematic, scroll-driven personal authority platform for **Fudge Jarcheh —
Entrepren-Artist**, built to the FudgeJarcheh.com Master Website Prompt.

Static HTML, CSS and JavaScript. No backend, no database, no build step, no
`npm install`, no external dependencies of any kind.

---

## Opening it

**Simplest — no server.** Double-click `index.html`, or:

```bash
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

Everything works from `file://`: navigation, the scroll engine, all imagery, the
self-hosted typefaces and the contact form. Chrome logs two harmless CORS
warnings about the font *preload hints* under `file://` — the fonts themselves
still load, and the warnings disappear when served over HTTP.

**Preferred — any static server**, which is how it will be hosted:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

Deploying means copying this folder to any static host. There is nothing to build.

---

## Structure

```
index.html                  Homepage — the 13-chapter cinematic story
css/
  fonts.css                 Self-hosted @font-face (Archivo, Inter, IBM Plex Mono)
  tokens.css                Design system: colour, type, space, motion, depth
  base.css                  Reset, typography, layout, nav, footer, forms
  cinema.css                The scroll-motion system
  components.css            Editorial blocks and page-specific composition
js/
  engine.js                 Scroll engine (scenes, parallax, reveals, video scrub)
  site.js                   Chrome, content rendering, contact interaction
data/
  content.js                Every content model — the CMS boundary
assets/
  images/                   Cinematic plates + hero poster frames
  videos/                   The scroll-scrubbed hero film (MP4 + WebM, 3 sizes)
  icons/                    Mark, favicon, arrow
  fonts/                    woff2 subsets, latin + latin-ext
  HIGGSFIELD-PROMPTS.md     Full generation spec for every visual
pages/
  about · ventures · music · journal · press · contact
  journal/<slug>.html       Article pages, one per note
robots.txt · sitemap.xml · site.webmanifest
```

---

## The motion system

The engine writes three custom properties and lets CSS do everything else, so
animation stays on the compositor and never touches layout.

| Property | Written to | Meaning |
|---|---|---|
| `--p` | `[data-scene]` | 0→1 across that scene's scroll track |
| `--q` | `[data-range="a b"]` | 0→1 within a slice of the parent scene |
| `--y` | `[data-parallax="0.15"]` | Pixel offset from viewport position |

### The hero film

The hero is a real 10-second film of Fudge, and **scroll is its transport** —
`engine.js` maps scene progress onto `video.currentTime`. It never plays on its
own; scrolling back runs it backwards.

The source arrived with 4 keyframes across 10 seconds, which stutters badly
under a seek-per-frame load. It is re-encoded to **60 keyframes (one every 4
frames), with B-frames removed and audio stripped**, so any seek lands on or
beside a keyframe.

Three size tiers and two formats ship. `engine.js` resolves one file, once, at
boot: the tier from viewport width, the format from `canPlayType` — H.264 where
it exists (smaller at this keyframe density), VP9/WebM otherwise. It never
re-picks on resize, which would restart the download and discard the buffer.

| | 1280×720 | 960×540 | 720×404 |
|---|---|---|---|
| MP4 (H.264) | 2.02 MB | 1.21 MB | 0.71 MB |
| WebM (VP9) | 2.16 MB | 1.42 MB | 0.95 MB |

Two cases spend nothing at all: `prefers-reduced-motion` and Save-Data (or a 2G
connection) leave the poster frame in place and never request the film. The
poster is also painted as a background on the film's container, so a frame is on
screen before the first byte arrives and stays there if video never loads.

Authoring a beat is declarative:

```html
<section class="scene" data-scene style="--scene-len:3">
  <div class="scene__stage">
    <div class="stage-media" data-range="0 1" data-anim="zoom-in">…</div>
    <p data-range="0.2 0.5" data-anim="fade-through track">Before the technology.</p>
  </div>
</section>
```

Available on `data-anim`: `zoom-in` `zoom-out` `rise` `sink` `enter` `pan-x`
`fade-in` `fade-out` `fade-through` `blur-in` `blur-out` `wipe-up` `wipe-down`
`iris` `track` `rail`. Reveals on enter use `data-reveal` (`""` `mask` `scale`
`blur`), text splits with `data-split="lines|words"`, and
`data-scrub-video` maps scene progress onto a video's `currentTime`.

**Performance.** One `requestAnimationFrame` loop that stops when nothing is
moving. Scenes and parallax targets are gated by `IntersectionObserver`, so
off-screen work costs nothing. Reads are batched before writes each frame.
`will-change` is applied only while an element is in play. First load is 16
requests and **zero external connections** — about 1.0 MB on a phone and 2.2 MB
on a desktop, nearly all of it the film.

**Mobile hero.** A 16:9 film cannot go full-bleed behind a portrait phone
without cropping to the middle ~26% of the frame, which cuts both of his hands
out of the shot. So below 760px the film becomes a cinematic band the headline
overlaps, with the copy beneath it — still a full-viewport hero, composed for
the screen it is actually on. Below 680px tall the band gives up height first
and the type tightens, so an SE-class phone still shows the name, the lead line
and both CTAs without clipping. Below 520px tall in landscape the scenes unpin
entirely and the film becomes an ordinary, complete, scrollable page.

**Reduced motion.** `prefers-reduced-motion: reduce` is a real branch, not a
disabled animation: the engine never starts, the film is never downloaded,
pinned scenes collapse to normal flow, the horizontal rail becomes a vertical
list, stacked beats become legible sequences, and the homepage shortens from
~26,000px to ~14,000px with every piece of content visible.

---

## Content architecture

`data/content.js` holds every repeatable type — journal, ventures, press, music,
worlds, evolution stages, navigation, social links. It is plain JavaScript
rather than fetched JSON purely so the site runs from `file://`; the shape is a
CMS collection and maps 1:1 to one.

Adding a journal article means appending an entry and copying an existing page in
`pages/journal/`. Adding a venture or a press item means appending an object —
the pages render themselves.

**Empty states are deliberate.** `press` and `music.releases` are empty arrays,
and the pages render a designed empty state rather than invented coverage or
fabricated releases. Social links with `url: null` render as a non-interactive
"soon" chip rather than a dead link. Fill the data and the UI fills itself.

---

## What still needs real material

These are the only places where genuine source material is required, all
isolated to `data/content.js`:

| What | Where | Currently |
|---|---|---|
| Contact address | `FJ.site.contactEmail` | `hello@fudgejarcheh.com` — assumed, change it |
| Social URLs | `FJ.site.social[].url` | `null` → renders as "soon" |
| Review Revolution URL | `FJ.ventures[0].url` | `null` → renders "Site coming soon" |
| Press coverage | `FJ.press` | Empty by design — never invented |
| Music releases | `FJ.music.releases` | Empty by design — never invented |
| Journal dates | `FJ.journal[].date` | Editorial seed metadata, set per publication |
| Still portraits | `assets/images/` | Awaiting Higgsfield generation from the reference photo |

See `assets/HIGGSFIELD-PROMPTS.md` for the full generation specification.

---

## Accessibility

Semantic landmarks, exactly one `<h1>` per page, a skip link as the first tab
stop, 2px visible focus rings, 44–48px minimum tap targets, labelled form fields
with `aria-invalid` and live error messaging, descriptive alt text on every
image, an Escape-closable focus-trapped mobile menu, and full reduced-motion
support.

## SEO

Unique title, description, canonical and Open Graph tags per page. JSON-LD
`Person` (Fudge Jarcheh), `Organization` (Frequency Digital Group), a nested
`Organization` for Review Revolution, `MusicGroup` for Fudge & The Frequency,
and `BlogPosting` on every article — with the relationships between them
explicitly linked by `@id`. Plus `sitemap.xml`, `robots.txt` and a web manifest.


---

## Verified

Chromium, 13 viewports from 320×568 to 2560×1080, plus landscape phone —
checking on every page, after driving the full scroll: no console errors, no
broken images, no horizontal overflow, nothing outside the viewport, no copy
clipped inside a pinned stage, one `<h1>` per page, alt text on every image, and
tap targets at 44px on touch pointers / 24px on fine pointers (WCAG 2.2 SC
2.5.8).

Plus interaction tests for the menu focus trap and Escape, contact validation →
mailto → reset, skip link and focus rings, reduced motion, and the hero film:
size tier, format fallback, decode, monotonic scrub across the full 10 seconds,
and zero bytes spent under Save-Data.
