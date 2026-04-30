document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu on link click
    if (navLinksItems) {
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (hamburger) {
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Form submission without redirecting (AJAX)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent page redirect
            
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Oops! There was a problem submitting your form');
                    }
                }
            } catch (error) {
                alert('Oops! There was a problem submitting your form');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // Add advanced staggered scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to section titles and cards with stagger
    const animatedElements = document.querySelectorAll('.section-title, .skill-card, .project-card, .cert-card, .timeline-item, .contact-info, .contact-form, .about-text');
    
    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.95)';
        
        // Calculate stagger based on siblings if in a grid
        let delay = 0;
        if (el.classList.contains('skill-card') || el.classList.contains('project-card') || el.classList.contains('cert-card')) {
            const siblingIndex = Array.from(el.parentElement.children).indexOf(el);
            delay = siblingIndex * 0.1; // 100ms delay per sibling
        }
        
        // Bouncy cubic-bezier transition
        el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}s`;
        observer.observe(el);
    });

    // Typing effect for the hero tagline
    const typingElement = document.querySelector('.hero h2');
    if (typingElement) {
        const text = typingElement.textContent.trim();
        typingElement.textContent = '';
        
        // Start typing after initial load animations
        setTimeout(() => {
            let i = 0;
            const typeWriter = setInterval(() => {
                if (i < text.length) {
                    typingElement.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeWriter);
                }
            }, 40);
        }, 800);
    }

    // Image Modal Logic
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("modalCaption");
    const closeBtn = document.querySelector(".close-modal");

    window.openModal = function(imageSrc, caption) {
        if (modal && modalImg && captionText) {
            modal.style.display = "block";
            modalImg.src = imageSrc;
            captionText.innerHTML = caption;
            
            // Add a fallback if image is missing so the modal doesn't just show a broken icon
            modalImg.onerror = function() {
                this.src = 'https://via.placeholder.com/800x600/f8fafc/8B5CF6.png?text=Image+Saved+in+Assets';
            };
        }
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
    }

    // Close modal when clicking outside the image
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});
