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
                    <div class="dropdown-menu" id="dropdownMenu" style="display: none;">
                        <div class="dropdown-header">
                            <div class="dropdown-avatar">👤</div>
                            <div class="dropdown-info">
                                <div class="dropdown-name">My Account</div>
                                <div class="dropdown-status">Connected</div>
                            </div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item" id="dropdownAddress">
                            <i class="fas fa-wallet"></i>
                            <div class="dropdown-item-content">
                                <div class="dropdown-item-label">Wallet Address</div>
                                <div class="dropdown-item-value" id="dropdownAddressValue">0x0000...0000</div>
                            </div>
                            <button class="dropdown-copy-btn" id="dropdownCopyBtn">📋</button>
                        </div>
                        <div class="dropdown-item">
                            <i class="fas fa-gem"></i>
                            <div class="dropdown-item-content">
                                <div class="dropdown-item-label">GEM FUN Balance</div>
                                <div class="dropdown-item-value" id="dropdownBalanceValue">0 GEM</div>
                            </div>
                        </div>
                        <div class="dropdown-item">
                            <i class="fas fa-globe"></i>
                            <div class="dropdown-item-content">
                                <div class="dropdown-item-label">Network</div>
                                <div class="dropdown-item-value">Base Network</div>
                            </div>
                        </div>
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
        const dropdownAddressValue = document.getElementById('dropdownAddressValue');
        const dropdownBalanceValue = document.getElementById('dropdownBalanceValue');

        if (address) {
            const shortAddress = `${address.slice(0,6)}...${address.slice(-4)}`;
            const fullAddress = address;
            
            if (betaBadge) betaBadge.style.display = 'flex';
            if (curveStatsBtn) curveStatsBtn.style.display = 'flex';
            if (connectBtn) connectBtn.style.display = 'none';
            if (userProfileBtn) userProfileBtn.style.display = 'flex';
            if (dropdownMenu) dropdownMenu.style.display = 'none';
            if (userAddressShort) userAddressShort.innerText = shortAddress;
            if (dropdownAddressValue) dropdownAddressValue.innerText = fullAddress;
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