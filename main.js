/* enishi — sequence orchestration
 *
 *   idle ──swipe up──▶ expand ──commit──▶ hold ──▶ zoom ──▶ site
 *              └── release short ──▶ snaps back to idle
 *
 * The upward swipe scrubs the circle open: its radius follows your finger.
 * Release past the threshold (or flick) and it commits to full screen;
 * release short and it snaps back. Trackpad scroll-up, click and
 * Enter/Space are equivalent fallbacks.
 */
(function () {
  "use strict";

  var stage = document.getElementById("stage");
  var canvas = document.getElementById("swirl");
  var orb = document.getElementById("orb");
  var phrase = document.getElementById("phrase");
  var pulse = document.getElementById("pulse");
  var pulseWord = pulse.querySelector(".word");
  var site = document.getElementById("site");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // a quiet, evolving "thinking" word under the orb
  var WORDS = [
    "coalescing", "evolving", "unfurling", "becoming",
    "cohering", "emerging", "germinating", "recombining", "attuning"
  ];
  var wi = Math.floor(Math.random() * WORDS.length);
  pulseWord.textContent = WORDS[wi];
  if (!reduced) {
    setInterval(function () {
      if (phase !== "idle" && phase !== "expand") return;
      wi = (wi + 1) % WORDS.length;
      pulseWord.style.opacity = "0";
      setTimeout(function () {
        pulseWord.textContent = WORDS[wi];
        pulseWord.style.opacity = "1";
      }, 380);
    }, 3200);
  }

  var T = {
    hold: reduced ? 500 : 1900,
    zoom: reduced ? 700 : 2800
  };
  var EASE = reduced ? 0.5 : 0.16; // settle rate toward the expand target
  var COMMIT = 0.5; // fraction of the pull that locks in a commit on release
  var FLICK = 0.55; // upward px/ms that commits regardless of distance

  function threshold() {
    return Math.min(window.innerHeight * 0.55, 360);
  }

  var swirl = null;
  try {
    swirl = window.createSwirl(canvas);
  } catch (e) {
    swirl = null;
  }

  var phase = "idle";
  var phaseStart = performance.now();
  var startedAt = performance.now();

  var expandP = 0; // 0..1 how far the circle has opened
  var target = 0; // where expandP eases to when not actively dragging
  var dragging = false;
  var startY = 0;
  var lastY = 0;
  var lastMoveT = 0;
  var vy = 0; // upward velocity, px/ms
  var moved = false;
  var pendingNudge = false;
  var wheelEndTimer = 0;

  function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }
  function easeIn(x) {
    return x * x * x;
  }
  function easeInOut(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function setPhase(p) {
    phase = p;
    phaseStart = performance.now();
    stage.setAttribute("data-phase", p);
    if (p === "idle") {
      expandP = 0;
      target = 0;
      dragging = false;
      orb.style.cssText = "";
      pulse.style.opacity = "";
      phrase.style.opacity = "";
      phrase.style.transform = "";
      canvas.style.transform = "";
      canvas.style.filter = "";
    } else if (p === "site") {
      site.removeAttribute("aria-hidden");
      site.focus({ preventScroll: true });
    }
  }

  // ---- gesture: pointer drag ----------------------------------------------
  function onDown(e) {
    if (phase === "hold") { pendingNudge = true; return; }
    if (phase !== "idle" && phase !== "expand") return;
    dragging = true;
    moved = false;
    startY = lastY = e.clientY;
    lastMoveT = performance.now();
    vy = 0;
    if (phase === "idle") setPhase("expand");
    if (stage.setPointerCapture && e.pointerId != null) {
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }

  function onMove(e) {
    if (!dragging || phase !== "expand") return;
    var now = performance.now();
    var y = e.clientY;
    if (Math.abs(y - startY) > 6) moved = true;
    var dt = Math.max(1, now - lastMoveT);
    vy = (lastY - y) / dt; // moving up => positive
    lastY = y;
    lastMoveT = now;
    expandP = clamp01((startY - y) / threshold());
    target = expandP;
  }

  function onUp() {
    if (phase === "hold") { pendingNudge = true; return; }
    if (phase !== "expand") return;
    dragging = false;
    var tap = !moved && expandP < 0.02; // a plain click/tap on the orb
    var commit = tap || expandP >= COMMIT || vy >= FLICK;
    target = commit ? 1 : 0;
  }

  // ---- gesture: trackpad / wheel scroll up -------------------------------
  function onWheel(e) {
    if (phase === "hold") { pendingNudge = true; return; }
    if (phase !== "idle" && phase !== "expand") return;
    if (e.deltaY >= 0) return; // only an upward push opens it
    e.preventDefault();
    if (phase === "idle") setPhase("expand");
    dragging = true; // hold off the easing while the wheel is spinning
    expandP = clamp01(expandP + -e.deltaY / threshold());
    target = expandP;
    clearTimeout(wheelEndTimer);
    wheelEndTimer = setTimeout(function () {
      dragging = false;
      target = expandP >= COMMIT ? 1 : 0;
    }, 140);
  }

  // ---- gesture: keyboard / assistive click -----------------------------
  function openViaKey() {
    if (phase === "idle") {
      setPhase("expand");
      dragging = false;
      target = 1;
    } else if (phase === "hold") {
      pendingNudge = true;
    }
  }

  stage.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  stage.addEventListener("wheel", onWheel, { passive: false });
  orb.addEventListener("click", function () {
    // pointer events already handle the mouse; this covers synthesized clicks
    if (phase === "idle") openViaKey();
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowUp") {
      e.preventDefault();
      openViaKey();
    }
  });
  window.addEventListener("resize", function () {
    if (swirl) swirl.resize();
  });

  // No WebGL: collapse to a plain fade into the page on first open.
  if (!swirl) {
    var fellBack = false;
    var fallback = function () {
      if (fellBack) return;
      fellBack = true;
      setPhase("zoom");
      setTimeout(function () { setPhase("site"); }, 1200);
    };
    stage.addEventListener("pointerup", function () {
      if (phase === "expand") fallback();
    });
  }

  // ---- render loop -----------------------------------------------------
  function frame(now) {
    var state = {
      time: (now - startedAt) / 1000,
      zoom: 0,
      reveal: 0,
      fade: 0,
      peach: 0
    };

    if (phase === "expand") {
      if (!dragging) {
        expandP += (target - expandP) * EASE;
        if (Math.abs(expandP - target) < 0.004) {
          expandP = target;
          setPhase(target >= 1 ? "hold" : "idle");
        }
      }
      state.reveal = expandP; // linear: the edge stays glued to your finger

      orb.style.opacity = String(1 - clamp01(expandP / 0.32));
      orb.style.transform =
        "translate(-50%, -50%) scale(" + (1 + expandP * 1.7).toFixed(3) + ")";
      pulse.style.opacity = String(1 - clamp01(expandP * 5));

      var pv = clamp01((expandP - 0.6) / 0.4);
      phrase.style.opacity = String(pv);
      phrase.style.transform =
        "translate(-50%, -50%) scale(" + (0.96 + 0.04 * pv).toFixed(3) + ")";
    } else if (phase === "hold") {
      state.reveal = 1;
      phrase.style.opacity = "1";
      phrase.style.transform = "translate(-50%, -50%) scale(1)";
      if (pendingNudge || (now - phaseStart) / T.hold >= 1) {
        pendingNudge = false;
        setPhase("zoom");
      }
    } else if (phase === "zoom") {
      var zp = clamp01((now - phaseStart) / T.zoom);
      state.reveal = 1;
      state.zoom = easeIn(zp);
      state.fade = easeInOut(clamp01((zp - 0.35) / 0.65));
      state.peach = easeInOut(clamp01((zp - 0.45) / 0.55));

      var s = 1 + state.zoom * 5.5;
      canvas.style.transform = "scale(" + s.toFixed(3) + ")";
      canvas.style.filter = "blur(" + (state.zoom * 10).toFixed(2) + "px)";
      phrase.style.opacity = String(1 - easeIn(zp));
      phrase.style.transform =
        "translate(-50%, -50%) scale(" + (1 + state.zoom * 5).toFixed(3) + ")";

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
