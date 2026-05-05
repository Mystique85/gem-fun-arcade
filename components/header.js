class HeaderComponent {
    constructor() {
        this.userAddress = null;
        this.gemBalance = 0;
        this.tradingEnabled = false;
    }

    getHTML() {
        return `
            <div class="logo-area">
                <img src="/Awesome.jpg" alt="GEM FUN" class="gem-logo" id="gemLogo">
                <h1 class="app-title"><span class="title-blue">GEM</span> <span class="title-accent">FUN</span></h1>
            </div>
            <div class="wallet-panel">
                <button id="connectWalletBtn" class="wallet-btn">
                    <span class="btn-icon">🔌</span>
                    <span>Connect Wallet</span>
                </button>
                <button id="disconnectWalletBtn" class="wallet-btn disconnect-btn" style="display: none;">
                    <span class="btn-icon">🔌</span>
                    <span>Disconnect</span>
                </button>
                <div class="wallet-status" id="walletStatus">
                    <span class="status-dot"></span>
                    <span class="status-text">Not connected</span>
                </div>
                <div class="gem-badge" id="gemBalance">
                    <span class="gem-icon">💎</span>
                    <span class="gem-amount">0</span>
                    <span class="gem-symbol">GEM</span>
                </div>
            </div>
            <div class="trading-bar" id="tradingStatusBar">
                <span class="trading-icon">⏳</span>
                <span class="trading-text">Checking token status...</span>
            </div>
        `;
    }

    updateWalletUI(address, balance, tradingEnabled) {
        this.userAddress = address;
        this.gemBalance = balance;
        this.tradingEnabled = tradingEnabled;
        
        const connectBtn = document.getElementById('connectWalletBtn');
        const disconnectBtn = document.getElementById('disconnectWalletBtn');
        const walletStatus = document.getElementById('walletStatus');
        const gemBalanceSpan = document.getElementById('gemBalance');
        const tradingBar = document.getElementById('tradingStatusBar');

        if (address) {
            if (connectBtn) connectBtn.style.display = 'none';
            if (disconnectBtn) disconnectBtn.style.display = 'flex';
            if (walletStatus) {
                const statusText = walletStatus.querySelector('.status-text');
                const statusDot = walletStatus.querySelector('.status-dot');
                if (statusText) statusText.innerText = `${address.slice(0,6)}...${address.slice(-4)}`;
                if (statusDot) statusDot.classList.add('connected');
            }
            if (gemBalanceSpan) {
                const amountSpan = gemBalanceSpan.querySelector('.gem-amount');
                if (amountSpan) amountSpan.innerText = balance.toFixed(2);
            }
        } else {
            if (connectBtn) connectBtn.style.display = 'flex';
            if (disconnectBtn) disconnectBtn.style.display = 'none';
            if (walletStatus) {
                const statusText = walletStatus.querySelector('.status-text');
                const statusDot = walletStatus.querySelector('.status-dot');
                if (statusText) statusText.innerText = 'Not connected';
                if (statusDot) statusDot.classList.remove('connected');
            }
            if (gemBalanceSpan) {
                const amountSpan = gemBalanceSpan.querySelector('.gem-amount');
                if (amountSpan) amountSpan.innerText = '0';
            }
        }

        if (tradingBar) {
            if (tradingEnabled) {
                tradingBar.classList.add('active');
                const icon = tradingBar.querySelector('.trading-icon');
                const text = tradingBar.querySelector('.trading-text');
                if (icon) icon.innerHTML = '✅';
                if (text) text.innerHTML = 'Trading active - GEM tokens ready!';
            } else {
                tradingBar.classList.remove('active');
                const icon = tradingBar.querySelector('.trading-icon');
                const text = tradingBar.querySelector('.trading-text');
                if (icon) icon.innerHTML = '⏳';
                if (text) text.innerHTML = 'Token locked (pre-migration)';
            }
        }
    }
}

window.HeaderComponent = HeaderComponent;