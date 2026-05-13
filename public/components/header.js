class HeaderComponent {
    constructor() {
        this.userAddress = null;
        this.gemBalance = 0;
        this.tradingEnabled = false;
    }

    formatBalance(balance) {
        if (balance === undefined || balance === null) return '0';
        const num = Number(balance);
        if (isNaN(num)) return '0';
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    getBadgesHTML() {
        const badges = [
            { name: 'OG', image: '/OG.png', locked: true, description: 'OG Player - Early adopter badge' },
            { name: 'Retro', image: '/Retro.png', locked: true, description: 'Retro Player - Classic arcade enthusiast' },
            { name: 'SOON', image: null, locked: false, isPlaceholder: true, description: 'Coming soon...' },
            { name: 'SOON', image: null, locked: false, isPlaceholder: true, description: 'Coming soon...' },
            { name: 'SOON', image: null, locked: false, isPlaceholder: true, description: 'Coming soon...' },
            { name: 'SOON', image: null, locked: false, isPlaceholder: true, description: 'Coming soon...' },
            { name: 'Hodler', image: '/Hodler.png', locked: true, description: 'Hodler - Holds GEM FUN tokens' },
            { name: 'Support', image: '/Support.png', locked: true, description: 'Supporter - Helped support the project' }
        ];

        let badgesHTML = `
            <div class="dropdown-divider"></div>
            <div class="dropdown-badges-section">
                <div class="dropdown-badges-header">
                    <span class="badges-title">ACHIEVEMENTS</span>
                </div>
                <div class="dropdown-badges-grid">
        `;

        for (let i = 0; i < badges.length; i++) {
            const badge = badges[i];
            const isLocked = badge.locked;
            const isPlaceholder = badge.isPlaceholder;
            const tooltipText = badge.description;
            
            if (isPlaceholder) {
                badgesHTML += `
                    <div class="badge-slot placeholder" data-tooltip="${tooltipText}">
                        <div class="badge-icon-placeholder">
                            <span class="placeholder-text">soon</span>
                        </div>
                    </div>
                `;
            } else {
                const lockedClass = isLocked ? 'locked' : '';
                const badgeIcon = badge.image 
                    ? `<img src="${badge.image}" alt="${badge.name}" class="badge-icon-img">`
                    : `<div class="badge-icon-default">🏅</div>`;
                
                badgesHTML += `
                    <div class="badge-slot ${lockedClass}" data-tooltip="${tooltipText}">
                        <div class="badge-icon">
                            ${badgeIcon}
                            ${isLocked ? '<div class="lock-overlay">🔒</div>' : ''}
                        </div>
                    </div>
                `;
            }
        }

        badgesHTML += `
                </div>
            </div>
        `;

        return badgesHTML;
    }

    getHTML() {
        const badgesHTML = this.getBadgesHTML();
        
        return `
            <div class="logo-area">
                <img src="/Awesome.jpg" alt="GEM FUN" class="gem-logo">
                <h1 class="app-title"><span class="title-blue">GEM</span> <span class="title-accent">FUN</span></h1>
                <div class="beta-badge" id="betaBadge" style="display: none;">
                    <span class="beta-icon">🧪</span>
                    <span class="beta-text">BETA TEST</span>
                </div>
            </div>
            <div class="wallet-panel">
                <button id="curveStatsBtn" class="curve-stats-btn" style="display: none;">
                    <span class="btn-icon">📊</span>
                    <span>
                        <span style="color: #3b82f6;">GEM</span>
                        <span style="color: #ffffff;"> FUN </span>
                        <span style="background: linear-gradient(135deg, #ffd700, #ff8c00); -webkit-background-clip: text; background-clip: text; color: transparent; font-weight: 800;">TGE Progress</span>
                    </span>
                </button>
                
                <button id="connectWalletBtn" class="nav-connect-btn">
                    <span>SIGN</span>
                    <i class="fas fa-wallet"></i>
                </button>
                
                <div class="profile-dropdown" id="profileDropdown">
                    <button id="userProfileBtn" class="user-profile-btn" style="display: none;">
                        <div class="user-avatar">
                            <span class="avatar-icon">👤</span>
                        </div>
                        <span class="user-address" id="userAddressShort"></span>
                        <i class="fas fa-chevron-down dropdown-arrow"></i>
                    </button>
                    <div class="dropdown-menu" id="dropdownMenu" style="display: none;">
                        <button class="dropdown-close-btn" id="dropdownCloseBtn">✕</button>
                        
                        <div class="dropdown-header">
                            <div class="gamer-hub-title">
                                <span class="hub-text">GAMER</span>
                                <span class="hub-text-highlight">HUB</span>
                            </div>
                            <div class="hub-glow"></div>
                        </div>
                        
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item">
                            <img src="/Awesome.jpg" alt="GEM FUN" class="dropdown-gem-icon">
                            <div class="dropdown-item-content">
                                <div class="dropdown-item-label">GEM FUN Balance</div>
                                <div class="dropdown-item-value" id="dropdownBalanceValue">0 GEM</div>
                            </div>
                        </div>
                        <div class="dropdown-item">
                            <img src="/Base.jpg" alt="Base" class="dropdown-network-icon">
                            <div class="dropdown-item-content">
                                <div class="dropdown-item-label">Network</div>
                                <div class="dropdown-item-value">Base Network</div>
                            </div>
                        </div>
                        
                        ${badgesHTML}
                        
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-disconnect-btn" id="disconnectFromDropdownBtn">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Disconnect Wallet</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    updateWalletUI(address, balance, tradingEnabled) {
        this.userAddress = address;
        this.gemBalance = balance;
        this.tradingEnabled = tradingEnabled;
        
        const connectBtn = document.getElementById('connectWalletBtn');
        const userProfileBtn = document.getElementById('userProfileBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const betaBadge = document.getElementById('betaBadge');
        const curveStatsBtn = document.getElementById('curveStatsBtn');
        const userAddressShort = document.getElementById('userAddressShort');
        const dropdownBalanceValue = document.getElementById('dropdownBalanceValue');
        const dropdownCloseBtn = document.getElementById('dropdownCloseBtn');

        if (dropdownCloseBtn) {
            dropdownCloseBtn.onclick = () => {
                if (dropdownMenu) dropdownMenu.style.display = 'none';
            };
        }

        if (address) {
            const shortAddress = `${address.slice(0,6)}...${address.slice(-4)}`;
            
            if (betaBadge) betaBadge.style.display = 'flex';
            if (curveStatsBtn) curveStatsBtn.style.display = 'flex';
            if (connectBtn) connectBtn.style.display = 'none';
            if (userProfileBtn) userProfileBtn.style.display = 'flex';
            if (dropdownMenu) dropdownMenu.style.display = 'none';
            if (userAddressShort) userAddressShort.innerText = shortAddress;
            if (dropdownBalanceValue) dropdownBalanceValue.innerText = this.formatBalance(balance) + ' GEM';
        } else {
            if (betaBadge) betaBadge.style.display = 'none';
            if (curveStatsBtn) curveStatsBtn.style.display = 'none';
            if (connectBtn) connectBtn.style.display = 'flex';
            if (userProfileBtn) userProfileBtn.style.display = 'none';
            if (dropdownMenu) dropdownMenu.style.display = 'none';
        }
    }
}

window.HeaderComponent = HeaderComponent;