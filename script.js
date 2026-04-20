/**
 * CHOCOLUX - Moteur de l'application
 */

// --- DONNÉES ---
const CAKES = [
  {id:1, name:"Ganache Royale", desc:"Trois couches de chocolat noir belge 70%, ganache veloutée et éclats de caramel salé.", price:18500, orders:342, tag:"best", p:"8-10 pers", note:"4.9", emoji:"🍫"},
  {id:2, name:"Anniversaire Étoile", desc:"Gâteau d'anniversaire aux fraises, crème chantilly légère et décoration personnalisable.", price:14500, orders:218, emoji:"🍓", tag:"", p:"6-8 pers", note:"4.8"},
  {id:3, name:"Forêt Noire Prestige", desc:"Génoise cacao, cerises griottines, chantilly exquise. Un classique revisité avec art.", price:22000, orders:156, emoji:"🍒", tag:"", p:"10-12 pers", note:"4.7"},
  {id:4, name:"Red Velvet Luxe", desc:"Éponge rouge écarlate et frosting cream cheese vanille. Élégant et savoureux.", price:19500, orders:187, emoji:"❤️", tag:"", p:"8-10 pers", note:"4.8"},
  {id:5, name:"Fondant Caramel", desc:"Cœur fondant chocolat noir, sauce caramel beurre salé, croustillant praliné noisette.", price:16000, orders:201, emoji:"🍮", tag:"", p:"6-8 pers", note:"4.9"},
  {id:6, name:"Opéra Doré", desc:"Biscuit joconde, crème beurre café, ganache chocolat. La pâtisserie française par excellence.", price:25000, orders:94, emoji:"☕", tag:"", p:"10-12 pers", note:"4.6"},
  {id:7, name:"Moka Arabica", desc:"Génoise café arabica d'exception, mousse café-chocolat, glaçage miroir doré.", price:17500, orders:128, emoji:"🫖", tag:"", p:"8-10 pers", note:"4.7"},
  {id:8, name:"Framboise Chic", desc:"Dacquoise amande, mousse framboise acidulée, coulis fruits rouges et fleurs comestibles.", price:21000, orders:67, emoji:"🫐", tag:"least", p:"8-10 pers", note:"4.5"}
];

const DEL = 1500;
let cart = [];
let fidCount = parseInt(localStorage.getItem('chx_fid') || '0');
let hasFree = localStorage.getItem('chx_free') === 'true';

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderCakes();
    updFid();
    initUIEffects();
    initContactForm();
});

// --- UTILITAIRES ---
const fp = (n) => n.toLocaleString('fr-FR');

function toast(msg) {
    const box = document.getElementById('toast-box');
    if (!box) return;
    const d = document.createElement('div');
    d.className = 'toast';
    d.textContent = msg;
    box.appendChild(d);
    setTimeout(() => d.remove(), 3500);
}

// --- LOGIQUE PANIER ---
function addCart(id, qty = 1, note = '', addr = '') {
    const cake = CAKES.find(c => c.id === id);
    if (!cake) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        const isFreeItem = hasFree && cart.length === 0;
        cart.push({ ...cake, qty, note, addr, free: isFreeItem });
        if (isFreeItem) {
            hasFree = false;
            localStorage.setItem('chx_free', 'false');
        }
    }
    renderCart();
    updCnt();
    toast(`🎂 ${cake.name} ajouté au panier !`);
}

function renderCart() {
    const body = document.getElementById('cart-body');
    const footer = document.getElementById('cart-ft');
    if (!body) return;

    if (cart.length === 0) {
        body.innerHTML = '<div class="cart-empty">🛍️<br/>Panier vide</div>';
        if (footer) footer.style.display = 'none';
        return;
    }

    if (footer) footer.style.display = 'block';
    body.innerHTML = cart.map(item => `
        <div class="c-item">
            <div class="c-emoji">${item.emoji}</div>
            <div class="c-iinfo">
                <div class="c-iname">${item.name}</div>
                <div class="c-iprice">${item.free ? 'GRATUIT 🎁' : fp(item.price * item.qty) + ' FCFA'}</div>
            </div>
            <button class="c-rm" onclick="remCart(${item.id})">🗑️</button>
        </div>
    `).join('');

    const total = cart.reduce((s, i) => s + (i.free ? 0 : i.price * i.qty), 0) + DEL;
    document.getElementById('cart-total').textContent = `${fp(total)} FCFA`;
}

function updCnt() {
    const cnt = document.getElementById('cart-cnt');
    if (cnt) cnt.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function updFid() {
    const fill = document.getElementById('fp-fill');
    if (fill) fill.style.width = `${(fidCount / 10) * 100}%`;
}

// --- GESTION INTERFACE (UI) ---
function initUIEffects() {
    // Header scroll
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

    // Reveal Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.cake-card, .section-title').forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(30px)";
        item.style.transition = "all 0.6s ease-out";
        observer.observe(item);
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const name = new FormData(contactForm).get('name');
        
        btn.innerText = "Envoi en cours...";
        btn.disabled = true;

        setTimeout(() => {
            toast(`Merci ${name} ! Message envoyé.`);
            contactForm.reset();
            btn.innerText = "Envoyer";
            btn.disabled = false;
        }, 1500);
    });
}

// --- RENDU CATALOGUE ---
function renderCakes() {
    const grid = document.getElementById('cakes-grid');
    if (!grid) return;
    grid.innerHTML = CAKES.map(c => `
        <div class="cake-card">
            <div class="ck-img">${c.emoji}</div>
            <div class="ck-body">
                <div class="ck-name">${c.name}</div>
                <div class="ck-price">${fp(c.price)} FCFA</div>
                <button class="btn-add" onclick="addCart(${c.id})">+ Panier</button>
            </div>
        </div>
    `).join('');
}