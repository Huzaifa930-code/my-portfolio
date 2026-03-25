'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       MOBILE NAVIGATION
       ============================================ */

    const navToggle = document.querySelector('.nav-toggle');
    const navMobile = document.querySelector('.nav-mobile');

    function openMobileMenu() {
        navToggle.classList.add('open');
        navMobile.classList.add('open');
        navMobile.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        navToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileMenu() {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
        // Wait for fade out before hiding
        setTimeout(() => {
            if (!navMobile.classList.contains('open')) navMobile.style.display = '';
        }, 300);
    }

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', () => {
            navMobile.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
        });

        navMobile.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });
    }

    /* ============================================
       SMOOTH SCROLL — ALL ANCHOR LINKS
       ============================================ */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            closeMobileMenu();
            // 95px offset for floating pill navbar
            const offset = target.getBoundingClientRect().top + window.scrollY - 95;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

    /* ============================================
       NAVBAR — SCROLLED STATE & ACTIVE LINKS
       ============================================ */

    const navbar  = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    const trackedIds = new Set(
        Array.from(navLinks)
            .map(l => l.getAttribute('href').replace('#', ''))
            .filter(Boolean)
    );
    const sections = Array.from(document.querySelectorAll('section[id]'))
        .filter(s => trackedIds.has(s.id));

    function onScroll() {
        const scrollY = window.scrollY;

        if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);

        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 150) current = section.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ============================================
       SCROLL REVEAL (INTERSECTION OBSERVER)
       ============================================ */

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el    = entry.target;
            const delay = parseInt(el.dataset.revealDelay || '0', 10);
            setTimeout(() => el.classList.add('visible'), delay);
            revealObserver.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ============================================
       STATS — static final values (no animation)
       ============================================ */

    /* ============================================
       TYPEWRITER EFFECT
       ============================================ */

    const roles = [
        'AI-Orchestrated Developer',
        'Full-Stack Engineer',
        'React Native Developer',
        'AI Systems Builder',
        'Node.js Developer',
    ];

    const typedEl = document.getElementById('typed-text');

    if (typedEl) {
        let roleIndex  = 0;
        let charIndex  = 0;
        let isDeleting = false;
        let isPaused   = false;

        const TYPE_SPEED   = 68;
        const DELETE_SPEED = 38;
        const PAUSE_END    = 2400;
        const PAUSE_START  = 380;

        function tick() {
            if (isPaused) return;
            const currentRole = roles[roleIndex];

            if (!isDeleting) {
                typedEl.textContent = currentRole.slice(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentRole.length) {
                    isPaused = true;
                    setTimeout(() => { isPaused = false; isDeleting = true; tick(); }, PAUSE_END);
                    return;
                }
                setTimeout(tick, TYPE_SPEED);
            } else {
                typedEl.textContent = currentRole.slice(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    roleIndex  = (roleIndex + 1) % roles.length;
                    isPaused   = true;
                    setTimeout(() => { isPaused = false; tick(); }, PAUSE_START);
                    return;
                }
                setTimeout(tick, DELETE_SPEED);
            }
        }

        setTimeout(tick, 1000);
    }

    /* ============================================
       DYNAMIC FOOTER YEAR
       ============================================ */

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ============================================
       NEURAL NETWORK PARTICLE CANVAS
       ============================================ */

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    let mouse = { x: null, y: null };
    let animId;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Skip animation entirely

    // Dual-accent palette: violet + cyan + mixed
    const COLORS = [
        { r: 139, g: 92,  b: 246 }, // violet
        { r: 139, g: 92,  b: 246 }, // violet (weighted)
        { r: 34,  g: 211, b: 238 }, // cyan
        { r: 34,  g: 211, b: 238 }, // cyan (weighted)
        { r: 52,  g: 211, b: 153 }, // mint (rare)
    ];

    const isMobile = () => W < 768;
    const PARTICLE_COUNT = () => isMobile() ? 80 : 180;
    const CONNECT_DIST   = () => isMobile() ? 90 : 130;

    function resizeCanvas() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x  = Math.random() * W;
            this.y  = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.size = Math.random() * 1.4 + 0.5;
            const c  = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.r   = c.r;
            this.g   = c.g;
            this.b   = c.b;
            this.alpha = Math.random() * 0.5 + 0.25;
            this.alphaDir = (Math.random() > 0.5 ? 1 : -1) * 0.004;
        }

        update() {
            // Drift
            this.x += this.vx;
            this.y += this.vy;

            // Seamless wrap
            if (this.x < -10) this.x = W + 10;
            if (this.x > W + 10) this.x = -10;
            if (this.y < -10) this.y = H + 10;
            if (this.y > H + 10) this.y = -10;

            // Twinkle
            this.alpha += this.alphaDir;
            if (this.alpha > 0.8 || this.alpha < 0.15) this.alphaDir *= -1;

            // Mouse repulsion
            if (mouse.x !== null) {
                const dx   = mouse.x - this.x;
                const dy   = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const rep  = isMobile() ? 90 : 140;
                if (dist > 0 && dist < rep) {
                    const force = (rep - dist) / rep;
                    this.x -= (dx / dist) * force * 1.8;
                    this.y -= (dy / dist) * force * 1.8;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},${this.alpha})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = PARTICLE_COUNT();
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        const dist = CONNECT_DIST();
        const len  = particles.length;

        for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
                const a  = particles[i];
                const b  = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d > dist) continue;

                const opacity = (1 - d / dist) * 0.22;
                // Blend colors of the two endpoints
                const mr = Math.floor((a.r + b.r) / 2);
                const mg = Math.floor((a.g + b.g) / 2);
                const mb = Math.floor((a.b + b.b) / 2);

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(${mr},${mg},${mb},${opacity})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        drawConnections();
        for (const p of particles) {
            p.update();
            p.draw();
        }
        animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Pause when tab is hidden to save battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            animate();
        }
    });

    resizeCanvas();
    initParticles();
    animate();

    /* ============================================
       CONSOLE EASTER EGG
       ============================================ */

    console.log('%c⬡ AI-ORCHESTRATED DEVELOPER', 'color: #8B5CF6; font-size: 1.1rem; font-weight: 800; letter-spacing: 0.05em;');
    console.log('%cBuilding with Claude · Cursor · GitHub Copilot', 'color: #22D3EE; font-size: 0.85rem;');
    console.log('%cSay hello → huzaifailyas522@gmail.com', 'color: #8888aa; font-size: 0.85rem;');

});
