// 3D Logo Animation using Three.js
// Creates an eye-catching 3D logo in the header
// Three.js will be loaded via CDN script tag

class Logo3D {
    constructor() {
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.logoMesh = null;
        this.animationId = null;
        this.isActive = false;
        
        // Wait for both Three.js and DOM to be ready
        // Since Three.js loads with defer, we need to wait for it properly
        const tryInit = () => {
            // Check if the logo element exists (erinotitle exists on all pages)
            const titleHeader = document.querySelector('#erinotitle');
            
            if (!titleHeader) {
                // Logo header doesn't exist, element not ready yet
                return;
            }
            
            // Check if Three.js is loaded
            if (typeof window.THREE === 'undefined') {
                // Check if script is loading (Three.js with defer)
                const checkThree = setInterval(() => {
                    if (typeof window.THREE !== 'undefined') {
                        clearInterval(checkThree);
                        // Small delay to ensure everything is ready
                        setTimeout(() => this.init(), 150);
                    }
                }, 50);
                // Timeout after 5 seconds
                setTimeout(() => {
                    clearInterval(checkThree);
                    if (typeof window.THREE === 'undefined') {
                        console.warn('Three.js not loaded, skipping 3D logo');
                    }
                }, 5000);
            } else {
                // Three.js is loaded, initialize after small delay
                setTimeout(() => this.init(), 150);
            }
        };
        
        // Wait for window load event to ensure deferred scripts are loaded
        if (document.readyState === 'complete') {
            // Page fully loaded, try init immediately
            tryInit();
        } else {
            // Wait for window load event (fires after all deferred scripts load)
            window.addEventListener('load', () => {
                setTimeout(tryInit, 100);
            }, { once: true });
            // Also try after DOMContentLoaded in case Three.js loads earlier
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(tryInit, 200);
                }, { once: true });
            } else {
                setTimeout(tryInit, 200);
            }
        }
    }

    init() {
        // Find the logo container (erinotitle exists on all pages)
        const titleHeader = document.querySelector('#erinotitle');
        
        if (!titleHeader) return;
        
        // Use the header as container
        this.container = titleHeader;
        if (!this.container) return;

        // Store original logo for fallback
        const originalLogo = titleHeader.querySelector('img');
        if (!originalLogo) return;

        // Get container dimensions
        const rect = this.container.getBoundingClientRect();
        const width = rect.width || 200;
        const height = rect.height || 200;

        // Create Three.js scene
        const THREE = window.THREE;
        if (!THREE) {
            console.warn('Three.js not available');
            return;
        }
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        
        // Create canvas element
        const canvas = this.renderer.domElement;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        canvas.style.overflow = 'hidden';
        
        // Make container relative for positioning
        if (window.getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }
        
        // Hide original logo, show 3D version
        if (originalLogo) {
            originalLogo.style.opacity = '0';
            originalLogo.style.transition = 'opacity 0.3s ease';
        }
        
        this.container.appendChild(canvas);

        // Position camera - adjusted for smaller logo
        this.camera.position.z = 1; // Further back for smaller logo
        this.camera.position.y = 0;
        this.camera.position.x = 0;

        // Create 3D logo from SVG
        this.createLogo();

        // No mouse tracking - logo will rotate on its own

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());

        // Start animation
        this.start();
        
        // Handle visibility
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.start();
            } else {
                this.stop();
            }
        });
    }

    createLogo() {
        const THREE = window.THREE;
        if (!THREE) return;
        
        // Add lighting first
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xFCBE11, 0.5);
        pointLight.position.set(-5, 0, 5);
        this.scene.add(pointLight);

        // Load the SVG as a texture
        const textureLoader = new THREE.TextureLoader();
        const logoTexture = textureLoader.load('/erino.svg', 
            (texture) => {
                // Texture loaded successfully
                // Don't flip Y - keep texture as is
                texture.flipY = false;
                
                // Get container dimensions
                const rect = this.container.getBoundingClientRect();
                const width = rect.width || 200;
                const height = rect.height || 200;
                
                // Calculate aspect ratio to maintain logo proportions
                // Get actual image dimensions from texture
                let aspectRatio = 1;
                if (texture.image) {
                    aspectRatio = texture.image.width / texture.image.height;
                } else {
                    // Fallback: typical logo aspect ratio
                    aspectRatio = width / height;
                }
                
                // Scale to fit container - adjust for mobile
                // Since camera is close (z = 0.5), we use normalized units relative to container
                const isMobile = window.innerWidth <= 1024;
                const scale = isMobile ? 0.6 : 0.8; // Smaller on mobile to prevent overflow
                const normalizedWidth = scale * aspectRatio;
                const normalizedHeight = scale;
                
                // Create a plane with the SVG texture
                const geometry = new THREE.PlaneGeometry(normalizedWidth, normalizedHeight);
                const material = new THREE.MeshStandardMaterial({
                    map: logoTexture,
                    transparent: true,
                    alphaTest: 0.01,
                    metalness: 0.1,
                    roughness: 0.9,
                    side: THREE.DoubleSide // Show both sides
                });
                
                const plane = new THREE.Mesh(geometry, material);
                plane.position.z = 0;
                // Flip vertically to fix upside down
                plane.scale.y = -1;
                // Store initial scale for dynamic flipping
                plane.userData.initialScaleX = 1;
                
                // Add depth with extrusion or second plane for shadow effect
                const depthGeometry = new THREE.PlaneGeometry(normalizedWidth, normalizedHeight);
                const depthMaterial = new THREE.MeshStandardMaterial({
                    map: logoTexture,
                    transparent: true,
                    alphaTest: 0.01,
                    color: 0x000000,
                    opacity: 0.3,
                    metalness: 0,
                    roughness: 1,
                    side: THREE.DoubleSide
                });
                
                const depthPlane = new THREE.Mesh(depthGeometry, depthMaterial);
                depthPlane.position.z = -0.02; // Slightly behind for depth effect
                // Same flipping for depth plane
                depthPlane.scale.y = -1; // Flip vertically
                depthPlane.userData.initialScaleX = 1;
                
                this.logoMesh = new THREE.Group();
                this.logoMesh.add(depthPlane);
                this.logoMesh.add(plane);
                this.scene.add(this.logoMesh);
                
                // Ensure animation is running now that mesh is loaded
                if (!this.isActive && this.renderer && this.scene && this.camera) {
                    this.start();
                }
                
                // Render immediately after creation
                if (this.renderer && this.scene && this.camera) {
                    this.renderer.render(this.scene, this.camera);
                }
            },
            undefined,
            (error) => {
                console.warn('Failed to load erino.svg texture:', error);
                // Fallback: create simple 3D plane without texture
                const geometry = new THREE.PlaneGeometry(1, 0.5);
                const material = new THREE.MeshStandardMaterial({
                    color: 0x104626,
                    metalness: 0.1,
                    roughness: 0.9
                });
                this.logoMesh = new THREE.Mesh(geometry, material);
                this.scene.add(this.logoMesh);
            }
        );
    }

    handleResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const rect = this.container.getBoundingClientRect();
        const width = rect.width || 200;
        const height = rect.height || 200;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        // Ensure canvas doesn't overflow on mobile
        const canvas = this.renderer.domElement;
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        canvas.style.overflow = 'hidden';
    }

    start() {
        if (!this.isActive && this.renderer) {
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
        if (!this.isActive || !this.renderer || !this.scene || !this.camera) {
            this.stop();
            return;
        }

        // Slow horizontal rotation - only rotate the logo, not the red dot
        if (this.logoMesh) {
            // Rotate horizontally at a constant slow speed
            this.logoMesh.rotation.y += 0.005; // Slow rotation (360 degrees every ~20 seconds)
            
            // Keep text readable: flip horizontally when facing backward
            // When rotation is between 90-270 degrees (facing away), flip the texture
            const normalizedRotation = ((this.logoMesh.rotation.y % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
            const isFacingBackward = normalizedRotation > Math.PI / 2 && normalizedRotation < Math.PI * 1.5;
            
            // Apply horizontal flip to all children (plane and depthPlane)
            this.logoMesh.children.forEach(child => {
                if (child.userData.initialScaleX !== undefined) {
                    // Flip horizontally when facing backward so text reads correctly
                    child.scale.x = isFacingBackward ? -Math.abs(child.userData.initialScaleX) : Math.abs(child.userData.initialScaleX);
                }
            });
        }
        // Continue rendering even if logo mesh isn't loaded yet (it will appear once loaded)

        this.renderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize automatically when script loads
// Wait for DOM and ensure Three.js is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit more for deferred scripts to load
        setTimeout(() => {
            try {
                new Logo3D();
            } catch (error) {
                console.warn('3D Logo initialization failed:', error);
            }
        }, 100);
    });
} else {
    // DOM already loaded, wait for window.load to ensure deferred scripts are ready
    if (document.readyState === 'complete') {
        // Everything is loaded, initialize
        setTimeout(() => {
            try {
                new Logo3D();
            } catch (error) {
                console.warn('3D Logo initialization failed:', error);
            }
        }, 100);
    } else {
        // Wait for window load event
        window.addEventListener('load', () => {
            setTimeout(() => {
                try {
                    new Logo3D();
                } catch (error) {
                    console.warn('3D Logo initialization failed:', error);
                }
            }, 200);
        }, { once: true });
    }
}

