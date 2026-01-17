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
            navLinks.classList.remove('active');

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

            const whatsappNumber = '201002200841';
            let messageText = `📬 *رسالة جديدة من الموقع* \n\n`;
            messageText += `👤 *الاسم:* ${name}\n`;
            messageText += `📱 *رقم الهاتف:* ${phone}\n`;
            messageText += `💬 *الرسالة:* ${message}`;

            const encodedText = encodeURIComponent(messageText);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

            window.open(whatsappUrl, '_blank');
            contactForm.reset();
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
        apiKey: "AIzaSyDIT0tkxLlYkEidEtwTHvZimvQuVM-gDyw",
        authDomain: "hamel-a89ce.firebaseapp.com",
        projectId: "hamel-a89ce",
        storageBucket: "hamel-a89ce.firebasestorage.app",
        messagingSenderId: "678005054790",
        appId: "1:678005054790:web:14a17c94ac0d3b2da71947"
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
        // Handle custom file names display
        const fileInputs = registrationForm.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const fileName = e.target.files[0] ? e.target.files[0].name : 'اختر من معرض الصور';
                const customBtn = e.target.parentElement.querySelector('.file-custom-btn');
                customBtn.innerHTML = `<i class="fas fa-check-circle" style="color: #4CAF50;"></i> ${fileName}`;
            });
        });

        const submitBtn = document.getElementById('submitBtn');
        const loader = document.getElementById('loader');
        const btnText = submitBtn?.querySelector('.btn-text');

        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const studentName = registrationForm.querySelector('input[name="studentName"]').value;

            // Check if already registered
            if (localStorage.getItem(`registered_${studentName}`)) {
                alert('عذراً، لقد قمت بالتقديم مسبقاً بهذا الاسم.');
                return;
            }

            // UI Feedback
            if (submitBtn) {
                submitBtn.disabled = true;
                if (loader) loader.style.display = 'inline-block';
                if (btnText) btnText.textContent = 'جاري الحفظ والرفع...';
            }

            try {
                const formData = new FormData(registrationForm);
                const phone1 = formData.get('phone1');
                const phone2 = formData.get('phone2');
                const address = formData.get('address');
                const sheikhName = formData.get('sheikhName');
                const sheikhPhone = formData.get('sheikhPhone');
                const level = formData.get('level');

                let photoUrl = "#", certUrl = "#", paymentUrl = "#";

                // Upload to Firebase if configured
                if (isFirebaseConfigured && db && storage) {
                    const uploadFile = async (file, folder) => {
                        if (!file || file.size === 0) return null;
                        const storageRef = storage.ref(`${folder}/${Date.now()}_${file.name}`);
                        const snapshot = await storageRef.put(file);
                        return await snapshot.ref.getDownloadURL();
                    };

                    const personalPhoto = document.getElementById('personalPhoto').files[0];
                    const birthCertificate = document.getElementById('birthCertificate').files[0];
                    const paymentScreenshot = document.getElementById('paymentScreenshot').files[0];

                    photoUrl = await uploadFile(personalPhoto, 'personal_photos');
                    certUrl = await uploadFile(birthCertificate, 'birth_certificates');
                    paymentUrl = await uploadFile(paymentScreenshot, 'payment_screenshots');

                    await db.collection('registrations').add({
                        studentName, phone1, phone2, address, sheikhName, sheikhPhone, level,
                        photoUrl, certUrl, paymentUrl,
                        submissionDate: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }

                // WhatsApp
                const whatsappNumber = '201002200841';
                let messageText = `✨ *استمارة تقديم جديدة - مسابقة حامل القرآن* ✨\n\n`;
                messageText += `📝 *بيانات المتسابق:*\n━━━━━━━━━━━━━━━\n👤 *الاسم:* ${studentName}\n🏆 *المستوى:* ${level}\n\n`;
                messageText += `📞 *بيانات التواصل:*\n━━━━━━━━━━━━━━━\n📱 *رقم الواتساب:* ${phone1}\n☎️ *رقم إضافي:* ${phone2}\n📍 *العنوان:* ${address}\n\n`;
                messageText += `👨‍🏫 *بيانات المحفظ:*\n━━━━━━━━━━━━━━━\n🕋 *الشيخ المحفظ:* ${sheikhName}\n📞 *رقم الشيخ:* ${sheikhPhone}\n\n`;

                if (!isFirebaseConfigured) {
                    messageText += `⚠️ *تنبيه:* يرجى إرفاق الصور في المحادثة الآن (لم يتم الرفع التلقائي).`;
                } else {
                    messageText += `✅ *ملاحظة:* تم حفظ البيانات في قاعدة بيانات الموقع.`;
                }

                const encodedText = encodeURIComponent(messageText);
                window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');

                localStorage.setItem(`registered_${studentName}`, 'true');
                registrationForm.reset();
                registrationForm.querySelectorAll('.file-custom-btn').forEach(btn => {
                    btn.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> اختر من معرض الصور`;
                });

                if (!isFirebaseConfigured) {
                    alert('تنبيه: الموقع غير مربوط بـ Firebase. تم فتح الواتساب فقط.');
                } else {
                    alert('تم التسجيل بنجاح!');
                }

            } catch (error) {
                console.error("Error:", error);
                alert('حدث خطأ: ' + error.message);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    if (loader) loader.style.display = 'none';
                    if (btnText) btnText.textContent = 'إرسال طلب التقديم';
                }
            }
        });
    }
});
