document.addEventListener('DOMContentLoaded', function () {

    // Inicializar EmailJS
    // NOTA: Reemplaza 'YOUR_PUBLIC_KEY' con tu clave pública de EmailJS
    // Obténla en: https://dashboard.emailjs.com/admin/account
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY'); // Reemplazar con tu Public Key
    }

    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });


    setTimeout(() => {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.innerHTML = '';
            typeWriter();
        }
    }, 1500);

    initializeEventListeners();

    addProgressBar();
});

function initializeEventListeners() {
    window.addEventListener('scroll', handleScroll);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });

    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.addEventListener('click', closeNavbarCollapse);
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }

    addCardHoverEffects();
}

function handleScroll() {
    const scrolled = window.pageYOffset;

    const navbar = document.querySelector('.navbar-custom');
    if (navbar) {
        if (scrolled > 50) {
            navbar.style.backgroundColor = 'rgba(13, 27, 42, 0.98)';
        } else {
            navbar.style.backgroundColor = 'rgba(13, 27, 42, 0.95)';
        }
    }

    handleParallaxEffects(scrolled);

    updateProgressBar();
}

function handleParallaxEffects(scrolled) {
    const heroSection = document.querySelector('.hero-section');
    const shapes = document.querySelectorAll('.shape');

    if (heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
}

function handleSmoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function closeNavbarCollapse() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
            bsCollapse.hide();
        }
    }
}

function typeWriter() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const text = 'Desarrollador Web Full Stack';
    let index = 0;

    function type() {
        if (index < text.length) {
            heroSubtitle.innerHTML = text.substring(0, index + 1) + '<span class="cursor" style="animation: blink 1s infinite;">|</span>';
            index++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                heroSubtitle.innerHTML = text;
            }, 500);
        }
    }

    type();
}

function handleFormSubmission(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!validateForm(name, email, subject, message)) {
        return;
    }

    animateFormSubmission();
}

function validateForm(name, email, subject, message) {
    if (!name || !email || !subject || !message) {
        showAlert('Por favor completa todos los campos.', 'warning');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Por favor ingresa un email válido.', 'warning');
        return false;
    }

    return true;
}

function animateFormSubmission() {
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enviando...';
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');

    // Obtener los valores del formulario
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Si EmailJS está configurado, enviar el correo
    if (typeof emailjs !== 'undefined' && emailjs.send) {
        // NOTA: Reemplaza 'YOUR_SERVICE_ID' y 'YOUR_TEMPLATE_ID'
        // con tus IDs de EmailJS de: https://dashboard.emailjs.com/
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                showAlert('¡Mensaje enviado exitosamente! Te contactaré pronto.', 'success');
                document.getElementById('contactForm').reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-loading');
            }, function (error) {
                console.log('FAILED...', error);
                showAlert('Error al enviar el mensaje. Inténtalo nuevamente.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-loading');
            });
    } else {
        // Simulación si EmailJS no está configurado
        setTimeout(() => {
            showAlert('¡Mensaje simulado! Configura EmailJS para envío real.', 'warning');
            document.getElementById('contactForm').reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
        }, 2000);
    }
}

function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="bi bi-${getAlertIcon(type)} me-2"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `;

    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        animation: slideInRight 0.5s ease-out;
        max-width: 400px;
        color: white;
        background: ${getAlertColor(type)};
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => alert.remove(), 500);
        }
    }, 5000);
}

function getAlertIcon(type) {
    switch (type) {
        case 'success': return 'check-circle-fill';
        case 'warning': return 'exclamation-triangle-fill';
        case 'error': return 'x-circle-fill';
        default: return 'info-circle-fill';
    }
}

function getAlertColor(type) {
    switch (type) {
        case 'success': return 'linear-gradient(135deg, #28a745, #20c997)';
        case 'warning': return 'linear-gradient(135deg, #ffc107, #fd7e14)';
        case 'error': return 'linear-gradient(135deg, #dc3545, #e83e8c)';
        default: return 'linear-gradient(135deg, #17a2b8, #6f42c1)';
    }
}

function addCardHoverEffects() {
    document.querySelectorAll('.card-project').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });
}

function addProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, #415A77, #778DA9);
        z-index: 9999;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
    `;
    document.body.appendChild(progressBar);
}

function updateProgressBar() {
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = winScroll / height;
        progressBar.style.transform = `scaleX(${scrolled})`;
    }
}

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe skill items for stagger animation
    document.querySelectorAll('.skill-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
}

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(300px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(300px);
            }
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        .btn-loading {
            pointer-events: none;
            opacity: 0.8;
        }
        
        .alert-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .alert-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
        }
        
        .alert-close:hover {
            opacity: 0.7;
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Loading animation for buttons */
        .btn-loading::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            margin: auto;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: button-loading-spinner 1s ease infinite;
        }
        
        @keyframes button-loading-spinner {
            from {
                transform: rotate(0turn);
            }
            to {
                transform: rotate(1turn);
            }
        }
    `;
    document.head.appendChild(style);
}

window.addEventListener('load', () => {
    addDynamicStyles();
    observeElements();
});