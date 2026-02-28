'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       MOBILE NAVIGATION
       ============================================ */

    const hamburger  = document.getElementById('hamburger');
    const navMenu    = document.querySelector('.nav-menu');
    const navOverlay = document.getElementById('navOverlay');

    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        navOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', () => {
        navMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hamburger.click(); }
    });

    // Close on nav link click, overlay click, or Escape key
    document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
    navOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

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
            const offset = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

    /* ============================================
       NAVBAR — GLASS EFFECT & ACTIVE LINK
       ============================================ */

    const navbar   = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    // Only track sections that have a corresponding nav link
    const navLinks = document.querySelectorAll('.nav-link');
    const trackedIds = new Set(
        Array.from(navLinks).map(l => l.getAttribute('href').replace('#', ''))
    );
    const sections = Array.from(document.querySelectorAll('section[id]'))
        .filter(s => trackedIds.has(s.id));

    function onScroll() {
        const scrollY = window.scrollY;

        // Frosted glass navbar
        navbar.classList.toggle('scrolled', scrollY > 40);

        // Active nav link — last section whose top edge has passed the viewport midpoint
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 140) current = section.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });

        // Back to top visibility
        backToTop.classList.toggle('visible', scrollY > 500);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load to set initial state

    /* ============================================
       BACK TO TOP
       ============================================ */

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============================================
       SCROLL REVEAL (INTERSECTION OBSERVER)
       ============================================ */

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el    = entry.target;
            const delay = parseInt(el.dataset.revealDelay || '0', 10);
            setTimeout(() => el.classList.add('is-visible'), delay);
            revealObserver.unobserve(el);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    /* ============================================
       STATS COUNTER ANIMATION
       ============================================ */

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el       = entry.target;
            const target   = parseInt(el.dataset.target, 10);
            const duration = 1400;
            const start    = performance.now();

            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
            }

            requestAnimationFrame(step);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

    /* ============================================
       TYPEWRITER EFFECT
       ============================================ */

    const roles = [
        'Full-Stack Developer',
        'Mobile App Developer',
        'React Engineer',
        'Node.js Developer',
        'Python Developer',
    ];

    const typedEl = document.getElementById('typed-text');

    if (typedEl) {
        let roleIndex  = 0;
        let charIndex  = 0;
        let isDeleting = false;
        let isPaused   = false;

        const TYPE_SPEED   = 70;
        const DELETE_SPEED = 40;
        const PAUSE_END    = 2200;
        const PAUSE_START  = 400;

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

        // Delay start so the hero entrance animation plays first
        setTimeout(tick, 900);
    }

    /* ============================================
       DYNAMIC FOOTER YEAR
       ============================================ */

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ============================================
       CONSOLE EASTER EGG
       ============================================ */

    console.log('%c👋 Hey there, developer!', 'color: #00d4ff; font-size: 1.2rem; font-weight: bold;');
    console.log('%cSnooping around? Nice — let\'s connect: huzaifailyas522@gmail.com', 'color: #8888aa; font-size: 0.9rem;');

});
