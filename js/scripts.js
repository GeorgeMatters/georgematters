// Modified loadHTML function
function loadHTML(url, id, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = data;
                if (callback) callback();

                // Check cookie consent after loading each section
                //checkCookieConsent();
            }
        }).catch(error => console.error('Error loading HTML:', error));
}


// Cookie Consent Logic
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function checkCookieConsent() {
    console.log('Checking cookie consent');
    var cookiesSection = document.getElementById('cookies');
    if (cookiesSection && getCookie('cookieConsent') !== '1') {
        console.log('Checking cookie, set to block');
        cookiesSection.style.display = 'block';
    }
}


function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-navigation');
    const navLinks = document.querySelectorAll('.nav-link'); // Select all navigation links

    if (hamburger && nav) {
        // Toggle the visibility of the navigation menu
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('is-active');
        });

        // Close the navigation menu when any navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-active');
            });
        });
    } else {
        console.error('Hamburger menu or navigation elements not found!');
    }
}


function initCookies() {
    // Set up the event listener for the consent button
    var consentButton = document.getElementById('cookieConsentButton');
    if (consentButton) {
        consentButton.addEventListener('click', function() {
            // Set a cookie for 1 year to record consent
            setCookie('cookieConsent', '1', 365);

            // Hide the cookie consent banner
            var cookiesSection = document.getElementById('cookies');
            if (cookiesSection) {
                cookiesSection.style.display = 'none';
            }
        });
    }

    // Check if the cookie consent banner should be displayed
    checkCookieConsent();
}

// Function to initialize the home slider
function initHomeSlider() {
    const slides = document.querySelectorAll('.home-section .home-slide');
    let currentSlide = 0;
    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    setInterval(showNextSlide, 5000); // Change slide every 5 seconds
}

// Attach event listeners to all internal navigation links
function attachNavListeners() {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    initHamburger()
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize the contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let isFormValid = true;

        Array.from(contactForm.elements).forEach(input => {
            if (input.type !== "submit" && !validateInput(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            alert('Thank you for your message! We will get back to you soon.');
        } else {
            console.log('Please fill out all the fields correctly.');
        }
    });

    function validateInput(input) {
        const isValid = input.checkValidity();
        input.parentElement.classList.toggle('invalid', !isValid);
        return isValid;
    }
}

function startSlideshow() {
    const slider = document.getElementById('image-slider');
    const slides = Array.from(slider.getElementsByClassName('slide'));
    let currentIndex = 0;

    function updateSlider() {
        if (currentIndex >= slides.length) {
            currentIndex = 0; // Reset to first slide
        }
        const firstIndex = currentIndex;
        const secondIndex = (firstIndex + 1) % slides.length;
        const thirdIndex = (secondIndex + 1) % slides.length;

        slides.forEach((slide, index) => {
            slide.style.display = 'none';
            if (index === firstIndex || index === secondIndex || index === thirdIndex) {
                slide.style.display = 'flex';
            }
        });
    }

    function nextSlide() {
        currentIndex++;
        updateSlider();
    }

    function prevSlide() {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1; // Loop to last slide
        }
        updateSlider();
    }

    slider.querySelector('.next').addEventListener('click', nextSlide);
    slider.querySelector('.prev').addEventListener('click', prevSlide);

    // Automatic movement
    setInterval(nextSlide, 4000); // Change slide every 4 seconds

    updateSlider(); // Initialize the slider
}

// Load and initialize sections when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    loadHTML('html/header.html', 'header', attachNavListeners);
    loadHTML('html/home.html', 'home', initHomeSlider);
    loadHTML('html/about.html', 'about');
    loadHTML('html/slider.html', 'slider', startSlideshow);
    loadHTML('html/socialmedia.html', 'social');
    loadHTML('html/services.html', 'services', attachNavListeners);
    loadHTML('html/projects.html', 'projects');
    loadHTML('html/contact.html', 'contact', initializeContactForm);
    loadHTML('html/footer.html', 'footer', attachNavListeners);
    loadHTML('html/cookies.html', 'cookies', initCookies);

});

