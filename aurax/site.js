/* AURAX — scroll-cinematic experience. Requires gsap + ScrollTrigger + THREE on window. */
(function () {
  const ASSET = window.AURAX_ASSET_BASE || '/aurax';
  const FRAMES = window.AURAX_FRAMES || 96;
  const SEQ = { a: 'orbit', b: 'drive', c: 'detail' };
  const PALETTE = ['#2f7bff', '#7c3aed', '#ff2fb3', '#ff6a1a', '#22d3ee', '#10b981'];
  const VERSIONS = [
    { id: 'aurora', name: 'Aurora', tone: 'Electric blue · Deep violet', c: '#4f6bff', img: 'v-aurora.jpg' },
    { id: 'ember', name: 'Ember', tone: 'Molten orange · Liquid magenta', c: '#ff4d6d', img: 'v-ember.jpg', video: 'v-ember.mp4' },
    { id: 'lagoon', name: 'Lagoon', tone: 'Neon cyan · Emerald', c: '#18c8b8', img: 'v-lagoon.jpg' },
    { id: 'chrome', name: 'Chrome', tone: 'Liquid silver · Prism', c: '#c9ced8', img: 'v-chrome.jpg' },
  ];

  const HTML = `
  <div class="ax-loader" id="axLoader">
    <div>
      <div class="mark">AURAX · Concept One</div>
      <div class="word chrome" data-text="Coming Soon">Coming Soon</div>
      <div class="bar"><i id="axBar"></i></div>
      <div class="pct" id="axPct">Loading 0%</div>
    </div>
  </div>
  <canvas id="ax-three"></canvas>
  <div class="ax-grain"></div>
  <div class="ax-progress" id="axProgress"></div>

  <nav class="ax-nav">
    <a href="#top" class="logo">Aurax<small>Concept One</small></a>
    <div class="menu"><a href="#design">Design</a><a href="#performance">Performance</a><a href="#technology">Technology</a><a href="#spectrum">Spectrum</a><a href="#specs">Specs</a></div>
    <a href="#reserve" class="pill">Coming Soon</a>
  </nav>

  <!-- 1. HERO -->
  <section class="ax-film" id="top" data-seq="a">
    <div class="stick">
      <canvas class="seq"></canvas>
      <div class="veil"></div>
      <div class="copy">
        <div>
          <div class="k rv">A new luxury performance marque</div>
          <h1 class="chrome" data-text="Coming Soon">Coming Soon</h1>
          <div class="sub rv">The first hypercar finished in living iridescent light. Scroll to walk around it.</div>
        </div>
        <div class="scroll">Scroll</div>
      </div>
      <div class="cap l" data-at="0.55"><div class="k">01 · Silhouette</div><h2>One unbroken line.</h2><p>From the light blade to the diffuser, the body is a single sculpted surface with no seams to interrupt the light.</p></div>
      <div class="cap r" data-at="0.85"><div class="k">02 · Presence</div><h2>Recognisable at a glance.</h2><p>Paint that shifts through six colours as you move. No badge required.</p></div>
    </div>
  </section>

  <!-- 2. DESIGN PHILOSOPHY -->
  <section class="ax-sec ax-band" id="design">
    <div class="ax-wrap">
      <div class="ax-split">
        <div>
          <div class="ax-k rv">Design philosophy</div>
          <h2 class="ax-h rv">Sculpted by <span class="irid">light</span>, not lines.</h2>
        </div>
        <p class="ax-p rv">We began with a single question: what if a car's colour was never fixed? Concept One answers with a multi-layer interference paint that refracts electric blue, deep violet, molten orange, neon cyan, emerald and liquid magenta depending on where you stand and where the light falls. Every angle is a new car.</p>
      </div>
      <div class="ax-grid">
        <div class="glass rv"><div class="n">01</div><h3>Interference paint</h3><p>Seven nano-layers of ceramic pigment refract light like a soap film, so the hue changes with the viewing angle rather than the paint.</p></div>
        <div class="glass rv"><div class="n">02</div><h3>Light blade</h3><p>A single full-width LED blade replaces headlamps, grille and badge. It is the only straight line on the car.</p></div>
        <div class="glass rv"><div class="n">03</div><h3>Monocoque cabin</h3><p>Carbon tub, glass canopy, two seats. Nothing that does not make the car faster or more beautiful.</p></div>
      </div>
    </div>
  </section>

  <!-- 3. AERO & PERFORMANCE -->
  <section class="ax-film" id="performance" data-seq="b">
    <div class="stick">
      <canvas class="seq"></canvas>
      <div class="veil"></div>
      <div class="cap tl" data-at="0.12"><div class="k">Aerodynamics &amp; performance</div><h2>Shaped by the wind.</h2><p>Active aero surfaces, a full underbody diffuser and channelled air through the doors deliver downforce without a single wing.</p></div>
      <div class="hud r" data-at="0.45">
        <div><b>1,240</b><span>Horsepower</span></div>
        <div><b>1.9<small>s</small></b><span>0–60 mph</span></div>
        <div><b>0.21</b><span>Drag coefficient</span></div>
      </div>
      <div class="cap l" data-at="0.8"><div class="k">Quad-motor torque vectoring</div><h2>Every wheel thinks.</h2><p>Four independent motors adjust torque 1,000 times per second so the car rotates around you, not the other way round.</p></div>
    </div>
  </section>

  <!-- 4. INTELLIGENT TECHNOLOGY -->
  <section class="ax-sec" id="technology">
    <div class="ax-wrap">
      <div class="ax-k rv">Intelligent technology</div>
      <h2 class="ax-h rv">Quietly <span class="irid">brilliant</span>.</h2>
      <p class="ax-p rv">The technology stays out of sight until it matters. A cabin with no screens to distract you, an assistant that understands intent, and a battery that charges in the time it takes to order coffee.</p>
      <div class="ax-grid">
        <div class="glass rv"><div class="big irid">12 min</div><h3>10 to 80 percent</h3><p>Immersion-cooled 900 V architecture accepts 500 kW charging without throttling.</p></div>
        <div class="glass rv"><div class="big irid">0 screens</div><h3>Canopy display</h3><p>Navigation and telemetry are projected onto the glass canopy itself, aligned to the road ahead.</p></div>
        <div class="glass rv"><div class="big irid">Level 3</div><h3>Aurax Pilot</h3><p>Lidar, radar and 14 cameras let the car drive the boring parts so you can drive the rest.</p></div>
      </div>
    </div>
  </section>

  <!-- 5. DRIVING EXPERIENCE -->
  <section class="ax-film" id="drive" data-seq="c">
    <div class="stick">
      <canvas class="seq"></canvas>
      <div class="veil"></div>
      <div class="cap tr" data-at="0.1"><div class="k">Driving experience</div><h2>Closer than you have ever sat to the road.</h2><p>A seating position 30 cm lower than a conventional supercar, steering with 2.1 turns lock to lock, and a chassis that weighs less than a tonne.</p></div>
      <div class="hud" data-at="0.5">
        <div><b>3</b><span>Drive modes: Glide · Pulse · Storm</span></div>
        <div><b>420</b><span>Miles of range</span></div>
        <div><b>217</b><span>mph limited</span></div>
      </div>
      <div class="cap r" data-at="0.82"><div class="k">The reveal</div><h2>Every arrival is an event.</h2><p>Energy particles trace the airflow along the body as the paint shifts through the spectrum under any light.</p></div>
    </div>
  </section>

  <!-- 6. COLOR SPECTRUM -->
  <section class="ax-sec ax-spec" id="spectrum">
    <div class="ax-wrap">
      <div class="ax-split">
        <div><div class="ax-k rv">Colour spectrum</div><h2 class="ax-h rv">Four <span class="irid">living</span> finishes.</h2></div>
        <p class="ax-p rv">Each finish is tuned to a different band of the spectrum. Hover or tap a swatch to change the light.</p>
      </div>
      <div class="spec-stage rv" id="specStage">
        ${VERSIONS.map((v, i) => v.video
          ? `<video src="${ASSET}/img/${v.video}" poster="${ASSET}/img/${v.img}" class="${i ? '' : 'on'}" data-v="${v.id}" muted loop playsinline preload="none"></video>`
          : `<img src="${ASSET}/img/${v.img}" alt="Aurax Concept One in ${v.name}" class="${i ? '' : 'on'}" data-v="${v.id}" loading="lazy">`).join('')}
        <div class="glow" id="specGlow" style="--c:${VERSIONS[0].c}"></div>
        <div class="lbl"><b id="specName">${VERSIONS[0].name}</b><span id="specTone">${VERSIONS[0].tone}</span></div>
      </div>
      <div class="swatches rv" id="swatches">
        ${VERSIONS.map((v, i) => `<button class="swatch ${i ? '' : 'on'}" data-v="${v.id}" style="--c:${v.c}"><i></i>${v.name}</button>`).join('')}
      </div>
    </div>
  </section>

  <!-- 7. SPECIFICATIONS -->
  <section class="ax-sec" id="specs">
    <div class="ax-wrap">
      <div class="ax-k rv">Specifications</div>
      <h2 class="ax-h rv">Concept One.</h2>
      <div class="specs">
        <div class="rv"><span>Powertrain</span><b>Quad-motor electric</b></div>
        <div class="rv"><span>Output</span><b>1,240 hp · 1,800 Nm</b></div>
        <div class="rv"><span>0–60 mph</span><b>1.9 s</b></div>
        <div class="rv"><span>Top speed</span><b>217 mph</b></div>
        <div class="rv"><span>Battery</span><b>120 kWh · 900 V</b></div>
        <div class="rv"><span>Range</span><b>420 mi</b></div>
        <div class="rv"><span>Weight</span><b>1,890 lb dry</b></div>
        <div class="rv"><span>Drag coefficient</span><b>0.21</b></div>
        <div class="rv"><span>Chassis</span><b>Carbon monocoque</b></div>
        <div class="rv"><span>Production</span><b>99 units</b></div>
      </div>
    </div>
  </section>

  <!-- 8. CTA -->
  <section class="ax-sec ax-band ax-cta" id="reserve">
    <div class="ax-wrap">
      <div class="ax-k rv">Be first</div>
      <h2 class="ax-h chrome rv" data-text="Coming Soon">Coming Soon</h2>
      <p class="ax-p rv" style="margin-left:auto;margin-right:auto">Ninety-nine cars. Register now for early allocation and the world premiere invitation.</p>
      <form id="axForm" class="rv"><input type="email" placeholder="Your email" required aria-label="Email"><button type="submit">Register interest</button></form>
      <div class="ok" id="axOk">You are on the list. Watch your inbox.</div>
    </div>
  </section>
  <footer class="ax-foot"><span>© ${new Date().getFullYear()} Aurax Automotive</span><span>Concept One · Coming Soon</span></footer>`;

  const root = document.getElementById('aurax-root');
  root.innerHTML = HTML;

  /* ---------- helpers ---------- */
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const pad = (n) => String(n).padStart(4, '0');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- frame sequences ---------- */
  const sequences = {};
  function loadSequence(key, onProgress) {
    if (sequences[key]) return sequences[key].promise;
    const imgs = new Array(FRAMES);
    let loaded = 0;
    const promise = new Promise((resolve) => {
      for (let i = 0; i < FRAMES; i++) {
        const im = new Image();
        im.decoding = 'async';
        im.onload = im.onerror = () => { loaded++; onProgress && onProgress(loaded / FRAMES); if (loaded === FRAMES) resolve(imgs); };
        im.src = `${ASSET}/frames/${SEQ[key]}/${pad(i + 1)}.jpg`;
        imgs[i] = im;
      }
    });
    sequences[key] = { imgs, promise, ready: false };
    promise.then(() => { sequences[key].ready = true; });
    return promise;
  }

  function fitCanvas(c) {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
  }
  function drawFrame(c, img) {
    if (!img || !img.naturalWidth) return;
    fitCanvas(c);
    const ctx = c.getContext('2d');
    const cw = c.width, ch = c.height, iw = img.naturalWidth, ih = img.naturalHeight;
    const s = Math.max(cw / iw, ch / ih);
    const dw = iw * s, dh = ih * s;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  /* ---------- three.js particle field ---------- */
  let three = null;
  function initThree() {
    if (!window.THREE || reduced) return;
    const canvas = $('#ax-three');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 8;
    const N = window.innerWidth < 900 ? 900 : 2200;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), seed = new Float32Array(N);
    const tmp = new THREE.Color();
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24; pos[i * 3 + 1] = (Math.random() - 0.5) * 14; pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      tmp.set(PALETTE[i % PALETTE.length]); col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b; seed[i] = Math.random() * 100;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
      uniforms: { uTime: { value: 0 }, uVel: { value: 0 }, uMouse: { value: new THREE.Vector2(0, 0) }, uDpr: { value: renderer.getPixelRatio() } },
      vertexShader: `attribute float seed; varying vec3 vC; varying float vA; uniform float uTime,uVel,uDpr; uniform vec2 uMouse;
        void main(){ vC=color; vec3 p=position; float t=uTime*0.15+seed;
        p.x+=sin(t*0.7+seed)*0.6+uVel*1.8*sin(seed); p.y+=cos(t*0.5+seed*1.3)*0.5-uVel*0.6; p.z+=sin(t*0.3)*0.4;
        p.x+=uMouse.x*0.8; p.y+=uMouse.y*0.5;
        vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv;
        float s=(1.2+fract(seed)*2.2)*(1.0+uVel*2.0); gl_PointSize=s*uDpr*(12.0/-mv.z);
        vA=0.35+0.45*sin(t*2.0+seed)+uVel*0.6; }`,
      fragmentShader: `varying vec3 vC; varying float vA; void main(){ vec2 d=gl_PointCoord-0.5; float r=dot(d,d); if(r>0.25) discard; float a=smoothstep(0.25,0.0,r)*vA; gl_FragColor=vec4(vC,a); }`,
    });
    scene.add(new THREE.Points(geo, mat));
    const mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (e) => { mouse.set((e.clientX / innerWidth - 0.5) * 2, -(e.clientY / innerHeight - 0.5) * 2); }, { passive: true });
    function resize() { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
    window.addEventListener('resize', resize); resize();
    let vel = 0, lastY = scrollY, lastT = performance.now();
    window.addEventListener('scroll', () => { const now = performance.now(); vel = Math.min(1, Math.abs(scrollY - lastY) / Math.max(1, now - lastT) / 2.5); lastY = scrollY; lastT = now; }, { passive: true });
    let visible = true;
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
    const clock = new THREE.Clock();
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible) return;
      mat.uniforms.uTime.value = clock.getElapsedTime();
      mat.uniforms.uVel.value += (vel - mat.uniforms.uVel.value) * 0.08; vel *= 0.9;
      mat.uniforms.uMouse.value.lerp(mouse, 0.05);
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    })();
    three = { renderer };
  }

  /* ---------- scroll choreography ---------- */
  function initScroll() {
    const gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST) return;
    gsap.registerPlugin(ST);
    gsap.to('#axProgress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    $$('.ax-film').forEach((sec) => {
      const key = sec.dataset.seq, canvas = $('canvas.seq', sec);
      const state = { f: 0 };
      const render = () => { const s = sequences[key]; if (!s) return; const im = s.imgs[Math.round(state.f)]; if (im && im.complete) drawFrame(canvas, im); };
      // first frame ASAP
      loadSequence(key).then(render);
      window.addEventListener('resize', render);
      gsap.to(state, { f: FRAMES - 1, ease: 'none', onUpdate: render, scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
      // lazy-load neighbouring sequences before they are needed
      ST.create({ trigger: sec, start: 'top bottom+=60%', once: true, onEnter: () => loadSequence(key) });
      // captions timed to scroll position
      $$('[data-at]', sec).forEach((el) => {
        const at = parseFloat(el.dataset.at);
        gsap.set(el, { opacity: 0, y: 30 });
        gsap.timeline({ scrollTrigger: { trigger: sec, start: `${at * 100 - 14}% top`, end: `${at * 100 + 18}% top`, scrub: 0.4 } })
          .to(el, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }).to(el, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 0.6);
      });
      const copy = $('.copy', sec);
      if (copy) gsap.to(copy, { opacity: 0, y: -60, ease: 'none', scrollTrigger: { trigger: sec, start: '8% top', end: '32% top', scrub: 0.4 } });
    });

    $$('.rv').forEach((el) => {
      gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  /* ---------- spectrum ---------- */
  function initSpectrum() {
    const imgs = $$('#specStage img, #specStage video'), sw = $$('#swatches .swatch');
    const set = (id) => {
      const v = VERSIONS.find((x) => x.id === id);
      imgs.forEach((im) => { const on = im.dataset.v === id; im.classList.toggle('on', on); if (im.tagName === 'VIDEO') { if (on) { im.play().catch(() => {}); } else { im.pause(); } } });
      sw.forEach((b) => b.classList.toggle('on', b.dataset.v === id));
      $('#specName').textContent = v.name; $('#specTone').textContent = v.tone; $('#specGlow').style.setProperty('--c', v.c);
    };
    sw.forEach((b) => { b.addEventListener('mouseenter', () => set(b.dataset.v)); b.addEventListener('click', () => set(b.dataset.v)); });
    let i = 0; setInterval(() => { if (document.hidden) return; if (!$('#swatches:hover')) { i = (i + 1) % VERSIONS.length; set(VERSIONS[i].id); } }, 4200);
  }

  /* ---------- glass hover light ---------- */
  document.addEventListener('mousemove', (e) => {
    const g = e.target.closest && e.target.closest('.glass'); if (!g) return;
    const r = g.getBoundingClientRect(); g.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); g.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  }, { passive: true });

  /* ---------- form ---------- */
  $('#axForm').addEventListener('submit', (e) => { e.preventDefault(); e.target.reset(); $('#axOk').style.display = 'block'; });

  /* ---------- boot ---------- */
  document.body.style.overflow = 'hidden';
  const bar = $('#axBar'), pct = $('#axPct');
  loadSequence('a', (p) => { bar.style.transform = `scaleX(${p})`; pct.textContent = `Loading ${Math.round(p * 100)}%`; }).then(() => {
    initThree();
    initScroll();
    initSpectrum();
    setTimeout(() => { $('#axLoader').classList.add('done'); document.body.style.overflow = ''; window.ScrollTrigger && ScrollTrigger.refresh(); }, 400);
    // warm the next sequences in the background
    setTimeout(() => loadSequence('b').then(() => loadSequence('c')), 1500);
  });
})();
