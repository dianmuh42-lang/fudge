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

### 02 — `assets/images/editorial-stage.webp` — **DELIVERED**
Supplied as a finished 1500×2000 photograph generated from the reference
photograph. It is live as the editorial portrait in Section 02, "Who is Fudge
Jarcheh?" What shipped reads as a direct sibling of the hero and origin films
— same subject, same lighting formula, same hands-open gesture — rather than
the cooler, quieter three-quarter pose originally speculated below; that
consistency across the site's three identity-bearing assets is a stronger
result than the original brief, so it stands as delivered.

> **Subject** Fudge Jarcheh, three-quarter length, facing camera, in the
> wide-brim peace-sign hat and round glasses, hands open at chest height.
> **Composition** Centred, generous negative space above and around him.
> **Camera angle** Eye level. **Lens feel** 85mm portrait compression.
> **Depth of field** Shallow, background resolved to soft dark blue.
> **Lighting** Deep blue ambient filling the background and shadow side; a
> warm amber rim raking the opposite side of the face, hat and hands.
> **Materials** Matte cotton overshirt, brushed felt hat, layered chain
> necklaces, worn leather cord pendant. **Environment** Dark studio, no
> visible walls or props. **Mood** Composed, direct, quietly confident.
> **Colour treatment** As asset 01 (matching the hero and origin film) —
> desaturated, warm highlights against cool shadows, fine grain.

### 07 — `assets/videos/hero-film*` — **DELIVERED**
Supplied as a finished 1920×1080 / 24fps / 5s clip generated from the reference
photograph. It is live as the scroll-scrubbed hero, on both desktop and mobile.
The prompt below records what it contains, for regenerating or extending it.

> **Subject** Fudge Jarcheh, chest-up, in a wide-brim hat with an embroidered
> peace sign and round sunglasses, gesturing with one hand as the camera cranes
> from his chest up to a close final frame on his face. **Composition** Opens
> tight on a pendant at his chest, identity withheld; closes on a direct-gaze
> close-up with the hat's peace sign fully in frame. **Camera angle** Begins
> level with the chest, tilts up to eye level on the face. **Lens feel** 50mm,
> a slow, continuous push. **Depth of field** Shallow throughout, background
> resolved to soft dark blue. **Lighting** Deep teal-blue key filling the
> background falloff; a warm amber rim raking one side of the face and hand.
> **Materials** Matte cotton overshirt, brushed felt hat, worn leather cord
> pendant. **Environment** Infinite dark studio void. **Mood** Composed,
> unhurried, quietly commanding. **Colour treatment** Desaturated with warm
> highlights against cool shadows, deep true blacks, fine grain. **Motion** One
> continuous unbroken take, constant velocity. No cuts. Scrubs cleanly at any
> scroll speed and reverses just as cleanly.

**Two crops ship, not one file scaled down.** The full 1920×1080 frame serves
tablet and desktop; phones get a genuine, centred **9:16 crop** —
`crop=608:1080:656:0` (`656 = (1920-608)/2`, an exact 9:16 width from the
1080 height) — rather than a shrunk landscape video cropped again by CSS.
`engine.js` picks the crop by viewport width (portrait below 760px, matching
the mobile CSS breakpoint), independent of the size-tier and format choice
below.

**Encoding actually used** — the delivered source was 10-bit HEVC with a
single keyframe across the whole clip, which neither decodes broadly in
browsers nor scrubs cleanly:

```
ffmpeg -i src.mp4 -an -vf scale=1280:720:flags=lanczos \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 \
  -crf 22 -preset slow -movflags +faststart hero-film.mp4

ffmpeg -i src.mp4 -an -vf crop=608:1080:656:0 \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -g 4 -keyint_min 4 -sc_threshold 0 -bf 0 \
  -crf 22 -preset slow -movflags +faststart hero-film-portrait.mp4
```

`-pix_fmt yuv420p` drops it to broadly-supported 8-bit. `-g 4` gives ~30
keyframes over the 5s clip (one per 4 frames), `-bf 0` drops B-frames so seeks
never depend on a later frame, `-an` strips audio. Repeat the landscape master
at `scale=960:540` (crf 24), and all three as VP9/WebM with `-auto-alt-ref 0
-lag-in-frames 0`. Poster frames come from a single well-composed timestamp
(here, t=4.3s — the full reveal) rather than literal frame 0, so the static
fallback (reduced motion, Save-Data, a short landscape viewport) always shows
identity clearly rather than the withheld opening beat. `engine.js` resolves
crop, tier and format at boot; the poster (and its background-image copy) is
cheap enough to re-resolve on rotate even though the film itself never re-picks.

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

### 05 — `assets/videos/frequency-film*` — **DELIVERED**
Supplied as a finished 1920×1080 / 24fps / 5s clip generated from the reference
photograph, replacing the abstract waveform plate originally specified below.
It is live as the scroll-scrubbed background for Section 06, "People Are The
Frequency," behind the six words, the paragraph and the final ember title —
identical wiring to the hero and origin films (`data-scrub-video`, dense
keyframes, landscape-only since this section is full-bleed `cover` at every
width already). The fade-in that was meant to bring the media in as the words
start turned out to be dead — `.freq-field`'s own `opacity: 0.7` and
`[data-anim~="fade-in"]`'s `opacity: var(--q)` were equal specificity, and
`.freq-field` loaded later, so it silently won every time; the section opened
at a constant 70% opacity regardless of scroll. Fixed by dropping the opacity
from `.freq-field` (it only ever needs `z-index`) so the animation actually
drives it: 0% at the top of the section, full strength by the final title —
a real dark-to-revealed arc now, not a flat wash from the first frame.

