/* ============================================================
   FUDGE JARCHEH — CINEMA ENGINE
   A dependency-free scroll engine. It reads layout once per
   frame, then writes CSS custom properties; every visual change
   happens in CSS on transform / opacity / filter / clip-path.

   Contract
   --------
   .scene[data-scene]            -> writes --p  (0..1 across its track)
     [data-range="0.1 0.6"]      -> writes --q  (0..1 within that slice)
     [data-ease="io|out|in"]     -> easing applied to --q
   [data-parallax="0.18"]        -> writes --y  (px, viewport relative)
   [data-reveal]                 -> adds .is-in when it enters
   [data-split="lines|words"]    -> wraps text for masked reveals
   [data-scrub-video]            -> maps scene progress to currentTime
   [data-statements]             -> sequential statement stack
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  var EASE = {
    linear: function (t) { return t; },
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    in: function (t) { return t * t * t; },
    io: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  };

  /* ---------- stable viewport unit (mobile URL bar) ---------- */
  var setVH = function () {
    root.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
  };
  setVH();

  /* ---------- shared state ---------- */
  var scenes = [];
  var parallax = [];
  var videos = [];
  var stacks = [];
  var running = false;
  var lastY = window.scrollY || 0;
  var vel = 0;
  var viewH = window.innerHeight;

  /* ============================================================
     SPLIT TEXT — wrap into lines (or words) for masked reveals
     ============================================================ */

  function splitText(el) {
    var mode = el.getAttribute('data-split') || 'lines';
    if (el.dataset.splitDone === '1') return;

    var text = el.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    el.setAttribute('aria-label', text);

    var words = text.split(' ');
    var frag = document.createDocumentFragment();
    var probes = [];

    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'split__probe';
      s.style.display = 'inline-block';
      s.textContent = w;
      frag.appendChild(s);
      probes.push(s);
      if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
    });

    el.textContent = '';
    el.classList.add('split');
    el.appendChild(frag);

    if (mode === 'words') {
      var wf = document.createDocumentFragment();
      probes.forEach(function (p, i) {
        var wrap = document.createElement('span');
        wrap.className = 'split__word';
        var inner = document.createElement('i');
        inner.textContent = p.textContent;
        inner.style.setProperty('--d', (i * 42) + 'ms');
        wrap.appendChild(inner);
        wf.appendChild(wrap);
        if (i < probes.length - 1) wf.appendChild(document.createTextNode(' '));
      });
      el.textContent = '';
      el.appendChild(wf);
      el.setAttribute('aria-hidden', 'false');
      el.dataset.splitDone = '1';
      return;
    }

    /* group probes into visual lines by their offsetTop */
    var lines = [];
    var currentTop = null;
    probes.forEach(function (p) {
      var top = p.offsetTop;
      if (currentTop === null || Math.abs(top - currentTop) > 2) {
        lines.push([]);
        currentTop = top;
      }
      lines[lines.length - 1].push(p.textContent);
    });

    var lf = document.createDocumentFragment();
    lines.forEach(function (words, i) {
      var line = document.createElement('span');
      line.className = 'split__line';
      var inner = document.createElement('span');
      inner.className = 'split__inner';
      inner.textContent = words.join(' ');
      inner.style.setProperty('--d', (i * 95) + 'ms');
      line.appendChild(inner);
      lf.appendChild(line);
    });

    el.textContent = '';
    el.appendChild(lf);
    el.dataset.splitDone = '1';
  }

  function resplit() {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      if (el.dataset.splitDone === '1' && el.getAttribute('data-split') !== 'words') {
        var label = el.getAttribute('aria-label');
        if (!label) return;
        el.dataset.splitDone = '';
        el.textContent = label;
        el.classList.remove('split');
        splitText(el);
      }
    });
  }

  /* ============================================================
     REVEALS
     ============================================================ */

  var revealIO = null;
  var revealSeen = new WeakSet();

  function initReveals(scope) {
    var targets = (scope || document).querySelectorAll('[data-reveal], [data-split]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) reveal(e.target); });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    }
    targets.forEach(function (el) {
      if (revealSeen.has(el)) return;
      revealSeen.add(el);
      revealIO.observe(el);
    });

    /* Anything already on screen at load must be visible NOW. The
       observer's -12% bottom margin means an element sitting in the
       last sliver of the first viewport never intersects until the
       user scrolls — which silently hid the hero's primary CTA. */
    requestAnimationFrame(function () {
      targets.forEach(function (el) {
        if (el.classList.contains('is-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
      });
    });
  }

  function reveal(el) {
    var group = el.closest('[data-reveal-group]');
    if (group && !group.dataset.staggered) {
      group.dataset.staggered = '1';
      group.querySelectorAll('[data-reveal]').forEach(function (k, i) {
        k.style.setProperty('--rv-d', (i * 110) + 'ms');
      });
    }
    el.classList.add('is-in');
    if (revealIO) revealIO.unobserve(el);
  }

  /* ============================================================
     SCENES
     ============================================================ */

  function collect() {
    scenes = [];
    parallax = [];
    videos = [];
    stacks = [];

    document.querySelectorAll('[data-scene]').forEach(function (el) {
      var stage = el.querySelector('.scene__stage') || el;
      var ranged = [];
      el.querySelectorAll('[data-range]').forEach(function (r) {
        var parts = (r.getAttribute('data-range') || '0 1').trim().split(/\s+/).map(Number);
        var a = isFinite(parts[0]) ? parts[0] : 0;
        var b = isFinite(parts[1]) ? parts[1] : 1;
        ranged.push({
          el: r,
          a: a,
          b: b === a ? a + 0.0001 : b,
          ease: EASE[r.getAttribute('data-ease')] || EASE.linear,
          last: -1
        });
      });

      var stmts = el.querySelector('[data-statements]');
      if (stmts) {
        stacks.push({ scene: el, host: stmts, items: Array.prototype.slice.call(stmts.children), live: -1 });
      }

      var vid = el.querySelector('[data-scrub-video]');
      if (vid) videos.push({ scene: el, el: vid });

      scenes.push({
        el: el,
        stage: stage,
        ranged: ranged,
        p: 0,
        raw: 0,
        active: false,
        top: 0,
        len: 1
      });
    });

    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      parallax.push({
        el: el,
        speed: parseFloat(el.getAttribute('data-parallax')) || 0.15,
        y: 0,
        active: false
      });
    });

    measure();
    gate();
  }

  function measure() {
    viewH = window.innerHeight;
    var sy = window.scrollY || window.pageYOffset || 0;
    scenes.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      s.top = r.top + sy;
      /* the pinned stage consumes one viewport of the track */
      s.len = Math.max(1, s.el.offsetHeight - s.stage.offsetHeight);
    });
  }

  /* Only animate what is on (or near) screen. */
  var gateIO = null;
  function gate() {
    if (!('IntersectionObserver' in window)) {
      scenes.forEach(function (s) { s.active = true; });
      parallax.forEach(function (p) { p.active = true; });
      return;
    }
    if (gateIO) gateIO.disconnect();
    gateIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var rec = e.target.__cine;
        if (!rec) return;
        rec.active = e.isIntersecting;
        rec.el.style.willChange = e.isIntersecting ? 'transform' : 'auto';
      });
      kick();
    }, { rootMargin: '25% 0px 25% 0px' });

    scenes.forEach(function (s) { s.el.__cine = s; gateIO.observe(s.el); });
    parallax.forEach(function (p) { p.el.__cine = p; gateIO.observe(p.el); });
  }

  /* ============================================================
     FRAME
     ============================================================ */

  function frame() {
    var sy = window.scrollY || window.pageYOffset || 0;

    /* smoothed scroll velocity, normalised and clamped */
    var d = sy - lastY;
    lastY = sy;
    vel = lerp(vel, clamp(d / 60, -1, 1), 0.12);
    if (Math.abs(vel) < 0.0005) vel = 0;

    var writes = [];
    var busy = false;

    /* ---- READ + compute ---- */
    for (var i = 0; i < scenes.length; i++) {
      var s = scenes[i];
      if (!s.active) continue;
      var raw = clamp((sy - s.top) / s.len, 0, 1);
      s.raw = raw;
      /* a touch of smoothing gives the scrub a filmic glide */
      s.p = lerp(s.p, raw, 0.19);
      if (Math.abs(s.p - raw) < 0.0004) s.p = raw; else busy = true;
      writes.push(s);
    }

    for (var j = 0; j < parallax.length; j++) {
      var pl = parallax[j];
      if (!pl.active) continue;
      var rect = pl.el.getBoundingClientRect();
      var centre = rect.top + rect.height / 2;
      var off = (centre - viewH / 2) / viewH;
      pl.y = -off * pl.speed * viewH;
    }

    /* ---- WRITE ---- */
    root.style.setProperty('--vel', vel.toFixed(4));
    root.style.setProperty('--scrolled', (sy / Math.max(1, document.documentElement.scrollHeight - viewH)).toFixed(4));

    for (var k = 0; k < writes.length; k++) {
      var sc = writes[k];
      sc.el.style.setProperty('--p', sc.p.toFixed(4));
      for (var m = 0; m < sc.ranged.length; m++) {
        var rg = sc.ranged[m];
        var q = rg.ease(clamp((sc.p - rg.a) / (rg.b - rg.a), 0, 1));
        if (Math.abs(q - rg.last) > 0.0005) {
          rg.el.style.setProperty('--q', q.toFixed(4));
          rg.last = q;
        }
      }
    }

    for (var n = 0; n < parallax.length; n++) {
      if (parallax[n].active) parallax[n].el.style.setProperty('--y', parallax[n].y.toFixed(2) + 'px');
    }

    /* ---- scrubbed video: scroll IS the transport ---- */
    for (var v = 0; v < videos.length; v++) {
      var rec = videos[v];
      var scene = null;
      for (var z = 0; z < scenes.length; z++) if (scenes[z].el === rec.scene) { scene = scenes[z]; break; }
      if (!scene || !scene.active) continue;
      var media = rec.el;
      if (media.readyState < 2 || !isFinite(media.duration) || media.duration <= 0) continue;
      if (!media.paused) media.pause();
      var target = scene.p * media.duration;
      var next = lerp(media.currentTime, target, 0.22);
      if (Math.abs(next - media.currentTime) > 0.012) {
        try { media.currentTime = next; } catch (err) { /* seek not ready */ }
        busy = true;
      }
    }

    /* ---- statement stacks ---- */
    for (var t = 0; t < stacks.length; t++) {
      var st = stacks[t];
      var sceneRec = null;
      for (var y = 0; y < scenes.length; y++) if (scenes[y].el === st.scene) { sceneRec = scenes[y]; break; }
      if (!sceneRec || !sceneRec.active) continue;
      var count = st.items.length;
      /* hold the last statement a beat longer than the rest */
      var idx = clamp(Math.floor(sceneRec.p * (count + 0.35)), 0, count - 1);
      if (idx !== st.live) {
        for (var c = 0; c < count; c++) st.items[c].classList.toggle('is-live', c === idx);
        st.live = idx;
      }
    }

    if (busy || Math.abs(vel) > 0) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function kick() {
    if (running || reduced.matches) return;
    running = true;
    requestAnimationFrame(frame);
  }

  /* ============================================================
     CHAPTER COUNTER
     ============================================================ */

  function initChapters() {
    var out = document.querySelector('[data-chapter-out]');
    if (!out) return;
    var chapters = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
    if (!chapters.length) return;
    var total = String(chapters.length).padStart(2, '0');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var n = e.target.getAttribute('data-chapter');
        out.textContent = n + ' / ' + total;
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    chapters.forEach(function (c) { io.observe(c); });
    out.textContent = chapters[0].getAttribute('data-chapter') + ' / ' + total;
  }

  /* ============================================================
     VIDEO HYGIENE — muted, never autoplay with sound, pause offscreen
     ============================================================ */

  /* Resolve the film for the viewport actually in front of us, once.
     Never re-pick on resize — that restarts the download and throws away
     the buffer for no visual gain.

     Size tier keeps a phone off the desktop master. Format prefers H.264
     (smaller here at the keyframe density scrubbing needs, and supported
     everywhere) and falls back to VP9 for any engine without it. */
  function pickSource(v) {
    var base = v.getAttribute('data-film-base');
    if (!base) return v.getAttribute('data-src') || '';
    var w = window.innerWidth;
    var tier = w <= 760 ? '-720' : w <= 1280 ? '-960' : '';
    var mp4 = v.canPlayType('video/mp4; codecs="avc1.4d401f"');
    return base + tier + (mp4 === 'probably' || mp4 === 'maybe' ? '.mp4' : '.webm');
  }

  function loadScrubVideos() {
    var conn = navigator.connection || navigator.webkitConnection || {};
    var frugal = conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || '');

    document.querySelectorAll('video[data-scrub-video]').forEach(function (v) {
      /* Reduced motion or Save-Data: the poster is the hero. No megabytes
         are spent on a film the visitor has asked not to be shown. */
      if (reduced.matches || frugal) {
        v.setAttribute('data-film', 'poster-only');
        return;
      }
      if (v.dataset.filmLoaded === '1') return;
      var src = pickSource(v);
      if (!src) return;
      v.dataset.filmLoaded = '1';
      v.preload = 'auto';
      v.src = src;
      v.addEventListener('loadeddata', function () {
        v.setAttribute('data-film', 'ready');
        kick();
      }, { once: true });
      v.addEventListener('error', function () {
        /* the poster painted on the container stays visible */
        v.setAttribute('data-film', 'failed');
      }, { once: true });
      v.load();
    });
  }

  function initVideos() {
    var all = document.querySelectorAll('video');
    all.forEach(function (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.removeAttribute('controls');
    });

    loadScrubVideos();

    var loops = document.querySelectorAll('video[data-loop]');
    if (!loops.length || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduced.matches) {
          var pr = v.play();
          if (pr && pr.catch) pr.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.05 });

    loops.forEach(function (v) { io.observe(v); });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) loops.forEach(function (v) { v.pause(); });
    });
  }

  /* ============================================================
     CURSOR (fine pointers only)
     ============================================================ */

  function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (reduced.matches) return;

    var dot = document.createElement('div');
    dot.className = 'cursor';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);

    var tx = 0, ty = 0, cx = 0, cy = 0, live = false;

    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!live) { live = true; cx = tx; cy = ty; dot.classList.add('is-active'); loop(); }
      var t = e.target.closest('a, button, [data-cursor="hover"]');
      dot.classList.toggle('is-hover', !!t);
    }, { passive: true });

    window.addEventListener('pointerleave', function () { dot.classList.remove('is-active'); });

    function loop() {
      cx = lerp(cx, tx, 0.18);
      cy = lerp(cy, ty, 0.18);
      dot.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    }
  }

  /* ============================================================
     BOOT
     ============================================================ */

  function boot() {
    document.querySelectorAll('[data-split]').forEach(splitText);
    initReveals();
    initChapters();
    initVideos();
    initCursor();

    if (reduced.matches) {
      /* static, complete, readable — no scroll maths at all */
      document.querySelectorAll('[data-reveal], [data-split]').forEach(function (el) { el.classList.add('is-in'); });
      document.querySelectorAll('[data-statements] > *').forEach(function (el) { el.classList.add('is-live'); });
      return;
    }

    collect();
    kick();

    window.addEventListener('scroll', kick, { passive: true });

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        setVH();
        resplit();
        measure();
        kick();
      }, 160);
    }, { passive: true });

    window.addEventListener('orientationchange', function () {
      setTimeout(function () { setVH(); measure(); kick(); }, 320);
    });

    /* late-loading media changes layout — remeasure once settled */
    window.addEventListener('load', function () { setVH(); resplit(); measure(); kick(); });
  }

  reduced.addEventListener('change', function () { window.location.reload(); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function rescan(scope) {
    (scope || document).querySelectorAll('[data-split]').forEach(splitText);
    initReveals(scope);
    if (reduced.matches) {
      (scope || document).querySelectorAll('[data-reveal], [data-split]').forEach(function (el) { el.classList.add('is-in'); });
      (scope || document).querySelectorAll('[data-statements] > *').forEach(function (el) { el.classList.add('is-live'); });
      return;
    }
    collect();
    kick();
  }

  window.Cinema = {
    remeasure: function () { measure(); kick(); },
    collect: collect,
    rescan: rescan
  };
})();
