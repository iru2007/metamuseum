// --- 1. DATI SIMULATI (Il nostro database finto) ---
// Usiamo immagini da Unsplash per un look professionale
const artworks = [
    {
        id: 1,
        title: "Cyber Renaissance",
        artist: "Alessia V.",
        image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        basePrice: 500, // Prezzo di partenza
        likes: 120,
        views: 1400,
        bids: 5,
        trend: "up" // Per la freccina nel mercato
    },
    {
        id: 2,
        title: "Neon Solitude",
        artist: "Marco D.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        basePrice: 350,
        likes: 45,
        views: 600,
        bids: 2,
        trend: "stable"
    },
    {
        id: 3,
        title: "Quantum Dreams",
        artist: "AI Collective",
        image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        basePrice: 800,
        likes: 310,
        views: 5000,
        bids: 12,
        trend: "up"
    },
    {
        id: 4,
        title: "Glitch Soul",
        artist: "Sara K.",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        basePrice: 200,
        likes: 20,
        views: 150,
        bids: 0,
        trend: "down"
    }
];

// Crediti utente simulati
let userCredits = 1000;

// --- 2. ALGORITMO DI VALORE DINAMICO [cite: 11] ---
// Formula: Prezzo = Base + (Likes * 0.5) + (Views * 0.05) + (Bids * 5)
function calculatePrice(art) {
    const likeVal = art.likes * 0.5;
    const viewVal = art.views * 0.05;
    const bidVal = art.bids * 5.0;
    
    // Calcoliamo e arrotondiamo a 2 decimali
    return (art.basePrice + likeVal + viewVal + bidVal).toFixed(2);
}

// --- 3. RENDERING (Creazione HTML via JS) ---

function initGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    const marketBody = document.getElementById('market-body');

    // Puliamo prima di riempire (utile se ricarichiamo i dati)
    galleryContainer.innerHTML = '';
    marketBody.innerHTML = '';

    artworks.forEach(art => {
        const currentPrice = calculatePrice(art);

        // A. Creazione Card Galleria
        const card = document.createElement('div');
        card.className = 'art-card';
        card.onclick = () => openModal(art); // Al click apre la modale
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${art.image}" alt="${art.title}">
            </div>
            <div class="card-info">
                <h3 class="card-title">${art.title}</h3>
                <p class="card-artist">${art.artist}</p>
                <div class="card-stats">
                    <span class="price-tag">${currentPrice} MC</span>
                    <span class="likes-count"><i class="fa-solid fa-eye"></i> ${art.views}</span>
                </div>
            </div>
        `;
        galleryContainer.appendChild(card);

        // B. Creazione Riga Mercato
        const row = document.createElement('tr');
        // Icona trend
        let trendIcon = art.trend === 'up' ? '<i class="fa-solid fa-arrow-trend-up" style="color:var(--neon-blue)"></i>' : 
                        art.trend === 'down' ? '<i class="fa-solid fa-arrow-trend-down" style="color:red"></i>' : 
                        '<i class="fa-solid fa-minus" style="color:gray"></i>';
        
        row.innerHTML = `
            <td>${art.title}</td>
            <td>${trendIcon}</td>
            <td>${currentPrice} MC</td>
            <td style="color:${art.trend === 'up' ? 'var(--neon-blue)' : 'white'}">${art.trend === 'up' ? '+2.4%' : '0%'}</td>
        `;
        marketBody.appendChild(row);
    });
}

// --- 4. GESTIONE MODALE E INTERAZIONI ---

const modal = document.getElementById('art-modal');
const closeModal = document.querySelector('.close-modal');
let currentArtId = null; // Tiene traccia di quale opera è aperta

function openModal(art) {
    currentArtId = art.id;
    
    // Simuliamo una "View" appena si apre l'opera [cite: 13]
    art.views += 1;
    
    // Popoliamo i dati nella modale
    document.getElementById('modal-img').src = art.image;
    document.getElementById('modal-title').innerText = art.title;
    document.getElementById('modal-artist').innerText = art.artist;
    updateModalPrice(art);
    
    modal.style.display = "block";
    
    // Ridisegna la griglia sotto per aggiornare le view
    initGallery();
}

function updateModalPrice(art) {
    const price = calculatePrice(art);
    document.getElementById('modal-price').innerText = `${price} MetaCredits`;
}

// Chiudi modale
closeModal.onclick = () => { modal.style.display = "none"; }
window.onclick = (event) => {
    if (event.target == modal) { modal.style.display = "none"; }
}

// Bottoni Like e Bid nella modale
document.getElementById('btn-like').onclick = () => {
    const art = artworks.find(a => a.id === currentArtId);
    if(art) {
        art.likes += 1; // Aumenta like
        updateModalPrice(art); // Aggiorna prezzo a video
        initGallery(); // Aggiorna tutto il sito
        alert("Like aggiunto! Il valore dell'opera è salito.");
    }
};

document.getElementById('btn-bid').onclick = () => {
    const art = artworks.find(a => a.id === currentArtId);
    if(art) {
        art.bids += 1; // Aumenta offerte
        updateModalPrice(art);
        initGallery();
        alert("Offerta simulata inviata! La domanda di mercato fa salire il prezzo.");
    }
};

// Funzione scroll
window.scrollToSection = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// --- 5. ANIMAZIONI GSAP (L'effetto WOW) ---
// Aspetta che la pagina sia caricata
window.onload = () => {
    initGallery();

    // Animazione Hero Elements
    gsap.from(".hero-content h1", { duration: 1, y: 50, opacity: 0, ease: "power3.out" });
    gsap.from(".subtitle", { duration: 1, y: 30, opacity: 0, delay: 0.3, ease: "power3.out" });
    gsap.from(".cta-group", { duration: 1, y: 30, opacity: 0, delay: 0.6, ease: "power3.out" });

    // Animazione Scroll (Le sezioni appaiono mentre scorri)
    gsap.utils.toArray("section").forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // inizia quando la sezione è all'80% dello schermo
            },
            y: 50,
            opacity: 0,
            duration: 1
        });
    });
};
