// Persist marquee animation state across page loads - global state for all pages
// Ensures continuous path (top -> right -> bottom) and prevents animations from getting stuck
(function() {
    // Get all tape elements
    const tapes = document.querySelectorAll('.tape');
    
    if (tapes.length === 0) return;
    
    // Use a global key so state persists across all pages
    const storageKey = 'marquee-global-state';
    const duration = 30000; // 30 seconds
    
    // Base delays for continuous path (from CSS)
    const baseDelays = [0, 21800, 15300]; // Top: 0s, Bottom: 21.8s, Vertical: 15.3s
    
    // Function to get the actual position in the continuous path
    function getContinuousPathPosition(element, tapeIndex) {
        const animations = element.getAnimations ? element.getAnimations() : [];
        const animation = animations.length > 0 ? animations[0] : null;
        if (!animation) return null;
        
        const currentTime = animation.currentTime || 0;
        const baseDelay = baseDelays[tapeIndex] || 0;
        
        // Calculate position in the continuous path (0 to duration)
        // Add base delay to get the actual position in the continuous loop
        const pathPosition = (currentTime + baseDelay) % duration;
        return pathPosition;
    }
    
    // Function to set animation to a specific position in the continuous path
    function setContinuousPathPosition(element, pathPosition, tapeIndex) {
        if (pathPosition === null || pathPosition === undefined) return;
        
        const baseDelay = baseDelays[tapeIndex] || 0;
        
        // Calculate where this animation should be to match the path position
        // pathPosition = (animationTime + baseDelay) % duration
        // So: animationTime = (pathPosition - baseDelay + duration) % duration
        let animationTime = (pathPosition - baseDelay + duration) % duration;
        
        // Convert to negative delay to start animation at this point
        const delay = -(animationTime / 1000);
        
        // Get animation properties from CSS
        const animationName = getComputedStyle(element).animationName;
        const animationDuration = getComputedStyle(element).animationDuration || '30s';
        const animationTiming = getComputedStyle(element).animationTimingFunction || 'linear';
        const animationIteration = getComputedStyle(element).animationIterationCount || 'infinite';
        
        // Remove and reapply animation with the calculated delay
        element.style.animation = 'none';
        element.offsetHeight; // Force reflow
        element.style.animation = `${animationName} ${animationDuration} ${animationTiming} ${delay}s ${animationIteration}`;
    }
    
    // Save state periodically and before page unload
    function saveStates() {
        const states = {};
        let hasValidState = false;
        
        tapes.forEach((tape, index) => {
            const inner = tape.querySelector('.tape-inner');
            if (inner) {
                const pathPosition = getContinuousPathPosition(inner, index);
                if (pathPosition !== null) {
                    states[index] = pathPosition;
                    hasValidState = true;
                }
            }
        });
        
        if (hasValidState) {
            try {
                sessionStorage.setItem(storageKey, JSON.stringify(states));
            } catch (e) {
                // Storage might be full or disabled
            }
        }
    }
    
    // Save state every 1 second for better accuracy
    setInterval(saveStates, 1000);
    
    // Save state before page unload
    window.addEventListener('beforeunload', saveStates);
    
    // Also save on visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            saveStates();
        }
    });
    
    // Restore state on page load
    function restoreStates() {
        try {
            const saved = sessionStorage.getItem(storageKey);
            if (saved) {
                const states = JSON.parse(saved);
                
                // Wait for animations to initialize - try multiple times
                let attempts = 0;
                const maxAttempts = 25;
                
                function tryRestore() {
                    attempts++;
                    let allReady = true;
                    let anyRestored = false;
                    
                    tapes.forEach((tape, index) => {
                        if (states[index] !== undefined) {
                            const inner = tape.querySelector('.tape-inner');
                            if (inner) {
                                // Check if animation exists
                                const animations = inner.getAnimations ? inner.getAnimations() : [];
                                const hasAnimation = animations.length > 0;
                                
                                // Also check computed style as fallback
                                const animName = getComputedStyle(inner).animationName;
                                const styleHasAnimation = animName && animName !== 'none';
                                
                                if (hasAnimation || styleHasAnimation || attempts >= 8) {
                                    // Restore the position in the continuous path
                                    setContinuousPathPosition(inner, states[index], index);
                                    anyRestored = true;
                                } else if (attempts < maxAttempts) {
                                    allReady = false;
                                }
                            }
                        }
                    });
                    
                    // If we restored at least one, we're good
                    if (!allReady && attempts < maxAttempts && !anyRestored) {
                        setTimeout(tryRestore, 150);
                    }
                }
                
                // Start trying after animations have a chance to initialize
                setTimeout(tryRestore, 200);
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
        setTimeout(restoreStates, 50);
    });
    
    // Also try after delays to catch late-loading animations
    setTimeout(restoreStates, 500);
    setTimeout(restoreStates, 1500);
})();
