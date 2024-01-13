

// Function to load a HTML file into a target div and execute a callback after loading
function loadHTML(url, id, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = data;
                if (callback) callback();
            }
        }).catch(error => console.error('Error loading HTML:', error));
}

// Function to initialize the home slider
function initHomeSlider() {
    const slides = document.querySelectorAll('.home-section .home-slide');
    let currentSlide = 0;
    attachNavListeners();

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
});    