// Particle Background System - Subtle animated particles responding to mouse movement
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.isActive = false;
        
        // Brutalist color palette
        this.colors = ['#104626', '#FCBE11', '#FAFAFA'];
        
        this.init();
    }

    init() {
        // Style canvas to be a subtle background layer
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.15';
        this.canvas.id = 'particle-canvas';
        document.body.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        
        // Only animate if page is visible
        if (document.visibilityState === 'visible') {
            this.start();
        }
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // Pause animation when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.start();
            } else {
                this.stop();
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Recreate particles with new dimensions
        if (this.particles.length === 0) {
            this.createParticles();
        }
    }

    createParticles() {
        const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 15000));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    animate() {
        if (!this.isActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // React to mouse proximity
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 150;
            
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                particle.vx += (dx / distance) * force * 0.05;
                particle.vy += (dy / distance) * force * 0.05;
                
                // Slight opacity increase near mouse
                particle.opacity = Math.min(1, particle.opacity + force * 0.1);
            } else {
                // Gradually return to base opacity
                particle.opacity = Math.max(0.2, particle.opacity - 0.01);
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Damping
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Draw particle in brutalist style (rectangular/square particles)
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.beginPath();
            // Draw as small rectangles for brutalist aesthetic
            const size = particle.radius * 2;
            this.ctx.fillRect(
                particle.x - size / 2,
                particle.y - size / 2,
                size,
                size
            );
        });
        
        // Draw connections between nearby particles
        this.drawConnections();
        
        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.strokeStyle = '#104626';
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.1;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ParticleBackground();
    });
} else {
    new ParticleBackground();
}

