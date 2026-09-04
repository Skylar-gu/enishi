/* enishi — the swirl
 * A single full-screen fragment shader: domain-warped value-noise fbm
 * pushed through an iq cosine palette, with a radial reveal mask and a
 * zoom-into-centre parameter. No libraries.
 */
(function (global) {
  "use strict";

  var VERT = [
    "attribute vec2 a_pos;",
    "void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }"
  ].join("\n");

  var FRAG = [
    "precision highp float;",
    "",
    "uniform vec2  u_res;",
    "uniform float u_time;",
    "uniform float u_seed;",
    "uniform float u_zoom;    // 0 = at rest, 1 = flown into the centre",
    "uniform float u_reveal;  // 0..1 radial bloom out from the centre",
    "uniform float u_fade;    // 0..1 dissolve of the whole field",
    "uniform float u_peach;   // 0..1 tint toward the page colour",
    "",
    "float hash(vec2 p) {",
    "  p = fract(p * vec2(123.34, 456.21) + u_seed);",
    "  p += dot(p, p + 45.32);",
    "  return fract(p.x * p.y);",
    "}",
    "",
    "float vnoise(vec2 p) {",
    "  vec2 i = floor(p);",
    "  vec2 f = fract(p);",
    "  float a = hash(i);",
    "  float b = hash(i + vec2(1.0, 0.0));",
    "  float c = hash(i + vec2(0.0, 1.0));",
    "  float d = hash(i + vec2(1.0, 1.0));",
    "  vec2 u = f * f * (3.0 - 2.0 * f);",
    "  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);",
    "}",
    "",
    "float fbm(vec2 p) {",
    "  float s = 0.0;",
    "  float amp = 0.5;",
    "  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);",
    "  for (int k = 0; k < 6; k++) {",
    "    s += amp * vnoise(p);",
    "    p = m * p;",
    "    amp *= 0.5;",
    "  }",
    "  return s;",
    "}",
    "",
    "vec3 palette(float t) {",
    "  vec3 a = vec3(0.62, 0.55, 0.62);",
    "  vec3 b = vec3(0.42, 0.44, 0.48);",
    "  vec3 c = vec3(1.0, 1.0, 1.0);",
    "  vec3 d = vec3(0.00, 0.28, 0.60);",
    "  return a + b * cos(6.28318530718 * (c * t + d));",
    "}",
    "",
    "void main() {",
    "  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;",
    "  float edge = length(uv) / 0.72;",           // ~1.0 at the shorter-axis edge
    "",
    "  // push into the centre as u_zoom rises",
    "  float scale = 0.45 + 0.85 * pow(u_zoom, 2.2) * 6.0;",
    "  vec2 p = uv * scale;",
    "",
    "  float t = u_time * 0.06 + u_seed * 10.0;",
    "  vec2 q = vec2(fbm(p + vec2(0.0, 0.0) + t),",
    "               fbm(p + vec2(5.2, 1.3) - t));",
    "  vec2 r = vec2(fbm(p + 3.5 * q + vec2(1.7, 9.2) + 0.15 * t),",
    "               fbm(p + 3.5 * q + vec2(8.3, 2.8) - 0.13 * t));",
    "  float f = fbm(p + 4.0 * r);",
    "",
    "  float swirlAngle = atan(uv.y, uv.x) + length(q) * 2.0 + t * 0.4;",
    "  float shade = f + 0.35 * sin(swirlAngle) + length(r) * 0.5;",
    "",
    "  vec3 col = palette(shade + t * 0.3);",
    "  col = mix(col, palette(shade * 1.7 + 0.4), 0.35);",
    "",
    "  // ethereal lift: soft bloom + a bright breath at the core",
    "  col = col * col * 1.25 + col * 0.25;",
    "  float core = 1.0 - smoothstep(0.0, 1.1, edge);",
    "  col += vec3(0.9, 0.82, 0.95) * core * 0.35 * (1.0 - u_zoom);",
    "",
    "  // radial reveal blooming out from the centre, reaching past the corners",
    "  float rad = u_reveal * 2.4;",
    "  float revealMask = 1.0 - smoothstep(rad - 0.5, rad, edge);",
    "",
    "  // ephemeral falloff at the rim + whole-field dissolve",
    "  float rim = 1.0 - smoothstep(0.6, 2.1, edge);",
    "  float alpha = revealMask * rim * (1.0 - u_fade * 0.92);",
    "",
    "  col = mix(col, vec3(0.964, 0.913, 0.866), u_peach * 0.85);",
    "",
    "  gl_FragColor = vec4(clamp(col, 0.0, 1.0), clamp(alpha, 0.0, 1.0));",
    "}"
  ].join("\n");

  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error("[enishi] shader error:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function createSwirl(canvas) {
    var gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true })
          || canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return null;

    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("[enishi] link error:", gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    var u = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      seed: gl.getUniformLocation(prog, "u_seed"),
      zoom: gl.getUniformLocation(prog, "u_zoom"),
      reveal: gl.getUniformLocation(prog, "u_reveal"),
      fade: gl.getUniformLocation(prog, "u_fade"),
      peach: gl.getUniformLocation(prog, "u_peach")
    };

    var seed = Math.random();
    gl.uniform1f(u.seed, seed);

    function resize() {
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function render(s) {
      gl.uniform2f(u.res, canvas.width, canvas.height);
      gl.uniform1f(u.time, s.time || 0);
      gl.uniform1f(u.zoom, s.zoom || 0);
      gl.uniform1f(u.reveal, s.reveal || 0);
      gl.uniform1f(u.fade, s.fade || 0);
      gl.uniform1f(u.peach, s.peach || 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    resize();
    return { resize: resize, render: render, gl: gl };
  }

  global.createSwirl = createSwirl;
})(window);
