# Higgsfield asset specification — fudgejarcheh.com

Every visual on the site resolves to a path in this document. Each entry is a
complete, deliberate cinematic prompt specifying **Subject, Composition, Camera
angle, Lens feel, Depth of field, Lighting, Materials, Environment, Mood, Colour
treatment** and, where the asset is moving, **Motion**.

## Art direction lock

One lighting language across every asset, taken from the supplied reference
photograph: a **deep teal-blue key** filling the background falloff, a **warm
amber/ember rim** raking one edge of the subject, near-black shadows that keep
detail, and a soft top-down source. Colour treatment is consistently
**desaturated with warm highlights and cool shadows**, fine 35mm grain, gentle
halation on the brightest edges. No lens flares, no orange-and-teal clipping, no
stock-photo gloss.

Palette: `#000000` · `#121517` · `#5E6569` · `#F3F1EB`, with `#D8602E` (ember)
and `#2C6B8F` (signal blue) confined to the *lighting*, never to UI.

## Identity rule — read before generating any portrait

The brief's **Visual Source Rule** governs every asset containing Fudge:

> If a real reference image of Fudge Jarcheh is attached to the session, treat it
> as the primary source for his appearance. Preserve recognisable face, body
> proportions, hair, styling, clothing characteristics and overall appearance.
> Camera angle, environment, lighting and composition may change. Do not
> transform Fudge into a different person.

Practically, that means portrait assets **must** be generated image-to-image
from the reference photograph — never text-to-image from a description. Upload
the reference through `media_upload_widget`, then pass the returned `media_id`
with role `image` on every portrait job. A portrait generated without that
reference is a different person wearing his name, and must not ship.

Assets 01, 02, 07 and 09 below are identity-bearing. Assets 03–06, 08 and 10–12
are environments and objects and carry no likeness.

---

## Identity-bearing assets

### 01 — `assets/images/hero-stage.svg` → `hero-stage.webp` (1920×2400, 4:5)
Model: `soul_2` (quality `2k`) · reference image required · aspect `3:4`

> **Subject** Fudge Jarcheh, full-length, standing, facing camera, hands open and
> lifted slightly at waist height, wide-brim hat, round wire glasses, layered
> chains, oversized dark overshirt. **Composition** Centred, generous headroom,
> figure occupying the lower two thirds, vast empty space above for typography.
> **Camera angle** Eye level, dead-on, no tilt. **Lens feel** 85mm portrait
> compression, negligible distortion. **Depth of field** f/2.0 — sharp on the
> face, background dissolving into pure falloff. **Lighting** Deep teal-blue
> ambient filling the void behind him; a warm amber rim raking the left edge of
> the face, shoulder and hands; a second cooler rim on the right shoulder;
> nothing lighting the background directly. **Materials** Matte cotton, brushed
> felt, dull antique-gold metal, glass. **Environment** Infinite dark studio
> void, no floor line, no props. **Mood** Composed, still, quietly authoritative
> — an artist's album cover, not a founder's headshot. **Colour treatment**
> Desaturated, warm highlights against cool shadows, deep true blacks, fine 35mm
> grain, faint halation on the rim light.

### 02 — `assets/images/editorial-stage.svg` → `editorial-stage.webp` (1600×2000, 4:5)
Model: `soul_2` (quality `2k`) · reference image required · aspect `3:4`

> **Subject** Fudge Jarcheh, three-quarter length, turned 30° from camera, gaze
> off-frame left, one hand resting near the chest. **Composition** Subject on the
> right third, a hard-edged rectangle of window light falling across the empty
> left third. **Camera angle** Slightly below eye level. **Lens feel** 50mm,
> honest perspective. **Depth of field** f/2.8, shallow but readable.
> **Lighting** Single large soft source high and camera-left producing a defined
> shadow edge; cool blue bounce filling the shadow side; no rim. **Materials**
> Matte fabric, skin with visible texture, plaster wall. **Environment** Bare
> studio corner, one wall, no furniture. **Mood** Editorial, considered,
> magazine-profile rather than corporate. **Colour treatment** Cooler and flatter
> than the hero, slightly lifted blacks, restrained contrast, fine grain.

### 07 — `assets/videos/hero-film.mp4` (1920×1080, ~15s, scroll-scrubbed)
Model: `kling3_0` or `seedance_2_5` · reference image required · aspect `16:9`

