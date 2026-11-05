// All client-side motion: scroll reveals, the drifting sky in the hero,
// pointer parallax, the cycling word, and small page furniture.
// Everything re-initialises on `astro:page-load` so it survives the
// soft page transitions.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let cleanups: Array<() => void> = [];

/* ── scroll reveal ── */
function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  );
  els.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

/* ── nav hairline once the page has moved ── */
function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));
}

/* ── today's date, film-stamp style ── */
function initToday() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  document.querySelectorAll<HTMLElement>('[data-today]').forEach((el) => {
    el.textContent = stamp;
  });
}

/* ── the line under the name ── */
function initCycle() {
  const el = document.querySelector<HTMLElement>('[data-cycle]');
  if (!el || reduceMotion.matches) return;
  const words = (el.dataset.cycle ?? '').split('|').filter(Boolean);
  if (words.length < 2) return;
  let i = 0;
  let swap: number | undefined;
  const tick = window.setInterval(() => {
    el.classList.add('is-out');
    swap = window.setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('is-out');
    }, 720);
  }, 4600);
  cleanups.push(() => {
    window.clearInterval(tick);
    window.clearTimeout(swap);
  });
}

/* ── pointer parallax on the hero collage ── */
function initParallax() {
  const el = document.querySelector<HTMLElement>('[data-parallax]');
  if (!el || reduceMotion.matches || !window.matchMedia('(pointer: fine)').matches) return;
  const onMove = (e: PointerEvent) => {
    el.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3));
    el.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3));
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  cleanups.push(() => window.removeEventListener('pointermove', onMove));
}

/* ── the sky ── */
const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uSeed;
uniform vec3 uTop, uBottom, uCloud, uShade, uGlow;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
float density(vec2 q, float t) {
  vec2 warp = vec2(fbm(q * 1.3 + vec2(0.0, t * 1.4)), fbm(q * 1.3 + vec2(5.2, 1.3 - t)));
  return fbm(q + warp * 1.15);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime * 0.018;
  vec2 q = p * 1.55 + vec2(t + uSeed, t * 0.3 + uSeed * 0.37);

  float d = density(q, t);
  float cover = smoothstep(0.38, 0.68, d);

  // light comes from the upper left: compare density a step towards it
  float towards = density(q + vec2(-0.11, 0.15), t);
  float lit = clamp((d - towards) * 3.2 + 0.55, 0.0, 1.0);

  vec3 sky = mix(uBottom, uTop, smoothstep(0.0, 1.0, uv.y));
  vec3 cloud = mix(uShade, uCloud, lit);
  cloud += uGlow * pow(lit, 3.0) * 0.4;
  vec3 col = mix(sky, cloud, cover);

  // film grain
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) * 0.07;
  gl_FragColor = vec4(col, 1.0);
}`;

type Palette = Record<'top' | 'bottom' | 'cloud' | 'shade' | 'glow', string>;

const PALETTES: Record<string, Palette> = {
  day: { top: '#5a7b9d', bottom: '#a9bccb', cloud: '#f5efe3', shade: '#8f9aa8', glow: '#f2b25e' },
  dusk: { top: '#4f6387', bottom: '#cfa78d', cloud: '#f7dcb4', shade: '#6d7187', glow: '#f59a4a' },
};

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function initSky(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return; // the CSS gradient behind the canvas stays visible

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    canvas.style.display = 'none';
    return;
  }
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const palette = PALETTES[canvas.dataset.sky ?? 'day'] ?? PALETTES.day;
  gl.uniform3fv(u('uTop'), rgb(palette.top));
  gl.uniform3fv(u('uBottom'), rgb(palette.bottom));
  gl.uniform3fv(u('uCloud'), rgb(palette.cloud));
  gl.uniform3fv(u('uShade'), rgb(palette.shade));
  gl.uniform3fv(u('uGlow'), rgb(palette.glow));
  gl.uniform1f(u('uSeed'), canvas.dataset.sky === 'dusk' ? 7.3 : 0);
  const uRes = u('uRes');
  const uTime = u('uTime');

  // Clouds are soft, so render below native resolution: cheaper, and the
  // upscaled grain reads as film.
  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.5;
    const w = Math.max(2, Math.round(canvas.clientWidth * scale));
    const h = Math.max(2, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  };

  const start = performance.now();
  const draw = (now: number) => {
    gl.uniform1f(uTime, (now - start) / 1000 + 40);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  resize();
  draw(start);

  const ro = new ResizeObserver(() => {
    resize();
    draw(performance.now());
  });
  ro.observe(canvas);

  let raf = 0;
  let visible = true;
  let last = 0;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden || now - last < 33) return; // ~30fps
    last = now;
    draw(now);
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(canvas);
  if (!reduceMotion.matches) raf = requestAnimationFrame(loop);

  cleanups.push(() => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  });
}

/* ── lifecycle ── */
function init() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  initReveal();
  initNav();
  initToday();
  initCycle();
  initParallax();
  document.querySelectorAll<HTMLCanvasElement>('canvas[data-sky]').forEach(initSky);
}

document.addEventListener('astro:page-load', init);
