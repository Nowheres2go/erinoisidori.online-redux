// Mobile menu toggle functionality
(function() {
    const menuButton = document.getElementById('menu-toggle');
    const aside = document.querySelector('aside');
    const body = document.body;

    // Show menu button on mobile
    function checkMobile() {
        if (window.innerWidth <= 1024) {
            if (menuButton) {
                menuButton.style.display = 'flex';
                menuButton.style.visibility = 'visible';
            }
        } else {
            if (menuButton) {
                menuButton.style.display = 'none';
                menuButton.style.visibility = 'hidden';
            }
        }
    }

    // Check on load and resize
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (menuButton && aside) {
        menuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpening = !aside.classList.contains('menu-open');
            aside.classList.toggle('menu-open');
            menuButton.classList.toggle('active');
            body.classList.toggle('menu-active');
            
            // Prevent body scrolling when menu is open
            if (isOpening) {
                body.style.overflow = 'hidden';
                body.style.position = 'fixed';
                body.style.width = '100%';
            } else {
                body.style.overflow = '';
                body.style.position = '';
                body.style.width = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (aside.classList.contains('menu-open') && 
                !aside.contains(e.target) && 
                !menuButton.contains(e.target)) {
                aside.classList.remove('menu-open');
                menuButton.classList.remove('active');
                body.classList.remove('menu-active');
                body.style.overflow = '';
                body.style.position = '';
                body.style.width = '';
            }
        });

        // Close menu when clicking a nav link (on mobile)
        const navLinks = document.querySelectorAll('#navLinks a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1024) {
                    aside.classList.remove('menu-open');
                    menuButton.classList.remove('active');
                    body.classList.remove('menu-active');
                    body.style.overflow = '';
                    body.style.position = '';
                    body.style.width = '';
                }
            });
        });
    }
})();