> **Subject** Fudge Jarcheh standing still in a dark void as the camera moves
> around and toward him. **Composition** Opens wide with the figure small and
> centred; closes on a chest-up frame. **Camera angle** Begins slightly high,
> settles to eye level. **Lens feel** 35mm easing to 85mm — a slow compressing
> push. **Depth of field** Progressively shallower as the push lands.
> **Lighting** Teal-blue ambient; a warm amber rim that travels across the face
> as the camera arcs. **Materials** As asset 01. **Environment** Infinite dark
> studio void. **Mood** Patient, weightless, inevitable. **Colour treatment**
> Matching asset 01. **Motion** One continuous unbroken take. Slow dolly-in with
> a gentle 15° arc to camera-left. No cuts, no whip pans, no handheld shake, no
> subject movement beyond breathing. Constant velocity so it scrubs cleanly at
> any scroll speed.

*Encode for scrubbing: `-g 8` (dense keyframes), `-crf 26`, `faststart`, muted,
under 4 MB. Then swap the hero `<img>` for
`<video data-scrub-video muted playsinline preload="auto" poster="…">` — the
engine already drives `currentTime` from scene progress.*

### 09 — `assets/images/about-portrait.webp` (1400×1750, 4:5)
Model: `soul_2` · reference image required · aspect `3:4`

> **Subject** Fudge Jarcheh seated, leaning forward, forearms on knees, direct
> gaze. **Composition** Centred, tight, shoulders filling the frame width.
> **Camera angle** Eye level. **Lens feel** 85mm. **Depth of field** f/2.0.
> **Lighting** Single warm key camera-right, deep blue fill from behind camera-
> left, strong falloff to black. **Materials** Matte fabric, metal chain, skin.
> **Environment** Dark room, suggestion of a wall behind. **Mood** Direct,
> unguarded, conversational. **Colour treatment** As asset 01.

---

## Environment and object assets — no likeness

### 03 — `assets/images/venture-review-revolution.svg` → `.webp` (1920×1200, 16:10)
Model: `marketing_studio_image` or `nano_banana_pro` · aspect `16:9`

> **Subject** Three translucent reputation-intelligence panels floating in depth,
> the nearest carrying a rising trend line. **Composition** Panels staggered
> diagonally from lower-left to upper-right, generous negative space top-left.
> **Camera angle** Slightly above, looking down at 15°. **Lens feel** 35mm.
> **Depth of field** Rear panels softly out of focus. **Lighting** Cool blue key
> from the upper right; a single ember accent glowing from the trend line.
> **Materials** Frosted glass, thin brushed-metal edges, emissive data marks.
> **Environment** Dark void, no desk, no hands, no device bezels. **Mood**
> Precise, restrained, expensive. **Colour treatment** Near-monochrome blue-grey
> with one ember accent. Absolutely no legible text, logos or UI chrome.

### 04 — `assets/images/music-stage.svg` → `.webp` (1920×1200, 16:10)
Model: `nano_banana_pro` · aspect `16:9`

> **Subject** Two hard beams of amber stage light cutting down through haze onto
> a crowd rendered entirely in silhouette. **Composition** Beams converging at
> upper centre, crowd occupying the lower fifth, vast dark middle. **Camera
> angle** From behind and above the crowd, looking toward the stage. **Lens
> feel** 24mm wide. **Depth of field** Deep — haze does the separating.
> **Lighting** Two hard top sources, heavy atmospheric haze, a cool blue wash on
> the far left. **Materials** Volumetric haze, matte darkness. **Environment**
> Small venue, no visible stage, no performer, no instruments. **Mood** Communal,
> warm, remembered. **Colour treatment** Amber highlights against blue-black
> shadow, heavy grain, strong halation. **No identifiable faces.**

### 05 — `assets/images/frequency-field.svg` → `.webp` (1920×1200, 16:10)
Model: `nano_banana_pro` · aspect `16:9`

