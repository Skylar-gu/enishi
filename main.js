/* enishi — sequence orchestration
 * idle -> (click) -> bloom -> hold -> zoom -> site
 * One button press runs the whole arrival; a click during bloom/hold
 * skips ahead to the zoom.
 */
(function () {
  "use strict";

  var stage = document.getElementById("stage");
  var canvas = document.getElementById("swirl");
  var orb = document.getElementById("orb");
  var site = document.getElementById("site");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Timeline (ms)
  var T = {
    bloom: reduced ? 700 : 3000,
    hold: reduced ? 400 : 1900,
    zoom: reduced ? 700 : 2800
  };

  var swirl = null;
  try {
    swirl = window.createSwirl(canvas);
  } catch (e) {
    swirl = null;
  }

  var phase = "idle";
  var phaseStart = 0;
  var startedAt = performance.now();
  var skipToZoom = false;

  function setPhase(p) {
    phase = p;
    phaseStart = performance.now();
    stage.setAttribute("data-phase", p);
    if (p === "site") {
      site.removeAttribute("aria-hidden");
      site.focus({ preventScroll: true });
    }
  }

  function easeInOut(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
  function easeIn(x) {
    return x * x * x;
  }
  function easeOut(x) {
    return 1 - Math.pow(1 - x, 3);
  }
  function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }

  function begin() {
    if (phase !== "idle") return;
    setPhase("bloom");
  }

  function nudge() {
    if (phase === "bloom" || phase === "hold") skipToZoom = true;
  }

  orb.addEventListener("click", begin);
  stage.addEventListener("click", function (ev) {
    if (ev.target === orb || orb.contains(ev.target)) return;
    nudge();
  });
  window.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" || ev.key === " ") {
      if (phase === "idle") begin();
      else nudge();
    }
  });

  window.addEventListener("resize", function () {
    if (swirl) swirl.resize();
  });

  // If WebGL is unavailable, degrade to a plain fade into the page.
  if (!swirl) {
    orb.addEventListener("click", function () {
      setTimeout(function () { setPhase("zoom"); }, 50);
      setTimeout(function () { setPhase("site"); }, 1300);
    }, { once: true });
  }

  function frame(now) {
    var t = (now - startedAt) / 1000;

    var state = { time: t, zoom: 0, reveal: 0, fade: 0, peach: 0 };

    if (phase === "bloom") {
      var bp = clamp01((now - phaseStart) / T.bloom);
      state.reveal = easeOut(bp);
      if (skipToZoom) {
        skipToZoom = false;
        setPhase("zoom");
      } else if (bp >= 1) {
        setPhase("hold");
      }
    } else if (phase === "hold") {
      state.reveal = 1;
      var hp = (now - phaseStart) / T.hold;
      if (skipToZoom || hp >= 1) {
        skipToZoom = false;
        setPhase("zoom");
      }
    } else if (phase === "zoom") {
      var zp = clamp01((now - phaseStart) / T.zoom);
      state.reveal = 1;
      state.zoom = easeIn(zp);
      state.fade = easeInOut(clamp01((zp - 0.35) / 0.65));
      state.peach = easeInOut(clamp01((zp - 0.45) / 0.55));

      // extra rush on the canvas element itself
      var s = 1 + state.zoom * 5.5;
      canvas.style.transform = "scale(" + s.toFixed(3) + ")";
      canvas.style.filter = "blur(" + (state.zoom * 10).toFixed(2) + "px)";

      if (zp >= 1) setPhase("site");
    } else if (phase === "site") {
      state.fade = 1;
    }

    if (swirl && phase !== "idle" && phase !== "site") {
      swirl.render(state);
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
