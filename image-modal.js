// Image modal for artwork pages - click to view full size
(function() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.className = 'image-modal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 10000;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.className = 'image-modal-content';
    modalContent.style.cssText = `
        position: relative;
        max-width: 95vw;
        max-height: 95vh;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    // Create image element
    const modalImg = document.createElement('img');
    modalImg.className = 'image-modal-img';
    modalImg.style.cssText = `
        max-width: 100%;
        max-height: 95vh;
        width: auto;
        height: auto;
        object-fit: contain;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
        animation: imageModalFadeIn 0.3s ease;
    `;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'image-modal-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close image');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: #104626;
        color: #FCBE11;
        border: 3px solid #104626;
        font-size: 2rem;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-family: "Times New Roman", serif;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        z-index: 10001;
    `;
    
    modalContent.appendChild(modalImg);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add CSS animation
    if (!document.getElementById('image-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'image-modal-styles';
        style.textContent = `
            @keyframes imageModalFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .image-modal.active {
                display: flex !important;
                opacity: 1 !important;
            }
            
            .image-modal-content {
                cursor: pointer;
            }
            
            .postPageImg {
                cursor: zoom-in;
                transition: transform 0.2s ease;
            }
            
            .postPageImg:hover {
                transform: scale(1.02);
            }
            
            @media (max-width: 1024px) {
                .image-modal-img {
                    max-width: 100vw;
                    max-height: 100vh;
                }
                
                .image-modal-close {
                    top: 10px;
                    right: 10px;
                    background: rgba(16, 70, 38, 0.9);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Function to open modal
    function openModal(imgSrc) {
        modalImg.src = imgSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        // Trigger animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
    
    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    // Add click handlers to all post page images
    function initImageModals() {
        const postImages = document.querySelectorAll('.postPageImg');
        postImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(this.src);
            });
        });
    }
    
    // Close modal handlers
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
    
    modalContent.addEventListener('click', function(e) {
        if (e.target === modalContent || e.target === modalImg) {
            closeModal();
        }
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageModals);
    } else {
        initImageModals();
    }
})();

