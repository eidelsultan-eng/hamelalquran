document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animations)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navbar Scroll Effect
    // --- Countdown Timer Logic ---
    const countdownTarget = new Date("Feb 8, 2026 00:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = countdownTarget - now;

        if (distance < 0) {
            const countdownEl = document.getElementById("countdown");
            if (countdownEl) countdownEl.style.display = "none";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minsEl = document.getElementById("minutes");
        const secsEl = document.getElementById("seconds");

        if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minsEl) minsEl.innerText = minutes.toString().padStart(2, '0');
        if (secsEl) secsEl.innerText = seconds.toString().padStart(2, '0');
    };

    if (document.getElementById("countdown")) {
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --- Navigation & Scroll logic cleaned up ---
    // Hero buttons scroll logic
    const heroApplyBtn = document.querySelector('.hero-btns .btn-primary');
    const heroDiscoverBtn = document.querySelector('.hero-btns .btn-secondary');

    if (heroApplyBtn) {
        heroApplyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const applySection = document.getElementById('apply');
            if (applySection) {
                applySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (heroDiscoverBtn) {
        heroDiscoverBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Smooth Scrolling for all internal links

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset; // Removed -80 offset
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form (WhatsApp + Firebase)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            // Feedback: Change button text
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'جاري الإرسال...';

            try {
                // Save to Firebase if configured
                if (isFirebaseConfigured && db) {
                    await db.collection('messages').add({
                        name,
                        phone,
                        message,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'جديد'
                    });
                }

                const whatsappNumber = '201002200841';
                let messageText = `📬 *رسالة جديدة من الموقع* \n\n`;
                messageText += `👤 *الاسم:* ${name}\n`;
                messageText += `📱 *رقم الهاتف:* ${phone}\n`;
                messageText += `💬 *الرسالة:* ${message}`;

                const encodedText = encodeURIComponent(messageText);
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

                window.open(whatsappUrl, '_blank');
                contactForm.reset();
                alert('تم إرسال رسالتك وحفظها بنجاح.');
            } catch (error) {
                console.error("Error saving message:", error);
                alert('حدث خطأ أثناء الإرسال، سيتم فتح الواتساب فقط.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    }

    // Stats Counter Animation
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const startCounters = () => {
        counters.forEach(counter => {
            const originalText = counter.innerText;
            const hasPlus = originalText.includes('+');
            const hasK = originalText.includes('K');
            const target = parseInt(originalText.replace('+', '').replace('K', '').replace(',', ''));
            if (isNaN(target)) return;

            let current = 0;
            const increment = target / speed;

            const updateCount = () => {
                current += increment;

                if (current < target) {
                    let displayValue = Math.ceil(current);
                    if (hasK) displayValue = displayValue + 'K';
                    if (hasPlus) displayValue = displayValue + '+';

                    counter.innerText = displayValue;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = originalText;
                }
            };
            updateCount();
        });
    };

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

    // --- Firebase Configuration ---
    const firebaseConfig = {
        apiKey: "AIzaSyA6fnq6E4P4aLvtOLRfUogPNLV__MIlcD8",
        authDomain: "dddd-3161a.firebaseapp.com",
        projectId: "dddd-3161a",
        storageBucket: "dddd-3161a.firebasestorage.app",
        messagingSenderId: "295943367803",
        appId: "1:295943367803:web:5c859045aad563af4a06de",
        measurementId: "G-M3FJ7TGZYJ"
    };

    // Initialize Firebase
    let db = null;
    let storage = null;
    const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

    if (typeof firebase !== 'undefined' && isFirebaseConfigured) {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            storage = firebase.storage();
        } catch (err) {
            console.error("Firebase Init Error:", err);
        }
    }

    // --- Global Settings enforcement ---
    let appSettings = {
        registrationStatus: 'open',
        nominationStatus: 'open'
    };

    async function fetchSettings() {
        if (!isFirebaseConfigured || !db) return;
        try {
            const doc = await db.collection('settings').doc('appConfig').get();
            if (doc.exists) {
                appSettings = doc.data();
                applySettings();
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
        }
    }

    function applySettings() {
        // Main Registration Section enforcement
        const regForm = document.getElementById('registrationForm');
        const countdownEl = document.getElementById('countdown');

        if (appSettings.registrationStatus === 'closed') {
            if (regForm) {
                const formHeader = regForm.closest('.apply-card')?.querySelector('.form-header p');
                if (formHeader) {
                    formHeader.innerHTML = '<span style="color: #ff4d4d; font-weight: bold; font-size: 1.2rem;">⚠️ عذراً، باب التقديم الإلكتروني مغلق حالياً.</span>';
                }
                regForm.style.opacity = '0.6';
                regForm.style.pointerEvents = 'none';
                const submitBtn = document.getElementById('submitBtn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    const btxt = submitBtn.querySelector('.btn-text');
                    if (btxt) btxt.textContent = 'باب التقديم مغلق';
                    submitBtn.style.background = '#666';
                }
            }
            // Update Hero Badge if it exists
            const heroBadge = document.querySelector('.hero-badge');
            if (heroBadge) {
                heroBadge.textContent = 'باب التقديم مغلق حالياً';
                heroBadge.style.background = 'rgba(255, 77, 77, 0.2)';
                heroBadge.style.color = '#ff4d4d';
                heroBadge.style.borderColor = '#ff4d4d';
            }
        } else {
            // Normal state
        }

        // Nomination Section enforcement
        const nominationForm = document.getElementById('nominationForm');
        if (appSettings.nominationStatus === 'closed') {
            if (nominationForm) {
                nominationForm.style.opacity = '0.6';
                nominationForm.style.pointerEvents = 'none';
                const nomBtn = nominationForm.querySelector('button');
                if (nomBtn) {
                    nomBtn.disabled = true;
                    nomBtn.textContent = 'باب الترشيح مغلق';
                    nomBtn.style.background = '#666';
                }
            }
        }
    }

    fetchSettings();

    // Registration Form logic
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        const submitBtn = document.getElementById('submitBtn');
        const loader = document.getElementById('loader');
        const btnText = submitBtn?.querySelector('.btn-text');
        const agreeTerms = document.getElementById('agreeTerms');

        if (agreeTerms && submitBtn) {
            agreeTerms.addEventListener('change', () => {
                if (agreeTerms.checked && appSettings.registrationStatus === 'open') {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                } else {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.5';
                    submitBtn.style.cursor = 'not-allowed';
                }
            });
        }


        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (appSettings.registrationStatus === 'closed') {
                alert('عذراً، باب التقديم الإلكتروني مغلق حالياً.');
                return;
            }

            const studentNameInput = registrationForm.querySelector('input[name="studentName"]');
            if (!studentNameInput) return;
            const studentName = studentNameInput.value.trim();

            if (localStorage.getItem(`registered_${studentName}`)) {
                alert('عذراً، لقد قمت بالتقديم مسبقاً بهذا الاسم.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                if (loader) loader.style.display = 'inline-block';
                if (btnText) btnText.textContent = 'جاري حفظ البيانات...';
            }

            try {

                // 2. Prepare Data for Firestore
                const formData = new FormData(registrationForm);
                const registrationData = {
                    studentName,
                    gender: formData.get('gender'),
                    phone1: formData.get('phone1'),
                    phone2: formData.get('phone2'),
                    phone3: formData.get('phone3'),
                    address: formData.get('address'),
                    sheikhName: formData.get('sheikhName'),
                    sheikhPhone: formData.get('sheikhPhone'),
                    level: formData.get('level'),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };

                if (isFirebaseConfigured && db) {
                    if (btnText) btnText.textContent = 'جاري حجز رقم الجلوس...';

                    const counterRef = db.collection('counters').doc(`${registrationData.gender}_${registrationData.level}`);

                    const seatNumber = await db.runTransaction(async (transaction) => {
                        const counterDoc = await transaction.get(counterRef);
                        let count = 0;
                        if (counterDoc.exists) {
                            count = counterDoc.data().count;
                        }

                        // Define ranges based on gender and level
                        const ranges = {
                            'بنين': {
                                'المستوى الأول (القرآن كاملاً)': 4000,
                                'المستوى الثاني (ثلاثة أرباع القرآن)': 4301,
                                'المستوى الثالث (نصف القرآن)': 4801,
                                'المستوى الرابع (ربع القرآن)': 5501,
                                'المستوى الخامس (البراعم - 5 أجزاء)': 1
                            },
                            'بنات': {
                                'المستوى الأول (القرآن كاملاً)': 2000,
                                'المستوى الثاني (ثلاثة أرباع القرآن)': 2301,
                                'المستوى الثالث (نصف القرآن)': 2801,
                                'المستوى الرابع (ربع القرآن)': 3501,
                                'المستوى الخامس (البراعم - 5 أجزاء)': 1001
                            }
                        };

                        const start = ranges[registrationData.gender][registrationData.level];
                        const assignedSeat = start + count;

                        // 2. Calculate Committee Number (15 students per committee)
                        const committeeNumber = Math.ceil((count + 1) / 15);

                        // Update counter for next student
                        transaction.set(counterRef, { count: count + 1 });

                        // Add the registration document with seat number and committee
                        const newRegRef = db.collection('registrations').doc();
                        registrationData.seatNumber = assignedSeat;
                        registrationData.committee = committeeNumber;
                        transaction.set(newRegRef, registrationData);

                        return { assignedSeat, committeeNumber };
                    });

                    // Success UI update
                    document.getElementById('displayStudentName').textContent = studentName;
                    document.getElementById('displaySeatNumber').textContent = seatNumber.assignedSeat;
                    const committeeDisplay = document.getElementById('displayCommittee');
                    if (committeeDisplay) committeeDisplay.textContent = seatNumber.committeeNumber;
                    document.getElementById('seatNumberModal').style.display = 'flex';
                }

                localStorage.setItem(`registered_${studentName}`, 'true');
                registrationForm.reset();
                if (agreeTerms) agreeTerms.checked = false;

            } catch (error) {
                console.error("Submission Error:", error);
                alert('حدث خطأ أثناء الإرسال: ' + error.message);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.5';
                    submitBtn.style.cursor = 'not-allowed';
                    if (loader) loader.style.display = 'none';
                    if (btnText) btnText.textContent = 'إرسال طلب التقديم';
                }
            }
        });
    }

    // Modal close function
    window.closeSeatModal = () => {
        document.getElementById('seatNumberModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // --- Gallery & Lightbox Logic ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    let visibleCount = 4;

    // Initially hide images beyond the first 5
    const updateGalleryVisibility = () => {
        galleryItems.forEach((item, index) => {
            if (index < visibleCount) {
                item.classList.remove('hidden');
                item.style.display = 'block';
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });

        if (visibleCount >= galleryItems.length) {
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        }
    };

    updateGalleryVisibility();

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 5; // Show 5 more
            updateGalleryVisibility();
        });
    }

    // Lightbox Modal Functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            if (lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    // Nomination Form Logic
    const nominationForm = document.getElementById('nominationForm');
    if (nominationForm) {
        nominationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (appSettings.nominationStatus === 'closed') {
                alert('عذراً، باب الترشيح مغلق حالياً.');
                return;
            }

            const submitNomBtn = nominationForm.querySelector('button[type="submit"]');
            const originalText = submitNomBtn.innerHTML;

            try {
                submitNomBtn.disabled = true;
                submitNomBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

                const formData = new FormData(nominationForm);
                const data = {
                    nominatorName: formData.get('nominatorName') || 'فاعل خير',
                    nominatorPhone: formData.get('nominatorPhone'),
                    awardType: formData.get('awardType'),
                    nomineeName: formData.get('nomineeName'),
                    reason: formData.get('reason'),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };

                if (isFirebaseConfigured && db) {
                    await db.collection('nominations').add(data);
                    alert('تم إرسال ترشيحك بنجاح! شكراً لمشاركتك.');
                    nominationForm.reset();
                } else {
                    alert('عذراً، نظام الترشيحات غير متاح حالياً.');
                }
            } catch (err) {
                console.error("Nomination Error:", err);
                alert('حدث خطأ أثناء إرسال الترشيح. يرجى المحاولة لاحقاً.');
            } finally {
                submitNomBtn.disabled = false;
                submitNomBtn.innerHTML = originalText;
            }
        });
    }
});
