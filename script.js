document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animations)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('open');

            // Add Styles for active mobile menu if not in CSS
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(10, 10, 10, 0.98)';
                navLinks.style.padding = '30px';
                navLinks.style.textAlign = 'center';
            } else {
                navLinks.style.display = '';
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close mobile menu on click

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form (WhatsApp)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('input[placeholder="الاسم"]').value;
            const phone = contactForm.querySelector('input[placeholder="رقم الهاتف"]').value;
            const message = contactForm.querySelector('textarea').value;

            const whatsappNumber = '201005252162';
            let messageText = `*رسالة جديدة من موقع مسابقة حامل القرآن*\n\n`;
            messageText += `*الاسم:* ${name}\n`;
            messageText += `*رقم الهاتف:* ${phone}\n`;
            messageText += `*الرسالة:* ${message}`;

            const encodedText = encodeURIComponent(messageText);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

            window.open(whatsappUrl, '_blank');
            contactForm.reset();
        });
    }

    // Stats Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // زيادة الرقم لجعل الحركة أنعم

    const startCounters = () => {
        counters.forEach(counter => {
            const originalText = counter.innerText;
            const hasPlus = originalText.includes('+');
            const hasK = originalText.includes('K');
            const target = parseInt(originalText.replace('+', '').replace('K', '').replace(',', ''));

            let current = 0;
            const increment = target / speed;

            const updateCount = () => {
                current += increment;

                if (current < target) {
                    let displayValue = Math.ceil(current);
                    if (hasK) displayValue = displayValue + 'K';
                    if (hasPlus) displayValue = displayValue + '+';

                    counter.innerText = displayValue;
                    requestAnimationFrame(updateCount); // أفضل للأداء من setTimeout
                } else {
                    counter.innerText = originalText; // العودة للنص الأصلي لضمان الدقة
                }
            };
            updateCount();
        });
    };

    // Trigger counters with Intersection Observer
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }
});
