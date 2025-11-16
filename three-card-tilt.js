// 3D Card Tilt Effect using CSS transforms (lightweight alternative to full Three.js)
// This provides smooth 3D tilt effects on artwork cards

class Card3DTilt {
    constructor() {
        this.cards = [];
        this.init();
    }

    init() {
        // Find all post cards (artwork/blog cards)
        const postCards = document.querySelectorAll('.postCard');
        
        postCards.forEach(card => {
            this.setupCard(card);
        });

        // Use MutationObserver to handle dynamically added cards
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const newCards = node.querySelectorAll ? node.querySelectorAll('.postCard') : [];
                        newCards.forEach(card => {
                            if (!this.cards.includes(card)) {
                                this.setupCard(card);
                            }
                        });
                        // Check if the node itself is a card
                        if (node.classList && node.classList.contains('postCard')) {
                            this.setupCard(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    setupCard(card) {
        if (this.cards.includes(card)) return;
        this.cards.push(card);

        // Add perspective to card container if needed
        if (!card.style.perspective) {
            card.style.perspective = '1000px';
            card.style.transformStyle = 'preserve-3d';
            card.style.transition = 'transform 0.1s ease-out';
        }

        // Get card dimensions and position
        const rect = card.getBoundingClientRect();
        let cardCenterX = rect.left + rect.width / 2;
        let cardCenterY = rect.top + rect.height / 2;

        const handleMouseMove = (e) => {
            // Recalculate on each move for scroll changes
            const rect = card.getBoundingClientRect();
            cardCenterX = rect.left + rect.width / 2;
            cardCenterY = rect.top + rect.height / 2;

            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            // Calculate tilt angles (limited to prevent too much rotation)
            const maxTilt = 15; // degrees
            const tiltX = (mouseY / (rect.height / 2)) * maxTilt * -1;
            const tiltY = (mouseX / (rect.width / 2)) * maxTilt;

            // Apply 3D transform
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Add subtle shadow/shine effect
            const intensity = Math.sqrt(mouseX * mouseX + mouseY * mouseY) / Math.max(rect.width, rect.height);
            card.style.filter = `brightness(${1 + intensity * 0.1})`;
        };

        const handleMouseLeave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.filter = 'brightness(1)';
            card.style.transition = 'transform 0.5s ease-out, filter 0.5s ease-out';
        };

        const handleMouseEnter = () => {
            card.style.transition = 'transform 0.1s ease-out, filter 0.1s ease-out';
        };

        // Add event listeners
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        card.addEventListener('mouseenter', handleMouseEnter);

        // Handle touch for mobile
        let touchStartX, touchStartY;
        
        card.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }, { passive: true });

        card.addEventListener('touchmove', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touch = e.touches[0];
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            const mouseX = touch.clientX - cardCenterX;
            const mouseY = touch.clientY - cardCenterY;

            const maxTilt = 10;
            const tiltX = (mouseY / (rect.height / 2)) * maxTilt * -1;
            const tiltY = (mouseX / (rect.width / 2)) * maxTilt;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
        }, { passive: true });

        card.addEventListener('touchend', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            touchStartX = null;
            touchStartY = null;
        }, { passive: true });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Card3DTilt();
    });
} else {
    new Card3DTilt();
}

