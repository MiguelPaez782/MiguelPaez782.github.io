/* ================================================
   KAIROS CREATIVE — MAIN JS
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky nav ─────────────────────────────── */
  const nav = document.getElementById('nav');
  const navLogo = nav.querySelector('.nav-logo');

  const onScroll = () => {
    const stuck = window.scrollY > 70;
    nav.classList.toggle('stuck', stuck);
    // Logo only visible once nav is sticky (hero already shows the big logo)
    navLogo.style.opacity       = stuck ? '1' : '0';
    navLogo.style.pointerEvents = stuck ? 'auto' : 'none';
    navLogo.style.transform     = stuck ? 'translateX(0)' : 'translateX(-8px)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger ───────────────────────── */
  const hamburger   = document.querySelector('.nav-hamburger');
  const navLinks    = document.querySelector('.nav-links');
  const navOverlay  = document.getElementById('navOverlay');

  function closeNav() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      if (navOverlay) navOverlay.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      // Prevent body scroll when nav is open
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', closeNav)
    );
    if (navOverlay) navOverlay.addEventListener('click', closeNav);
  }

  /* ── Hero particles ─────────────────────────── */
  const pWrap = document.querySelector('.hero-particles');
  if (pWrap) {
    const colors = ['#225378','#3b8fc0','#1a6fa0','rgba(201,148,58,0.7)','rgba(255,255,255,0.18)'];
    for (let i = 0; i < 32; i++) {
      const s = document.createElement('span');
      const sz = Math.random() * 6 + 2;
      Object.assign(s.style, {
        width: sz + 'px',
        height: sz + 'px',
        background: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100 + '%',
        animationDuration: (Math.random() * 14 + 7) + 's',
        animationDelay: (Math.random() * 8) + 's',
      });
      pWrap.appendChild(s);
    }
  }

  /* ── Scroll reveal ──────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .stagger').forEach(el => io.observe(el));

  /* ── Hero parallax ──────────────────────────── */
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.2 && heroContent) {
      heroContent.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    }
  }, { passive: true });

  /* ── Render product grid ────────────────────── */
  const grid = document.getElementById('productGrid');
  if (grid && typeof PRODUCTS !== 'undefined') {
    renderProducts('all');
  }

  function renderProducts(category) {
    if (!grid) return;
    const filtered = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);

    grid.innerHTML = filtered.map(p => `
      <article
        class="product-card"
        data-id="${p.id}"
        data-category="${p.category}"
        tabindex="0"
        role="button"
        aria-label="Ver detalles de ${p.name}"
      >
        <div class="card-img">
          <img
            src="${p.image}"
            alt="${p.name}"
            loading="lazy"
            onerror="this.style.opacity='0'"
          />
          <div class="card-img-overlay"></div>
          ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ''}
          <div class="card-hover-cta">
            <span>
              <i class="fa-solid fa-expand" aria-hidden="true"></i>
              Ver detalles
            </span>
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-name">${p.name}</h3>
          <p class="card-desc">${p.tagline}</p>
          <div class="card-tags">
            ${p.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

    // Bind click / keyboard
    grid.querySelectorAll('.product-card').forEach(card => {
      const open = () => openModal(card.dataset.id);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });

    // Stagger entrance
    grid.querySelectorAll('.product-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.45s ease, box-shadow 0.45s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
      });
    });
  }

  /* ── Product filter tabs ────────────────────── */
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.tab);
    });
  });

  /* ── Modal ──────────────────────────────────── */
  const overlay = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');

  function openModal(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p || !overlay) return;

    // Populate content
    document.getElementById('modal-label-cat').textContent = p.category.charAt(0).toUpperCase() + p.category.slice(1);
    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-tagline').textContent = p.tagline;

    // Specs
    const specsGrid = document.getElementById('modal-specs');
    specsGrid.innerHTML = Object.entries(p.specs).map(([k,v]) => `
      <div class="spec-item">
        <span class="spec-key">${k}</span>
        <span class="spec-val">${v}</span>
      </div>
    `).join('');

    // Options
    const optionsList = document.getElementById('modal-options');
    optionsList.innerHTML = p.options.map(o => `
      <div class="option-item">
        <i class="${o.icon} option-icon" aria-hidden="true"></i>
        <span>${o.text}</span>
      </div>
    `).join('');

    // Gallery
    const gallery = document.getElementById('modal-gallery');
    gallery.innerHTML = p.gallery.map((src, i) => `
      <div class="gallery-thumb" tabindex="0" aria-label="Imagen ${i+1}">
        <img src="${src}" alt="${p.name} - imagen ${i+1}" loading="lazy" onerror="this.style.opacity='0'" />
      </div>
    `).join('');

    // WA link
    const waBtn = document.getElementById('modal-wa-btn');
    if (waBtn) {
      const msg = encodeURIComponent(`Hola Kairos Creative! Me interesa el ${p.name}. ¿Me pueden dar más información?`);
      waBtn.href = `https://wa.me/573006623070?text=${msg}`;
    }

    // Open overlay
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Init 3D viewer
    const canvas = document.getElementById('viewer-canvas');
    if (canvas && typeof Viewer3D !== 'undefined') {
      // Give the modal time to render, then size canvas to fit container
      setTimeout(() => {
        // Don't set canvas.width/height directly — let Viewer3D handle it responsively
        Viewer3D.load(canvas, p.shape, p.id);
      }, 180);
    }
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── Active nav link on scroll ──────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) cur = s.id; });
    navAs.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + cur
        ? 'var(--accent-light)'
        : '';
    });
  }, { passive: true });

});
