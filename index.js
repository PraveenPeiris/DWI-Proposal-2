/* ========================================
   DWI Project Proposal — Interactivity
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initTimelineTabs();
    initTimelineItems();
    initCounters();
    initMobileNav();
});

/* ---------- Navbar scroll effect ---------- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
            // Close mobile nav
            document.querySelector('.nav-links')?.classList.remove('open');
        });
    });
}

/* ---------- Scroll-triggered fade-in ---------- */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger siblings a little
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach((el, i) => {
        // Auto-stagger cards in grids
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('modules-grid') ||
                       parent.classList.contains('arch-grid') ||
                       parent.classList.contains('overview-highlights'))) {
            el.dataset.delay = i * 100;
        }
        observer.observe(el);
    });

    // Trigger hero elements immediately
    document.querySelectorAll('.hero .animate-in').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
}

/* ---------- Timeline tab switching ---------- */
function initTimelineTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.timeline-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active panel
            panels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
                // Animate timeline items in the new panel
                animateTimelineItems(targetPanel);
            }
        });
    });
}

/* ---------- Timeline item animations ---------- */
function initTimelineItems() {
    // Animate the initially visible panel
    const activePanel = document.querySelector('.timeline-panel.active');
    if (activePanel) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateTimelineItems(activePanel);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(activePanel);
    }
}

function animateTimelineItems(panel) {
    const items = panel.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
        item.classList.remove('visible');
        setTimeout(() => {
            item.classList.add('visible');
        }, 120 * i);
    });
}

/* ---------- Animated counters ---------- */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1200;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            toggle.classList.toggle('active');
        });
    }
}

/* ---------- Subtle parallax on hero glows ---------- */
(function initParallax() {
    const glows = document.querySelectorAll('.hero-glow');
    if (!glows.length) return;

    let ticking = false;

    document.addEventListener('mousemove', (e) => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            glows.forEach((glow, i) => {
                const factor = (i + 1) * 12;
                glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });

            ticking = false;
        });
    }, { passive: true });
})();

/* ---------- Active nav link highlighting ---------- */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active',
                        link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -80% 0px'
    });

    sections.forEach(section => observer.observe(section));
})();
