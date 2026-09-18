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

The hero is a real 5-second film of Fudge, and **scroll is its transport** —
`engine.js` maps scene progress onto `video.currentTime`. It never plays on its
own; scrolling back runs it backwards. The take opens withholding his face (a
tight shot of the pendant), and by the end of the scroll pulls back to a full
reveal — hat, sunglasses, direct gaze.

The source arrived as 10-bit HEVC with 1 keyframe across 5 seconds, which
neither decodes broadly in browsers nor scrubs cleanly. It is re-encoded to
8-bit H.264/VP9 at **60 keyframes (one every 4 frames), with B-frames removed
and audio stripped**, so any seek lands on or beside a keyframe.

**It ships as two crops, not one file scaled down.** Tablet and desktop get the
full 16:9 frame; phones get a true, centred 9:16 crop (608×1080 from the
1920×1080 source — exact 9:16, not letterboxed) rather than a shrunk landscape
video cropped again by CSS. `engine.js` resolves crop, tier and format once at
boot: portrait below 760px viewport width (the same breakpoint the mobile CSS
already keys off), the size tier from width within landscape, the format from
`canPlayType` — H.264 where it exists (smaller at this keyframe density), VP9
otherwise. It never re-picks on resize, which would restart the download and
discard the buffer — only the (cheap, few-KB) poster re-resolves on rotate.

| | 1280×720 | 960×540 | 608×1080 (portrait) |
|---|---|---|---|
| MP4 (H.264) | 909 KB | 485 KB | 860 KB |
| WebM (VP9) | 650 KB | 432 KB | 635 KB |

Two cases spend nothing at all: `prefers-reduced-motion` and Save-Data (or a 2G
connection) leave the poster frame in place and never request the film. A third
— a viewport short enough that the section below has already unpinned the scene
(no track left to scrub against) — does the same, since fetching a film that
can't be scrubbed there would just be waste. The poster (landscape or portrait,
matching whichever crop is active) is also painted as a background on the
film's container, so a frame is on screen before the first byte arrives and
stays there if video never loads.

A video that has never played still shows its `poster` attribute on screen even
after a successful programmatic seek — some engines only repaint once playback
has genuinely started. At rest on load the first seek target is 0 (the video's
own resting value), so the usual smoothing skips it as a no-op and the poster
would otherwise sit there indefinitely. `engine.js` starts playback for a beat,
muted, the moment the film is decoded, then immediately pauses — enough to
force the real first frame on screen before scroll takes over.

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
`will-change` is applied only while an element is in play. First load is 16–18
requests and **zero external connections** — well under 1 MB on both a phone
and a desktop, nearly all of it the film.

**Mobile hero.** Because the phone asset is a genuine 9:16 crop rather than a
16:9 frame squeezed into a portrait viewport, the hero goes full-bleed on
mobile exactly as it does on desktop — same structure, no band, no crop hack.
The difference is only in what has to change: the subject now fills the whole
frame width, so there's no empty margin to set text into. Copy anchors to the
bottom instead of the centre, over a scrim heavy enough to hold type against a
subject immediately behind it. Below 680px tall the type tightens further so an
SE-class phone still shows the name, the lead line and both CTAs without
clipping. Below 520px tall in landscape the scenes unpin entirely and the film
becomes an ordinary, complete, scrollable page — the poster there also swaps to
`aspect-ratio: 9/16` below 760px width, so the fallback still reads as the
portrait crop it actually is rather than a landscape box force-cropping it.

**Reduced motion.** `prefers-reduced-motion: reduce` is a real branch, not a
disabled animation: the engine never starts, the film is never downloaded,
pinned scenes collapse to normal flow, the horizontal rail becomes a vertical
list, stacked beats become legible sequences, and the homepage shortens from
~26,000px to ~16,000px with every piece of content visible.

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
portrait/landscape crop selection by viewport, size tier, format fallback,
decode, correct poster (and background) on both crops and on rotate, monotonic
scrub across the full 5 seconds on every tier, the true first frame painting
correctly at rest (not the poster) on load, and zero bytes spent under
Save-Data or a viewport too short to scrub.
