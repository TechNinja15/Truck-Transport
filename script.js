// ============================
// DOM Ready
// ============================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHamburger();
    initCountUp();
    initAOS();
    initForms();
    setMinDate();
});

// Hide loader when page fully loads
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 800); // minimum display time so the animation is visible
    }
});

// ============================
// Navbar scroll effect
// ============================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================
// Mobile hamburger menu
// ============================
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ============================
// Count-up animation for stats
// ============================
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let counted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statNumbers.forEach(el => countUp(el));
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);
}

function countUp(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easedProgress * target);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

// ============================
// Animate on Scroll (custom lightweight AOS)
// ============================
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ============================
// Form handling
// ============================
function initForms() {
    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoading('bookingSubmitBtn', 'Searching...');

            setTimeout(() => {
                resetButton('bookingSubmitBtn', `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    Search Available Trucks
                `);
                showModal(
                    'Booking Request Submitted!',
                    'We\'ve found trucks matching your route. Our team will contact you shortly with the best options and pricing.'
                );
                bookingForm.reset();
            }, 1500);
        });
    }

    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showLoading('registerSubmitBtn', 'Registering...');

            setTimeout(() => {
                resetButton('registerSubmitBtn', 'Register Now — It\'s Free');
                showModal(
                    'Registration Successful! 🎉',
                    'Welcome aboard! Your agency profile is under review. You\'ll receive a confirmation email within 24 hours with your dashboard access.'
                );
                registerForm.reset();
            }, 1500);
        });
    }
}

function showLoading(btnId, text) {
    const btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.innerHTML = `
        <span class="spinner"></span>
        ${text}
    `;
    btn.style.opacity = '0.7';
}

function resetButton(btnId, html) {
    const btn = document.getElementById(btnId);
    btn.disabled = false;
    btn.innerHTML = html;
    btn.style.opacity = '1';
}

// ============================
// Modal
// ============================
function showModal(title, message) {
    const modal = document.getElementById('successModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ============================
// Set minimum date to today
// ============================
function setMinDate() {
    const dateInput = document.getElementById('transportDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// ============================
// Smooth scroll for anchor links
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        // Check if the anchor target exists on the CURRENT page
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});
