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
            const href = this.getAttribute('href');
            if (href === '#') return;

            navLinks.classList.remove('active');

            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
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

    // Registration Form logic
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        const submitBtn = document.getElementById('submitBtn');
        const loader = document.getElementById('loader');
        const btnText = submitBtn?.querySelector('.btn-text');
        const agreeTerms = document.getElementById('agreeTerms');

        if (agreeTerms && submitBtn) {
            agreeTerms.addEventListener('change', () => {
                if (agreeTerms.checked) {
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

        // File selection preview
        const fileInputs = registrationForm.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const wrapper = input.parentElement;
                const fileName = e.target.files[0]?.name;

                if (fileName) {
                    wrapper.classList.add('has-file');
                    let preview = wrapper.querySelector('.file-name-preview');
                    if (!preview) {
                        preview = document.createElement('div');
                        preview.className = 'file-name-preview';
                        wrapper.appendChild(preview);
                    }
                    preview.textContent = fileName;
                } else {
                    wrapper.classList.remove('has-file');
                    const preview = wrapper.querySelector('.file-name-preview');
                    if (preview) preview.remove();
                }
            });
        });

        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const studentName = registrationForm.querySelector('input[name="studentName"]').value.trim();

            if (localStorage.getItem(`registered_${studentName}`)) {
                alert('عذراً، لقد قمت بالتقديم مسبقاً بهذا الاسم.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                if (loader) loader.style.display = 'inline-block';
                if (btnText) btnText.textContent = 'جاري رفع الملفات والبيانات...';
            }

            try {
                // 1. Upload files to Firebase Storage
                let uploadedUrls = {
                    birthCertificate: null,
                    personalPhoto: null,
                    paymentReceipt: null
                };

                if (isFirebaseConfigured && firebase.storage) {
                    const storage = firebase.storage();
                    const uploadFile = async (file, folder) => {
                        if (!file) return null;
                        if (btnText) btnText.textContent = `جاري رفع ${folder === 'birth' ? 'شهادة الميلاد' : folder === 'photo' ? 'الصورة' : 'الإيصال'}...`;
                        const fileName = `${Date.now()}_${file.name}`;
                        const storageRef = storage.ref(`registrations/${fileName}`);
                        await storageRef.put(file);
                        return await storageRef.getDownloadURL();
                    };

                    const birthCertFile = document.getElementById('birthCertificate').files[0];
                    const photoFile = document.getElementById('personalPhoto').files[0];
                    const receiptFile = document.getElementById('paymentReceipt').files[0];

                    if (birthCertFile) uploadedUrls.birthCertificate = await uploadFile(birthCertFile, 'birth');
                    if (photoFile) uploadedUrls.personalPhoto = await uploadFile(photoFile, 'photo');
                    if (receiptFile) uploadedUrls.paymentReceipt = await uploadFile(receiptFile, 'receipt');
                }

                // 2. Prepare Data for Firestore
                const formData = new FormData(registrationForm);
                const registrationData = {
                    studentName,
                    gender: formData.get('gender'),
                    phone1: formData.get('phone1'),
                    phone2: formData.get('phone2'),
                    address: formData.get('address'),
                    sheikhName: formData.get('sheikhName'),
                    sheikhPhone: formData.get('sheikhPhone'),
                    level: formData.get('level'),
                    // Save full URLs from Firebase Storage
                    birthCertificateUrl: uploadedUrls.birthCertificate,
                    personalPhotoUrl: uploadedUrls.personalPhoto,
                    paymentReceiptUrl: uploadedUrls.paymentReceipt,
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
                                'المستوى الثاني (نصف القرآن)': 4301,
                                'المستوى الثالث (ربع القرآن)': 4801,
                                'المستوى الرابع (ثلاثة أجزاء)': 5501
                            },
                            'بنات': {
                                'المستوى الأول (القرآن كاملاً)': 2000,
                                'المستوى الثاني (نصف القرآن)': 2301,
                                'المستوى الثالث (ربع القرآن)': 2801,
                                'المستوى الرابع (ثلاثة أجزاء)': 3501
                            }
                        };

                        const start = ranges[registrationData.gender][registrationData.level];
                        const assignedSeat = start + count;

                        // Update counter for next student
                        transaction.set(counterRef, { count: count + 1 });

                        // Add the registration document with seat number
                        const newRegRef = db.collection('registrations').doc();
                        registrationData.seatNumber = assignedSeat;
                        transaction.set(newRegRef, registrationData);

                        return assignedSeat;
                    });

                    // Success UI update
                    document.getElementById('displayStudentName').textContent = studentName;
                    document.getElementById('displaySeatNumber').textContent = seatNumber;
                    document.getElementById('seatNumberModal').style.display = 'flex';
                }

                localStorage.setItem(`registered_${studentName}`, 'true');
                registrationForm.reset();
                if (agreeTerms) agreeTerms.checked = false;

                // Clear file previews
                registrationForm.querySelectorAll('.file-input-wrapper').forEach(w => {
                    w.classList.remove('has-file');
                    const p = w.querySelector('.file-name-preview');
                    if (p) p.remove();
                });

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