> **Subject** A field of fine interfering waveforms spreading outward from a
> centre point. **Composition** Horizontally symmetrical, amplitude greatest at
> centre, dissolving to black at both edges. **Camera angle** Straight on, flat.
> **Lens feel** Flat graphic rendering, no perspective. **Depth of field** None.
> **Lighting** Self-emissive lines only. **Materials** Hairline light traces.
> **Environment** Pure black. **Mood** Quiet, scientific, almost silent.
> **Colour treatment** Cool grey-blue lines with occasional single ember strands.
> Extremely low contrast — the type sits on top of this and must stay legible.

### 06 — `assets/images/world-{entrepreneur,technologist,artist,thinker}.svg` → `.webp` (1200×1500, 4:5)
Model: `nano_banana_pro` · aspect `3:4` · **generate as one consistent set**

> **Subject** Four abstract environments, one per world. *Entrepreneur* —
> architectural planes and structural forms rising from darkness.
> *Technologist* — a receding lattice of connected points. *Artist* — a single
> hard beam of light crossing a waveform. *Thinker* — an empty horizon under
> soft grey light. **Composition** Each vertical, subject in the lower two
> thirds, empty above. **Camera angle** Eye level, straight on. **Lens feel**
> 35mm. **Depth of field** Shallow at the base, deep toward the horizon.
> **Lighting** Each lit by one dominant source: cool blue (entrepreneur), deep
> signal blue (technologist), warm amber (artist), flat grey (thinker).
> **Materials** Concrete, glass, light, haze. **Environment** Abstract, no
> people, no text, no recognisable places. **Mood** Four moods of one person.
> **Colour treatment** Identical grade across all four so they read as a set.

### 08 — `assets/images/head-{about,ventures,music,journal,press,contact}.svg` → `.webp` (1920×1200)
Model: `nano_banana_pro` · aspect `16:9` · **one consistent set**

> **Subject** Six quiet abstract fields, each a variation on one light gesture.
> **Composition** Wide, uncluttered, weighted to the lower half so an oversized
> headline sits cleanly in the upper two thirds. **Camera angle** Straight on.
> **Lens feel** 50mm. **Depth of field** Soft throughout. **Lighting** One
> dominant source per plate, matching each page's tone: about (cool blue band),
> ventures (structural planes), music (warm waveform), journal (grey horizon),
> press (blue lattice), contact (ember band). **Materials** Haze, light, soft
> gradient. **Environment** Abstract. **Mood** Calm, editorial, deliberately
> secondary to the typography. **Colour treatment** Low contrast, deep blacks —
> these sit behind white text and must never compete with it.

### 10 — `assets/images/journal-*.svg` → `.webp` (1600×1000, 16:10)
Model: `nano_banana_pro` · aspect `16:9`

> Three quiet abstract plates matching each article's subject — resonance
> (warm waveforms), overlapping worlds (two intersecting planes of light),
> intelligence (a cool blue lattice dissolving). Same grade as asset 08, wider
> crop, one visual idea per plate, no text.

### 11 — `assets/images/og-default.webp` (1200×630, 1.91:1)
Model: `nano_banana_pro` · aspect `16:9`

> **Subject** The hero lighting scheme in landscape, with the lower-left third
> left deliberately empty. **Composition** Off-centre, negative space for an
> overlaid wordmark. **Lighting** Teal-blue field with a warm ember rim entering
> from the right. **Mood** Cinematic title card. **Colour treatment** As asset
> 01. **No text baked in.**

### 12 — `assets/videos/origin-film.mp4` (1920×1080, ~12s, scroll-scrubbed)
Model: `kling3_0` · aspect `16:9`

> **Subject** The music venue of asset 04. **Motion** One continuous slow pull-
> back from a tight frame on the light beams to a wide of the room, plus a
> barely perceptible drift of haze. No cuts, no crowd motion, constant velocity.
> Everything else as asset 04.

---

## Wiring generated assets in

The site reads every image from a path — nothing is hard-coded to the current
placeholder format. To swap in a generated asset:

1. Save it at the same path with a `.webp` extension.
2. Update the `src` (homepage sections are in `index.html`; card and grid
   imagery is in `data/content.js`).
3. For video, replace the `<img>` inside `.stage-media` with:

```html
<video data-scrub-video muted playsinline preload="auto"
       poster="assets/images/hero-stage.webp"
       src="assets/videos/hero-film.mp4"></video>
```

The engine detects `data-scrub-video` inside a `[data-scene]` and drives
`currentTime` from scene progress — no JavaScript changes needed.
