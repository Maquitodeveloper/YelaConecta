// Inicializar librería AOS (Animate On Scroll)
document.addEventListener("DOMContentLoaded", function() {
    AOS.init({
        once: true, // La animación ocurre solo una vez al hacer scroll
        offset: 100, // Desplazamiento (en px) desde el elemento original para activar la animación
    });
});

// Efecto en la barra de navegación al hacer scroll
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        navbar.style.padding = '0.8rem 0';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.padding = '1rem 0';
    }
});

// Smooth Scrolling para los enlaces de anclaje
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Compensar la altura del navbar fijo
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
