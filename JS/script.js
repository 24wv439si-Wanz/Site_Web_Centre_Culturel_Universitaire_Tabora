/**
 * 1. GESTION DU THÈME (APPLICATION IMMÉDIATE)
 */
(function() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
})();

function initTheme() {
    const themeBtn = document.getElementById('theme-switch');
    if (themeBtn) {
        // Mise à jour de l'icône au démarrage
        const theme = document.documentElement.getAttribute('data-theme');
        updateThemeIcon(theme);

        themeBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = (theme === 'dark') ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('theme-switch');
    if (!themeBtn) return;
    themeBtn.innerHTML = (theme === 'dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

/**
 * 2. SLIDER NEWS BELT (VERSION LENTE ET MAJESTUEUSE)
 */
function initNewsBelt() {
    const track = document.getElementById('beltTrack');
    const nextBtn = document.getElementById('nextNews');
    const prevBtn = document.getElementById('prevNews');
    let cards = document.querySelectorAll('.news-card');

    if (!track || cards.length === 0) return;

    // --- SYSTÈME DE CLONAGE ---
    const firstClone1 = cards[0].cloneNode(true);
    const firstClone2 = cards[1].cloneNode(true);
    const lastClone1 = cards[cards.length - 2].cloneNode(true);
    const lastClone2 = cards[cards.length - 1].cloneNode(true);

    track.appendChild(firstClone1);
    track.appendChild(firstClone2);
    track.prepend(lastClone2);
    track.prepend(lastClone1);

    let index = 1;
    const gap = 30;
    let isTransitioning = false;

    function updateSlide(animate = true) {
        if (animate) {
            isTransitioning = true;
            
            // ÉTAPE 1 : DISPARITION TRÈS DOUCE (1.2 seconde pour s'effacer)
            track.style.transition = "opacity 1.2s ease-in-out, filter 1.2s ease-in-out";
            track.style.filter = "brightness(0) blur(8px)";
            track.style.opacity = "0";
            
            // ÉTAPE 2 : DÉPLACEMENT PENDANT LE NOIR (On attend la fin du fondu)
            setTimeout(() => {
                track.style.transition = "none";
                track.style.transform = `translateX(calc(-${index * 100}% - ${index * gap}px))`;
                
                track.offsetHeight; // Force le rendu

                // ÉTAPE 3 : RÉAPPARITION TRÈS LENTE (2 secondes pour une clarté totale)
                // Utilisation de cubic-bezier pour un effet "soyeux"
                track.style.transition = "opacity 2s cubic-bezier(0.4, 0, 0.2, 1), filter 2s cubic-bezier(0.4, 0, 0.2, 1)";
                track.style.filter = "brightness(1) blur(0px)";
                track.style.opacity = "1";
                
                // On ne redonne la main à l'utilisateur qu'une fois la magie finie
                setTimeout(() => { isTransitioning = false; }, 2000);
            }, 1200); 
        } else {
            // Recalage instantané sans animation (pour la boucle infinie)
            track.style.transition = "none";
            track.style.transform = `translateX(calc(-${index * 100}% - ${index * gap}px))`;
            track.style.filter = "brightness(1)";
            track.style.opacity = "1";
        }
    }

    function moveNext() {
        if (isTransitioning) return;
        index++;
        updateSlide(true);
        
        if (index > 3) { 
            setTimeout(() => {
                index = 1;
                updateSlide(false);
            }, 3300); // 1.2s (out) + 2s (in) + un petit battement
        }
    }

    function movePrev() {
        if (isTransitioning) return;
        index--;
        updateSlide(true);
        
        if (index < 1) {
            setTimeout(() => {
                index = 3;
                updateSlide(false);
            }, 3300);
        }
    }

    if (nextBtn) nextBtn.onclick = () => { moveNext(); resetTimer(); };
    if (prevBtn) prevBtn.onclick = () => { movePrev(); resetTimer(); };

    // AUTOMATISME : 6 secondes de lecture + ~3s de transition = 9000ms
    let autoTimer = setInterval(moveNext, 9500);
    function resetTimer() {
        clearInterval(autoTimer);
        autoTimer = setInterval(moveNext, 9500);
    }

    updateSlide(false);
    window.addEventListener('resize', () => updateSlide(false));
}

/**
 * 3. INITIALISATION GÉNÉRALE
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNewsBelt();
    if (typeof handleHeader === 'function') handleHeader();
    if (typeof startEventSlider === 'function') startEventSlider();
});