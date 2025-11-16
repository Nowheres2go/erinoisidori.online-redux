// Custom Animated Cursor - Using cursor.cur and interactive hover effects
// Creates an animated, responsive cursor that transforms into a donut circle on link hover

class CustomCursor {
    constructor() {
        this.cursorDonut = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.animationId = null;
        this.isActive = false;
        
        // Check if custom cursor should be enabled (not on touch devices)
        if (window.matchMedia('(pointer: fine)').matches) {
            this.init();
        }
    }

    init() {
        // Use cursor.cur as default cursor
        document.body.style.cursor = 'url(/cursor.cur), auto';
        
        // Create donut circle for hover effects (ring with transparent center)
        // Using thick border to create the donut ring (transparent center is automatic)
        this.cursorDonut = document.createElement('div');
        this.cursorDonut.id = 'cursor-donut';
        this.cursorDonut.style.cssText = `
            position: fixed;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 8px solid #FCBE11;
            background-color: transparent;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease-out, width 0.3s ease-out, height 0.3s ease-out, border-width 0.3s ease-out;
            will-change: transform, opacity;
            box-shadow: 0 0 0 3px #104626;
        `;
        
        // Create inner green border circle at the circumference of the inner yellow circle
        // Positioned at the inner edge of the yellow border
        const innerBorder = document.createElement('div');
        innerBorder.id = 'cursor-inner-border';
        innerBorder.style.cssText = `
            position: absolute;
            width: calc(100% - 16px);
            height: calc(100% - 16px);
            border-radius: 50%;
            border: 2px solid #104626;
            background-color: transparent;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            box-sizing: border-box;
        `;
        
        this.cursorDonut.appendChild(innerBorder);
        document.body.appendChild(this.cursorDonut);
        
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            if (!this.isActive) {
                this.start();
            }
        });
        
        // Handle hover on all links
        this.setupLinkHovers();
        
        // Hide cursor when mouse leaves window
        document.addEventListener('mouseleave', () => {
            if (this.cursorDonut) this.cursorDonut.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            // Donut only shows on link hover, not on mouse enter
        });
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
        
        // Smooth follow effect (easing)
        this.cursorX += (this.mouseX - this.cursorX) * 0.2;
        this.cursorY += (this.mouseY - this.cursorY) * 0.2;
        
        // Update donut position
        if (this.cursorDonut) {
            this.cursorDonut.style.left = this.cursorX + 'px';
            this.cursorDonut.style.top = this.cursorY + 'px';
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    setupLinkHovers() {
        // Find all links (including those added dynamically)
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                this.onLinkHover(e.target);
            });
            
            link.addEventListener('mouseleave', (e) => {
                this.onLinkLeave(e.target);
            });
        });
        
        // Use MutationObserver to handle dynamically added links
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'A') {
                            node.addEventListener('mouseenter', (e) => this.onLinkHover(e.target));
                            node.addEventListener('mouseleave', (e) => this.onLinkLeave(e.target));
                        }
                        // Check for links within the node
                        const childLinks = node.querySelectorAll('a');
                        childLinks.forEach(link => {
                            link.addEventListener('mouseenter', (e) => this.onLinkHover(e.target));
                            link.addEventListener('mouseleave', (e) => this.onLinkLeave(e.target));
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    onLinkHover(linkElement) {
        // Hide default cursor on both body and the link itself with !important
        document.body.style.setProperty('cursor', 'none', 'important');
        if (linkElement) {
            linkElement.style.setProperty('cursor', 'none', 'important');
        }
        
        // Also hide cursor on all links to prevent any override
        document.querySelectorAll('a').forEach(link => {
            link.style.setProperty('cursor', 'none', 'important');
        });
        
        if (this.cursorDonut) {
            this.cursorDonut.style.opacity = '1';
            this.cursorDonut.style.width = '80px';
            this.cursorDonut.style.height = '80px';
            this.cursorDonut.style.borderWidth = '10px';
            this.cursorDonut.style.boxShadow = '0 0 0 4px #104626';
            
            // Update inner border to match circumference of inner yellow circle
            // With 80px donut and 10px border, inner edge is at 60px (80 - 10*2)
            const innerBorder = this.cursorDonut.querySelector('#cursor-inner-border');
            if (innerBorder) {
                innerBorder.style.width = 'calc(100% - 20px)';
                innerBorder.style.height = 'calc(100% - 20px)';
                innerBorder.style.borderWidth = '2.5px';
            }
        }
    }

    onLinkLeave(linkElement) {
        // Restore default cursor
        document.body.style.setProperty('cursor', 'url(/cursor.cur), auto', 'important');
        if (linkElement) {
            linkElement.style.removeProperty('cursor');
        }
        
        // Restore cursor on all links (remove inline style to use CSS defaults)
        document.querySelectorAll('a').forEach(link => {
            link.style.removeProperty('cursor');
        });
        
        if (this.cursorDonut) {
            this.cursorDonut.style.opacity = '0';
            this.cursorDonut.style.width = '60px';
            this.cursorDonut.style.height = '60px';
            this.cursorDonut.style.borderWidth = '8px';
            this.cursorDonut.style.boxShadow = '0 0 0 3px #104626';
            
            // Reset inner border to match circumference of inner yellow circle
            // With 60px donut and 8px border, inner edge is at 44px (60 - 8*2)
            const innerBorder = this.cursorDonut.querySelector('#cursor-inner-border');
            if (innerBorder) {
                innerBorder.style.width = 'calc(100% - 16px)';
                innerBorder.style.height = 'calc(100% - 16px)';
                innerBorder.style.borderWidth = '2px';
            }
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CustomCursor();
    });
} else {
    new CustomCursor();
}

