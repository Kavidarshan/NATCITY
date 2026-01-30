// script.js - FINAL VERSION WITH HAMBURGER FIX
// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const messageForm = document.getElementById('messageForm');
const branchMessageForm = document.getElementById('branchMessageForm');
const expediaLink = document.getElementById('expediaLink');
const bookingLink = document.getElementById('bookingLink');
const currentYearSpan = document.getElementById('currentYear');
const whatsappBtn = document.getElementById('whatsappBtn');

// Fixed Hamburger Menu Toggle
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Function to show message
function showMessage(elementId, message, isSuccess) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        element.style.padding = '12px 15px';
        element.style.marginTop = '15px';
        element.style.borderRadius = '5px';
        element.style.backgroundColor = isSuccess ? '#d4edda' : '#f8d7da';
        element.style.color = isSuccess ? '#155724' : '#721c24';
        element.style.border = `1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'}`;
        element.style.fontSize = '0.95rem';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    } else {
        // If element doesn't exist, create it
        const newElement = document.createElement('div');
        newElement.id = elementId;
        newElement.textContent = message;
        newElement.style.cssText = `
            display: block;
            padding: 12px 15px;
            margin-top: 15px;
            border-radius: 5px;
            background-color: ${isSuccess ? '#d4edda' : '#f8d7da'};
            color: ${isSuccess ? '#155724' : '#721c24'};
            border: 1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'};
            font-size: 0.95rem;
        `;
        
        if (messageForm) {
            messageForm.appendChild(newElement);
        } else if (branchMessageForm) {
            branchMessageForm.appendChild(newElement);
        }
        
        setTimeout(() => {
            newElement.remove();
        }, 5000);
    }
}

// Form submission (home page)
if (messageForm) {
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const branchSelect = document.getElementById('branchSelect');
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const branch = branchSelect ? branchSelect.value : 'General';
        
        // Validate
        if (!name || !email || !message) {
            showMessage('responseMessage', 'Please fill in all required fields.', false);
            return;
        }
        
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showMessage('responseMessage', 'Please enter a valid email address.', false);
            return;
        }
        
        // Prepare data
        const formData = {
            branch: branch,
            name: name,
            email: email,
            subject: subject,
            message: message
        };
        
        // Show loading state
        const submitBtn = messageForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send data to PHP
            const response = await fetch('send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('responseMessage', data.message || 'Message sent successfully! We\'ll get back to you soon.', true);
                // Reset form
                messageForm.reset();
            } else {
                showMessage('responseMessage', data.message || 'Failed to send message. Please try again.', false);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('responseMessage', 'Network error. Please try again.', false);
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Form submission (branch pages)
if (branchMessageForm) {
    branchMessageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const nameInput = document.getElementById('branchName');
        const emailInput = document.getElementById('branchEmail');
        const subjectInput = document.getElementById('branchSubject');
        const messageInput = document.getElementById('branchMessage');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const subject = subjectInput ? subjectInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';
        
        // Get current page to determine branch
        const currentPage = window.location.pathname;
        let branch = 'General';
        if (currentPage.includes('nuwara-eliya')) branch = 'nuwara-eliya';
        if (currentPage.includes('ella')) branch = 'ella';
        
        // Validate
        if (!name || !email || !message) {
            showMessage('branchResponseMessage', 'Please fill in all required fields.', false);
            return;
        }
        
        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showMessage('branchResponseMessage', 'Please enter a valid email address.', false);
            return;
        }
        
        // Prepare data
        const formData = {
            branch: branch,
            name: name,
            email: email,
            subject: subject,
            message: message
        };
        
        // Show loading state
        const submitBtn = branchMessageForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send data to PHP
            const response = await fetch('send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('branchResponseMessage', data.message || 'Message sent successfully! We\'ll get back to you soon.', true);
                // Reset form
                branchMessageForm.reset();
            } else {
                showMessage('branchResponseMessage', data.message || 'Failed to send message. Please try again.', false);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('branchResponseMessage', 'Network error. Please try again.', false);
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Set current year in footer
const currentYear = new Date().getFullYear();
if (currentYearSpan) {
    currentYearSpan.textContent = currentYear;
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') return;
        
        // If it's an external link, don't prevent default
        if (href.startsWith('http')) return;
        
        e.preventDefault();
        
        const targetId = href;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Calculate header height for offset
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 70;
            
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }
    });
});

// Track external link clicks
if (expediaLink) {
    expediaLink.addEventListener('click', () => {
        console.log('Expedia link clicked');
    });
}

if (bookingLink) {
    bookingLink.addEventListener('click', () => {
        console.log('Booking.com link clicked');
    });
}

// WhatsApp button click handler
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function(e) {
        // Get current page to determine branch
        const currentPage = window.location.pathname;
        let branchText = 'General Inquiry';
        
        if (currentPage.includes('nuwara-eliya')) {
            branchText = 'Nuwara Eliya Branch';
        } else if (currentPage.includes('ella')) {
            branchText = 'Ella Branch';
        }
        
        // Update the WhatsApp link with branch info
        const currentHref = this.getAttribute('href');
        const newHref = currentHref.replace('%20about%20', `%20about%20${branchText}%20`);
        this.setAttribute('href', newHref);
        
        console.log('WhatsApp clicked for:', branchText);
    });
}

// Room card hover effect enhancement
document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('NAT City Hotel website loaded successfully');
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        
        if (currentPage.includes(itemHref) && itemHref !== '#' && itemHref !== 'index.html') {
            item.classList.add('active');
        }
        
        // Special case for home page
        if (currentPage.endsWith('index.html') || currentPage.endsWith('/')) {
            if (itemHref === 'index.html' || itemHref === '#home') {
                item.classList.add('active');
            }
        }
    });
    
    // Add animation to elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.room-card, .dish, .feature, .branch-card').forEach(el => {
        observer.observe(el);
    });
    
    // Close dropdowns when clicking outside on mobile
    if (window.innerWidth <= 768) {
        document.addEventListener('click', (e) => {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                if (!dropdown.parentElement.contains(e.target)) {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateY(-10px)';
                }
            });
        });
    }
});