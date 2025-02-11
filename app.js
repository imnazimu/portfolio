// Function to scroll to home/header section
function scrollToHome() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Scroll to home on page load
window.addEventListener('load', function() {
  window.scrollTo(0, 0);
});

// Also handle when page is refreshed
if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) {
  window.scrollTo(0, 0);
}

// Handle logo click
document.querySelector('.logo a').addEventListener('click', function(e) {
  e.preventDefault();
  scrollToHome();
});

// Navigation smooth scroll
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    
    // If clicking home link, scroll to top
    if (targetId === '#home') {
      scrollToHome();
      return;
    }
    
    // For other sections
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      const navHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Mobile menu code
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const mobileMenu = document.querySelector('.nav-links');
    if (mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
    }
  });
});

// Initialize EmailJS with your public key
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Add your EmailJS public key here
})();

function sendEmail(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: 'mtonoy1@gmail.com',
        from_name: name,
        from_email: email,
        message: message,
    }).then(
        function(response) {
            console.log("SUCCESS", response);
            document.getElementById('contactForm').reset();
            showPopup('success', 'Thank you for your message!');
        },
        function(error) {
            console.log("FAILED", error);
            showPopup('error', 'Oops, Please try again later');
        }
    );

    return false;
}

function showPopup(type, message) {
    const popup = document.createElement('div');
    popup.className = 'popup-message';
    
    popup.innerHTML = `
        <div class="popup-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-heart-broken'}"></i>
            <h3>${type === 'success' ? 'Thank You!' : 'Oops!'}</h3>
            <p>${message}</p>
        </div>
    `;

    document.querySelector('.contact-form').appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

// Video hover autoplay functionality
document.addEventListener('DOMContentLoaded', function() {
  // Handle all video containers
  for (let i = 1; i <= 3; i++) {
    const videoContainer = document.getElementById(`videoContainer${i}`);
    const iframe = videoContainer.querySelector('iframe');
    const originalSrc = iframe.src;

    videoContainer.addEventListener('mouseenter', function() {
      // Add autoplay and start from beginning
      iframe.src = originalSrc + '&autoplay=1&start=0';
    });

    videoContainer.addEventListener('mouseleave', function() {
      // Reset video by reloading original source
      iframe.src = originalSrc;
    });
  }
});

// Update Video Slider Functionality
let currentIndex = 0;
const slider = document.querySelector('.video-slider');
const videos = document.querySelectorAll('.slider-video');
let autoSlideInterval;
let isHovered = false;

function updateSlider() {
  videos.forEach((video, index) => {
    video.className = 'slider-video';
    
    if (index === currentIndex) {
      video.classList.add('active');
      if (isHovered) video.classList.add('instant');
    } else if (index === (currentIndex - 1 + videos.length) % videos.length) {
      video.classList.add('prev');
      if (isHovered) video.classList.add('instant');
    } else if (index === (currentIndex + 1) % videos.length) {
      video.classList.add('next');
      if (isHovered) video.classList.add('instant');
    }
  });

  // Update indicator dots
  const dots = document.querySelectorAll('.slider-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });

  // Remove instant class after transition
  if (isHovered) {
    setTimeout(() => {
      videos.forEach(video => video.classList.remove('instant'));
    }, 50);
  }
}

function slideVideos() {
  if (!isHovered) {
    currentIndex = (currentIndex + 1) % videos.length;
    updateSlider();
  }
}

function startAutoSlide() {
  autoSlideInterval = setInterval(slideVideos, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Initialize slider and start auto-sliding
updateSlider();
startAutoSlide();

// Add hover detection for all videos
document.querySelectorAll('.slider-video').forEach((video) => {
  const iframe = video.querySelector('iframe');
  const originalSrc = iframe.src;

  video.addEventListener('mouseenter', () => {
    // Start playing the video regardless of position
    iframe.src = originalSrc + '&autoplay=1&mute=0';
    isHovered = true;
    stopAutoSlide();  // Stop sliding while video is being watched
  });

  video.addEventListener('mouseleave', () => {
    // Stop the video
    iframe.src = originalSrc;
    isHovered = false;
    startAutoSlide();  // Resume sliding
  });
});

// Add click functionality to dots
document.querySelectorAll('.slider-dot').forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    updateSlider();
  });
});

