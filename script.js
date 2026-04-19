// Attendre que le document soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {

    // 1. Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Empêche le rechargement de la page
            
            // Récupération des données
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            
            // Animation du bouton pendant l'envoi
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Envoi en cours...";
            btn.disabled = true;

            // Simulation d'un envoi (on attend 1.5 seconde)
            setTimeout(() => {
                alert(`Merci ${name} ! Votre message a bien été envoyé (simulation).`);
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }

    // 2. Changement de style du header au scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = "0.8rem 2rem";
            header.style.backgroundColor = "rgba(15, 23, 42, 0.95)";
        } else {
            header.style.padding = "1.5rem 2rem";
            header.style.backgroundColor = "rgba(15, 23, 42, 0.9)";
        }
    });

    // 3. Animation d'apparition (Reveal) au défilement
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // On applique l'animation aux cartes de projets et au titre de section
    const itemsToAnimate = document.querySelectorAll('.projet-card, .section-title');
    itemsToAnimate.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(30px)";
        item.style.transition = "all 0.6s ease-out";
        observer.observe(item);
    });

});
