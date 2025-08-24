/**
 * @file Main script for the portfolio website.
 * @description Handles all dynamic functionality including animations, theme toggling, navigation, and form submissions.
 * @author Adidtiya Kurniawan
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENT SELECTORS ---
    const SELECTORS = {
        preloader: '#preloader',
        smoothScrollLinks: 'a[href^="#"]',
        animatedElements: '.hidden',
        themeToggle: '#theme-toggle',
        hamburger: '.hamburger',
        navLinks: '.nav-links',
        typingEffect: '.typing-effect',
        filterContainer: '.filter-buttons',
        projectGrid: '.project-grid',
        projectDetailButtons: '.project-detail-btn',
        projectModal: '#project-modal',
        closeModalBtn: '.close-btn',
        modalTitle: '#modal-title',
        modalDesc: '#modal-desc',
        modalGithubLink: '#modal-github-link',
        modalLiveLink: '#modal-live-link',
        contactForm: '#contact-form',
        formStatus: '#form-status',
        backToTopButton: '#back-to-top',
        cursorDot: '.cursor-dot',
        cursorOutline: '.cursor-outline',
    };

    // --- CLASS & STATE CONSTANTS ---
    const CLASSES = {
        loaded: 'loaded',
        active: 'active',
        toggle: 'toggle',
        show: 'show',
        hide: 'hide',
        darkMode: 'dark-mode',
    };

    // --- TIMING & DELAY CONSTANTS ---
    const TIMING = {
        preloaderDelay: 500,
        typingSpeed: 150,
        deletingSpeed: 100,
        typingPause: 1200,
        formStatusClear: 6000,
        cursorAnimationDuration: 500,
    };

    /**
     * Initializes all the website functionalities.
     */
    function init() {
        initPreloader();
        initSmoothScrolling();
        initFadeInAnimation();
        initThemeToggle();
        initHamburgerMenu();
        initTypingEffect();
        initProjectFilter();
        initProjectModal();
        initContactForm();
        initBackToTopButton();
        initCustomCursor();
    }

    // --- FUNCTIONAL MODULES ---

    /** Handles the pre-loader fade-out effect. */
    function initPreloader() {
        const preloader = document.querySelector(SELECTORS.preloader);
        if (!preloader) return;
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add(CLASSES.loaded), TIMING.preloaderDelay);
        });
    }

    /** Enables smooth scrolling for anchor links and closes mobile nav on click. */
    function initSmoothScrolling() {
        const navLinks = document.querySelector(SELECTORS.navLinks);
        const hamburger = document.querySelector(SELECTORS.hamburger);
        document.querySelectorAll(SELECTORS.smoothScrollLinks).forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
                if (navLinks?.classList.contains(CLASSES.active)) {
                    navLinks.classList.remove(CLASSES.active);
                    hamburger?.classList.remove(CLASSES.toggle);
                }
            });
        });
    }

    /** Sets up Intersection Observer to fade in elements on scroll. */
    function initFadeInAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(CLASSES.show);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll(SELECTORS.animatedElements).forEach(el => observer.observe(el));
    }

    /** Manages the light/dark mode theme toggle. */
    function initThemeToggle() {
        const themeToggle = document.querySelector(SELECTORS.themeToggle);
        if (!themeToggle) return;
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle(CLASSES.darkMode);
            const isDarkMode = document.body.classList.contains(CLASSES.darkMode);
            themeToggle.textContent = isDarkMode ? '🌙' : '☀️';
            themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
        });
    }

    /** Controls the mobile hamburger menu. */
    function initHamburgerMenu() {
        const hamburger = document.querySelector(SELECTORS.hamburger);
        const navLinks = document.querySelector(SELECTORS.navLinks);
        if (!hamburger || !navLinks) return;
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle(CLASSES.active);
            hamburger.classList.toggle(CLASSES.toggle);
        });
    }

    /** Creates the typewriter effect for the hero section. */
    function initTypingEffect() {
        const typingElement = document.querySelector(SELECTORS.typingEffect);
        if (!typingElement) return;

        const text = "Adidtiya Kurniawan";
        let index = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentText = text.substring(0, index);
            typingElement.innerHTML = currentText;

            if (!isDeleting && index < text.length) {
                index++;
                setTimeout(typeWriter, TIMING.typingSpeed);
            } else if (isDeleting && index > 0) {
                index--;
                setTimeout(typeWriter, TIMING.deletingSpeed);
            } else {
                isDeleting = !isDeleting;
                setTimeout(typeWriter, TIMING.typingPause);
            }
        }
        typeWriter();
    }
    
    /** Handles filtering of projects based on category. */
    function initProjectFilter() {
        const filterContainer = document.querySelector(SELECTORS.filterContainer);
        if (!filterContainer) return;

        filterContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (!target.classList.contains('filter-btn')) return;

            filterContainer.querySelector(`.${CLASSES.active}`)?.classList.remove(CLASSES.active);
            target.classList.add(CLASSES.active);

            const filterValue = target.getAttribute('data-filter');
            document.querySelectorAll('.project-card').forEach(card => {
                const isVisible = filterValue === 'all' || card.dataset.category.includes(filterValue);
                card.classList.toggle(CLASSES.hide, !isVisible);
            });
        });
    }

    /** Manages the project detail modal. */
    function initProjectModal() {
        const modal = document.querySelector(SELECTORS.projectModal);
        const projectGrid = document.querySelector(SELECTORS.projectGrid);
        const closeModalBtn = document.querySelector(SELECTORS.closeModalBtn);
        if (!modal || !projectGrid || !closeModalBtn) return;

        function openModal(detailButton) {
            document.querySelector(SELECTORS.modalTitle).textContent = detailButton.dataset.title;
            document.querySelector(SELECTORS.modalDesc).textContent = detailButton.dataset.desc;
            document.querySelector(SELECTORS.modalGithubLink).href = detailButton.dataset.github;

            const liveLink = detailButton.dataset.live;
            const liveLinkButton = document.querySelector(SELECTORS.modalLiveLink);
            
            if (liveLink && liveLink.trim() !== '') {
                liveLinkButton.href = liveLink;
                liveLinkButton.style.display = 'inline-block';
            } else {
                liveLinkButton.style.display = 'none';
            }
            modal.style.display = 'block';
        }

        function closeModal() {
            modal.style.display = 'none';
        }

        projectGrid.addEventListener('click', e => {
            const detailButton = e.target.closest(SELECTORS.projectDetailButtons);
            if (detailButton) openModal(detailButton);
        });

        closeModalBtn.addEventListener('click', closeModal);
        window.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.style.display === 'block') closeModal();
        });
    }

    /** Handles AJAX submission for the contact form. */
    function initContactForm() {
        const form = document.querySelector(SELECTORS.contactForm);
        const formStatus = document.querySelector(SELECTORS.formStatus);
        if (!form || !formStatus) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Mengirim...';

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.textContent = "Pesan berhasil dikirim. Terima kasih!";
                    formStatus.style.color = "green";
                    form.reset();
                } else {
                    const data = await response.json();
                    const errorMessage = data.errors ? data.errors.map(err => err.message).join(", ") : "Oops! Ada masalah saat mengirim pesan.";
                    formStatus.textContent = errorMessage;
                    formStatus.style.color = "red";
                }
            } catch (error) {
                formStatus.textContent = "Oops! Ada masalah koneksi.";
                formStatus.style.color = "red";
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Kirim Pesan';
                setTimeout(() => { formStatus.textContent = ''; }, TIMING.formStatusClear);
            }
        });
    }
    
    /** Controls the visibility and action of the back-to-top button. */
    function initBackToTopButton() {
        const button = document.querySelector(SELECTORS.backToTopButton);
        if (!button) return;

        window.addEventListener('scroll', () => {
            button.classList.toggle(CLASSES.show, window.scrollY > 300);
        });
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /** Manages the custom cursor follow effect. */
    function initCustomCursor() {
        const cursorDot = document.querySelector(SELECTORS.cursorDot);
        const cursorOutline = document.querySelector(SELECTORS.cursorOutline);
        if (!cursorDot || !cursorOutline) return;

        window.addEventListener('mousemove', (e) => {
            const { clientX: posX, clientY: posY } = e;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, {
                duration: TIMING.cursorAnimationDuration,
                fill: "forwards"
            });
        });
    }

    // --- SCRIPT EXECUTION ---
    init();
});