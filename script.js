/**
 * Rolems Ramos - Portfolio Interactions
 * Vanilla JavaScript ES6+
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const toast = document.getElementById('toast-notification');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyTooltip = document.getElementById('copy-tooltip');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const contactForm = document.getElementById('contact-form');
  const successBanner = document.getElementById('form-success-banner');

  // =========================================================================
  // 1. Mobile Menu Toggle & Navigation
  // =========================================================================
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 2. Navbar Scroll Style & Back-to-Top Button
  // =========================================================================
  const handleScroll = () => {
    const scrollPos = window.scrollY;

    // Navbar background blur switch
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 3. Active Nav Link on Scroll (Intersection Observer)
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // =========================================================================
  // 4. Skills Progress Bar Animation on Scroll
  // =========================================================================
  const progressBars = document.querySelectorAll('.progress-fill');

  if ('IntersectionObserver' in window && progressBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => skillsObserver.observe(bar));
  } else {
    // Fallback if IntersectionObserver not supported
    progressBars.forEach(bar => bar.classList.add('animated'));
  }

  // =========================================================================
  // 5. Projects Filtering
  // =========================================================================
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // =========================================================================
  // 6. Toast Notification Helper
  // =========================================================================
  let toastTimer = null;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  // =========================================================================
  // 7. Copy Email to Clipboard
  // =========================================================================
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'rolemsr25@gmail.com';

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback method
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        if (copyTooltip) {
          copyTooltip.textContent = 'Copied!';
          copyTooltip.classList.add('show');
          setTimeout(() => {
            copyTooltip.textContent = 'Copy';
            copyTooltip.classList.remove('show');
          }, 2000);
        }

        showToast('Email copied to clipboard: ' + email);
      } catch (err) {
        showToast('Direct email: ' + email);
      }
    });
  }

  // =========================================================================
  // 8. Contact Form Handling
  // =========================================================================
  if (contactForm) {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const serviceSelect = document.getElementById('form-service');
    const messageInput = document.getElementById('form-message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (input, isValid) => {
      if (isValid) {
        input.classList.remove('error');
      } else {
        input.classList.add('error');
      }
      return isValid;
    };

    // Live validation on blur
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        validateField(nameInput, nameInput.value.trim().length > 0);
      });
      nameInput.addEventListener('input', () => {
        if (nameInput.classList.contains('error')) {
          validateField(nameInput, nameInput.value.trim().length > 0);
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        validateField(emailInput, emailRegex.test(emailInput.value.trim()));
      });
      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
          validateField(emailInput, emailRegex.test(emailInput.value.trim()));
        }
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', () => {
        validateField(messageInput, messageInput.value.trim().length > 0);
      });
      messageInput.addEventListener('input', () => {
        if (messageInput.classList.contains('error')) {
          validateField(messageInput, messageInput.value.trim().length > 0);
        }
      });
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length > 0);
      const isEmailValid = validateField(emailInput, emailRegex.test(emailInput.value.trim()));
      const isMsgValid = validateField(messageInput, messageInput.value.trim().length > 0);

      if (!isNameValid || !isEmailValid || !isMsgValid) {
        showToast('Please fill in all required fields correctly.');
        return;
      }

      const name = encodeURIComponent(nameInput.value.trim());
      const email = encodeURIComponent(emailInput.value.trim());
      const service = encodeURIComponent(serviceSelect ? serviceSelect.value : 'Inquiry');
      const message = encodeURIComponent(messageInput.value.trim());

      const mailtoSubject = `Inquiry: ${service} from ${name}`;
      const mailtoBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0AService: ${service}%0D%0A%0D%0AMessage:%0D%0A${message}`;
      const mailtoUrl = `mailto:rolemsr25@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Show success state
      if (successBanner) {
        successBanner.classList.add('visible');
      }

      showToast('Opening email client...');

      // Trigger mailto dispatch
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 600);

      // Reset form fields after submission
      contactForm.reset();
    });
  }

  // =========================================================================
  // 9. Live Philippine Local Time Clock
  // =========================================================================
  const phLiveClock = document.getElementById('ph-live-clock');

  // Live Philippine Local Time (GMT+8)
  const updatePHClock = () => {
    if (!phLiveClock) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Manila',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      phLiveClock.textContent = `${timeStr} GMT+8`;
    } catch (e) {
      phLiveClock.textContent = 'GMT+8';
    }
  };

  updatePHClock();
  setInterval(updatePHClock, 30000);
});
