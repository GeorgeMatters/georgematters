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

// Attach event listeners to navigation links
function attachNavListeners() {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;

    document.querySelectorAll('.main-navigation a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - headerHeight,
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

// Slider functionality
function startSlideshow() {
    const slider = document.getElementById('image-slider');
    const slides = Array.from(slider.getElementsByClassName('slide'));
    let currentIndex = 0;

    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentIndex || index === (currentIndex + 1) % slides.length || index === (currentIndex + 2) % slides.length) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }

    slider.querySelector('.next').addEventListener('click', nextSlide);
    slider.querySelector('.prev').addEventListener('click', prevSlide);

    // Automatic movement
    setInterval(nextSlide, 5000);

    updateSlider(); // Initialize the slider
}

// Load and initialize sections
document.addEventListener("DOMContentLoaded", function() {
    loadHTML('html/header.html', 'header', attachNavListeners);
    loadHTML('html/home.html', 'home');
    loadHTML('html/about.html', 'about');
    loadHTML('html/slider.html', 'slider', startSlideshow);
    loadHTML('html/socialmedia.html', 'social');
    loadHTML('html/services.html', 'services');
    loadHTML('html/projects.html', 'projects');
    loadHTML('html/contact.html', 'contact', initializeContactForm);
    loadHTML('html/footer.html', 'footer');
});
