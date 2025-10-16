/* ============================================
   MODERN PORTFOLIO - JAVASCRIPT
   Huzaifa Ilyas - Full-Stack Developer
   ============================================ */

'use strict';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */

const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

// Toggle mobile menu when hamburger is clicked
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when a nav link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

/* ============================================
   SMOOTH SCROLLING FOR NAVIGATION LINKS
   ============================================ */

// Smooth scroll to sections (already handled by CSS scroll-behavior: smooth)
// But adding this for better browser compatibility
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================
   ACTIVE NAVIGATION LINK ON SCROLL
   ============================================ */

const sections = document.querySelectorAll('.section, .hero');
const navLinksArray = Array.from(navLinks);

function highlightNavLink() {
    let scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinksArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */

const backToTopButton = document.getElementById('backToTop');

// Show/hide back to top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

// Smooth scroll to top when back to top button is clicked
backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ============================================
   NAVBAR BACKGROUND ON SCROLL
   ============================================ */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(15, 15, 30, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.backgroundColor = 'rgba(15, 15, 30, 0.95)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
    }
});

/* ============================================
   SCROLL ANIMATIONS (FADE IN ON SCROLL)
   ============================================ */

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Elements to animate on scroll
const elementsToAnimate = document.querySelectorAll(
    '.about-content, .skill-category, .project-card, .contact-card, .highlight-item'
);

elementsToAnimate.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(element);
});

/* ============================================
   HERO BUTTONS SMOOTH SCROLL
   ============================================ */

// Select all buttons in hero section (including scroll-down button)
const heroButtons = document.querySelectorAll('.hero-buttons .btn, .scroll-down a');

console.log(`✅ Found ${heroButtons.length} hero buttons`);

heroButtons.forEach((button, index) => {
    console.log(`Button ${index + 1}:`, button.getAttribute('href'));

    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const targetId = this.getAttribute('href');
        console.log(`🖱️ Button clicked! Target: ${targetId}`);

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            console.log(`✅ Target section found:`, targetSection);

            // Get the exact position
            const navbarHeight = 70;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            console.log(`📍 Current scroll: ${window.pageYOffset}`);
            console.log(`📍 Target position: ${offsetPosition}`);

            // Smooth scroll using window.scrollTo
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            console.log(`✅ Scroll initiated to ${offsetPosition}px`);

            // Verify scroll after a moment
            setTimeout(() => {
                console.log(`📊 New scroll position: ${window.pageYOffset}`);
            }, 1000);
        } else {
            console.error(`❌ Target section not found: ${targetId}`);
        }
    });
});

/* ============================================
   TYPING EFFECT FOR HERO TITLE (OPTIONAL)
   ============================================ */

// Uncomment this section if you want a typing effect for the hero title
/*
const heroTitle = document.querySelector('.hero-title');
const titleText = heroTitle.textContent;
heroTitle.textContent = '';

let charIndex = 0;

function typeTitle() {
    if (charIndex < titleText.length) {
        heroTitle.textContent += titleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeTitle, 100);
    }
}

// Start typing effect after page loads
window.addEventListener('load', () => {
    setTimeout(typeTitle, 500);
});
*/

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */

// Debounce function to limit scroll event frequency
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll event handlers
const debouncedHighlightNavLink = debounce(highlightNavLink, 10);
window.removeEventListener('scroll', highlightNavLink);
window.addEventListener('scroll', debouncedHighlightNavLink);

/* ============================================
   CONSOLE MESSAGE (EASTER EGG)
   ============================================ */

console.log(
    '%c👋 Hi there, Developer!',
    'color: #6C5CE7; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cLooking at the code? I like that! 🚀',
    'color: #00B8D4; font-size: 16px;'
);
console.log(
    '%cLet\'s connect: huzaifailyas522@gmail.com',
    'color: #A29BFE; font-size: 14px;'
);

/* ============================================
   PREVENT CONSOLE ERRORS
   ============================================ */

// Ensure all elements exist before trying to manipulate them
if (!hamburger || !navMenu) {
    console.warn('Navigation elements not found');
}

if (!backToTopButton) {
    console.warn('Back to top button not found');
}

/* ============================================
   PAGE LOAD OPTIMIZATION
   ============================================ */

// Add a slight delay to ensure smooth animations on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Set initial opacity
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease-in';

/* ============================================
   ACCESSIBILITY IMPROVEMENTS
   ============================================ */

// Add keyboard navigation for hamburger menu
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});

// Add focus styles for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ============================================
   DYNAMIC YEAR IN FOOTER (BONUS)
   ============================================ */

// Update year automatically in footer
const footerText = document.querySelector('.footer-text');
if (footerText) {
    const currentYear = new Date().getFullYear();
    footerText.innerHTML = footerText.innerHTML.replace('2025', currentYear);
}

/* ============================================
   END OF SCRIPT
   ============================================ */

console.log('%c✅ Portfolio loaded successfully!', 'color: #00B8D4; font-weight: bold;');

}); // End of DOMContentLoaded
