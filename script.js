// Particle Background System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.isActive = true;
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    getRandomColor() {
        const colors = ['#22d3ee', '#3b82f6', '#8b5cf6', '#06b6d4', '#a855f7'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Pause animation when tab is hidden
        document.addEventListener('visibilitychange', () => {
            this.isActive = document.visibilityState === 'visible';
        });
    }

    animate() {
        if (!this.isActive) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Mouse interaction
            if (this.mouse.x != null && this.mouse.y != null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (100 - distance) / 100;
                    
                    particle.x -= forceDirectionX * force * 2;
                    particle.y -= forceDirectionY * force * 2;
                }
            }

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();

            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.globalAlpha = (1 - distance / 150) * 0.2;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// Typing Animation
class TypingAnimation {
    constructor(elementId, text, speed = 100, delay = 0) {
        this.element = document.getElementById(elementId);
        this.text = text;
        this.speed = speed;
        this.delay = delay;
        this.index = 0;
    }

    start() {
        setTimeout(() => {
            this.type();
        }, this.delay);
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Scroll Reveal Animation
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-on-scroll');
        this.skillBars = document.querySelectorAll('.skill-bar');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Animate skill bars if present
                    const skillBar = entry.target.querySelector('.skill-bar');
                    if (skillBar) {
                        const width = skillBar.getAttribute('data-width');
                        setTimeout(() => {
                            skillBar.style.width = width;
                        }, 200);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
}

// Mouse Tracking for Card Glow
class CardGlowEffect {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .skill-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
}

// Smooth Scroll for Navigation Links
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
    }
}

// Mobile Menu Toggle
class MobileMenu {
    constructor() {
        this.btn = document.getElementById('mobile-menu-btn');
        this.menu = document.getElementById('mobile-menu');
        this.init();
    }

    init() {
        this.btn.addEventListener('click', () => {
            this.menu.classList.toggle('hidden');
            const icon = this.btn.querySelector('i');
            if (this.menu.classList.contains('hidden')) {
                icon.setAttribute('data-lucide', 'menu');
            } else {
                icon.setAttribute('data-lucide', 'x');
            }
            lucide.createIcons();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.btn.contains(e.target) && !this.menu.contains(e.target)) {
                this.menu.classList.add('hidden');
                const icon = this.btn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    }
}

// Navigation Background on Scroll
class NavigationScroll {
    constructor() {
        this.nav = document.getElementById('navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.nav.classList.add('shadow-lg', 'shadow-black/20');
                this.nav.style.background = 'rgba(2, 6, 23, 0.95)';
            } else {
                this.nav.classList.remove('shadow-lg', 'shadow-black/20');
                this.nav.style.background = 'rgba(2, 6, 23, 0.8)';
            }
        });
    }
}

// Parallax Effect for Hero Section
class ParallaxEffect {
    constructor() {
        this.hero = document.getElementById('home');
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const shapes = this.hero.querySelectorAll('.animate-pulse');
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 20;
                const x = (window.innerWidth * mouseX - shape.offsetLeft) / speed;
                const y = (window.innerHeight * mouseY - shape.offsetTop) / speed;
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
}

// Form Handling
class ContactForm {
    constructor() {
        this.form = document.querySelector('form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message
            const btn = this.form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> Message Sent!';
            btn.classList.remove('from-cyan-500', 'to-blue-600');
            btn.classList.add('from-green-500', 'to-emerald-600');
            lucide.createIcons();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.add('from-cyan-500', 'to-blue-600');
                btn.classList.remove('from-green-500', 'to-emerald-600');
                lucide.createIcons();
                this.form.reset();
            }, 3000);
        });
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particle System
    new ParticleSystem();
    
    // Initialize Typing Animations
    const typing1 = new TypingAnimation('typing-text-1', "Hi, I'm Aashita Dash", 100, 500);
    const typing2 = new TypingAnimation('typing-text-2', "Computer Science Student | AI & Data Enthusiast", 50, 2500);
    
    typing1.start();
    typing2.start();
    
    // Initialize Other Components
    new ScrollReveal();
    new CardGlowEffect();
    new SmoothScroll();
    new MobileMenu();
    new NavigationScroll();
    new ParallaxEffect();
    new ContactForm();
    
    // Re-initialize Lucide icons after dynamic content
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
});

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});