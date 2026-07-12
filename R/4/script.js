/* ============================================
   Krishna Kanth B — AI Consulting Website
   JavaScript
   ============================================ */

(function() {
    'use strict';

    // ========================================
    // Loader
    // ========================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1400);
    });

    // ========================================
    // Theme Toggle
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    function getPreferredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Synchronize Cal.com theme
        document.querySelectorAll('iframe[src*="cal.com"]').forEach(function(iframe) {
            try {
                const url = new URL(iframe.src);
                url.searchParams.set('theme', theme);
                iframe.src = url.toString();
            } catch(e) {}
        });
        
        document.querySelectorAll('a[href*="cal.com"]').forEach(function(link) {
            try {
                const url = new URL(link.href);
                url.searchParams.set('theme', theme);
                link.href = url.toString();
            } catch(e) {}
        });
    }

    setTheme(getPreferredTheme());

    themeToggle.addEventListener('click', function() {
        const current = html.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // ========================================
    // Navigation & Scroll
    // ========================================
    document.documentElement.classList.add('smooth-scroll');
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 50);
        lastScroll = scrollY;

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';

        backToTop.classList.toggle('visible', scrollY > 500);
    }, { passive: true });

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========================================
    // Scroll Reveal
    // ========================================
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(function(el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show everything
        reveals.forEach(function(el) {
            el.classList.add('revealed');
        });
    }

    // ========================================
    // Animated Counters
    // ========================================
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 800;
        var start = null;

        function update(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    // Animate hero stats immediately
    var heroStats = document.querySelectorAll('.hero-stat-number[data-count]');
    setTimeout(function() {
        heroStats.forEach(function(el) {
            animateCounter(el);
        });
    }, 1600);

    // Animate benefit counters on scroll
    var benefitNumbers = document.querySelectorAll('.benefit-number[data-count]');

    if ('IntersectionObserver' in window && benefitNumbers.length > 0) {
        var counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        benefitNumbers.forEach(function(el) {
            counterObserver.observe(el);
        });
    }

    // ========================================
    // FAQ Accordion
    // ========================================
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        var btn = item.querySelector('.faq-question');
        btn.addEventListener('click', function() {
            var isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(function(other) {
                other.classList.remove('active');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ========================================
    // Contact Form
    // ========================================
    var contactForm = document.getElementById('contactForm');

    if (contactForm) contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var name = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var company = document.getElementById('company').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Build mailto link
        var subject = encodeURIComponent('AI Consulting Inquiry from ' + name);
        var body = encodeURIComponent(
            'Name: ' + name + '\n' +
            'Email: ' + email + '\n' +
            (company ? 'Company: ' + company + '\n' : '') +
            (phone ? 'Phone: ' + phone + '\n' : '') +
            '\nMessage:\n' + message
        );

        window.location.href = 'mailto:krishnakanthb13@gmail.com?subject=' + subject + '&body=' + body;
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

})();
