// components/header.js

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

    getHTML() {
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
        const betaBadge = document.getElementById('betaBadge');
        const curveStatsBtn = document.getElementById('curveStatsBtn');
        const userAddressShort = document.getElementById('userAddressShort');

        if (address) {
            const shortAddress = `${address.slice(0,6)}...${address.slice(-4)}`;
            
            if (betaBadge) betaBadge.style.display = 'flex';
            if (curveStatsBtn) curveStatsBtn.style.display = 'flex';
            if (connectBtn) connectBtn.style.display = 'none';
            if (userProfileBtn) userProfileBtn.style.display = 'flex';
            if (userAddressShort) userAddressShort.innerText = shortAddress;
            
            if (window.dropdownMenuInstance) {
                window.dropdownMenuInstance.updateUserData();
            }
        } else {
            if (betaBadge) betaBadge.style.display = 'none';
            if (curveStatsBtn) curveStatsBtn.style.display = 'none';
            if (connectBtn) connectBtn.style.display = 'flex';
            if (userProfileBtn) userProfileBtn.style.display = 'none';
        }
    }
}

window.HeaderComponent = HeaderComponent;

// ========== INICJALIZACJA HEADER ==========
function initHeader() {
    console.log('initHeader called');
    const headerInner = document.querySelector('#mainHeader .header-inner');
    if (headerInner && window.HeaderComponent) {
        const headerComponent = new window.HeaderComponent();
        headerInner.innerHTML = headerComponent.getHTML();
        if (window.setHeaderComponent) window.setHeaderComponent(headerComponent);
        console.log('Header initialized successfully');
        return headerComponent;
    }
    console.log('Failed to initialize header');
    return null;
}

// Automatyczne inicjalizowanie header'a po załadowaniu strony
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
} else {
    initHeader();
}

window.initHeader = initHeader;