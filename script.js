/* ============ Kit Sala Infantil — Landing Script ============ */
(function () {
  'use strict';

  // ---------- Year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Scarcity countdown (15 min, persistent via localStorage) ----------
  var DURATION = 15 * 60 * 1000; // 15 minutes
  var KEY = 'kit_offer_deadline_v1';
  var deadline = parseInt(localStorage.getItem(KEY), 10);
  var now = Date.now();

  if (!deadline || isNaN(deadline) || deadline < now) {
    deadline = now + DURATION;
    localStorage.setItem(KEY, String(deadline));
  }

  var timerEls = [
    document.getElementById('topTimer'),
    document.getElementById('heroTimer'),
    document.getElementById('offerTimer')
  ].filter(Boolean);

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
    var diff = deadline - Date.now();
    if (diff <= 0) {
      // Reset for next visitor / continued urgency
      deadline = Date.now() + DURATION;
      localStorage.setItem(KEY, String(deadline));
      diff = DURATION;
    }
    var totalSec = Math.floor(diff / 1000);
    var m = Math.floor(totalSec / 60);
    var s = totalSec % 60;
    var text = pad(m) + ':' + pad(s);
    for (var i = 0; i < timerEls.length; i++) {
      timerEls[i].textContent = text;
    }
  }
  tick();
  setInterval(tick, 1000);

  // ---------- CTA tracking (InitiateCheckout) ----------
  var ctas = document.querySelectorAll('.js-cta');
  ctas.forEach(function (el) {
    el.addEventListener('click', function () {
      try {
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'InitiateCheckout', {
            content_name: 'Kit Completo de Decoração para Sala Infantil',
            value: 29.90,
            currency: 'BRL',
            source: el.getAttribute('data-event') || 'cta'
          });
        }
      } catch (e) { /* noop */ }
    });
  });

  // ---------- Reveal on scroll (IntersectionObserver) ----------
  var reveals = document.querySelectorAll('.reveal');
  function revealAll(){ reveals.forEach(function(el){ el.classList.add('in'); }); }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
    setTimeout(revealAll, 2000);
  } else {
    revealAll();
  }

  // ---------- ViewContent (fires once when offer section visible) ----------
  var offerSection = document.getElementById('oferta');
  if (offerSection && 'IntersectionObserver' in window) {
    var vcFired = false;
    var vcObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !vcFired) {
          vcFired = true;
          try {
            if (typeof window.fbq === 'function') {
              window.fbq('track', 'ViewContent', {
                content_name: 'Kit Completo de Decoração para Sala Infantil',
                content_category: 'Educação Infantil',
                value: 29.90,
                currency: 'BRL'
              });
            }
          } catch (e) { /* noop */ }
          vcObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    vcObserver.observe(offerSection);
  }
})();
