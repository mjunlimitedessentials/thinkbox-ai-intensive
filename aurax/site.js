/* NEW TO ME AUTO — scroll-cinematic experience. Requires gsap + ScrollTrigger + THREE on window. */
(function () {
  const ASSET = window.AURAX_ASSET_BASE || '/aurax';
  const FRAMES = window.AURAX_FRAMES || 96;
  const SEQ = { a: 'orbit', b: 'drive', c: 'detail' };
  const PALETTE = ['#2f7bff', '#7c3aed', '#ff2fb3', '#ff6a1a', '#22d3ee', '#10b981'];
  const VERSIONS = [
    { id: 'mercedes', name: 'Mercedes-Benz S-Class', tone: 'Obsidian black · Executive sedan', c: '#4f6bff', img: 'v-mercedes.jpg' },
    { id: 'cadillac', name: 'Cadillac Escalade', tone: 'Black Raven · Full-size luxury SUV', c: '#ff4d6d', img: 'v-cadillac.jpg' },
    { id: 'buick', name: 'Buick Enclave', tone: 'White Frost · Three-row SUV', c: '#18c8b8', img: 'v-buick.jpg' },
    { id: 'toyota', name: 'Toyota Tacoma TRD', tone: 'Blue Crush · Off-road pickup', c: '#2f7bff', img: 'v-toyota.jpg' },
  ];

  const HTML = `
  <div class="ax-loader" id="axLoader">
    <div>
      <div class="mark">New To Me Auto · The Collection</div>
      <div class="word chrome" data-text="Coming Soon">Coming Soon</div>
      <div class="bar"><i id="axBar"></i></div>
      <div class="pct" id="axPct">Loading 0%</div>
    </div>
  </div>
  <canvas id="ax-three"></canvas>
  <div class="ax-grain"></div>
  <div class="ax-progress" id="axProgress"></div>

  <nav class="ax-nav">
    <a href="#top" class="logo">New To Me<small>Auto · The Collection</small></a>
    <div class="menu"><a href="#design">About</a><a href="#performance">Sourcing</a><a href="#technology">Process</a><a href="#spectrum">Collection</a><a href="#partners">Partners</a></div>
    <a href="#reserve" class="pill">Coming Soon</a>
  </nav>

  <!-- 1. HERO -->
  <section class="ax-film" id="top" data-seq="a">
    <div class="stick">
      <canvas class="seq"></canvas>
      <div class="veil"></div>
      <div class="copy">
        <div>
          <div class="k rv">New To Me Auto · Your connection to the wholesale automotive market</div>
          <h1 class="chrome" data-text="Coming Soon">Coming Soon</h1>
          <div class="sub rv">From dealer auctions to your driveway. Scroll to see what access looks like.</div>
        </div>
        <div class="scroll">Scroll</div>
      </div>
      <div class="cap l" data-at="0.55"><div class="k">01 · Access</div><h2>Inventory that never reaches the lot.</h2><p>We source from dealer trades, off-lease returns, excess and aging inventory, fleet opportunities and licensed wholesale auctions.</p></div>
      <div class="cap r" data-at="0.85"><div class="k">02 · Opportunity</div><h2>The right vehicle, the right channel.</h2><p>Every car in the Collection was identified through the wholesale marketplace at the right opportunity.</p></div>
    </div>
  </section>

  <!-- 2. DESIGN PHILOSOPHY -->
  <section class="ax-sec ax-band" id="design">
    <div class="ax-wrap">
      <div class="ax-split">
        <div>
          <div class="ax-k rv">Who we are</div>
          <h2 class="ax-h rv">From dealer auctions to <span class="irid">your driveway</span>.</h2>
        </div>
        <p class="ax-p rv">New To Me Auto is a wholesale automotive dealership focused on connecting quality pre-owned vehicles with buyers through a trusted network of established dealerships, licensed dealer-auction channels and automotive industry partners. Rather than relying on traditional retail inventory alone, we strategically source vehicles across the wholesale marketplace, which gives us access to inventory that may never reach a traditional dealership lot.</p>
      </div>
      <div class="ax-grid">
        <div class="glass rv"><div class="n">01 · Access</div><h3>A broader marketplace</h3><p>New- and used-car dealerships, dealer trades, excess and aging inventory, off-lease vehicles, fleet opportunities and licensed wholesale automotive auctions.</p></div>
        <div class="glass rv"><div class="n">02 · Relationships</div><h3>A trusted network</h3><p>Established dealerships, auction resources and automotive professionals we work with every week. The wholesale industry moves through relationships, market knowledge, timing and access.</p></div>
        <div class="glass rv"><div class="n">03 · Opportunity</div><h3>The right vehicle, through the right channel</h3><p>Whether it begins with a dealership trade, an off-lease return, excess dealer inventory or a vehicle crossing the auction block, the goal is the same.</p></div>
      </div>
    </div>
  </section>

  <!-- 3. AERO & PERFORMANCE -->
  <section class="ax-film" id="performance" data-seq="b">
    <div class="stick">
      <canvas class="seq"></canvas>
      <div class="veil"></div>
      <div class="cap tl" data-at="0.12"><div class="k">Sourcing in motion</div><h2>More than buying and selling.</h2><p>Behind every vehicle is a sourcing process. Our team navigates the wholesale marketplace to identify available inventory, evaluate purchasing opportunities and build relationships with dealers and industry partners.</p></div>
      <div class="hud r" data-at="0.45">
        <div><b>Trades</b><span>Dealer to dealer</span></div>
        <div><b>Off-lease</b><span>Returns &amp; fleet</span></div>
        <div><b>Auctions</b><span>Licensed wholesale</span></div>
      </div>
      <div class="cap l" data-at="0.8"><div class="k">The bridge</div><h2>Dealer marketplace to your driveway.</h2><p>By working within established wholesale channels we create a bridge between the automotive dealer marketplace and customers seeking greater access to quality pre-owned vehicles.</p></div>
    </div>
  </section>

  <!-- 4. INTELLIGENT TECHNOLOGY -->
  <section class="ax-sec" id="technology">
    <div class="ax-wrap">
      <div class="ax-k rv">Built on relationships. Driven by opportunity.</div>
      <h2 class="ax-h rv">Positioned for <span class="irid">growth</span>.</h2>
      <p class="ax-p rv">As buying habits and the automotive marketplace evolve, wholesale vehicle sourcing presents significant opportunity for expansion. Our vision extends beyond individual transactions: we are building a scalable sourcing operation supported by dealership relationships, wholesale market access, technology, efficient inventory acquisition and strategic partnerships.</p>
      <div class="ax-grid">
        <div class="glass rv"><div class="big irid">Network</div><h3>Dealership partners</h3><p>We continue to expand our network of dealership partners, auction resources and purchasing channels to strengthen our ability to source diverse inventory.</p></div>
        <div class="glass rv"><div class="big irid">Value</div><h3>Across the ecosystem</h3><p>Our model helps dealerships move inventory while creating additional opportunities for vehicles to reach their next destination.</p></div>
        <div class="glass rv"><div class="big irid">Scale</div><h3>Technology and access</h3><p>Efficient acquisition, market knowledge and timing, so opportunities are identified and acted on quickly.</p></div>
      </div>
    </div>
  </section>

  <!-- 5. DRIVING EXPERIENCE -->
  <section class="ax-film" id="drive" data-seq="c">
    <div class="stick">
      <canvas class="seq"></canvas>
      <div class="veil"></div>
      <div class="cap tr" data-at="0.1"><div class="k">For customers</div><h2>Greater access. More possibilities.</h2><p>Vehicles sourced across the wholesale marketplace, inspected and presented like the day they left the studio.</p></div>
      <div class="hud" data-at="0.5">
        <div><b>Sedans</b><span>Executive &amp; luxury</span></div>
        <div><b>SUVs</b><span>Full-size &amp; three-row</span></div>
        <div><b>Trucks</b><span>Performance &amp; off-road</span></div>
      </div>
      <div class="cap r" data-at="0.82"><div class="k">The reveal</div><h2>Every arrival is an event.</h2><p>From the auction lane to the open road. This is what showing up looks like.</p></div>
    </div>
  </section>

  <!-- 6. COLOR SPECTRUM -->
  <section class="ax-sec ax-spec" id="spectrum">
    <div class="ax-wrap">
      <div class="ax-split">
        <div><div class="ax-k rv">The Collection</div><h2 class="ax-h rv">Four <span class="irid">icons</span>, one lot.</h2></div>
        <p class="ax-p rv">A preview of the kind of inventory we source. Hover or tap a name to switch.</p>
      </div>
      <div class="spec-stage rv" id="specStage">
        ${VERSIONS.map((v, i) => v.video
          ? `<video src="${ASSET}/img/${v.video}" poster="${ASSET}/img/${v.img}" class="${i ? '' : 'on'}" data-v="${v.id}" muted loop playsinline preload="none"></video>`
          : `<img src="${ASSET}/img/${v.img}" alt="${v.name}" class="${i ? '' : 'on'}" data-v="${v.id}" loading="lazy">`).join('')}
        <div class="glow" id="specGlow" style="--c:${VERSIONS[0].c}"></div>
        <div class="lbl"><b id="specName">${VERSIONS[0].name}</b><span id="specTone">${VERSIONS[0].tone}</span></div>
      </div>
      <div class="swatches rv" id="swatches">
        ${VERSIONS.map((v, i) => `<button class="swatch ${i ? '' : 'on'}" data-v="${v.id}" style="--c:${v.c}"><i></i>${v.name}</button>`).join('')}
      </div>
    </div>
  </section>

  <!-- 6b. WHO WE SERVE -->
  <section class="ax-sec ax-band" id="partners">
    <div class="ax-wrap">
      <div class="ax-k rv">Who we serve</div>
      <h2 class="ax-h rv">Value across the <span class="irid">ecosystem</span>.</h2>
      <div class="ax-grid">
        <div class="glass rv"><div class="n">Customers</div><h3>Greater access and more possibilities</h3><p>Quality pre-owned vehicles identified through channels a traditional retail lot never sees.</p></div>
        <div class="glass rv"><div class="n">Dealership partners</div><h3>Another reliable channel for moving inventory</h3><p>Trades, aging stock and off-lease returns find their next destination through our network.</p></div>
        <div class="glass rv"><div class="n">Strategic partners &amp; investors</div><h3>A model built for the moving marketplace</h3><p>Participation in a scalable sourcing operation positioned within the continually moving pre-owned automotive market. <a href="mailto:info@NewToMeAuto.com">info@NewToMeAuto.com</a></p></div>
      </div>
    </div>
  </section>

  <!-- 7. SPECIFICATIONS -->
  <section class="ax-sec" id="specs">
    <div class="ax-wrap">
      <div class="ax-k rv">Sourcing at a glance</div>
      <h2 class="ax-h rv">How we source.</h2>
      <div class="specs">
        <div class="rv"><span>Channel</span><b>Dealer trades</b></div>
        <div class="rv"><span>Channel</span><b>Off-lease vehicles</b></div>
        <div class="rv"><span>Channel</span><b>Excess &amp; aging inventory</b></div>
        <div class="rv"><span>Channel</span><b>Fleet opportunities</b></div>
        <div class="rv"><span>Channel</span><b>Licensed wholesale auctions</b></div>
        <div class="rv"><span>Network</span><b>Dealerships &amp; industry partners</b></div>
        <div class="rv"><span>Inspection</span><b>150-point check</b></div>
        <div class="rv"><span>History</span><b>Full report included</b></div>
        <div class="rv"><span>Based in</span><b>Connecticut, USA</b></div>
        <div class="rv"><span>Status</span><b>Opening soon</b></div>
      </div>
    </div>
  </section>

  <!-- 8. CTA -->
  <section class="ax-sec ax-band ax-cta" id="reserve">
    <div class="ax-wrap">
      <div class="ax-k rv">From the auction lane to the open road</div>
      <h2 class="ax-h chrome rv" data-text="Coming Soon">Coming Soon</h2>
      <p class="ax-p rv" style="margin-left:auto;margin-right:auto">Your connection to the wholesale automotive market. Register now for first access to the Collection and an invitation to the opening.</p>
      <form id="axForm" class="rv"><input type="email" placeholder="Your email" required aria-label="Email"><button type="submit">Register interest</button></form>
      <div class="ok" id="axOk">Thank you. Your registration has been sent to info@NewToMeAuto.com.</div>
      <p class="ax-contact rv">Questions? Email <a href="mailto:info@NewToMeAuto.com">info@NewToMeAuto.com</a></p>
    </div>
  </section>
  <footer class="ax-foot">
    <span>© ${new Date().getFullYear()} New To Me Auto. All rights reserved. · <a href="mailto:info@NewToMeAuto.com">info@NewToMeAuto.com</a></span>
    <span class="legal"><a href="#" data-legal="terms">Terms of Service</a> · <a href="#" data-legal="privacy">Privacy Policy</a> · From Dealer Auctions to Your Driveway</span>
  </footer>
  <div class="ax-modal" id="axModal" role="dialog" aria-modal="true" aria-labelledby="axModalTitle">
    <div class="bg" data-close></div>
    <div class="box">
      <button class="x" data-close aria-label="Close">✕</button>
      <h3 id="axModalTitle"></h3>
      <div class="body" id="axModalBody"></div>
    </div>
  </div>`;

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


  const LEGAL = {
    terms: { title: 'Terms of Service', html: `
      <p><em>Last updated: ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long'})}</em></p>
      <h4>1. Acceptance</h4><p>By accessing this website you agree to these Terms of Service and to our Privacy Policy. If you do not agree, please do not use the site.</p>
      <h4>2. Pre-launch information</h4><p>New To Me Auto is preparing to open. Vehicles, specifications, pricing and availability shown on this site are illustrative previews and may change or be withdrawn without notice. Nothing on this site is an offer to sell a specific vehicle.</p>
      <h4>3. Registration of interest</h4><p>Submitting your email registers your interest only. It does not reserve a vehicle, create a contract, or guarantee allocation, pricing or an invitation.</p>
      <h4>4. Vehicle information</h4><p>Manufacturer specifications, performance figures and imagery are provided for general information. Confirm details of any specific vehicle with New To Me Auto before purchase. All vehicles are sold subject to a written purchase agreement.</p>
      <h4>5. Intellectual property</h4><p>Site design, text, imagery and video are owned by or licensed to New To Me Auto. Vehicle names and logos are trademarks of their respective manufacturers and are used for identification only. New To Me Auto is an independent dealership and is not affiliated with any manufacturer.</p>
      <h4>6. Acceptable use</h4><p>You agree not to misuse the site, attempt to gain unauthorised access, scrape content, or interfere with its operation.</p>
      <h4>7. Disclaimer and limitation of liability</h4><p>The site is provided "as is" without warranties of any kind. To the fullest extent permitted by law, New To Me Auto is not liable for any indirect, incidental or consequential loss arising from use of the site.</p>
      <h4>8. Changes and governing law</h4><p>We may update these terms at any time by posting a revised version here. These terms are governed by the laws of the State of Connecticut, and any dispute is subject to the exclusive jurisdiction of the state and federal courts located in Connecticut.</p>
      <h4>9. Contact</h4><p>Questions about these terms: <a href="mailto:info@NewToMeAuto.com">info@NewToMeAuto.com</a>.</p>` },
    privacy: { title: 'Privacy Policy', html: `
      <p><em>Last updated: ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long'})}</em></p>
      <h4>1. What we collect</h4><p>When you register interest we collect your email address and the date and time of your submission. We also collect standard technical information such as IP address, browser type and pages viewed, through server logs and, where enabled, analytics cookies.</p>
      <h4>2. How we use it</h4><p>To notify you when New To Me Auto opens, send you an invitation and occasional updates about the Collection, respond to enquiries, and keep the site secure and working properly. We do not sell your personal information.</p>
      <h4>3. Sharing</h4><p>We share data only with service providers that help us run the site and send email (for example hosting and email delivery providers), and where required by law. Providers may process data only on our instructions.</p>
      <h4>4. Cookies</h4><p>The site uses essential cookies and local storage for basic functionality. Optional analytics cookies, if used, can be blocked in your browser settings without affecting the site.</p>
      <h4>5. Retention</h4><p>We keep registration details until you unsubscribe or ask us to delete them, and technical logs for no longer than 12 months.</p>
      <h4>6. Your choices and rights</h4><p>Every email includes an unsubscribe link. You may ask us to access, correct or delete your information at any time by emailing <a href="mailto:info@NewToMeAuto.com">info@NewToMeAuto.com</a>. California residents have additional rights under the CCPA, including the right to know and delete, which we honour on request.</p>
      <h4>7. Children</h4><p>The site is not directed at children under 16 and we do not knowingly collect their information.</p>
      <h4>8. Security</h4><p>We use reasonable technical and organisational measures to protect your data, including encrypted connections (HTTPS).</p>
      <h4>9. Changes and contact</h4><p>We will post any changes to this policy here. Contact New To Me Auto at <a href="mailto:info@NewToMeAuto.com">info@NewToMeAuto.com</a>.</p>` },
  };
  const modal = $('#axModal');
  const openLegal = (k) => { const l = LEGAL[k]; if (!l) return; $('#axModalTitle').textContent = l.title; $('#axModalBody').innerHTML = l.html; modal.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeLegal = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
  document.addEventListener('click', (e) => { const a = e.target.closest('[data-legal]'); if (a) { e.preventDefault(); openLegal(a.dataset.legal); return; } if (e.target.closest('[data-close]')) closeLegal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLegal(); });

  /* ---------- form ---------- */
  $('#axForm').addEventListener('submit', (e) => { e.preventDefault(); const email = e.target.querySelector('input').value.trim(); const subject = encodeURIComponent('New To Me Auto — register my interest'); const body = encodeURIComponent(`Please register my interest in the New To Me Auto Collection.\n\nEmail: ${email}\nSent from: ${location.href}`); window.location.href = `mailto:info@NewToMeAuto.com?subject=${subject}&body=${body}`; e.target.reset(); $('#axOk').style.display = 'block'; });

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
