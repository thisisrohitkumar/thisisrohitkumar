// gsap and ScrollTrigger are loaded via CDN in index.html
// Immediate registration
if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
}

// Roles for typing animation
const roles = [
    "Software Development Engineer",
    "Full Stack Developer",
    "Python Developer",
    "MERN Stack Developer",
    "AI Enthusiast",
    "UI/UX Designer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

const typingText = document.getElementById('typing-text');

function type() {
    if (!typingText) return;
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        charIndex--;
        typeSpeed = 50;
    } else {
        charIndex++;
        typeSpeed = 100;
    }

    typingText.textContent = currentRole.substring(0, charIndex);

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// GSAP Entrance Animations
function initAnimations() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    if (!gsap || !ScrollTrigger) {
        console.warn("GSAP or ScrollTrigger not loaded. Animations skipped.");
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Entrance (Always runs on load)
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });
    tl.from('.navbar-wrapper', { y: -100, opacity: 0 })
      .from('.hero-pretitle', { opacity: 0, y: 20, duration: 0.5 }, '-=0.5')
      .from('.hero-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
      .from('.hero-roles', { opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.hero-description', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-actions', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.profile-frame', { opacity: 0, scale: 0.8, rotate: -10, ease: 'back.out(1.7)' }, '-=0.5');

    // 2. Section Component Reveals (Reusable function)
    const createReveal = (selector, triggerSelector, staggerDelay = 0.1) => {
        const elements = gsap.utils.toArray(selector);
        if (elements.length === 0) return;

        gsap.from(elements, {
            scrollTrigger: {
                trigger: triggerSelector,
                start: 'top 95%', // Very sensitive trigger
                toggleActions: 'play none none none',
                once: true
            },
            opacity: 0,
            y: 30,
            stagger: staggerDelay,
            duration: 0.8,
            ease: 'power2.out',
            clearProps: 'all',
            // Fallback: If already in view on refresh, show immediately
            onRefresh: (self) => {
                if (self.progress > 0) gsap.set(elements, { opacity: 1, y: 0, visibility: 'visible', clearProps: 'all' });
            }
        });
    };

    // 3. Section Titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 95%',
            },
            opacity: 0,
            x: -30,
            duration: 1,
            ease: 'power3.out',
            clearProps: 'all'
        });
    });

    // 4. Initialize specialized reveals
    createReveal('.about-card', '#about', 0.15);
    createReveal('.tech-category', '#tech', 0.15);
    createReveal('.project-card', '#projects', 0.2);

    // 5. Ultimate Fail-safe: Force everything visible after a delay
    // This ensures content is accessible even if ScrollTrigger somehow fails.
    setTimeout(() => {
        const allAnimated = '.about-card, .tech-category, .project-card, .section-title';
        gsap.to(allAnimated, { 
            opacity: 1, 
            y: 0, 
            x: 0, 
            scale: 1, 
            visibility: 'visible',
            duration: 0.5,
            stagger: 0.05,
            overwrite: 'auto',
            clearProps: 'all'
        });
    }, 2000);

    // Final refresh to lock in positions
    ScrollTrigger.refresh();
}

// Initialize everything
window.addEventListener('load', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Typing animation
    type();
    
    // Animation initialization with safe delay
    setTimeout(() => {
        initAnimations();
        
        // Secondary refresh after images have definitely settled
        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
        }
    }, 200);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = target.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
