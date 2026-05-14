class DropdownMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMenu();
        this.attachEvents();
    }

    createMenu() {
        if (document.getElementById('customDropdownMenu')) return;
        
        const menuHTML = `
            <div class="custom-dropdown-menu" id="customDropdownMenu" style="display: none;">
                <div class="custom-dropdown-header">
                    <div class="gamer-hub-title">
                        <span class="hub-text">GAMER</span>
                        <span class="hub-text-highlight">HUB</span>
                    </div>
                    <div class="hub-glow"></div>
                    <button class="custom-dropdown-close" id="customDropdownClose">✕</button>
                </div>
                <div class="custom-dropdown-items-container">
                    <div class="custom-dropdown-item" data-action="profile" data-close="false">
                        <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span class="item-text">My Profile</span>
                        <span class="item-soon">soon</span>
                    </div>
                    <div class="custom-dropdown-item" data-action="guild" data-close="false">
                        <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                            <path d="M2 17l10 5 10-5"></path>
                            <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        <span class="item-text">Guild</span>
                        <span class="item-soon">soon</span>
                    </div>
                    <div class="custom-dropdown-item" data-action="leaderboard" data-close="false">
                        <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M8 6h13"></path>
                            <path d="M8 12h13"></path>
                            <path d="M8 18h13"></path>
                            <path d="M3 6h.01"></path>
                            <path d="M3 12h.01"></path>
                            <path d="M3 18h.01"></path>
                        </svg>
                        <span class="item-text">Leaderboard</span>
                        <span class="item-soon">soon</span>
                    </div>
                    <div class="custom-dropdown-divider"></div>
                    <div class="custom-dropdown-item" data-action="achievements" data-close="true">
                        <svg class="dropdown-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10 2C8.5 2 7 2.1 5.8 2.3C5.3 2.4 5 2.8 5 3.3V3.6C4.2 3.7 3.4 3.9 2.6 4.1C2.2 4.2 2 4.6 2 5C2 7.2 3.8 9 6 9C6.5 9 6.9 8.9 7.3 8.8C8 10.2 9 11.4 10.3 12.2C10.1 12.8 10 13.4 10 14H9C8.4 14 8 14.4 8 15V17H7.5C7.2 17 7 17.2 7 17.5C7 17.8 7.2 18 7.5 18H12.5C12.8 18 13 17.8 13 17.5C13 17.2 12.8 17 12.5 17H12V15C12 14.4 11.6 14 11 14H10C10 13.4 9.9 12.8 9.7 12.2C11 11.4 12 10.2 12.7 8.8C13.1 8.9 13.5 9 14 9C16.2 9 18 7.2 18 5C18 4.6 17.8 4.2 17.4 4.1C16.6 3.9 15.8 3.7 15 3.6V3.3C15 2.8 14.7 2.4 14.2 2.3C12.8 2.1 11.4 2 10 2Z" />
                            <circle cx="6" cy="6" r="1" fill="currentColor" />
                            <circle cx="14" cy="6" r="1" fill="currentColor" />
                        </svg>
                        <span class="item-text">Achievements</span>
                    </div>
                    <div class="custom-dropdown-divider"></div>
                    <div class="custom-dropdown-item disconnect" data-action="disconnect" data-close="true">
                        <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span class="item-text">Log Out</span>
                    </div>
                </div>
            </div>
        `;
        
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileDropdown) {
            profileDropdown.insertAdjacentHTML('beforeend', menuHTML);
        }
    }

    attachEvents() {
        const profileBtn = document.getElementById('userProfileBtn');
        const closeBtn = document.getElementById('customDropdownClose');
        
        if (profileBtn) {
            const newProfileBtn = profileBtn.cloneNode(true);
            profileBtn.parentNode.replaceChild(newProfileBtn, profileBtn);
            
            newProfileBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            };
        }

        if (closeBtn) {
            closeBtn.onclick = () => this.close();
        }

        document.querySelectorAll('.custom-dropdown-item').forEach(item => {
            item.onclick = (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                const shouldClose = item.dataset.close === 'true';
                this.handleAction(action, shouldClose);
            };
        });

        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.profile-dropdown') && !e.target.closest('#customDropdownMenu')) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        const menu = document.getElementById('customDropdownMenu');
        if (menu) {
            menu.style.display = 'block';
            this.isOpen = true;
        }
    }

    close() {
        const menu = document.getElementById('customDropdownMenu');
        if (menu) {
            menu.style.display = 'none';
            this.isOpen = false;
        }
    }

    updateUserData() {}

    handleAction(action, shouldClose) {
        if (shouldClose) {
            this.close();
        }
        
        switch(action) {
            case 'profile':
                break;
            case 'guild':
                break;
            case 'leaderboard':
                break;
            case 'achievements':
                if (window.achievementsModal) {
                    window.achievementsModal.open();
                }
                break;
            case 'disconnect':
                if (window.disconnectWallet) {
                    window.disconnectWallet();
                }
                break;
        }
    }
}

function initDropdownMenu() {
    if (!window.dropdownMenuInstance) {
        window.dropdownMenuInstance = new DropdownMenu();
    }
}

window.DropdownMenu = DropdownMenu;
window.initDropdownMenu = initDropdownMenu;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initDropdownMenu, 1000);
    });
} else {
    setTimeout(initDropdownMenu, 1000);
}