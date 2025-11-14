// Grid overlay toggle for brutalist design
(function() {
    // Create grid overlay element
    const gridOverlay = document.createElement('div');
    gridOverlay.id = 'grid-overlay';
    gridOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        display: none;
        opacity: 0.3;
    `;
    
    // Create grid lines
    const gridSize = 20; // 20px grid
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position: absolute; top: 0; left: 0;';
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'grid');
    pattern.setAttribute('width', gridSize);
    pattern.setAttribute('height', gridSize);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${gridSize} 0 L 0 0 0 ${gridSize}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#104626');
    path.setAttribute('stroke-width', '1');
    
    pattern.appendChild(path);
    defs.appendChild(pattern);
    svg.appendChild(defs);
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'url(#grid)');
    svg.appendChild(rect);
    
    gridOverlay.appendChild(svg);
    document.body.appendChild(gridOverlay);
    
    // Toggle function
    let isVisible = false;
    function toggleGrid() {
        isVisible = !isVisible;
        gridOverlay.style.display = isVisible ? 'block' : 'none';
        localStorage.setItem('grid-overlay-visible', isVisible);
    }
    
    // Restore state from localStorage
    const savedState = localStorage.getItem('grid-overlay-visible');
    if (savedState === 'true') {
        isVisible = true;
        gridOverlay.style.display = 'block';
    }
    
    // Expose toggle function globally for button
    window.toggleGridOverlay = toggleGrid;
})();

