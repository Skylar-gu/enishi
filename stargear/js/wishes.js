/* wishes: tanabata bamboo with paper strips (tanzaku) */
(function () {
  const { $, h, sfx, save, persist } = SG;
  const NS = "http://www.w3.org/2000/svg";
  const s = (tag, attrs, parent) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); parent && parent.append(el); return el; };
  const svg = $("#tree");
  const PAPERS = ["#ff8fc7", "#c9a7ff", "#9ff5d8", "#ffe27a", "#fff6fb", "#8fd3ff"];
  const STARTERS = [
    { text: "may every gear turn smoothly", color: "#ffe27a", from: "hoshi" },
    { text: "more strawberry milk for everyone", color: "#ff8fc7", from: "hoshi" },
  ];

  // bamboo
  const stalk = (x, top, lean) => {
    s("path", { d: `M${x} 360 Q${x + lean / 2} ${top + 120} ${x + lean} ${top}`, stroke: "#5fb77a", "stroke-width": 11, fill: "none", "stroke-linecap": "round" }, svg);
    s("path", { d: `M${x} 360 Q${x + lean / 2} ${top + 120} ${x + lean} ${top}`, stroke: "#9ff5b8", "stroke-width": 3, fill: "none", "stroke-dasharray": "34 6", opacity: 0.8 }, svg);
  };
  stalk(150, 18, -6); stalk(95, 80, -20); stalk(215, 60, 18);
  const branches = [[150, 60, 60, 40], [150, 60, 250, 36], [148, 140, 40, 120], [150, 140, 270, 118], [148, 220, 60, 214], [150, 220, 250, 200]];
  const anchors = [];
  branches.forEach(([x1, y1, x2, y2]) => {
    s("path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 18} ${x2} ${y2}`, stroke: "#5fb77a", "stroke-width": 3, fill: "none" }, svg);
    for (let t = 0.3; t <= 1; t += 0.35) anchors.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t - Math.sin(t * Math.PI) * 9]);
    s("path", { d: `M${x2} ${y2} q${x2 > x1 ? 16 : -16} -10 ${x2 > x1 ? 30 : -30} 4 q${x2 > x1 ? -16 : 16} 8 ${x2 > x1 ? -30 : 30} -4z`, fill: "#7fd99a", stroke: "#2a1638", "stroke-width": 1.5 }, svg);
  });
  const stripLayer = s("g", {}, svg);

  function draw() {
    stripLayer.innerHTML = "";
    const all = [...STARTERS, ...save.wishes];
    all.slice(-anchors.length).forEach((w, i) => {
      const [x, y] = anchors[(i * 7) % anchors.length];
      const g = s("g", { class: "strip", tabindex: 0, role: "button", "aria-label": "wish: " + w.text, style: `--sway:${i * -0.37}s; transform-origin:${x}px ${y}px` }, stripLayer);
      s("line", { x1: x, y1: y, x2: x, y2: y + 8, stroke: "#fff6fb", "stroke-width": 1 }, g);
      s("rect", { x: x - 9, y: y + 8, width: 18, height: 64, fill: w.color, stroke: "#2a1638", "stroke-width": 1.5, rx: 1 }, g);
      [...w.text.replace(/\s+/g, "")].slice(0, 5).forEach((ch, j) => s("text", { x, y: y + 18 + j * 11, class: "strip-ch", "text-anchor": "middle", "dominant-baseline": "central" }, g).textContent = ch);
      const show = () => { sfx.blip(); SG.say(`"${w.text}"${w.from ? " — " + w.from : ""}`); };
      g.addEventListener("click", show);
      g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
    });
  }
  draw();

  let color = PAPERS[0];
  PAPERS.forEach((c, i) => {
    const b = h("button", { type: "button", class: "swatch" + (i ? "" : " on"), role: "radio", "aria-checked": i ? "false" : "true", "aria-label": "paper color " + (i + 1), style: `--c:${c}` });
    b.addEventListener("click", () => { color = c; SG.$$(".swatch").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); }); sfx.blip(); });
    $("#swatches").append(b);
  });

  $("#wishForm").addEventListener("submit", e => {
    e.preventDefault();
    const text = $("#wishText").value.trim();
    if (!text) return;
    save.wishes.push({ text, color }); persist();
    $("#wishText").value = "";
    draw();
    sfx.ok();
    SG.say("your wish is tied to the bamboo. the stars will read it tonight ✦");
    if (!SG.shard("venus") && save.wishes.length === 1) SG.coins(1, "first wish");
  });
})();
