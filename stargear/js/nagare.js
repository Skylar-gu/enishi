/* nagare: a somatic flow meditation — breath ring, fading brush trail, gentle prompts */
(function () {
  const { $, sfx, save } = SG;
  const canvas = $("#nagareCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const ring = $("#breathRing");
  const promptEl = $("#nagarePrompt");
  const cueEl = $("#breathCue");
  const timerEl = $("#nagareTimer");

  const PROMPTS = [
    "breathe in ✦ shoulders soft",
    "trace a slow spiral",
    "sway side to side, gently",
    "make your smallest gesture",
    "close your eyes for one breath",
    "let your hand wander like water",
    "draw the horizon in one line",
    "make your biggest gesture",
    "notice where you're holding",
    "one more slow breath",
  ];

  // 4 in · 2 hold · 6 out = 12s cycle
  const CYCLE = 12000, IN_END = 4000, HOLD_END = 6000;

  let running = false, raf = null, startT = 0, promptTick = 0, promptIdx = 0;
  let lastPhase = "", awarded = false;
  let drawing = false, last = null;

  function fit() {
    const wrap = canvas.parentElement;
    const rect = wrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function paint(x, y) {
    const hue = ((performance.now() / 80) % 360) | 0;
    ctx.strokeStyle = `hsla(${hue}, 85%, 78%, 0.55)`;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    if (last) { ctx.moveTo(last.x, last.y); ctx.lineTo(x, y); }
    else { ctx.moveTo(x, y); ctx.lineTo(x + 0.1, y + 0.1); }
    ctx.stroke();
    last = { x, y };
  }
  function onMove(e) {
    if (!running) return;
    if (e.pointerType !== "mouse" && !drawing) return;
    const rect = canvas.getBoundingClientRect();
    paint(e.clientX - rect.left, e.clientY - rect.top);
  }
  function onDown(e) {
    if (!running) return;
    drawing = true;
    last = null;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    onMove(e);
  }
  function onUp() { drawing = false; last = null; }

  function fadeStep() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.012)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.globalCompositeOperation = "source-over";
  }

  function loop(now) {
    if (!running) return;
    const t = now - startT;
    const p = t % CYCLE;
    let phase, scale;
    if (p < IN_END) { phase = "INHALE"; scale = 0.62 + 0.5 * (p / IN_END); }
    else if (p < HOLD_END) { phase = "HOLD"; scale = 1.12; }
    else { phase = "EXHALE"; scale = 1.12 - 0.5 * ((p - HOLD_END) / (CYCLE - HOLD_END)); }
    ring.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
    if (phase !== lastPhase) {
      lastPhase = phase;
      cueEl.textContent = phase;
      if (save.sound) {
        if (phase === "INHALE") SG.tone(392, 0.5, { type: "sine", vol: 0.025 });
        else if (phase === "EXHALE") SG.tone(294, 0.7, { type: "sine", vol: 0.025 });
      }
    }
    if (t - promptTick > 13500) {
      promptTick = t;
      promptIdx = (promptIdx + 1) % PROMPTS.length;
      promptEl.textContent = PROMPTS[promptIdx];
    }
    const s = (t / 1000) | 0;
    timerEl.textContent = `✦ session: ${(s / 60 | 0)}:${String(s % 60).padStart(2, "0")}`;
    if (!awarded && s >= 60) {
      awarded = true;
      if (SG.shard("saturn")) SG.coins(3, "one long slow breath");
    }
    fadeStep();
    raf = requestAnimationFrame(loop);
  }

  function begin() {
    if (running) return;
    running = true;
    awarded = save.shards.includes("saturn");
    startT = performance.now();
    promptTick = -13500;
    promptIdx = -1;
    lastPhase = "";
    fit();
    raf = requestAnimationFrame(loop);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    sfx.back();
  }
  function saveImage() {
    const link = document.createElement("a");
    link.download = "nagare-trace.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    sfx.ok();
    SG.toast("✦ trace saved");
  }

  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("pointerleave", onUp);
  $("#nagareClear").addEventListener("click", clearCanvas);
  $("#nagareSave").addEventListener("click", saveImage);

  document.addEventListener("world:open", e => { if (e.detail.id === "nagare") begin(); });
  document.addEventListener("world:close", e => { if (e.detail.id === "nagare") stop(); });
  addEventListener("resize", () => { if (running) fit(); });
})();
