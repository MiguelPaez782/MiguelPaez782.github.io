/* ===========================
   KAIROS CREATIVE - MAIN JS
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Custom Cursor ---- */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      setTimeout(() => {
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
      }, 80);
    });

    document.querySelectorAll('a, button, .product-card, .value-card, .contact-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        follower.style.width = '55px';
        follower.style.height = '55px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        follower.style.width = '35px';
        follower.style.height = '35px';
      });
    });
  }

  /* ---- Navbar scroll ---- */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ---- Mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
    revealObserver.observe(el);
  });

  /* ---- Particles ---- */
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    const colors = ['#225378', '#3a9fd6', '#1a6fa0', '#F4A629', 'rgba(255,255,255,0.3)'];
    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 8 + 2;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 12 + 8}s;
        animation-delay: ${Math.random() * 8}s;
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ---- Animated counter ---- */
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const increment = target / 60;
        const update = () => {
          current += increment;
          if (current < target) {
            el.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(update);
          } else {
            el.textContent = target + suffix;
          }
        };
        update();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ---- Product Tabs ---- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.tab;

      productCards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.97)';

        if (!show) {
          card.style.display = 'none';
        } else {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          }, 50);
        }
      });
    });
  });

  /* ---- Smooth active nav link ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 150) current = s.id;
    });
    navAs.forEach(a => {
      a.classList.remove('active-nav');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active-nav');
    });
  });

  /* ---- Parallax hero ---- */
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.35;
      if (heroContent) heroContent.style.transform = `translateY(${offset}px)`;
    }
  });

});