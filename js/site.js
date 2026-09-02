/*  Life · Land · Legacy — shared behaviour
    ------------------------------------------------------------------
    Two things, on every page: the mobile menu, and the scroll-spy that
    keeps the sticky section sub-nav in sync with the page. The sub-nav
    is the only navigation a pillar page has (no dropdowns), so it has
    to always show where you are.
*/

(function () {
  'use strict';

  /* ─── Mobile menu ──────────────────────────────────────────────── */
  var nav    = document.getElementById('nav');
  var burger = document.querySelector('.nav-burger');
  var menu   = document.getElementById('mobileMenu');

  if (burger && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      if (nav) nav.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('open'));
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });

    // Escape closes it, and so does growing past the burger breakpoint —
    // otherwise the menu stays latched open behind the desktop nav.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
    });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ─── Floating mobile actions: Talk Story + back to top ────────────
     Puts the primary action in the thumb zone on long pages, and a
     labelled back-to-top in the opposite corner. CSS shows these on
     mobile only; here we build them and toggle visibility on scroll. */
  (function () {
    var wrap = document.createElement('div');
    wrap.className = 'floaters';

    var top = document.createElement('button');
    top.type = 'button';
    top.className = 'float-top';
    top.setAttribute('aria-label', 'Back to top of page');
    top.innerHTML = '&uarr; Top';
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var cta = document.createElement('a');
    cta.className = 'float-cta';
    // Prefer the on-page contact section; fall back to a direct call.
    cta.href = document.getElementById('contact') ? '#contact' : 'tel:8085153081';
    cta.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.24 1z"/></svg>Talk Story';

    wrap.appendChild(top);
    wrap.appendChild(cta);
    document.body.appendChild(wrap);

    var visible = false;
    var update = function () {
      var scrolled   = window.scrollY > window.innerHeight * 0.6;
      // Don't cover the contact section / footer at the very bottom.
      var nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 140;
      var show = scrolled && !nearBottom;
      if (show !== visible) { visible = show; wrap.classList.toggle('is-visible', show); }
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  /* ─── Sub-nav scroll-spy ───────────────────────────────────────────
     Marks the link whose section currently sits under the header. Uses
     scroll position rather than IntersectionObserver so that tall
     sections (some run several screens) still register the moment
     their top passes the bar.
  */
  var subnav = document.querySelector('.subnav');
  if (!subnav) return;

  var links = [].slice.call(subnav.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;

  var targets = links
    .map(function (link) {
      var el = document.getElementById(link.getAttribute('href').slice(1));
      return el ? { link: link, el: el } : null;
    })
    .filter(Boolean);
  if (!targets.length) return;

  /* ─── Jump-to-section dropdown (mobile) ────────────────────────────
     On a phone the sub-nav strip only shows two or three of a dozen-plus
     sections. This adds an "On this page" toggle (CSS turns the strip
     into the dropdown it opens) so every section is one tap away. The
     scroll-spy below still marks the active link, which the open menu
     highlights. */
  (function () {
    var inner = subnav.querySelector('.subnav-inner');
    var list  = subnav.querySelector('.subnav-links');
    if (!inner || !list) return;

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'subnav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span>On this page</span>' +
                       '<span class="subnav-toggle-chev" aria-hidden="true">&#9662;</span>';
    inner.insertBefore(toggle, list);

    var close = function () {
      subnav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !subnav.classList.contains('open');
      subnav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('click', function (e) {
      if (subnav.classList.contains('open') && !subnav.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();

  var current = null;
  var ticking = false;

  var sync = function () {
    ticking = false;

    // Everything above this line counts as "passed" — the sticky bars'
    // combined height plus a little breathing room.
    var line = subnav.getBoundingClientRect().bottom + 24;
    var active = targets[0];

    for (var i = 0; i < targets.length; i++) {
      if (targets[i].el.getBoundingClientRect().top <= line) active = targets[i];
      else break;
    }

    // At the very bottom the last section may be too short to ever cross
    // the line; select it explicitly so the final tab can light up.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      active = targets[targets.length - 1];
    }

    if (active === current) return;
    if (current) current.link.classList.remove('active');
    active.link.classList.add('active');
    current = active;

    // Keep the active chip visible in the horizontally scrolling bar on
    // mobile, without scrolling the page itself.
    var list = active.link.closest('.subnav-links');
    if (list && list.scrollWidth > list.clientWidth) {
      var l = active.link.offsetLeft;
      var w = active.link.offsetWidth;
      if (l < list.scrollLeft || l + w > list.scrollLeft + list.clientWidth) {
        list.scrollTo({ left: l - 16, behavior: 'smooth' });
      }
    }
  };

  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(sync);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  sync();
})();
