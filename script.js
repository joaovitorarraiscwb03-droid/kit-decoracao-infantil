(function () {
  // Year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Countdown 15 min
  var DURATION = 15 * 60 * 1000;
  var KEY = "kit_offer_deadline_v1";
  var deadline = parseInt(localStorage.getItem(KEY) || "0", 10);
  var now = Date.now();
  if (!deadline || isNaN(deadline) || deadline < now) {
    deadline = now + DURATION;
    localStorage.setItem(KEY, String(deadline));
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var diff = deadline - Date.now();
    if (diff <= 0) {
      deadline = Date.now() + DURATION;
      localStorage.setItem(KEY, String(deadline));
      diff = DURATION;
    }
    var t = Math.floor(diff / 1000);
    var s = pad(Math.floor(t / 60)) + ":" + pad(t % 60);
    var a = document.getElementById("topTimer");
    var b = document.getElementById("offerTimer");
    if (a) a.textContent = s;
    if (b) b.textContent = s;
  }
  tick();
  setInterval(tick, 1000);

  // Reveal on scroll
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }

  // Smooth scroll buttons -> #oferta
  document.querySelectorAll(".js-scroll").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var target = document.getElementById("oferta");
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      track(btn.getAttribute("data-event") || "scroll");
    });
  });

  // CTA tracking (real checkout buttons)
  document.querySelectorAll(".js-cta").forEach(function (btn) {
    btn.addEventListener("click", function () {
      track(btn.getAttribute("data-event") || "cta");
    });
  });

  function track(source) {
    try {
      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout", {
          content_name: "Kit Completo de Decoração para Sala Infantil",
          value: 19.90,
          currency: "BRL",
          source: source
        });
      }
    } catch (e) { /* noop */ }
  }

  // Carousel
  var trackEl = document.getElementById("carTrack");
  var prev = document.getElementById("carPrev");
  var next = document.getElementById("carNext");
  var dotsBox = document.getElementById("carDots");
  if (trackEl && prev && next && dotsBox) {
    var slides = trackEl.children.length;
    var idx = 0;
    // build dots
    for (var i = 0; i < slides; i++) {
      (function (i) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "carousel-dot" + (i === 0 ? " active" : "");
        d.setAttribute("aria-label", "Ir para imagem " + (i + 1));
        d.addEventListener("click", function () { go(i); });
        dotsBox.appendChild(d);
      })(i);
    }
    function go(i) {
      idx = (i + slides) % slides;
      trackEl.style.transform = "translateX(-" + (idx * 100) + "%)";
      Array.prototype.forEach.call(dotsBox.children, function (d, j) {
        d.classList.toggle("active", j === idx);
      });
    }
    prev.addEventListener("click", function () { go(idx - 1); });
    next.addEventListener("click", function () { go(idx + 1); });
    setInterval(function () { go(idx + 1); }, 4000);
  }
})();
