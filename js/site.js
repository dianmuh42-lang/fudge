/* ============================================================
   FUDGE JARCHEH — SITE
   Chrome (nav, menu, footer), content rendering from the
   models in data/content.js, and the contact interaction.
   Works from file:// — no fetch, no build step.
   ============================================================ */

(function () {
  'use strict';

  var FJ = window.FJ || {};
  var site = FJ.site || {};

  /* Pages live one level down, so every generated link is
     prefixed to stay correct from any depth. */
  var depth = (location.pathname.match(/\/pages\//) ? 1 : 0) +
              (location.pathname.match(/\/pages\/journal\//) ? 1 : 0);
  var BASE = depth === 0 ? '' : depth === 1 ? '../' : '../../';
  var here = (location.pathname.split('/').pop() || 'index.html');
  /* An article lives at /pages/journal/<slug>.html — it still belongs to Journal. */
  if (/\/pages\/journal\//.test(location.pathname)) here = 'journal.html';

  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var url = function (href) { return /^(https?:|mailto:|#)/.test(href) ? href : BASE + href; };

  var ARROW = '<span class="btn__arrow" aria-hidden="true">&#8594;</span>';

  var fmtDate = function (iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  };

  /* ============================================================
     NAV + MENU
     ============================================================ */

  function buildNav() {
    var host = document.querySelector('[data-nav]');
    if (!host) return;

    var links = (site.nav || []).map(function (n) {
      var cur = n.root === here ? ' aria-current="page"' : '';
      return '<li><a class="nav__link" href="' + url(n.href) + '"' + cur + '>' + esc(n.label) + '</a></li>';
    }).join('');

    host.innerHTML =
      '<a class="nav__brand" href="' + url('index.html') + '">' +
        'Fudge Jarcheh <span>Entrepren-Artist</span>' +
      '</a>' +
      '<nav class="nav__desktop" aria-label="Primary"><ul class="nav__list">' + links + '</ul></nav>' +
      '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu">' +
        '<span></span><span class="u-visually-hidden">Menu</span>' +
      '</button>';

    var menu = el('div', 'menu');
    menu.id = 'menu';
    menu.setAttribute('aria-label', 'Site menu');
    menu.hidden = false;
    menu.innerHTML =
      '<ul class="menu__list">' +
        (site.nav || []).map(function (n) {
          var cur = n.root === here ? ' aria-current="page"' : '';
          return '<li class="menu__item"><a class="menu__link" href="' + url(n.href) + '"' + cur + '>' + esc(n.label) + '</a></li>';
        }).join('') +
      '</ul>' +
      '<div class="menu__foot">' +
        '<p class="t-meta">' + esc(site.motto || '') + '</p>' +
        '<div class="social">' + socialHTML() + '</div>' +
      '</div>';
    document.body.appendChild(menu);

    var toggle = host.querySelector('.nav__toggle');
    var open = false;
    var lastFocus = null;

    function setOpen(v) {
      open = v;
      toggle.setAttribute('aria-expanded', String(v));
      menu.classList.toggle('is-open', v);
      document.body.classList.toggle('is-locked', v);
      if (v) {
        lastFocus = document.activeElement;
        var first = menu.querySelector('.menu__link');
        if (first) setTimeout(function () { first.focus(); }, 380);
      } else if (lastFocus) {
        lastFocus.focus();
      }
    }

    toggle.addEventListener('click', function () { setOpen(!open); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) setOpen(false);
      if (e.key === 'Tab' && open) {
        var f = menu.querySelectorAll('a, button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (open && window.innerWidth > 900) setOpen(false); });

    /* Hide the bar on the way down, return it on the way up. */
    var lastY = window.scrollY, ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (!open) {
          host.classList.toggle('is-hidden', y > 240 && y > lastY);
          host.classList.toggle('is-solid', y > window.innerHeight * 0.6);
        }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ============================================================
     SOCIAL / FOOTER
     ============================================================ */

  function socialHTML() {
    return (site.social || []).map(function (s) {
      if (!s.url) {
        return '<span title="Link coming soon" aria-disabled="true">' + esc(s.label) + '</span>';
      }
      return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
             esc(s.label) + '<span class="u-visually-hidden"> (opens in a new tab)</span></a>';
    }).join('');
  }

  function buildFooter() {
    var host = document.querySelector('[data-footer]');
    if (!host) return;
    var year = new Date().getFullYear();

    host.innerHTML =
      '<div class="wrap">' +
        '<div class="footer__top">' +
          '<div>' +
            '<p class="footer__mark">Fudge Jarcheh<br><span style="color:var(--fg-faint)">Entrepren-Artist</span></p>' +
            '<p class="t-meta" style="margin-top:var(--s-5)">Frequency Digital Group</p>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h3 class="t-meta">Navigate</h3>' +
            '<ul>' + (site.nav || []).slice(1).map(function (n) {
              return '<li><a class="link" href="' + url(n.href) + '">' + esc(n.label) + '</a></li>';
            }).join('') + '</ul>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h3 class="t-meta">Connect</h3>' +
            '<div class="social">' + socialHTML() + '</div>' +
            '<p class="t-meta" style="margin-top:var(--s-5)">' +
              '<a class="link" href="' + url('pages/contact.html') + '">Get in touch ' + ARROW + '</a>' +
            '</p>' +
          '</div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<p class="t-meta">&copy; ' + year + ' Fudge Jarcheh &middot; Frequency Digital Group</p>' +
          '<p class="t-meta">' + esc(site.motto || '') + '</p>' +
        '</div>' +
      '</div>';
  }

  /* ============================================================
     RENDERERS
     ============================================================ */

  function renderJournal() {
    document.querySelectorAll('[data-journal]').forEach(function (host) {
      var limit = parseInt(host.getAttribute('data-journal'), 10);
      var skip = host.getAttribute('data-journal-exclude');
      var items = (FJ.journal || []).slice();
      if (skip) items = items.filter(function (a) { return a.slug !== skip; });
      items.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      if (limit > 0) items = items.slice(0, limit);
      if (!items.length) { host.innerHTML = emptyState('More notes are on the way.'); return; }

      host.setAttribute('data-reveal-group', '');
      host.innerHTML = items.map(function (a) {
        return '<article class="card" data-reveal>' +
          '<div class="card__meta">' +
            '<span class="t-meta t-meta--accent">' + esc(a.category) + '</span>' +
            '<time class="t-num" datetime="' + esc(a.date) + '">' + fmtDate(a.date) + '</time>' +
          '</div>' +
          '<h3 class="t-h3 card__title">' +
            '<a class="card__link" href="' + url('pages/journal/' + a.slug + '.html') + '">' + esc(a.title) + '</a>' +
          '</h3>' +
          '<p class="t-body">' + esc(a.excerpt) + '</p>' +
          '<p class="t-meta" style="margin-top:auto">Read ' + ARROW + ' &middot; ' + esc(a.readTime) + '</p>' +
        '</article>';
      }).join('');
    });
  }

  function renderWorlds() {
    var host = document.querySelector('[data-worlds]');
    if (!host) return;
    host.setAttribute('data-reveal-group', '');
    host.innerHTML = (FJ.worlds || []).map(function (w) {
      return '<article class="world" data-reveal data-tilt>' +
        '<div class="world__media plate">' +
          '<img src="' + url(w.image) + '" alt="' + esc(w.alt) + '" loading="lazy" decoding="async" width="1200" height="1500">' +
        '</div>' +
        '<div class="world__body">' +
          '<span class="t-num">' + esc(w.n) + '</span>' +
          '<h3 class="t-h3">' + esc(w.title) + '</h3>' +
          '<p class="t-body">' + esc(w.body) + '</p>' +
          '<a class="link" href="' + url(w.href) + '">' + esc(w.cta) + ' ' + ARROW + '</a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderBuilding() {
    var host = document.querySelector('[data-building]');
    if (!host) return;
    host.setAttribute('data-reveal-group', '');
    host.innerHTML = (FJ.building || []).map(function (b, i) {
      return '<li class="build" data-reveal>' +
        '<span class="t-num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<h3 class="t-h3 build__name">' + esc(b.name) + '</h3>' +
        '<p class="t-body build__note">' + esc(b.note) + '</p>' +
        '<span class="t-meta build__status">' + esc(b.status) + '</span>' +
      '</li>';
    }).join('');
  }

  function renderEvolution() {
    var rail = document.querySelector('[data-evolution-rail]');
    var stack = document.querySelector('[data-evolution-stack]');
    var items = FJ.evolution || [];

    var panel = function (s, i) {
      return '<div class="rail__panel">' +
        '<div><span class="t-num">' + esc(s.stage) + '</span>' +
        '<p class="t-meta t-meta--accent" style="margin-top:var(--s-4)">' + esc(s.kicker) + '</p></div>' +
        '<div><h3 class="t-h2">' + esc(s.title) + '</h3>' +
        '<p class="t-body" style="margin-top:var(--s-5)">' + esc(s.body) + '</p></div>' +
        '<span class="rail__index t-num">' + String(i + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0') + '</span>' +
      '</div>';
    };

    if (rail) rail.innerHTML = items.map(panel).join('');
    if (stack) {
      stack.setAttribute('data-reveal-group', '');
      stack.innerHTML = items.map(function (s, i) {
        return '<article class="stagecard" data-reveal>' +
          '<div class="stagecard__head">' +
            '<span class="t-num">' + esc(s.stage) + '</span>' +
            '<span class="t-meta t-meta--accent">' + esc(s.kicker) + '</span>' +
          '</div>' +
          '<h3 class="t-h2">' + esc(s.title) + '</h3>' +
          '<p class="t-body">' + esc(s.body) + '</p>' +
        '</article>';
      }).join('');
    }
  }

  function renderVentures() {
    document.querySelectorAll('[data-ventures]').forEach(function (host) {
      var items = FJ.ventures || [];
      if (!items.length) { host.innerHTML = emptyState('Ventures are being prepared for publication.'); return; }
      host.setAttribute('data-reveal-group', '');
      host.innerHTML = items.map(function (v) {
        var cta = v.url
          ? '<a class="btn" href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer">Visit ' + ARROW + '</a>'
          : '<span class="btn" aria-disabled="true" style="opacity:.45;cursor:not-allowed">Site coming soon</span>';
        return '<article class="venture" data-reveal>' +
          '<div class="venture__media plate plate--vignette">' +
            '<img src="' + url(v.image) + '" alt="' + esc(v.alt) + '" loading="lazy" decoding="async" width="1600" height="1000">' +
          '</div>' +
          '<div class="venture__body">' +
            '<p class="t-meta">' + esc(v.parentLabel) + '</p>' +
            '<h3 class="t-h2">' + esc(v.name) + '</h3>' +
            '<p class="t-lead">' + esc(v.line) + '</p>' +
            '<p class="t-body">' + esc(v.summary) + '</p>' +
            '<dl class="spec">' +
              '<div><dt class="t-meta">Status</dt><dd class="t-meta" style="color:var(--fg)">' + esc(v.status) + '</dd></div>' +
              '<div><dt class="t-meta">Category</dt><dd class="t-meta" style="color:var(--fg)">' + esc(v.category) + '</dd></div>' +
              '<div><dt class="t-meta">Founder</dt><dd class="t-meta" style="color:var(--fg)">' + esc(v.founder) + '</dd></div>' +
            '</dl>' +
            cta +
          '</div>' +
        '</article>';
      }).join('');
    });
  }

  function emptyState(msg) {
    return '<div class="empty">' +
      '<span class="t-meta">Nothing published yet</span>' +
      '<p class="t-body">' + esc(msg) + '</p>' +
      '<a class="link" href="' + url('pages/contact.html') + '">Get in touch ' + ARROW + '</a>' +
    '</div>';
  }

  function renderPress() {
    var host = document.querySelector('[data-press]');
    if (!host) return;
    var items = FJ.press || [];
    if (!items.length) {
      host.innerHTML = (FJ.pressSections || []).map(function (s) {
        return '<section class="press-group" id="' + esc(s.id) + '">' +
          '<div class="section-head">' +
            '<h2 class="t-h3">' + esc(s.title) + '</h2>' +
            '<p class="t-meta">' + esc(s.note) + '</p>' +
          '</div>' +
          emptyState('This section fills automatically as coverage is confirmed. Nothing is listed until it is real.') +
        '</section>';
      }).join('');
      return;
    }
    host.setAttribute('data-reveal-group', '');
    host.innerHTML = items.map(function (p) {
      var t = '<h3 class="t-h3 card__title">' + esc(p.title) + '</h3>';
      if (p.url) t = '<h3 class="t-h3 card__title"><a class="card__link" href="' + esc(p.url) +
        '" target="_blank" rel="noopener noreferrer">' + esc(p.title) + '</a></h3>';
      return '<article class="card" data-reveal>' +
        '<div class="card__meta"><span class="t-meta t-meta--accent">' + esc(p.outlet) + '</span>' +
        '<time class="t-num" datetime="' + esc(p.date) + '">' + fmtDate(p.date) + '</time></div>' +
        t + '<p class="t-meta">' + esc(p.type) + '</p>' +
      '</article>';
    }).join('');
  }

  function renderMusic() {
    var host = document.querySelector('[data-releases]');
    if (!host) return;
    var items = (FJ.music && FJ.music.releases) || [];
    if (!items.length) {
      host.innerHTML = emptyState('Releases, embeds and live dates are published here once confirmed. No placeholder tracks are listed.');
      return;
    }
    host.setAttribute('data-reveal-group', '');
    host.innerHTML = items.map(function (r) {
      return '<article class="card" data-reveal>' +
        '<div class="card__media plate"><img src="' + url(r.artwork) + '" alt="' + esc(r.title) + ' artwork" loading="lazy" decoding="async"></div>' +
        '<div class="card__meta"><span class="t-meta t-meta--accent">' + esc(r.type) + '</span><span class="t-num">' + esc(r.year) + '</span></div>' +
        '<h3 class="t-h3 card__title">' + esc(r.title) + '</h3>' +
      '</article>';
    }).join('');
  }

  /* ============================================================
     CARD TILT — subtle cursor response, pointer devices only
     ============================================================ */

  function initTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (((e.clientX - r.left) / r.width) - 0.5).toFixed(3));
        card.style.setProperty('--my', (((e.clientY - r.top) / r.height) - 0.5).toFixed(3));
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--mx', 0);
        card.style.setProperty('--my', 0);
      });
    });
  }

  /* ============================================================
     CONTACT — front-end interaction, no backend required
     ============================================================ */

  function initContact() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea, select'));

    function setError(input, msg) {
      var field = input.closest('.field');
      if (!field) return;
      var slot = field.querySelector('.error');
      field.classList.toggle('has-error', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (slot) slot.textContent = msg || '';
    }

    function validate(input) {
      var v = (input.value || '').trim();
      if (input.required && !v) { setError(input, 'Required'); return false; }
      if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        setError(input, 'Enter a valid email address'); return false;
      }
      if (input.name === 'message' && v && v.length < 12) {
        setError(input, 'A little more detail, please'); return false;
      }
      setError(input, '');
      return true;
    }

    fields.forEach(function (f) {
      f.addEventListener('blur', function () { validate(f); });
      f.addEventListener('input', function () {
        if (f.closest('.field').classList.contains('has-error')) validate(f);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      fields.forEach(function (f) {
        if (!validate(f)) { ok = false; if (!firstBad) firstBad = f; }
      });
      if (!ok) { if (firstBad) firstBad.focus(); return; }

      var data = {};
      fields.forEach(function (f) { data[f.name] = (f.value || '').trim(); });

      var subject = '[' + (data.reason || 'General') + '] ' + data.name;
      var bodyText =
        'Name: ' + data.name + '\n' +
        'Email: ' + data.email + '\n' +
        'Reason: ' + (data.reason || 'General') + '\n\n' +
        data.message + '\n';

      var mailto = 'mailto:' + (site.contactEmail || '') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(bodyText);

      var panel = el('div', 'form-success');
      panel.setAttribute('role', 'status');
      panel.innerHTML =
        '<span class="t-meta t-meta--accent">Message ready</span>' +
        '<h3 class="t-h3">Thank you, ' + esc(data.name.split(' ')[0]) + '.</h3>' +
        '<p class="t-body">This site runs without a backend, so your message opens in your email client with everything already filled in. Send it and it reaches the right inbox.</p>' +
        '<a class="btn" href="' + mailto + '">Open in email ' + ARROW + '</a>' +
        '<button class="link" type="button" data-reset>Write another message</button>';

      form.hidden = true;
      form.parentNode.insertBefore(panel, form.nextSibling);
      panel.querySelector('[data-reset]').addEventListener('click', function () {
        panel.remove();
        form.reset();
        fields.forEach(function (f) { setError(f, ''); });
        form.hidden = false;
        form.querySelector('input, textarea, select').focus();
      });
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ============================================================
     CONTACT ROUTES (mailto buttons with a preset reason)
     ============================================================ */

  function initMailRoutes() {
    document.querySelectorAll('[data-mail]').forEach(function (a) {
      var reason = a.getAttribute('data-mail');
      a.href = 'mailto:' + (site.contactEmail || '') + '?subject=' + encodeURIComponent('[' + reason + '] Enquiry');
    });
  }

  /* ============================================================
     BOOT
     ============================================================ */

  function boot() {
    buildNav();
    buildFooter();
    renderJournal();
    renderWorlds();
    renderBuilding();
    renderEvolution();
    renderVentures();
    renderPress();
    renderMusic();
    initTilt();
    initContact();
    initMailRoutes();

    /* Content arrived after the engine booted — re-scan it. */
    if (window.Cinema && window.Cinema.rescan) {
      requestAnimationFrame(function () { window.Cinema.rescan(document); });
    }
    document.dispatchEvent(new CustomEvent('fj:rendered'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
