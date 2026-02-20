// ========================================
// COMPONENTE DE PROYECTO (REUTILIZABLE)
// ========================================
class ProjectCard {
    constructor(config) {
        this.name = config.name;
        this.description = config.description;
        this.image = config.image;
        this.link = config.link;
        this.tags = config.tags || [];
        this.delay = config.delay || 0;
    }

    render() {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${this.delay}s`;

        card.innerHTML = `
            <div class="overflow-hidden">
                <img src="${this.image}" alt="${this.name}" class="project-image" />
            </div>
            <div class="project-content">
                <h4 class="project-title">${this.name}</h4>
                <p class="project-description">${this.description}</p>
                <div class="project-tags">
                    ${this.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <a href="${this.link}" target="_blank" rel="noopener noreferrer" class="project-link">
                    Ver Proyecto
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </a>
            </div>
        `;

        return card;
    }
}

// ========================================
// CONFIGURACIÓN DE PROYECTOS
// ========================================
const proyectos = [
    {
        name: "SandBox",
        description: "Una aplicación web sencilla que permite escribir código JavaScript.",
        image: "images/screenshot-sandbox.png",
        link: "https://github.com/MiguelPaez782/SandBox",
        tags: [ "JavaScript", "CSS3", "HTML5"]
    },
    {
        name: "Zenit",
        description: "App web SPA (Single Page Application) que permite a los usuarios crear, gestionar y dar seguimiento a sus metas personales.",
        image: "images/screenshot-zenit-appweb.png",
        link: "https://miguelpaez782.github.io/apps/zenit-app/",
        tags: [ "JavaScript", "CSS3", "HTML5", "Firebase"]
    },
    {
        name: "Calculadora de Tarifas Por Hora",
        description: "Calculadora de tarifas de hora laborales segun tus gastos mensuales y ganancias deseadas.",
        image: "images/screenshot-calculadora-tarifa-hora.png",
        link: "https://github.com/MiguelPaez782/calculadora-tarifa-hora",
        tags: ["HTML5", "CSS3", "JavaScript", "LocalStorage"]
    }
];

// ========================================
// FUNCIÓN PARA AGREGAR PROYECTOS
// ========================================
function addProject(projectConfig) {
    const container = document.getElementById('projects-container');
    const delay = container.children.length * 0.1;
    projectConfig.delay = delay;
    
    const project = new ProjectCard(projectConfig);
    container.appendChild(project.render());
}

// ========================================
// RENDERIZAR PROYECTOS INICIALES
// ========================================
function renderProjects() {
    proyectos.forEach(proyecto => {
        addProject(proyecto);
    });
}

// ========================================
// ANIMACIONES DE SCROLL
// ========================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar elementos que necesitan animación de reveal
    const revealElements = document.querySelectorAll('.fade-in-left, .fade-in-right, .project-card, .stat-card');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ========================================
// SMOOTH SCROLL PARA NAVEGACIÓN
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                const mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function initNavbarScroll() {
    const navbar = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// MENÚ MÓVIL
// ========================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// ========================================
// EFECTO DE CURSOR CON GRADIENTE
// ========================================
function initCursorEffect() {
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isMoving) {
            isMoving = true;
            document.body.classList.add('has-mouse');
        }

        document.body.style.setProperty('--mouse-x', `${mouseX}px`);
        document.body.style.setProperty('--mouse-y', `${mouseY}px`);
    });

    // Detectar cuando el mouse deja de moverse
    let timeout;
    document.addEventListener('mousemove', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            isMoving = false;
        }, 1000);
    });
}

// ========================================
// TYPING EFFECT (OPCIONAL)
// ========================================
function initTypingEffect() {
    const textElement = document.querySelector('.gradient-text');
    if (!textElement) return;

    const originalText = textElement.innerHTML;
    textElement.innerHTML = '';
    textElement.style.opacity = '1';

    let charIndex = 0;
    const typingSpeed = 50;

    function type() {
        if (charIndex < originalText.length) {
            // Manejar etiquetas HTML
            if (originalText.charAt(charIndex) === '<') {
                const closingBracket = originalText.indexOf('>', charIndex);
                textElement.innerHTML += originalText.substring(charIndex, closingBracket + 1);
                charIndex = closingBracket + 1;
            } else {
                textElement.innerHTML += originalText.charAt(charIndex);
                charIndex++;
            }
            setTimeout(type, typingSpeed);
        }
    }

    // Iniciar el efecto después de un pequeño delay
    setTimeout(type, 500);
}

// ========================================
// PARALLAX EFFECT
// ========================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-content, .grid-pattern');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('grid-pattern') ? 0.5 : 0.3;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ========================================
// ANIMACIÓN DE NÚMEROS (STATS)
// ========================================
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const text = entry.target.textContent;
                
                // Solo animar si es un número
                if (!isNaN(parseInt(text))) {
                    const target = parseInt(text);
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            entry.target.textContent = target + (text.includes('+') ? '+' : '');
                            clearInterval(timer);
                        } else {
                            entry.target.textContent = Math.floor(current) + (text.includes('+') ? '+' : '');
                        }
                    }, 16);
                }
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// ========================================
// ACTIVE LINK EN NAVBAR
// ========================================
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar proyectos
    renderProjects();
    
    // Inicializar todas las funcionalidades
    initScrollAnimations();
    initSmoothScroll();
    initNavbarScroll();
    initMobileMenu();
    initCursorEffect();
    initParallax();
    animateStats();
    initActiveNavLinks();
    
    // Opcional: descomentar para efecto de typing
    // initTypingEffect();
});

// ========================================
// EJEMPLO DE CÓMO AGREGAR UN NUEVO PROYECTO
// ========================================
/*
Para agregar un nuevo proyecto, simplemente llama a la función addProject:

addProject({
    name: "Nombre del Proyecto",
    description: "Descripción detallada del proyecto",
    image: "URL_de_la_imagen",
    link: "https://github.com/tu-usuario/proyecto",
    tags: ["Tag1", "Tag2", "Tag3"]
});
*/

// ========================================
// EXPORTAR FUNCIÓN PARA USO EXTERNO
// ========================================
window.addProject = addProject;
