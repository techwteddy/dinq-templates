/**
 * Motor Interativo do Projeto Aniversário (Local Dev Engine)
 * Foco: Alta Disponibilidade UI, Organização Modular e UX Fluida.
 */

// 1. Sistema de Notificações
const Toast = {
    container: document.getElementById('toast-container'),
    show(message, type = 'info', duration = 3000) {
        if (!this.container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        this.container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => toast.remove());
        }, duration);
    }
};

// 2. Lógica da Galeria de Polaroides
const Gallery = (() => {
    const memories = [
        { src: './imgs/gallery/1.png', caption: 'Momentos inesquecíveis ✨', tilt: 'tilt-left' },
        { src: './imgs/gallery/2.png', caption: 'Conexões verdadeiras ❤️', tilt: 'tilt-right' },
        { src: './imgs/gallery/3.png', caption: 'Caminhos que se cruzam 🌅', tilt: 'tilt-left-extreme' },
        { src: './imgs/gallery/4.png', caption: 'Celebrando a vida 🎂', tilt: 'tilt-right-extreme' },
        { src: './imgs/gallery/5.png', caption: 'Pequenos grandes instantes ☕', tilt: 'tilt-left' },
        { src: './imgs/gallery/6.png', caption: 'Juntos em cada aventura 🌊', tilt: 'tilt-right' }
    ];

    const init = () => {
        const grid = document.getElementById('polaroid-grid');
        if (!grid) return;
        grid.innerHTML = '';
        memories.forEach((mem, idx) => {
            const safeSrc = encodeURI(mem.src);
            const html = `
                <div class="polaroid-card ${mem.tilt} opacity-0">
                    <img src="${safeSrc}" alt="Memória ${idx + 1}">
                    <div class="caption-container">
                        <p class="polaroid-caption" data-src="${mem.src}">${mem.caption || ''}</p>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', html);
        });
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        grid.querySelectorAll('.opacity-0').forEach(el => observer.observe(el));
    };

    return { init };
})();

// 3. Envelope e Partículas
const setupEnvelope = () => {
    const envelope = document.getElementById('love-envelope');
    const letterSection = document.querySelector('.letter-section');
    const closeBtn = document.getElementById('close-letter-btn');
    const isMobile = () => window.innerWidth <= 768;

    if (!envelope) return;

    envelope.addEventListener('click', (e) => {
        if (e.target.closest('.letter-content')) return;
        if (isMobile() && envelope.classList.contains('open')) return;
        if (e.target.closest('#close-letter-btn')) return;

        envelope.classList.toggle('open');
        if (letterSection) letterSection.classList.toggle('open-spacing');
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            envelope.classList.remove('open');
            if (letterSection) letterSection.classList.remove('open-spacing');
        });
    }
};

const setupScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('fade-in-visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.opacity-0').forEach(el => observer.observe(el));
};

const EmojiRain = (() => {
    const emojis = ['🧸', '🌸', '🎂', '🎈', '🎉', '✨', '💖', '🎁', '🌹', '🥳'];
    const container = document.createElement('div');
    container.id = 'emoji-rain-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;overflow:hidden;';
    const createParticle = () => {
        const particle = document.createElement('span');
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const size = Math.random() * 1.5 + 0.8;
        const startLeft = Math.random() * 100;
        const duration = Math.random() * 10 + 8;
        const opacity = Math.random() * 0.4 + 0.1;
        const drift = (Math.random() - 0.5) * 50;
        particle.style.cssText = `position:absolute;bottom:-50px;left:${startLeft}vw;font-size:${size}rem;opacity:${opacity};transition:transform ${duration}s linear, opacity ${duration}s ease-in-out;`;
        container.appendChild(particle);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                particle.style.transform = `translate(${drift}px, -110vh) rotate(${Math.random() * 360}deg)`;
                particle.style.opacity = '0';
            });
        });
        setTimeout(() => particle.remove(), duration * 1000);
    };
    const init = () => {
        document.body.appendChild(container);
        setInterval(createParticle, 600);
    };
    return { init };
})();


// 5. Mini Player de Música
const MusicPlayer = (() => {
    let audio, btn, icon, started = false;
    const toggle = () => {
        if (!audio) return;
        if (audio.paused) {
            audio.play();
            icon.textContent = '⏸️';
            btn.classList.add('playing');
        } else {
            audio.pause();
            icon.textContent = '▶️';
            btn.classList.remove('playing');
        }
    };
    const autoplayOnFirstTouch = () => {
        if (started) return;
        started = true;
        audio.play().then(() => {
            icon.textContent = '⏸️';
            btn.classList.add('playing');
        }).catch(() => { });
        document.removeEventListener('click', autoplayOnFirstTouch);
        document.removeEventListener('touchstart', autoplayOnFirstTouch);
        document.removeEventListener('scroll', autoplayOnFirstTouch);
    };
    const init = () => {
        audio = document.getElementById('bg-music');
        btn = document.getElementById('music-toggle');
        icon = document.getElementById('music-icon');
        if (!audio || !btn) return;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            started = true;
            toggle();
        });
        document.addEventListener('click', autoplayOnFirstTouch, { once: true });
        document.addEventListener('touchstart', autoplayOnFirstTouch, { once: true });
        document.addEventListener('scroll', autoplayOnFirstTouch, { once: true });
    };
    return { init };
})();

// Inicialização Global
document.addEventListener('DOMContentLoaded', () => {
    Gallery.init();
    EmojiRain.init();
    setupEnvelope();
    setupScrollAnimations();
    MusicPlayer.init();
});
