document.addEventListener('DOMContentLoaded', () => {
    // Toggle mobile menu
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const userDropdown = document.getElementById('userDropdown');
    const notificationsDropdown = document.getElementById('notificationsDropdown');

    // Función para cerrar todos los dropdowns
    function closeAllDropdowns(exceptId = null) {
        const dropdowns = [userDropdown, notificationsDropdown];
        dropdowns.forEach(dropdown => {
            if (dropdown && dropdown.id !== exceptId) {
                const menu = dropdown.querySelector('div[class*="absolute"]');
                if (menu) {
                    menu.classList.add('hidden');
                }
            }
        });
    }

    // Función para cerrar el menú móvil
    function closeMobileMenu() {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }

    // Toggle menú móvil
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            closeAllDropdowns();
        });
    }

    // Manejar dropdowns de usuario y notificaciones
    [userDropdown, notificationsDropdown].forEach(dropdown => {
        if (dropdown) {
            const button = dropdown.querySelector('button');
            const menu = dropdown.querySelector('div[class*="absolute"]');
            
            if (button && menu) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isHidden = menu.classList.contains('hidden');
                    closeAllDropdowns(dropdown.id);
                    closeMobileMenu();
                    menu.classList.toggle('hidden', !isHidden);
                });
            }
        }
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#mobileMenu') && 
            !e.target.closest('#mobileMenuButton') && 
            !e.target.closest('#userDropdown') && 
            !e.target.closest('#notificationsDropdown')) {
            closeAllDropdowns();
            closeMobileMenu();
        }
    });

    // Soporte para teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
            closeMobileMenu();
        }
    });

    // Función para manejar el modo oscuro
    const handleDarkMode = () => {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', () => {
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });

            // Restaurar preferencia guardada
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            }
        }
    };

    handleDarkMode();
});