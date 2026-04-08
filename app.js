import { createProductCard, createReviewCard } from './components.js';

let appData = { products: [], reviews: [] };
let cart = JSON.parse(localStorage.getItem('da_cake_town_cart')) || [];

async function init() {
    try {
        const response = await fetch('data.json');
        appData = await response.json();
        
        renderProducts('cakes');
        setupEventListeners();
        animateHero();
        initHeroCanvas();
        updateCartUI();
        initChatbot();
        lucide.createIcons();
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}


function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    initParticles();
    animate();
}


function initChatbot() {
    const toggle = document.getElementById('chat-toggle');
    const container = document.getElementById('chatbot-container');
    const close = document.getElementById('close-chat');
    const messages = document.getElementById('chat-messages');
    
    const responses = {
        hours: "We are open every day from 10:30 AM to 12:00 Midnight! Perfect for late-night cravings. 🌙",
        custom: "To order a custom cake, you can use our form on the website or WhatsApp us. We usually need 24-48 hours for complex designs. 🎂",
        delivery: "We deliver within 10km of Shibpur, Howrah. This includes nearby Kolkata areas! 🚚"
    };

    toggle?.addEventListener('click', () => {
        container.classList.toggle('scale-0');
        container.classList.toggle('scale-100');
    });

    close?.addEventListener('click', () => {
        container.classList.add('scale-0');
        container.classList.remove('scale-100');
    });

    document.querySelectorAll('.chat-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.dataset.query;
            const userMsg = document.createElement('div');
            userMsg.className = 'bg-[#3D2B1F] text-white p-3 rounded-2xl self-end ml-auto max-w-[85%] mb-3 text-sm shadow-sm';
            userMsg.innerText = btn.innerText;
            messages.appendChild(userMsg);

            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'bg-[#F4C2C2]/30 p-4 rounded-2xl rounded-tl-none mb-3 text-[#3D2B1F] shadow-sm border border-[#F4C2C2]/50';
                botMsg.innerText = responses[query];
                messages.appendChild(botMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 500);
        });
    });
}

function renderProducts(category) {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.style.opacity = '0';
    
    setTimeout(() => {
        const filtered = category === 'all' 
            ? appData.products 
            : appData.products.filter(p => p.category === category);
        
        grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
        lucide.createIcons();
        grid.style.opacity = '1';
        
        gsap.from("#product-grid .product-card", {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "expo.out"
        });
    }, 300);
}

function setupEventListeners() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.category);
        });
    });

    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');

    cartBtn?.addEventListener('click', () => cartSidebar.classList.remove('translate-x-full'));
    closeCart?.addEventListener('click', () => cartSidebar.classList.add('translate-x-full'));

    const customForm = document.getElementById('custom-cake-form');
    customForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your inquiry has been sent to our master baker. We will contact you on WhatsApp shortly.');
        customForm.reset();
        window.nextStep(1);
    });
}

window.nextStep = (step) => {
    const steps = document.querySelectorAll('.form-step');
    const dots = document.querySelectorAll('.step-dot');
    
    gsap.to('.form-step', { opacity: 0, x: -20, duration: 0.2, onComplete: () => {
        steps.forEach(s => s.classList.add('hidden'));
        const activeStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if(activeStep) {
            activeStep.classList.remove('hidden');
            gsap.fromTo(activeStep, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
        }
    }});

    dots.forEach((dot, idx) => {
        if (idx < step) dot.classList.add('active');
        else dot.classList.remove('active');
    });
};

window.addToCart = (productId, buyNow = false) => {
    const product = appData.products.find(p => p.id === productId);
    cart.push({ ...product, cartId: Date.now() });
    updateCartUI();
    saveCart();
    if (!buyNow) {
        document.getElementById('cart-sidebar').classList.remove('translate-x-full');
    }
};

window.removeFromCart = (cartId) => {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCartUI();
    saveCart();
};

function saveCart() {
    localStorage.setItem('da_cake_town_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const count = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    if(!count || !itemsContainer) return;

    count.innerText = cart.length;
    let total = 0;
    itemsContainer.innerHTML = cart.length === 0 
        ? '<div class="h-64 flex flex-col items-center justify-center text-gray-400"><i data-lucide="shopping-bag" class="w-12 h-12 mb-4 opacity-20"></i><p>Your basket is empty</p></div>'
        : cart.map(item => {
            total += item.price;
            return `<div class="flex items-center gap-4 p-4 bg-[#FFF9F0]/50 rounded-2xl border border-[#F4C2C2]/20">
                <img src="${item.image}" class="w-16 h-16 object-cover rounded-xl shadow-sm">
                <div class="flex-1">
                    <div class="font-bold text-[#3D2B1F]">${item.name}</div>
                    <div class="text-[#C68E17] font-bold text-sm">₹${item.price}</div>
                </div>
                <button onclick="removeFromCart(${item.cartId})" class="p-2 hover:bg-red-50 text-red-400 rounded-full transition-colors"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
            </div>`;
        }).join('');
    
    totalContainer.innerText = `₹${total}`;
    lucide.createIcons();
}

function animateHero() {
    const tl = gsap.timeline();
    tl.to(".hero-title", { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" })
      .to(".hero-subtitle", { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.8")
      .to(".hero-btns", { opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.6");
}

document.addEventListener('DOMContentLoaded', init);


const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        window.location.href = "upi://pay?pa=11252459235@okbizaxis&pn=DaCakeTown&cu=INR";
    });
}

window.showUPI = function(){
document.getElementById("upiPopup").style.display = "block";
}

window.closeUPI = function(){
document.getElementById("upiPopup").style.display = "none";
}

window.orderCake = function(){

if(cart.length === 0){
alert("Your cart is empty!");
return;
}

let message = "Hi, I want to order the following cakes:%0A%0A";

let total = 0;

cart.forEach((item, index) => {
message += (index+1) + ". " + item.name + " - ₹" + item.price + "%0A";
total += item.price;
});

message += "%0A--------------------%0A";
message += "Total Amount: ₹" + total + "%0A";
message += "%0APlease confirm availability and delivery time.";

let whatsappURL = "https://wa.me/918692921044?text=" + message;

window.open(whatsappURL, "_blank");

cart = [];
saveCart();
updateCartUI();
}