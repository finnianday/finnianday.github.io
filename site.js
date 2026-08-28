// Shared site behaviour, loaded by every page.
//   1. Swaps any <div data-include="..."> for the contents of that file.
//   2. Wires up the nav (solid-on-scroll + mobile hamburger).
// Wrapped in an IIFE so nothing leaks into the global scope and collides
// with the page-specific scripts that still live inline (research, projects).
(function () {
  'use strict';

  // ── HTML includes ──
  // Note: this uses fetch(), so pages must be served over http(s).
  // Live Server and GitHub Pages are both fine; opening the file directly
  // from disk (file://) is not.
  function loadIncludes() {
    document.querySelectorAll('[data-include]').forEach(function (slot) {
      var url = slot.dataset.include;
      fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
          return res.text();
        })
        .then(function (html) {
          // Replace the placeholder itself, leaving no wrapper behind.
          slot.outerHTML = html;
        })
        .catch(function (err) {
          console.error('Include failed for ' + url + ':', err.message);
        });
    });
  }

  // ── Nav ──
  function initNav() {
    var nav = document.getElementById('main-nav');
    var toggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    var hero = document.querySelector('.hero');
    if (!nav) return;

    // Nav goes solid once the hero has scrolled out of view.
    if (hero) {
      new IntersectionObserver(function (entries) {
        nav.classList.toggle('solid', !entries[0].isIntersecting);
      }, { threshold: 0 }).observe(hero);
    }

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      // Force solid nav when the menu is open, whatever the scroll position.
      if (isOpen) nav.classList.add('solid');
    });

    // Close the menu when a link is tapped.
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });
  }

  loadIncludes();
  initNav();
})();
