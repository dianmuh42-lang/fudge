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
  images/                   Cinematic plates
  videos/                   Scroll-scrubbed film (see HIGGSFIELD-PROMPTS.md)
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
`will-change` is applied only while an element is in play. Total page weight is
under 500 KB including fonts.

**Reduced motion.** `prefers-reduced-motion: reduce` is a real branch, not a
disabled animation: the engine never starts, pinned scenes collapse to normal
flow, the horizontal rail becomes a vertical list, stacked beats become legible
sequences, and the homepage shortens from ~25,000px to ~16,000px with every
piece of content visible.

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
| Portrait imagery | `assets/images/` | Awaiting Higgsfield generation from the reference photo |

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
