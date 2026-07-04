/* Life · Land · Legacy — shared interactions */
(function () {
  'use strict';

  // ── Nav: solid on scroll ──────────────────────────────────
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('solid', window.scrollY > 40 || nav.dataset.always === 'true'); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile menu ───────────────────────────────────────────
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); toggle.classList.remove('open'); });
    });
  }

  // ── Scroll-reveal ─────────────────────────────────────────
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ── Interactive wordmark (home) ───────────────────────────
  var group = document.getElementById('wordmark');
  if (group) {
    var words = group.querySelectorAll('.word');
    var panels = document.querySelectorAll('.wp');
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var openKey = function (key) {
      panels.forEach(function (p) { p.classList.toggle('show', p.dataset.key === key); });
      words.forEach(function (w) { w.classList.toggle('active', w.dataset.key === key); });
    };
    var closeAll = function () {
      panels.forEach(function (p) { p.classList.remove('show'); });
      words.forEach(function (w) { w.classList.remove('active'); });
    };

    words.forEach(function (w) {
      w.addEventListener('click', function (e) {
        e.preventDefault();
        if (w.classList.contains('active')) { window.location.href = w.getAttribute('href'); }
        else { openKey(w.dataset.key); }
      });
      if (canHover) w.addEventListener('mouseenter', function () { openKey(w.dataset.key); });
    });
    if (canHover) {
      var gw = document.getElementById('wordmarkGroup');
      if (gw) gw.addEventListener('mouseleave', closeAll);
    }
    document.addEventListener('click', function (e) {
      var gw = document.getElementById('wordmarkGroup');
      if (gw && !gw.contains(e.target)) closeAll();
    });
  }

  // ── Stamp contact form source URL ─────────────────────────
  var pageField = document.querySelector('form [name="page"]');
  if (pageField) pageField.value = window.location.href;
})();
