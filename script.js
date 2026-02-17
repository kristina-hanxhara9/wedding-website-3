/**
 * WEDDING INVITATION - ELIRA & ARBEN
 * Advanced Animation & Interaction Script
 * Using GSAP, ScrollTrigger, and Lenis
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loading');

    // Check if intro video should play
    initIntroVideo();
});

// ============================================
// INTRO VIDEO OVERLAY
// ============================================

function initIntroVideo() {
    const overlay = document.getElementById('introVideoOverlay');
    const video = document.getElementById('introVideo');
    const skipBtn = document.getElementById('introSkipBtn');

    if (!overlay || !video) {
        // No intro video, proceed to main site
        initMainSite();
        return;
    }

    // Check if video source exists
    const source = video.querySelector('source');
    if (!source || !source.src) {
        overlay.classList.add('hidden');
        initMainSite();
        return;
    }

    // Auto-play video immediately
    overlay.classList.add('playing');
    video.play().catch(() => {
        // If autoplay fails, just show the site
        overlay.classList.add('hidden');
        initMainSite();
    });

    // Skip button click
    skipBtn.addEventListener('click', () => {
        video.pause();
        overlay.classList.add('hidden');
        initMainSite();
    });

    // Video ended
    video.addEventListener('ended', () => {
        overlay.classList.add('hidden');
        initMainSite();
    });

    // Handle video error (file not found)
    video.addEventListener('error', () => {
        overlay.classList.add('hidden');
        initMainSite();
    });
}

function initMainSite() {
    // Initialize all modules
    initPreloader();
    initLenisScroll();
    initGSAPAnimations();
    initNavigation();
    initCountdown();
    initParallax();
    initCursor();
    initForms();
    initStickyRSVP();
    initIntroSection();
    initMagneticElements();
    initTextRevealMasks();
    initHorizontalScrollSection();
    initGiftSection();
}

// ============================================
// PRELOADER
// ============================================

function initPreloader() {
    const preloader = document.getElementById('preloader');

    // Wait for all images to load
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;

    const checkAllLoaded = () => {
        loadedImages++;
        if (loadedImages >= totalImages) {
            hidePreloader();
        }
    };

    images.forEach(img => {
        if (img.complete) {
            checkAllLoaded();
        } else {
            img.addEventListener('load', checkAllLoaded);
            img.addEventListener('error', checkAllLoaded);
        }
    });

    // Fallback: hide preloader after 3 seconds regardless
    setTimeout(hidePreloader, 3000);

    function hidePreloader() {
        if (preloader.classList.contains('hidden')) return;

        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
            document.body.style.overflow = '';
            document.body.style.overflowY = 'auto';
            document.body.style.overflowX = 'hidden';

            // Start hero animations
            animateHero();
        }, 500);
    }
}

// ============================================
// LENIS SMOOTH SCROLL
// ============================================

let lenis;

function initLenisScroll() {
    // Check if Lenis is available
    if (typeof Lenis === 'undefined') {
        console.log('Lenis not available, using native scroll');
        initNativeScroll();
        return;
    }

    try {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Animation frame loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.5
                    });
                }
            });
        });
    } catch (error) {
        console.log('Lenis initialization failed, using native scroll');
        initNativeScroll();
    }
}

function initNativeScroll() {
    // Handle anchor links with native smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// GSAP ANIMATIONS
// ============================================

function initGSAPAnimations() {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize split text animations
    initSplitText();

    // Initialize reveal animations
    initRevealAnimations();

    // Initialize staggered animations
    initStaggerAnimations();
}

// Split Text Animation
function initSplitText() {
    const splitTexts = document.querySelectorAll('.split-text');

    splitTexts.forEach(element => {
        // Split text into words and characters
        const text = element.textContent;
        element.innerHTML = '';

        // Split into words
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'hidden';

            // Split word into characters
            const chars = word.split('');
            chars.forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                wordSpan.appendChild(charSpan);
            });

            element.appendChild(wordSpan);

            // Add space between words
            if (wordIndex < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });

        // Animate on scroll
        const delay = parseFloat(element.dataset.delay) || 0;
        const chars = element.querySelectorAll('.char');

        ScrollTrigger.create({
            trigger: element,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(chars, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.02,
                    delay: delay,
                    ease: 'power3.out'
                });
                element.classList.add('revealed');
            }
        });

        // Set initial state
        gsap.set(chars, { y: '100%', opacity: 0 });
    });
}

// Reveal Animations
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');

    revealElements.forEach(element => {
        const delay = parseFloat(element.dataset.delay) || 0;

        ScrollTrigger.create({
            trigger: element,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(element, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: delay,
                    ease: 'power3.out',
                    onComplete: () => {
                        element.classList.add('revealed');
                    }
                });
            }
        });

        // Set initial state
        gsap.set(element, { y: 40, opacity: 0 });
    });
}

// Staggered Animations for grid items
function initStaggerAnimations() {
    // Gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
        ScrollTrigger.create({
            trigger: '.gallery-grid',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(galleryItems, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out'
                });
            }
        });
        gsap.set(galleryItems, { y: 50, opacity: 0 });
    }

    // Detail cards
    const detailCards = document.querySelectorAll('.detail-card');
    if (detailCards.length) {
        ScrollTrigger.create({
            trigger: '.details-grid',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(detailCards, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
            }
        });
        gsap.set(detailCards, { y: 60, opacity: 0 });
    }

    // Schedule items
    const scheduleItems = document.querySelectorAll('.schedule-item');
    if (scheduleItems.length) {
        ScrollTrigger.create({
            trigger: '.schedule-timeline',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(scheduleItems, {
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power3.out'
                });
            }
        });
        gsap.set(scheduleItems, { x: -30, opacity: 0 });
    }
}

// Hero Animation
function animateHero() {
    const tl = gsap.timeline({ delay: 0.3 });

    // Animate ornament
    tl.to('.hero-ornament', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Animate subtitle
    const subtitleChars = document.querySelectorAll('.hero-subtitle .char');
    if (subtitleChars.length) {
        tl.to(subtitleChars, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.02,
            ease: 'power3.out'
        }, '-=0.4');
    }

    // Animate names
    tl.to('.hero-name', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    }, '-=0.3');

    // Animate ampersand
    tl.to('.hero-ampersand', {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)'
    }, '-=0.8');

    // Animate date
    tl.to('.hero-date', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4');

    // Animate scroll indicator
    tl.to('.hero-scroll', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4');

    // Set initial states
    gsap.set('.hero-ornament', { opacity: 0, y: -20 });
    gsap.set('.hero-name', { opacity: 0, y: 50 });
    gsap.set('.hero-ampersand', { opacity: 0, scale: 0.5 });
    gsap.set('.hero-date', { opacity: 0, y: 30 });
    gsap.set('.hero-scroll', { opacity: 0, y: 20 });

    // Animate hero video (if exists)
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        gsap.to(heroVideo, {
            scale: 1,
            duration: 2,
            ease: 'power2.out'
        });
    }
}

// ============================================
// PARALLAX EFFECTS
// ============================================

function initParallax() {
    // Parallax backgrounds
    const parallaxBgs = document.querySelectorAll('.parallax-bg');

    parallaxBgs.forEach(bg => {
        const speed = parseFloat(bg.dataset.speed) || 0.3;

        gsap.to(bg, {
            yPercent: -20 * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: bg.closest('section'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });

    // Floating ornaments
    const ornaments = document.querySelectorAll('.floating-ornament');
    ornaments.forEach((ornament, index) => {
        gsap.to(ornament, {
            y: (index % 2 === 0) ? -50 : 50,
            x: (index % 2 === 0) ? 30 : -30,
            rotation: (index % 2 === 0) ? 15 : -15,
            ease: 'none',
            scrollTrigger: {
                trigger: ornament.closest('section'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 2
            }
        });
    });

    // Vertical text parallax
    const verticalTexts = document.querySelectorAll('.vertical-text span');
    verticalTexts.forEach((span, index) => {
        gsap.to(span, {
            y: (index % 2 === 0) ? -100 : 100,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5
            }
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Scroll behavior for nav
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Animated underline for nav links
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                '--underline-width': '100%',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                '--underline-width': '0%',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// COUNTDOWN TIMER (Optional - only runs if elements exist)
// ============================================

function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Exit if countdown elements don't exist
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const weddingDate = new Date('August 15, 2025 14:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Animate number changes
        animateNumber(daysEl, days);
        animateNumber(hoursEl, hours);
        animateNumber(minutesEl, minutes);
        animateNumber(secondsEl, seconds);
    }

    function animateNumber(element, newValue) {
        if (!element) return;
        const formattedValue = String(newValue).padStart(2, '0');
        if (element.textContent !== formattedValue) {
            gsap.to(element, {
                y: -10,
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    element.textContent = formattedValue;
                    gsap.fromTo(element,
                        { y: 10, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.2 }
                    );
                }
            });
        }
    }

    // Initial update
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);
}

// ============================================
// CUSTOM CURSOR
// ============================================

function initCursor() {
    const cursor = document.getElementById('cursorFollower');
    if (!cursor || window.matchMedia('(max-width: 768px)').matches) {
        if (cursor) cursor.style.display = 'none';
        return;
    }

    const cursorDot = cursor.querySelector('.cursor-dot');
    const cursorRing = cursor.querySelector('.cursor-ring');

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        // Dot follows closely
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;

        // Ring follows with delay
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .hover-zoom, .gallery-item, input, textarea, select');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

// ============================================
// FORMS
// ============================================

function initForms() {
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');

    if (rsvpForm) {
        // Input focus animations
        const inputs = rsvpForm.querySelectorAll('.form-input');

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                gsap.to(input.nextElementSibling, {
                    width: '100%',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    gsap.to(input.nextElementSibling, {
                        width: '0%',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });

        // Form submission
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            const submitBtn = rsvpForm.querySelector('.rsvp-submit');
            submitBtn.textContent = 'Duke dërguar...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Hide form and show success message
                gsap.to(rsvpForm, {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    onComplete: () => {
                        rsvpForm.classList.add('hidden');
                        rsvpSuccess.classList.add('active');

                        gsap.fromTo(rsvpSuccess,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.5 }
                        );
                    }
                });

                console.log('Form submitted:', data);
            }, 1500);
        });
    }
}

// ============================================
// STICKY RSVP BUTTON
// ============================================

function initStickyRSVP() {
    const stickyBtn = document.getElementById('stickyRsvp');
    const heroSection = document.getElementById('hero');
    const rsvpSection = document.getElementById('rsvp');

    if (!stickyBtn || !heroSection || !rsvpSection) return;

    ScrollTrigger.create({
        trigger: heroSection,
        start: 'bottom top',
        endTrigger: rsvpSection,
        end: 'top 80%',
        onEnter: () => {
            stickyBtn.classList.add('visible');
        },
        onLeaveBack: () => {
            stickyBtn.classList.remove('visible');
        },
        onEnterBack: () => {
            stickyBtn.classList.add('visible');
        },
        onLeave: () => {
            stickyBtn.classList.remove('visible');
        }
    });
}

// ============================================
// HOVER EFFECTS ENHANCEMENT
// ============================================

// Enhanced hover effects for cards and images
document.addEventListener('DOMContentLoaded', () => {
    // Story images magnetic effect
    const storyImages = document.querySelectorAll('.story-image');

    storyImages.forEach(image => {
        image.addEventListener('mousemove', (e) => {
            const rect = image.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(image.querySelector('img'), {
                x: x * 0.05,
                y: y * 0.05,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        image.addEventListener('mouseleave', () => {
            gsap.to(image.querySelector('img'), {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // Gallery item hover effect
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item.querySelector('img'), {
                scale: 1.1,
                duration: 0.6,
                ease: 'power2.out'
            });
            gsap.to(item.querySelector('.gallery-overlay'), {
                opacity: 1,
                duration: 0.3
            });
            gsap.to(item.querySelector('.gallery-icon'), {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('img'), {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
            gsap.to(item.querySelector('.gallery-overlay'), {
                opacity: 0,
                duration: 0.3
            });
            gsap.to(item.querySelector('.gallery-icon'), {
                scale: 0.5,
                rotation: 45,
                duration: 0.3
            });
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn-hover-fill');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
});

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

// Animate timeline line
document.addEventListener('DOMContentLoaded', () => {
    const scheduleLine = document.querySelector('.schedule-line');

    if (scheduleLine) {
        gsap.fromTo(scheduleLine,
            { scaleY: 0, transformOrigin: 'top' },
            {
                scaleY: 1,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.schedule-timeline',
                    start: 'top 80%',
                    once: true
                }
            }
        );
    }

    // Animate section lines
    const sectionLines = document.querySelectorAll('.section-line');

    sectionLines.forEach(line => {
        gsap.fromTo(line,
            { scaleX: 0 },
            {
                scaleX: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    once: true
                }
            }
        );
    });

    // Color dots animation
    const colorDots = document.querySelectorAll('.color-dot');

    colorDots.forEach((dot, index) => {
        gsap.fromTo(dot,
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                delay: 0.5 + (index * 0.1),
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: dot.closest('.detail-card'),
                    start: 'top 80%',
                    once: true
                }
            }
        );
    });
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function
function debounce(func, wait) {
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    ScrollTrigger.refresh();
}, 250));

// ============================================
// ACCESSIBILITY
// ============================================

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable Lenis smooth scroll
    if (lenis) {
        lenis.destroy();
    }

    // Show all elements immediately
    document.querySelectorAll('.reveal-element, .split-text').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// PHOTO STORY SECTION
// ============================================

function initHorizontalScrollSection() {
    const panels = document.querySelectorAll('.photo-story-panel');
    if (!panels.length) return;

    panels.forEach((panel) => {
        const image = panel.querySelector('.photo-story-image');
        const number = panel.querySelector('.photo-story-number');
        const title = panel.querySelector('.photo-story-title');
        const text = panel.querySelector('.photo-story-text');

        // Animate image with clip-path reveal
        if (image) {
            gsap.fromTo(image,
                { clipPath: 'inset(0 100% 0 0)' },
                {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.2,
                    ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: panel,
                        start: 'top 70%',
                        once: true
                    }
                }
            );
        }

        // Animate text content
        const elements = [number, title, text].filter(Boolean);
        if (elements.length) {
            gsap.fromTo(elements,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    delay: 0.3,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: panel,
                        start: 'top 60%',
                        once: true
                    }
                }
            );
        }
    });
}

// ============================================
// INTRO SECTION - Hover Image Reveal (Jägerhof Style)
// ============================================

function initIntroSection() {
    const introLinks = document.querySelectorAll('.intro-link');
    const introImages = document.querySelectorAll('.intro-image');

    if (!introLinks.length || !introImages.length) return;

    // Create a map of images by their data-hover attribute
    const imageMap = {};
    introImages.forEach(img => {
        const key = img.dataset.hover;
        imageMap[key] = img;
    });

    // Handle hover on links
    introLinks.forEach(link => {
        const imageKey = link.dataset.image;
        const targetImage = imageMap[imageKey];

        if (!targetImage) return;

        link.addEventListener('mouseenter', () => {
            // Hide all images first
            introImages.forEach(img => img.classList.remove('active'));

            // Show the target image
            targetImage.classList.add('active');

            // Animate with GSAP for extra smoothness
            gsap.fromTo(targetImage,
                {
                    opacity: 0,
                    scale: 1.15,
                    rotation: gsap.utils.random(-3, 3)
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                }
            );

            // Animate image inside
            gsap.fromTo(targetImage.querySelector('img'),
                { scale: 1.2 },
                { scale: 1.05, duration: 0.8, ease: 'power2.out' }
            );
        });

        link.addEventListener('mouseleave', () => {
            // Fade out image
            gsap.to(targetImage, {
                opacity: 0,
                scale: 1.05,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    targetImage.classList.remove('active');
                }
            });
        });
    });

    // Animate intro section on scroll
    ScrollTrigger.create({
        trigger: '.intro-section',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            // Animate headline
            gsap.fromTo('.intro-headline',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );

            // Stagger animate links
            gsap.fromTo('.intro-link',
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    delay: 0.3,
                    ease: 'power3.out'
                }
            );

            // Animate connectors
            gsap.fromTo('.intro-connector',
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    delay: 0.5,
                    ease: 'power2.out'
                }
            );
        }
    });
}

// ============================================
// MAGNETIC ELEMENTS
// ============================================

function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.intro-link, .detail-card, .gallery-item');

    if (window.matchMedia('(max-width: 768px)').matches) return;

    magneticElements.forEach(el => {
        el.classList.add('magnetic');

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic pull effect
            const strength = el.classList.contains('intro-link') ? 0.3 : 0.15;

            gsap.to(el, {
                x: x * strength,
                y: y * strength,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ============================================
// TEXT REVEAL MASKS
// ============================================

function initTextRevealMasks() {
    const revealMasks = document.querySelectorAll('.reveal-mask');

    revealMasks.forEach(mask => {
        ScrollTrigger.create({
            trigger: mask,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                mask.classList.add('revealed');
            }
        });
    });
}

// ============================================
// ENHANCED PARALLAX EFFECTS
// ============================================

function initEnhancedParallax() {
    // Mouse-follow parallax for intro images
    const introSection = document.querySelector('.intro-section');
    const introImages = document.querySelectorAll('.intro-image');

    if (introSection && introImages.length) {
        introSection.addEventListener('mousemove', (e) => {
            const rect = introSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            introImages.forEach((img, index) => {
                const depth = (index + 1) * 0.02;
                gsap.to(img, {
                    x: x * 50 * depth,
                    y: y * 30 * depth,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            });
        });
    }
}

// Initialize enhanced parallax after DOM is loaded
document.addEventListener('DOMContentLoaded', initEnhancedParallax);

// ============================================
// SCROLL-BASED TEXT ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Animate section tags with slide-in effect
    const sectionTags = document.querySelectorAll('.section-tag');

    sectionTags.forEach(tag => {
        gsap.fromTo(tag,
            {
                opacity: 0,
                x: -30,
                clipPath: 'inset(0 100% 0 0)'
            },
            {
                opacity: 1,
                x: 0,
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: tag,
                    start: 'top 85%',
                    once: true
                }
            }
        );
    });

    // Animate story items with staggered reveals
    const storyItems = document.querySelectorAll('.story-item');

    storyItems.forEach((item, index) => {
        const isReverse = item.classList.contains('story-item-reverse');
        const direction = isReverse ? 1 : -1;

        const imageWrapper = item.querySelector('.story-image-wrapper');
        const content = item.querySelector('.story-content');

        // Animate image
        gsap.fromTo(imageWrapper,
            {
                opacity: 0,
                x: 80 * direction,
                rotateY: 10 * direction
            },
            {
                opacity: 1,
                x: 0,
                rotateY: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%',
                    once: true
                }
            }
        );

        // Animate content
        gsap.fromTo(content,
            {
                opacity: 0,
                x: -50 * direction
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                delay: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%',
                    once: true
                }
            }
        );
    });

    // Venue image reveal with clip-path
    const venueImage = document.querySelector('.venue-image');
    if (venueImage) {
        gsap.fromTo(venueImage,
            {
                clipPath: 'inset(0 100% 0 0)'
            },
            {
                clipPath: 'inset(0 0% 0 0)',
                duration: 1.2,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: '.venue-section',
                    start: 'top 60%',
                    once: true
                }
            }
        );
    }

    // Venue content stagger
    const venueContent = document.querySelector('.venue-content');
    if (venueContent) {
        const venueElements = venueContent.children;

        gsap.fromTo(venueElements,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                delay: 0.3,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.venue-content-side',
                    start: 'top 70%',
                    once: true
                }
            }
        );
    }

    // Quote text word-by-word reveal
    const quoteText = document.querySelector('.quote-text');
    if (quoteText) {
        const text = quoteText.textContent;
        const words = text.split(' ');
        quoteText.innerHTML = words.map(word =>
            `<span class="quote-word">${word}</span>`
        ).join(' ');

        const quoteWords = quoteText.querySelectorAll('.quote-word');

        gsap.fromTo(quoteWords,
            {
                opacity: 0,
                y: 30,
                filter: 'blur(10px)'
            },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.6,
                stagger: 0.03,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.quote-section',
                    start: 'top 60%',
                    once: true
                }
            }
        );
    }

    // Gift section special entrance
    const giftSection = document.querySelector('.gift-section');
    if (giftSection) {
        gsap.fromTo('.gift-icon',
            {
                scale: 0,
                rotation: -180
            },
            {
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.gift-section',
                    start: 'top 70%',
                    once: true
                }
            }
        );
    }

    // Footer hearts animation
    const footerHearts = document.querySelectorAll('.footer-hearts span');
    if (footerHearts.length) {
        gsap.fromTo(footerHearts,
            {
                scale: 0,
                opacity: 0
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.15,
                ease: 'back.out(2)',
                scrollTrigger: {
                    trigger: '.footer-hearts',
                    start: 'top 90%',
                    once: true
                }
            }
        );
    }
});

// ============================================
// GIFT SECTION - Jägerhof Style
// ============================================

function initGiftSection() {
    const giftSection = document.querySelector('.gift-section-new');

    if (!giftSection) return;

    // Scroll trigger for animation
    ScrollTrigger.create({
        trigger: giftSection,
        start: 'top 70%',
        once: true,
        onEnter: () => {
            giftSection.classList.add('in-view');

            // Stagger animate bank details
            const bankRows = giftSection.querySelectorAll('.gift-bank-row');
            if (bankRows.length) {
                gsap.fromTo(bankRows,
                    { opacity: 0, x: -20 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.6,
                        stagger: 0.15,
                        delay: 0.6,
                        ease: 'power3.out'
                    }
                );
            }
        }
    });
}

// ============================================
// PHOTO STORY NUMBER PULSE
// ============================================

// Subtle pulse on photo story numbers
setInterval(() => {
    const storyNumbers = document.querySelectorAll('.photo-story-number');
    storyNumbers.forEach((num) => {
        gsap.to(num, {
            scale: 1.05,
            opacity: 0.5,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    });
}, 5000);

// ============================================
// BACKGROUND MUSIC
// ============================================

(function initMusic() {
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');

    if (!musicBtn || !bgMusic) return;

    const iconOn = musicBtn.querySelector('.music-icon-on');
    const iconOff = musicBtn.querySelector('.music-icon-off');
    let isPlaying = false;

    bgMusic.volume = 0.3;

    function toggleMusic() {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
            iconOn.style.display = 'none';
            iconOff.style.display = 'block';
        } else {
            bgMusic.play().then(() => {
                musicBtn.classList.add('playing');
                iconOn.style.display = 'block';
                iconOff.style.display = 'none';
            }).catch(() => {
                // Autoplay blocked - will play on next click
            });
        }
        isPlaying = !isPlaying;
    }

    musicBtn.addEventListener('click', toggleMusic);

    // Try to autoplay when user first interacts with the page
    function autoplayOnInteraction() {
        if (!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.classList.add('playing');
                iconOn.style.display = 'block';
                iconOff.style.display = 'none';
            }).catch(() => {});
        }
        document.removeEventListener('click', autoplayOnInteraction);
        document.removeEventListener('scroll', autoplayOnInteraction);
        document.removeEventListener('touchstart', autoplayOnInteraction);
    }

    document.addEventListener('click', autoplayOnInteraction);
    document.addEventListener('scroll', autoplayOnInteraction);
    document.addEventListener('touchstart', autoplayOnInteraction);
})();
