// Animated Gradient Background - Similar to YouTube's backlight emulation
// Creates a subtle animated gradient that responds to mouse movement

class GradientBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.isActive = false;
        this.time = 0;
        this.initialized = false;
        
        // Brutalist color palette
        this.colors = {
            green: '#104626',
            yellow: '#FCBE11',
            beige: '#FAFAFA',
            darkBeige: '#d9d9d9'
        };
        
        // Lazy initialization - wait for browser to be idle
        this.lazyInit();
    }
    
    lazyInit() {
        // Use requestIdleCallback if available, otherwise use setTimeout with small delay
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                if (!this.initialized) {
                    this.init();
                }
            }, { timeout: 2000 }); // Timeout after 2 seconds max
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                if (!this.initialized) {
                    this.init();
                }
            }, 100);
        }
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        
        // Style canvas to be a subtle background layer
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-2'; // Behind particle background
        this.canvas.style.opacity = '0.4'; // Subtle but visible
        this.canvas.id = 'gradient-canvas';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.resize();
        
        // Only animate if page is visible
        if (document.visibilityState === 'visible') {
            this.start();
        }
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX / window.innerWidth;
            this.mouse.y = e.clientY / window.innerHeight;
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
        
        this.time += 0.01;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create radial gradients that respond to mouse position
        // Multiple gradient layers for depth
        
        // Primary gradient (responds to mouse)
        const gradient1 = this.ctx.createRadialGradient(
            this.mouse.x * this.canvas.width,
            this.mouse.y * this.canvas.height,
            0,
            this.mouse.x * this.canvas.width,
            this.mouse.y * this.canvas.height,
            Math.max(this.canvas.width, this.canvas.height) * 1.2
        );
        
        // Calculate animated colors with subtle movement
        const animatedGreen = this.hexToRgb(this.colors.green);
        const animatedYellow = this.hexToRgb(this.colors.yellow);
        
        // Primary gradient - subtle green to beige
        gradient1.addColorStop(0, `rgba(${animatedGreen.r}, ${animatedGreen.g}, ${animatedGreen.b}, 0.15)`);
        gradient1.addColorStop(0.3, `rgba(${animatedYellow.r}, ${animatedYellow.g}, ${animatedYellow.b}, 0.1)`);
        gradient1.addColorStop(0.6, `rgba(${animatedGreen.r}, ${animatedGreen.g}, ${animatedGreen.b}, 0.05)`);
        gradient1.addColorStop(1, `rgba(217, 217, 217, 0)`);
        
        this.ctx.fillStyle = gradient1;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Secondary gradient (opposite side, animated)
        const mouseOppositeX = 1 - this.mouse.x;
        const mouseOppositeY = 1 - this.mouse.y;
        
        const gradient2 = this.ctx.createRadialGradient(
            mouseOppositeX * this.canvas.width + Math.sin(this.time * 0.5) * 50,
            mouseOppositeY * this.canvas.height + Math.cos(this.time * 0.5) * 50,
            0,
            mouseOppositeX * this.canvas.width,
            mouseOppositeY * this.canvas.height,
            Math.max(this.canvas.width, this.canvas.height) * 0.8
        );
        
        gradient2.addColorStop(0, `rgba(${animatedYellow.r}, ${animatedYellow.g}, ${animatedYellow.b}, 0.12)`);
        gradient2.addColorStop(0.4, `rgba(${animatedGreen.r}, ${animatedGreen.g}, ${animatedGreen.b}, 0.08)`);
        gradient2.addColorStop(1, `rgba(217, 217, 217, 0)`);
        
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.fillStyle = gradient2;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Third gradient (subtle movement, top-left)
        const gradient3 = this.ctx.createRadialGradient(
            this.canvas.width * 0.2 + Math.sin(this.time * 0.3) * 30,
            this.canvas.height * 0.2 + Math.cos(this.time * 0.3) * 30,
            0,
            this.canvas.width * 0.2,
            this.canvas.height * 0.2,
            Math.max(this.canvas.width, this.canvas.height) * 0.6
        );
        
        gradient3.addColorStop(0, `rgba(${animatedGreen.r}, ${animatedGreen.g}, ${animatedGreen.b}, 0.08)`);
        gradient3.addColorStop(0.5, `rgba(${animatedYellow.r}, ${animatedYellow.g}, ${animatedYellow.b}, 0.04)`);
        gradient3.addColorStop(1, `rgba(217, 217, 217, 0)`);
        
        this.ctx.fillStyle = gradient3;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.globalCompositeOperation = 'source-over';
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new GradientBackground();
    });
} else {
    new GradientBackground();
}