// Update video hover functionality for folder videos
document.querySelectorAll('.folder-container').forEach(folder => {
  const videos = folder.querySelectorAll('.video-container iframe');
  const originalSrcs = Array.from(videos).map(iframe => iframe.src);

  // Store original video sources
  videos.forEach((iframe, index) => {
    iframe.dataset.originalSrc = originalSrcs[index];
  });

  // Handle folder hover
  folder.addEventListener('mouseleave', () => {
    // Reset all videos in this folder to original state
    videos.forEach(iframe => {
      iframe.src = iframe.dataset.originalSrc;
    });
  });
});

// Handle individual video hover
document.querySelectorAll('.folder-content .video-container').forEach(container => {
  const iframe = container.querySelector('iframe');

  container.addEventListener('mouseenter', () => {
    if (container.closest('.folder-container:hover')) {
      // Only autoplay if folder is still being hovered
      const originalSrc = iframe.dataset.originalSrc;
      
      // Stop other videos
      document.querySelectorAll('.folder-content .video-container iframe').forEach(otherIframe => {
        if (otherIframe !== iframe) {
          otherIframe.src = otherIframe.dataset.originalSrc;
        }
      });
      
      // Play this video
      iframe.src = originalSrc + '&autoplay=1&mute=0';
    }
  });

  container.addEventListener('mouseleave', () => {
    iframe.src = iframe.dataset.originalSrc;
  });
});

// Initialize particles.js with video editing theme
particlesJS('particles-js',
  {
    "particles": {
      "number": {
        "value": 40,  // Reduced for better performance
        "density": {
          "enable": true,
          "value_area": 900
        }
      },
      "color": {
        "value": ["#1dbf73", "#ffffff", "#11819a"]  // Multiple colors
      },
      "shape": {
        "type": ["circle", "triangle", "edge"],  // Different shapes like editing controls
        "stroke": {
          "width": 1,
          "color": "#1dbf73"
        }
      },
      "opacity": {
        "value": 0.3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 4,
          "size_min": 0.3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#1dbf73",
        "opacity": 0.2,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "bounce",  // Particles bounce off edges
        "bounce": true,
        "attract": {
          "enable": true,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"  // Connect particles on hover
        },
        "onclick": {
          "enable": true,
          "mode": "push"  // Add particles on click
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 0.5
          }
        },
        "push": {
          "particles_nb": 3
        }
      }
    },
    "retina_detect": true
  }
);

// Scroll reveal animation
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Performance optimized code
document.addEventListener('DOMContentLoaded', function() {
  // Lazy loading for videos
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        if (iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
          videoObserver.unobserve(iframe);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });

  // Apply lazy loading to all iframes
  document.querySelectorAll('iframe').forEach(iframe => {
    iframe.dataset.src = iframe.src;
    iframe.removeAttribute('src');
    videoObserver.observe(iframe);
  });

  // Optimized animations with requestAnimationFrame
  let ticking = false;
  let lastScrollY = window.scrollY;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }

  function updateOnScroll() {
    // Your scroll-based animations here
    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Debounced event handlers
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimized hover effects
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      requestAnimationFrame(() => {
        card.querySelector('.service-card-inner').style.transform = 'rotateY(180deg)';
      });
    });

    card.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        card.querySelector('.service-card-inner').style.transform = 'rotateY(0)';
      });
    });
  });

  // Optimized particles.js configuration
  particlesJS('particles-js', {
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      opacity: { value: 0.2 },
      size: { value: 3 },
      move: { speed: 1 }
    }
  });

  // Reduced CSS complexity with class toggling
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // Better event handling for service cards
  const progressBars = document.querySelectorAll('.progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          entry.target.style.width = '90%';
        });
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => progressObserver.observe(bar));
});
