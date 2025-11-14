// Persist marquee animation state across page loads
(function() {
    // Get all tape elements
    const tapes = document.querySelectorAll('.tape');
    
    if (tapes.length === 0) return;
    
    // Create a unique key for this page
    const pageKey = window.location.pathname;
    const storageKey = `marquee-state-${pageKey}`;
    
    // Function to get animation progress
    function getAnimationProgress(element) {
        const animations = element.getAnimations ? element.getAnimations() : [];
        const animation = animations.length > 0 ? animations[0] : null;
        if (!animation) return null;
        
        const currentTime = animation.currentTime || 0;
        const duration = animation.effect ? animation.effect.getTiming().duration : 30000;
        return currentTime % duration;
    }
    
    // Function to set animation progress using animation-delay
    function setAnimationProgress(element, progress) {
        if (progress === null || progress === undefined) return;
        
        // Use negative animation-delay to start animation at specific point
        // Duration is 30s (30000ms) based on CSS
        const duration = 30000;
        const delay = -(progress % duration) / 1000; // Convert to seconds, make negative
        
        // Remove any existing animation, then reapply with delay
        const animationName = getComputedStyle(element).animationName;
        const animationDuration = getComputedStyle(element).animationDuration || '30s';
        const animationTiming = getComputedStyle(element).animationTimingFunction || 'linear';
        const animationIteration = getComputedStyle(element).animationIterationCount || 'infinite';
        
        element.style.animation = 'none';
        element.offsetHeight; // Force reflow
        element.style.animation = `${animationName} ${animationDuration} ${animationTiming} ${delay}s ${animationIteration}`;
    }
    
    // Save state periodically and before page unload
    function saveStates() {
        const states = {};
        tapes.forEach((tape, index) => {
            const inner = tape.querySelector('.tape-inner');
            if (inner) {
                const progress = getAnimationProgress(inner);
                if (progress !== null) {
                    states[index] = progress;
                }
            }
        });
        
        if (Object.keys(states).length > 0) {
            try {
                sessionStorage.setItem(storageKey, JSON.stringify(states));
            } catch (e) {
                // Storage might be full or disabled
            }
        }
    }
    
    // Save state every 2 seconds
    setInterval(saveStates, 2000);
    
    // Save state before page unload
    window.addEventListener('beforeunload', saveStates);
    
    // Restore state on page load
    function restoreStates() {
        try {
            const saved = sessionStorage.getItem(storageKey);
            if (saved) {
                const states = JSON.parse(saved);
                
                // Wait for animations to initialize - try multiple times
                let attempts = 0;
                const maxAttempts = 15;
                
                function tryRestore() {
                    attempts++;
                    let allReady = true;
                    
                    tapes.forEach((tape, index) => {
                        if (states[index] !== undefined) {
                            const inner = tape.querySelector('.tape-inner');
                            if (inner) {
                                // Try to get animation
                                let animation = null;
                                try {
                                    const animations = inner.getAnimations ? inner.getAnimations() : [];
                                    animation = animations.length > 0 ? animations[0] : null;
                                } catch (e) {
                                    // Fallback: check computed style
                                    const animName = getComputedStyle(inner).animationName;
                                    if (animName && animName !== 'none') {
                                        animation = { effect: { getTiming: () => ({ duration: 30000 }) } };
                                    }
                                }
                                
                                if (animation) {
                                    setAnimationProgress(inner, states[index]);
                                } else if (attempts < maxAttempts) {
                                    allReady = false;
                                }
                            }
                        }
                    });
                    
                    if (!allReady && attempts < maxAttempts) {
                        setTimeout(tryRestore, 200);
                    }
                }
                
                // Start trying after animations have a chance to initialize
                setTimeout(tryRestore, 500);
            }
        } catch (e) {
            // Couldn't restore state
            console.log('Could not restore marquee state:', e);
        }
    }
    
    // Try multiple times to ensure animations are ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', restoreStates);
    } else {
        restoreStates();
    }
    
    window.addEventListener('load', function() {
        setTimeout(restoreStates, 100);
    });
    
    // Also try after a delay to catch late-loading animations
    setTimeout(restoreStates, 1000);
})();
