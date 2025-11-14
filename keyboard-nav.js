// Keyboard navigation for brutalist UX
(function() {
    // Prevent navigation when typing in inputs/textarea
    function isInputFocused() {
        const active = document.activeElement;
        return active && (
            active.tagName === 'INPUT' ||
            active.tagName === 'TEXTAREA' ||
            active.isContentEditable
        );
    }

    document.addEventListener('keydown', function(e) {
        // Don't interfere if user is typing
        if (isInputFocused()) return;

        // Arrow keys for previous/next navigation on post pages
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const prevLink = document.querySelector('.previous.navArrow');
            const nextLink = document.querySelector('.next.navArrow');
            
            if (e.key === 'ArrowLeft' && prevLink && prevLink.href) {
                e.preventDefault();
                window.location.href = prevLink.href;
            } else if (e.key === 'ArrowRight' && nextLink && nextLink.href) {
                e.preventDefault();
                window.location.href = nextLink.href;
            }
        }

        // Number keys 1-9 for direct navigation to menu items
        if (e.key >= '1' && e.key <= '9') {
            const navLinks = document.querySelectorAll('#navLinks a');
            const index = parseInt(e.key) - 1;
            if (navLinks[index] && navLinks[index].href) {
                e.preventDefault();
                window.location.href = navLinks[index].href;
            }
        }

        // 'H' key for home
        if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            window.location.href = '/';
        }

        // 'R' key for random post - get all post URLs from data attribute or post cards
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            // Try to get all post URLs from data attribute first
            const allPostsData = document.getElementById('all-posts-data');
            let allPostUrls = [];
            
            if (allPostsData && allPostsData.dataset.posts) {
                try {
                    allPostUrls = JSON.parse(allPostsData.dataset.posts);
                } catch (e) {
                    console.error('Failed to parse post URLs:', e);
                }
            }
            
            // Fallback: get post card links from current page
            if (allPostUrls.length === 0) {
                const postCards = document.querySelectorAll('.postCard');
                allPostUrls = Array.from(postCards).map(card => card.href).filter(Boolean);
            }
            
            // If still no posts, try to get from works and blogs pages
            if (allPostUrls.length === 0) {
                // This would require fetching, so we'll just try to navigate to works/blogs
                const worksLink = document.querySelector('a[href*="/works/"]');
                const blogsLink = document.querySelector('a[href*="/blogs/"]');
                const allLinks = [worksLink, blogsLink].filter(Boolean).map(link => link.href);
                if (allLinks.length > 0) {
                    window.location.href = allLinks[Math.floor(Math.random() * allLinks.length)];
                    return;
                }
            }
            
            if (allPostUrls.length > 0) {
                const randomIndex = Math.floor(Math.random() * allPostUrls.length);
                window.location.href = allPostUrls[randomIndex];
            }
        }

        // 'G' key for grid toggle
        if (e.key === 'g' || e.key === 'G') {
            e.preventDefault();
            if (typeof toggleGridOverlay === 'function') {
                toggleGridOverlay();
            }
        }

        // 'S' key for stats page
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            window.location.href = '/stats/';
        }

        // Escape to close menu (mobile)
        if (e.key === 'Escape') {
            const aside = document.querySelector('aside');
            const menuButton = document.getElementById('menu-toggle');
            if (aside && aside.classList.contains('menu-open')) {
                aside.classList.remove('menu-open');
                if (menuButton) menuButton.classList.remove('active');
                document.body.classList.remove('menu-active');
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        }

        // '/' key to focus search (if search exists)
        if (e.key === '/' && !isInputFocused()) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
    });
})();

