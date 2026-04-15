/**
 * 1. GESTION DU THÈME
 */
(function() {
    // Si aucune préférence n'est enregistrée, on choisit 'dark' par défaut
    const theme = localStorage.getItem('theme') || 'dark'; 
    document.documentElement.setAttribute('data-theme', theme);
})();

function initTheme() {
    const themeBtn = document.getElementById('theme-switch');
    if (themeBtn) {
        // On récupère le thème actuel (qui sera 'dark' par défaut maintenant)
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
 * 2. SLIDER NEWS BELT (TA VERSION ORIGINALE - FLUIDITÉ MAXIMALE)
 */
function initNewsBelt() {
    const track = document.getElementById('beltTrack');
    const nextBtn = document.getElementById('nextNews');
    const prevBtn = document.getElementById('prevNews');
    let cards = document.querySelectorAll('.news-card');

    if (!track || cards.length === 0) return;

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
            // Étape 1 : Disparition
            track.style.transition = "opacity 1.2s ease-in-out, filter 1.2s ease-in-out";
            track.style.filter = "brightness(0) blur(8px)";
            track.style.opacity = "0";
            
            setTimeout(() => {
                track.style.transition = "none";
                track.style.transform = `translateX(calc(-${index * 100}% - ${index * gap}px))`;
                track.offsetHeight; 

                // Étape 3 : Réapparition
                track.style.transition = "opacity 2s cubic-bezier(0.4, 0, 0.2, 1), filter 2s cubic-bezier(0.4, 0, 0.2, 1)";
                track.style.filter = "brightness(1) blur(0px)";
                track.style.opacity = "1";
                
                setTimeout(() => { isTransitioning = false; }, 2000);
            }, 1200); 
        } else {
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
            // On réduit légèrement le temps (de 3300ms à 3200ms) 
            // pour que le saut invisible se fasse pile à la fin de l'apparition
            setTimeout(() => {
                index = 1;
                updateSlide(false);
            }, 3200); 
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
            }, 3200);
        }
    }

    if (nextBtn) nextBtn.onclick = () => { moveNext(); resetTimer(); };
    if (prevBtn) prevBtn.onclick = () => { movePrev(); resetTimer(); };

    let autoTimer = setInterval(moveNext, 9500);
    function resetTimer() {
        clearInterval(autoTimer);
        autoTimer = setInterval(moveNext, 9500);
    }

    updateSlide(false);
    window.addEventListener('resize', () => updateSlide(false));
}

/**
 * 3. GESTION DU HEADER (FIXÉ)
 */
function handleHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    const isHomePage = document.body.classList.contains('home-page');
    const checkScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            if (isHomePage) header.classList.remove('scrolled');
            else header.classList.add('scrolled');
        }
    };
    checkScroll();
    window.addEventListener('scroll', checkScroll);
}

/**
 * 4. SLIDER ÉVÉNEMENTS (RÉTABLI)
 */
function startEventSlider() {
    const slides = document.querySelectorAll('.event-slide');
    if (slides.length <= 1) return;
    let current = 0;
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 5000);
}

/**
 * 5. RECHERCHE BIBLIOTHÈQUE
 */
function initLibrarySearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const books = document.querySelectorAll('.book-item');
        let count = 0;
        books.forEach(book => {
            const title = book.querySelector('h4').innerText.toLowerCase();
            if (title.includes(query)) {
                book.style.display = "block";
                count++;
            } else {
                book.style.display = "none";
            }
        });
        const counter = document.getElementById('counter');
        if (counter) counter.innerText = `${count} livre(s) trouvé(s)`;
    });
}

/**
 * INITIALISATION GÉNÉRALE
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    handleHeader();
    initNewsBelt();
    startEventSlider();
    initLibrarySearch();
});

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const clockElement = document.getElementById('live-clock');
    if(clockElement) {
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// Mettre à jour la date aussi
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today  = new Date();
    const dateElement = document.getElementById('current-date');
    if(dateElement) {
        dateElement.textContent = today.toLocaleDateString('fr-FR', options);
    }
}

setInterval(updateClock, 1000);
updateClock();
updateDate();

