/* ================================================
   KAIROS CREATIVE — 3D PRODUCT VIEWER
   Uses Three.js r128 via CDN
   ================================================ */

const Viewer3D = (() => {

  let scene, camera, renderer, object, animFrame;
  let isMouseDown = false;
  let prevMouse = { x: 0, y: 0 };
  let autoRotate = true;

  const BRAND_BLUE  = 0x225378;
  const BRAND_LIGHT = 0x6cb8e0;  /* light blue accent for model highlights */
  const BRAND_GOLD  = BRAND_LIGHT; /* alias kept for compat */
  const LIGHT_BLUE  = 0x3b8fc0;

  /* ── Build placeholder geometry by shape ── */
  function buildGeometry(shape, canvas) {
    // Clear any existing object
    if (object) { scene.remove(object); object = null; }

    const group = new THREE.Group();

    if (shape === 'notebook' || shape === 'calendar') {
      // Book body
      const bodyGeo = new THREE.BoxGeometry(1.6, 2.0, 0.25);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: BRAND_BLUE,
        roughness: 0.4,
        metalness: 0.1,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      // Cover highlight strip (top edge)
      const stripGeo = new THREE.BoxGeometry(1.6, 0.04, 0.27);
      const stripMat = new THREE.MeshStandardMaterial({ color: BRAND_GOLD, roughness: 0.3, metalness: 0.4 });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.y = 1.0;
      group.add(strip);

      // Spine / binding
      const spineGeo = new THREE.BoxGeometry(0.08, 2.04, 0.3);
      const spineMat = new THREE.MeshStandardMaterial({ color: 0x0a1a2e, roughness: 0.6 });
      const spine = new THREE.Mesh(spineGeo, spineMat);
      spine.position.x = -0.84;
      group.add(spine);

      // Coil rings (simplified as tori)
      const torusMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.2, metalness: 0.9 });
      const coilCount = shape === 'calendar' ? 6 : 10;
      const startY = shape === 'calendar' ? 0.75 : 0.85;
      for (let i = 0; i < coilCount; i++) {
        const torusGeo = new THREE.TorusGeometry(0.06, 0.018, 8, 14);
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.position.set(-0.9, startY - i * (1.7 / (coilCount - 1)), 0);
        torus.rotation.y = Math.PI / 2;
        group.add(torus);
      }

      // Pages edge (right side white block)
      const pagesGeo = new THREE.BoxGeometry(0.03, 1.96, 0.2);
      const pagesMat = new THREE.MeshStandardMaterial({ color: 0xf8f5f0, roughness: 0.95 });
      const pages = new THREE.Mesh(pagesGeo, pagesMat);
      pages.position.x = 0.815;
      group.add(pages);

      // For calendar: add stand at bottom
      if (shape === 'calendar') {
        const standGeo = new THREE.BoxGeometry(1.7, 0.06, 0.5);
        const standMat = new THREE.MeshStandardMaterial({ color: 0x1a3d5c, roughness: 0.5 });
        const stand = new THREE.Mesh(standGeo, standMat);
        stand.position.y = -1.03;
        stand.position.z = 0.1;
        group.add(stand);
        group.rotation.x = -0.25; // slight tilt for calendar
      }

    } else if (shape === 'pen') {
      // Pen cylinder
      const bodyGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 20);
      const bodyMat = new THREE.MeshStandardMaterial({ color: BRAND_BLUE, roughness: 0.3, metalness: 0.3 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      // Grip section
      const gripGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.6, 20);
      const gripMat = new THREE.MeshStandardMaterial({ color: BRAND_GOLD, roughness: 0.6, metalness: 0.1 });
      const grip = new THREE.Mesh(gripGeo, gripMat);
      grip.position.y = -0.6;
      group.add(grip);

      // Cap
      const capGeo = new THREE.CylinderGeometry(0.083, 0.083, 0.5, 20);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.2, metalness: 0.5 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 1.15;
      group.add(cap);

      // Tip
      const tipGeo = new THREE.ConeGeometry(0.04, 0.3, 12);
      const tipMat = new THREE.MeshStandardMaterial({ color: 0x888, roughness: 0.3, metalness: 0.8 });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.y = -1.35;
      tip.rotation.x = Math.PI;
      group.add(tip);

      // Clip
      const clipGeo = new THREE.BoxGeometry(0.025, 0.9, 0.025);
      const clipMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.2, metalness: 0.9 });
      const clip = new THREE.Mesh(clipGeo, clipMat);
      clip.position.set(0.095, 0.85, 0);
      group.add(clip);

      group.rotation.z = Math.PI / 2; // lay horizontal

    } else if (shape === 'flat') {
      // Bookmark / separator - thin flat rectangle
      const geo = new THREE.BoxGeometry(0.55, 1.9, 0.012);
      const mat = new THREE.MeshStandardMaterial({ color: BRAND_BLUE, roughness: 0.5 });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      // Decorative stripe
      const stripeGeo = new THREE.BoxGeometry(0.55, 0.06, 0.014);
      const stripeMat = new THREE.MeshStandardMaterial({ color: BRAND_GOLD, roughness: 0.3, metalness: 0.4 });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.y = 0.9;
      group.add(stripe);

      // Tassel string
      const stringGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6);
      const stringMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1 });
      const str = new THREE.Mesh(stringGeo, stringMat);
      str.position.y = 1.18;
      group.add(str);

      // Hole
      const holeGeo = new THREE.TorusGeometry(0.025, 0.008, 8, 12);
      const holeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.3, metalness: 0.8 });
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.position.y = 0.88;
      hole.position.z = 0.008;
      group.add(hole);
    }

    return group;
  }

  /* ── Init renderer ── */
  function init(canvas) {
    if (!canvas) return;

    const W = canvas.clientWidth  || 400;
    const H = canvas.clientHeight || 420;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(4, 5, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3b8fc0, 0.6);
    fill.position.set(-4, -1, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x3b8fc0, 0.4);
    rim.position.set(0, -4, -3);
    scene.add(rim);

    // Subtle env ground reflect
    const ground = new THREE.HemisphereLight(0x225378, 0x0a0a0f, 0.35);
    scene.add(ground);
  }

  /* ── Mouse / touch drag ── */
  function bindEvents(canvas) {
    canvas.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      autoRotate = false;
      prevMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { isMouseDown = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown || !object) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      object.rotation.y += dx * 0.012;
      object.rotation.x += dy * 0.008;
      object.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, object.rotation.x));
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    // Touch
    canvas.addEventListener('touchstart', (e) => {
      isMouseDown = true; autoRotate = false;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    window.addEventListener('touchend', () => { isMouseDown = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isMouseDown || !object) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      object.rotation.y += dx * 0.012;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    // Resume auto-rotate after 3s idle
    canvas.addEventListener('mouseup', () => {
      setTimeout(() => { autoRotate = true; }, 3000);
    });
  }

  /* ── Render loop ── */
  function animate() {
    animFrame = requestAnimationFrame(animate);
    if (autoRotate && object) {
      object.rotation.y += 0.007;
    }
    renderer.render(scene, camera);
  }

  /* ── Public API ── */
  return {
    load(canvas, shape) {
      if (!canvas || typeof THREE === 'undefined') return;

      // Init on first load
      if (!renderer) {
        init(canvas);
        bindEvents(canvas);
        animate();
      }

      // Remove old object
      if (object) { scene.remove(object); object = null; }

      // Build new
      object = buildGeometry(shape, canvas);
      scene.add(object);

      // Reset rotation
      object.rotation.set(0, 0.3, 0);
      autoRotate = true;

      // Handle resize
      const W = canvas.clientWidth  || 400;
      const H = canvas.clientHeight || 420;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    },

    destroy() {
      if (animFrame) cancelAnimationFrame(animFrame);
      if (renderer) { renderer.dispose(); renderer = null; }
      scene = null; camera = null; object = null;
    }
  };
})();