Also found and fixed while wiring this in: the six words above it used
overlapping `data-range` values (each word started 0.02 before the previous
one ended), meant as a soft crossfade. `fade-through`'s envelope ramps fast at
both ends of a range, so within that shared 0.02 both words sat around ~40%
opacity simultaneously — a garbled double-exposure, not a dissolve. Ranges
are now contiguous (each starts exactly where the last ends) so only one word
is ever visible at a time; verified across a dense 37-point sweep of the full
word sequence.

> **Subject** Fudge Jarcheh, full figure, standing still in a red-lit void as
> the camera slowly pushes in; his own shadow is cast large on the wall behind
> him, haloed in cool blue light. **Composition** Centred, generous headroom;
> opens wide with the figure small against the space, closes tighter with the
> shadow-halo filling the background. **Camera angle** Eye level, dead-on.
> **Lens feel** 35mm easing toward 50mm — a slow, continuous push, no cuts.
> **Depth of field** Deep throughout — the shadow on the wall stays legible.
> **Lighting** A saturated red wash rising from the floor; a cool blue halo
> lighting the wall directly behind him, throwing the doubled shadow. **Materials**
> Matte black overshirt and trousers, brushed felt hat, layered chain necklace.
> **Environment** Infinite dark studio void, textured wall visible behind him.
> **Mood** Resonant, doubled, quietly haunting — a person and their own echo.
> **Colour treatment** Departs from the hero/origin teal-and-amber pairing for a
> deliberate red-and-blue duality, fitting this section's theme of resonance
> and "a version of yourself" more directly than the house palette would.
> **Motion** One continuous unbroken push-in, constant velocity, no cuts.

The original waveform-plate concept is preserved below for reference, in case
a future refresh wants the flatter, more abstract treatment back instead.

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

### 12 — `assets/videos/origin-film*` — **DELIVERED**
Supplied as a finished 1920×1080 / 24fps / 5s clip generated from the reference
photograph. It is live as the scroll-scrubbed background for Section 05, "The
Origin." What shipped reads better against that section's own intent — a
withheld, dramatic reveal after three lines of text — than the original venue
concept below, since it puts Fudge himself, not a generic space, at the centre
of the reveal. The prompt records what it actually contains.

> **Subject** Fudge Jarcheh, in the wide-brim peace-sign hat, the camera
> cranking from an extreme macro on the hat's brim — near-abstract, a blurred
> silhouette of him floating above it — back to a wide, symmetric, full-figure
> frame: hat, glasses, layered necklaces, hands open at the chest. **Composition**
> Centred throughout; opens filling the frame with texture and colour alone,
> closes with generous negative space either side of him. **Camera angle**
> Slightly low at the macro open, settling to eye level on the wide.
> **Lens feel** Macro easing to 50mm. **Depth of field** Extremely shallow at
> the open (the silhouette is pure bokeh), resolving to a clean, shallow
> portrait depth by the close. **Lighting** Deep teal-blue key filling the
> background; a warm amber rim on one side of the hat, face and hands.
> **Materials** Brushed felt (macro texture is the point at the open), worn
> leather cord, antique-gold pendant, matte cotton overshirt. **Environment**
> Infinite dark studio void. **Mood** Withheld, then commanding — mystery
> resolving into presence. **Colour treatment** As asset 01. **Motion** One
> continuous unbroken pull-back, constant velocity, no cuts — this section's
> own CSS zoom-out (`--from:1.30 --to:1.02`) doubles down on the same motion
> rather than fighting it, and needed no adjustment against the new footage.

**One crop only, unlike the hero.** This section is full-bleed `cover` at every
width already, same as most of the site — it doesn't get the hero's dedicated
9:16 phone crop. `engine.js`'s `pickSource` only requests a `-portrait` file
when the element carries `data-poster-portrait` (the hero does; this doesn't),
so a phone here correctly falls back to the `-960` landscape tier instead of
404ing — the same generic path every other background video on the site will
take unless it explicitly opts into its own portrait crop.

---

## Wiring generated assets in

The site reads every image from a path — nothing is hard-coded to the current
placeholder format. To swap in a generated asset:

1. Save it at the same path with a `.webp` extension.
2. Update the `src` (homepage sections are in `index.html`; card and grid
   imagery is in `data/content.js`).
3. For a plain (non-scrubbed) background video, replace the `<img>` inside
   `.stage-media` with:

```html
<video data-scrub-video muted playsinline preload="auto"
       poster="assets/images/some-poster.webp"
       data-src="assets/videos/some-film.mp4"></video>
```

The engine detects `data-scrub-video` inside a `[data-scene]` and drives
`currentTime` from scene progress — no JavaScript changes needed. `data-src` is
read once at boot by the generic fallback path in `pickSource()`.

**The hero specifically** is wired for size tiers, format fallback and a
portrait/landscape crop swap — see `js/engine.js`'s `pickSource`,
`resolvePoster` and `isPortraitViewport`. To replace the hero film, keep the
same attribute shape (`index.html`, inside `#hero`):

```html
<video data-scrub-video muted playsinline preload="none"
       poster="assets/images/hero-poster.jpg"
       data-poster-landscape="assets/images/hero-poster.jpg"
       data-poster-portrait="assets/images/hero-poster-portrait.jpg"
       data-film-base="assets/videos/hero-film"></video>
```

`data-film-base` is a prefix, not a full path — the engine appends
`-portrait` (viewport ≤760px), `-960` (≤1280px, landscape only), or nothing
(full landscape master), then `.mp4` or `.webm` depending on `canPlayType`. So
replacing the hero means producing all six files at that base name — see the
encoding commands under asset 07 above — not just one.
