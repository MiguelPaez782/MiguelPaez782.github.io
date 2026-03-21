/* ================================================
   KAIROS CREATIVE — 3D PRODUCT VIEWER
   Uses Three.js r128 + GLTFLoader via CDN

   PARA AGREGAR MODELOS 3D REALES:
   ─────────────────────────────────────────────────
   1. Exporta tu modelo como .glb desde Spline,
      Blender u otro programa 3D.
   2. Coloca el archivo en: assets/models/<id>.glb
      Ejemplo: assets/models/cuaderno-b5.glb
   3. Listo. El visor lo carga automáticamente.
      Si el archivo no existe, muestra el placeholder.

   IDs de productos (nombres de archivo esperados):
     cuaderno-b5.glb          cuaderno-a5.glb
     cuaderno-a6-lateral.glb  cuaderno-a6-superior.glb
     cuaderno-a7.glb          calendario-premium.glb
     calendario-sencillo.glb  separadores.glb
     lapicero.glb
   ================================================ */

const Viewer3D = (() => {

  let scene, camera, renderer, object, animFrame;
  let isMouseDown = false;
  let prevMouse   = { x: 0, y: 0 };
  let autoRotate  = true;

  const BRAND_BLUE  = 0x225378;
  const BRAND_LIGHT = 0x6cb8e0;

  /* ════════════════════════════════════════════
     GEOMETRÍAS PLACEHOLDER
     Se muestran mientras no existe el .glb
     ════════════════════════════════════════════ */
  function buildGeometry(shape) {
    const group = new THREE.Group();

    if (shape === 'notebook' || shape === 'calendar') {
      group.add(Object.assign(
        new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.0, 0.25),
          new THREE.MeshStandardMaterial({ color: BRAND_BLUE, roughness: 0.4, metalness: 0.1 }))
      ));

      const strip = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.27),
        new THREE.MeshStandardMaterial({ color: BRAND_LIGHT, roughness: 0.3, metalness: 0.4 }));
      strip.position.y = 1.0;
      group.add(strip);

      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.04, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x0a1a2e, roughness: 0.6 }));
      spine.position.x = -0.84;
      group.add(spine);

      const torusMat  = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.2, metalness: 0.9 });
      const coilCount = shape === 'calendar' ? 6 : 10;
      const startY    = shape === 'calendar' ? 0.75 : 0.85;
      for (let i = 0; i < coilCount; i++) {
        const t = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 14), torusMat);
        t.position.set(-0.9, startY - i * (1.7 / (coilCount - 1)), 0);
        t.rotation.y = Math.PI / 2;
        group.add(t);
      }

      const pages = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.96, 0.2),
        new THREE.MeshStandardMaterial({ color: 0xf8f5f0, roughness: 0.95 }));
      pages.position.x = 0.815;
      group.add(pages);

      if (shape === 'calendar') {
        const stand = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x1a3d5c, roughness: 0.5 }));
        stand.position.set(0, -1.03, 0.1);
        group.add(stand);
        group.rotation.x = -0.25;
      }

    } else if (shape === 'pen') {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 20),
        new THREE.MeshStandardMaterial({ color: BRAND_BLUE, roughness: 0.3, metalness: 0.3 }));
      group.add(body);

      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.6, 20),
        new THREE.MeshStandardMaterial({ color: BRAND_LIGHT, roughness: 0.6, metalness: 0.1 }));
      grip.position.y = -0.6;
      group.add(grip);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.083, 0.083, 0.5, 20),
        new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.2, metalness: 0.5 }));
      cap.position.y = 1.15;
      group.add(cap);

      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.3, 12),
        new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 }));
      tip.position.y = -1.35;
      tip.rotation.x = Math.PI;
      group.add(tip);

      const clip = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.9, 0.025),
        new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.2, metalness: 0.9 }));
      clip.position.set(0.095, 0.85, 0);
      group.add(clip);

      group.rotation.z = Math.PI / 2;

    } else if (shape === 'flat') {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.9, 0.012),
        new THREE.MeshStandardMaterial({ color: BRAND_BLUE, roughness: 0.5 }));
      group.add(mesh);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.014),
        new THREE.MeshStandardMaterial({ color: BRAND_LIGHT, roughness: 0.3, metalness: 0.4 }));
      stripe.position.y = 0.9;
      group.add(stripe);

      const str = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6),
        new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1 }));
      str.position.y = 1.18;
      group.add(str);

      const hole = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.008, 8, 12),
        new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.3, metalness: 0.8 }));
      hole.position.set(0, 0.88, 0.008);
      group.add(hole);
    }

    return group;
  }

  /* ════════════════════════════════════════════
     UTILIDADES
     ════════════════════════════════════════════ */

  // Centrar y escalar modelo GLB para que encaje en el visor
  function fitModel(gltfScene) {
    const box    = new THREE.Box3().setFromObject(gltfScene);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 3 / maxDim;
    gltfScene.scale.setScalar(scale);
    gltfScene.position.sub(center.multiplyScalar(scale));
    return gltfScene;
  }

  // Ajustar canvas al contenedor (responsive)
  function resizeCanvas(canvas) {
    const pane     = canvas.parentElement;
    const maxW     = pane ? pane.clientWidth : window.innerWidth;
    const isMobile = window.innerWidth <= 768;
    const W = Math.min(maxW, isMobile ? maxW : 400);
    const H = isMobile ? 200 : 400;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }

  // Reemplazar objeto en escena
  function placeObject(mesh) {
    if (object) { scene.remove(object); object = null; }
    object = mesh;
    scene.add(object);
    object.rotation.set(0, 0.3, 0);
    autoRotate = true;
  }

  /* ════════════════════════════════════════════
     INICIALIZACIÓN DEL RENDERER
     ════════════════════════════════════════════ */
  function init(canvas) {
    if (!canvas) return;
    const W = canvas.clientWidth  || 400;
    const H = canvas.clientHeight || 400;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding     = THREE.sRGBEncoding;
    renderer.toneMapping        = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(4, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x3b8fc0, 0.6);
    fill.position.set(-4, -1, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x3b8fc0, 0.4);
    rim.position.set(0, -4, -3);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0x225378, 0x0a0a0f, 0.35));
  }

  /* ════════════════════════════════════════════
     EVENTOS (arrastrar para rotar)
     ════════════════════════════════════════════ */
  function bindEvents(canvas) {
    canvas.addEventListener('mousedown', (e) => {
      isMouseDown = true; autoRotate = false;
      prevMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => {
      isMouseDown = false;
      setTimeout(() => { autoRotate = true; }, 3000);
    });
    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown || !object) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      object.rotation.y += dx * 0.012;
      object.rotation.x += dy * 0.008;
      object.rotation.x  = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, object.rotation.x));
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('touchstart', (e) => {
      isMouseDown = true; autoRotate = false;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
    window.addEventListener('touchend', () => {
      isMouseDown = false;
      setTimeout(() => { autoRotate = true; }, 3000);
    });
    window.addEventListener('touchmove', (e) => {
      if (!isMouseDown || !object) return;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      object.rotation.y += dx * 0.012;
      object.rotation.x += dy * 0.008;
      object.rotation.x  = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, object.rotation.x));
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });
  }

  function animate() {
    animFrame = requestAnimationFrame(animate);
    if (autoRotate && object) object.rotation.y += 0.007;
    renderer.render(scene, camera);
  }

  /* ════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════ */
  return {

    /**
     * Carga el modelo 3D de un producto.
     * @param {HTMLCanvasElement} canvas     - Canvas del visor
     * @param {string}            shape      - 'notebook' | 'calendar' | 'pen' | 'flat'
     * @param {string}            productId  - ID del producto, ej: 'cuaderno-b5'
     *                                         Busca en assets/models/<productId>.glb
     */
    load(canvas, shape, productId) {
      if (!canvas || typeof THREE === 'undefined') return;

      if (!renderer) {
        init(canvas);
        bindEvents(canvas);
        animate();
      }

      resizeCanvas(canvas);

      // Intentar cargar .glb real; si no existe, usar placeholder
      if (typeof THREE.GLTFLoader !== 'undefined' && productId) {
        const loader = new THREE.GLTFLoader();
        loader.load(
          `assets/models/${productId}.glb`,
          (gltf) => placeObject(fitModel(gltf.scene)),  // exito: modelo real
          undefined,
          ()    => placeObject(buildGeometry(shape))    // error: placeholder
        );
      } else {
        placeObject(buildGeometry(shape));
      }
    },

    destroy() {
      if (animFrame) cancelAnimationFrame(animFrame);
      if (renderer)  { renderer.dispose(); renderer = null; }
      scene = null; camera = null; object = null;
    }
  };

})();
