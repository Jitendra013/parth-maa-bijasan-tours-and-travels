// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active Navigation Link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function activateNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Booking Form Handling with Web3Forms (free - no backend, mail direct aapke inbox mein)
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');

// Sirf ye ek key daalo - https://web3forms.com pe jao, apna email dalo, jo key email mein aaye woh yahan paste karo
const WEB3FORMS_ACCESS_KEY = '0e5cf48d-b82a-4ef0-be0f-01dfb3ddd3bb';

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = bookingForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            pickup: document.getElementById('pickup').value.trim(),
            destination: document.getElementById('destination').value.trim(),
            date: document.getElementById('date').value,
            vehicle: document.getElementById('vehicle').value,
            message: document.getElementById('message').value.trim()
        };
        
        if (!formData.name || !formData.phone || !formData.pickup || !formData.destination || !formData.date) {
            showMessage('Please fill in all required fields.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }
        
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            showMessage('Please enter a valid 10-digit Indian phone number.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }
        
        if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY') {
            showMessage('Setup required: Get your free key from https://web3forms.com and paste it in script.js (line ~85).', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }
        
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: 'New Booking - ' + formData.name + ' (' + formData.phone + ')',
                    from_name: formData.name,
                    botcheck: document.querySelector('input[name="botcheck"]')?.value || '',
                    name: formData.name,
                    phone: formData.phone,
                    pickup: formData.pickup,
                    destination: formData.destination,
                    date: formData.date,
                    vehicle: formData.vehicle || 'Not specified',
                    message: formData.message || 'None'
                })
            });
            const data = await res.json();
            if (data.success) {
                showMessage('Thank you! Your inquiry has been submitted. We will contact you soon.', 'success');
                bookingForm.reset();
                setTimeout(hideMessage, 5000);
            } else {
                showMessage(data.message || 'Could not send. Please try again or call us.', 'error');
            }
        } catch (err) {
            console.error('Web3Forms Error:', err);
            showMessage('Network error. Please check internet and try again, or call us.', 'error');
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });
}

// Fallback mailto function
function sendViaMailto(formData) {
    const emailBody = `
New Booking Inquiry from Parth Maa Bijasan Tours & Travels Website

Name: ${formData.name}
Phone: ${formData.phone}
Pickup Location: ${formData.pickup}
Destination: ${formData.destination}
Travel Date: ${formData.date}
Preferred Vehicle: ${formData.vehicle || 'Not specified'}
Additional Message: ${formData.message || 'None'}

---
This inquiry was submitted from the website contact form.
    `.trim();
    
    const email = 'shuklajitendra013@gmail.com';
    const subject = encodeURIComponent('New Booking Inquiry - ' + formData.name);
    const body = encodeURIComponent(emailBody);
    
    // Open email client
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    
    showMessage('Thank you! Your email client will open. Please send the email to complete your inquiry.', 'success');
    
    setTimeout(() => {
        bookingForm.reset();
        hideMessage();
    }, 8000);
}

function showMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function hideMessage() {
    if (formMessage) {
        formMessage.style.display = 'none';
    }
}

// Set minimum date to today for date input
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Gallery Lightbox (Simple Implementation)
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img && img.src) {
            // Create a simple lightbox
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;
            
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', () => {
                document.body.removeChild(lightbox);
            });
        }
    });
});

// Advanced Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        }
    });
}, observerOptions);

// Enhanced Scroll Reveal Animations
document.addEventListener('DOMContentLoaded', () => {
    // Add reveal class to elements
    const animatedElements = document.querySelectorAll('.vehicle-card, .service-card, .feature-card, .gallery-item, .contact-item');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.9)';
        el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Animate numbers/counters if any
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Smooth scroll with easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// WhatsApp Button Animation
const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat) {
    whatsappFloat.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
    });
    
    whatsappFloat.addEventListener('mouseleave', function() {
        this.style.animation = 'pulse 2s infinite';
    });
}

// Phone number formatting (Indian format)
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    });
}

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Footer Logo Handling - Hide if image doesn't load
document.addEventListener('DOMContentLoaded', function() {
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        // Check if image exists and loaded
        const img = new Image();
        img.onload = function() {
            // Image loaded successfully, keep it visible
            footerLogo.style.display = 'block';
        };
        img.onerror = function() {
            // Image failed to load, hide it completely
            footerLogo.style.display = 'none';
            footerLogo.style.width = '0';
            footerLogo.style.height = '0';
            footerLogo.style.margin = '0';
            footerLogo.style.padding = '0';
            footerLogo.style.visibility = 'hidden';
            footerLogo.style.opacity = '0';
        };
        img.src = footerLogo.src;
        
        // Also add error event listener as backup
        footerLogo.addEventListener('error', function() {
            this.style.display = 'none';
            this.style.width = '0';
            this.style.height = '0';
            this.style.margin = '0';
            this.style.padding = '0';
            this.style.visibility = 'hidden';
            this.style.opacity = '0';
        });
        
        // Check if already failed
        if (footerLogo.complete && footerLogo.naturalHeight === 0) {
            footerLogo.style.display = 'none';
            footerLogo.style.width = '0';
            footerLogo.style.height = '0';
            footerLogo.style.margin = '0';
            footerLogo.style.padding = '0';
            footerLogo.style.visibility = 'hidden';
            footerLogo.style.opacity = '0';
        }
    }
});

// Console message for developers
console.log('%cParth Maa Bijasan Tours & Travels', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cWebsite developed with ❤️ for premium travel services', 'color: #6b7280; font-size: 12px;');
