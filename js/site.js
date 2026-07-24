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
