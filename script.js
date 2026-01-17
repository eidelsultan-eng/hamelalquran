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

    // Contact Form (WhatsApp + Firebase)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('input[placeholder="الاسم"]').value;
            const phone = contactForm.querySelector('input[placeholder="رقم الهاتف"]').value;
            const message = contactForm.querySelector('textarea').value;

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

            const studentName = registrationForm.querySelector('input[name="studentName"]').value.trim();

            if (localStorage.getItem(`registered_${studentName}`)) {
                alert('عذراً، لقد قمت بالتقديم مسبقاً بهذا الاسم.');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                if (loader) loader.style.display = 'inline-block';
                if (btnText) btnText.textContent = 'جاري المعالجة...';
            }

            // Timeout function
            const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("استغرق الرفع وقتاً طويلاً جداً (Timeout)")), ms));

            try {
                const formData = new FormData(registrationForm);
                const phone1 = formData.get('phone1');
                const phone2 = formData.get('phone2');
                const address = formData.get('address');
                const sheikhName = formData.get('sheikhName');
                const sheikhPhone = formData.get('sheikhPhone');
                const level = formData.get('level');

                let photoUrl = "#", certUrl = "#", paymentUrl = "#";
                let uploadSuccess = false;
                let dataSavedToCloud = false; // New variable to track if textual data was saved

                if (isFirebaseConfigured && db) {
                    // 1. Try to upload files (Optional/Best Effort)
                    if (storage) {
                        try {
                            if (btnText) btnText.textContent = 'جاري رفع الملفات...';

                            const uploadWithProgress = async (file, folder, label) => {
                                if (!file || file.size === 0) return "#";
                                const storageRef = storage.ref(`${folder}/${Date.now()}_${file.name}`);
                                const uploadTask = storageRef.put(file);
                                const snapshot = await Promise.race([uploadTask, timeout(15000)]); // 15 seconds per file
                                return await snapshot.ref.getDownloadURL();
                            };

                            const personalPhoto = document.getElementById('personalPhoto').files[0];
                            const birthCertificate = document.getElementById('birthCertificate').files[0];
                            const paymentScreenshot = document.getElementById('paymentScreenshot').files[0];

                            photoUrl = await uploadWithProgress(personalPhoto, 'personal_photos', 'الصورة الشخصية');
                            certUrl = await uploadWithProgress(birthCertificate, 'birth_certificates', 'شهادة الميلاد');
                            paymentUrl = await uploadWithProgress(paymentScreenshot, 'payment_screenshots', 'إيصال الدفع');
                            uploadSuccess = true;
                        } catch (fileErr) {
                            console.warn("File upload failed, proceeding with data only:", fileErr);
                        }
                    }

                    // 2. ALWAYS try to save the textual data
                    try {
                        if (btnText) btnText.textContent = 'جاري حفظ البيانات الأساسية...';
                        await Promise.race([
                            db.collection('registrations').add({
                                studentName, phone1, phone2, address, sheikhName, sheikhPhone, level,
                                photoUrl, certUrl, paymentUrl,
                                imagesUploaded: uploadSuccess,
                                submissionDate: firebase.firestore.FieldValue.serverTimestamp()
                            }),
                            timeout(10000)
                        ]);
                        dataSavedToCloud = true;
                    } catch (dbErr) {
                        console.error("Cloud DB Error:", dbErr);
                    }
                }

                // WhatsApp Logic
                const whatsappNumber = '201002200841';
                let messageText = `✨ *استمارة تقديم جديدة - مسابقة حامل القرآن* ✨\n\n`;
                messageText += `📝 *بيانات المتسابق:*\n━━━━━━━━━━━━━━━\n👤 *الاسم:* ${studentName}\n🏆 *المستوى:* ${level}\n\n`;
                messageText += `📞 *بيانات التواصل:*\n━━━━━━━━━━━━━━━\n📱 *رقم الواتساب:* ${phone1}\n☎️ *رقم إضافي:* ${phone2}\n📍 *العنوان:* ${address}\n\n`;
                messageText += `👨‍🏫 *بيانات المحفظ:*\n━━━━━━━━━━━━━━━\n🕋 *الشيخ المحفظ:* ${sheikhName}\n📞 *رقم الشيخ:* ${sheikhPhone}\n\n`;

                if (!uploadSuccess) {
                    messageText += `⚠️ *تنبيه:* يرجى إرفاق الصور (الشخصية، الشهادة، الإيصال) في هذه المحادثة الآن.`;
                }

                if (dataSavedToCloud) {
                    messageText += `\n✅ *ملاحظة:* تم حفظ البيانات نصياً في لوحة التحكم.`;
                }

                const encodedText = encodeURIComponent(messageText);
                window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');

                localStorage.setItem(`registered_${studentName}`, 'true');
                registrationForm.reset();
                registrationForm.querySelectorAll('.file-custom-btn').forEach(btn => {
                    btn.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> اختر من معرض الصور`;
                });

                if (dataSavedToCloud) {
                    alert(uploadSuccess ? 'تم التسجيل ورفع الصور بنجاح!' : 'تم حفظ البيانات بنجاح، يرجى إرسال الصور عبر الواتساب الآن.');
                } else {
                    alert('تم فتح الواتساب لإرسال البيانات.');
                }

            } catch (error) {
                console.error("Critical Error:", error);
                alert('حدث خطأ غير متوقع: ' + error.message);
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
