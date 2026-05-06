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
        
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(2) + 'B';
        }
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(2) + 'M';
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(2) + 'K';
        }
        
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    getHTML() {
        return `
            <div class="logo-area">
                <img src="/Awesome.jpg" alt="GEM FUN" class="gem-logo" id="gemLogo">
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
                <div class="gem-badge" id="gemBalance" style="display: none;">
                    <span class="gem-icon">💎</span>
                    <span class="gem-amount">0</span>
                    <span class="gem-symbol">GEM</span>
                </div>
                <button id="connectWalletBtn" class="wallet-btn">
                    <span class="btn-icon">🔌</span>
                    <span>Connect Wallet</span>
                </button>
                <button id="disconnectWalletBtn" class="wallet-btn disconnect-btn" style="display: none;">
                    <span class="btn-icon">🔌</span>
                    <span>Disconnect</span>
                </button>
            </div>
        `;
    }

    updateWalletUI(address, balance, tradingEnabled) {
        this.userAddress = address;
        this.gemBalance = balance;
        this.tradingEnabled = tradingEnabled;
        
        const connectBtn = document.getElementById('connectWalletBtn');
        const disconnectBtn = document.getElementById('disconnectWalletBtn');
        const gemBalanceSpan = document.getElementById('gemBalance');
        const betaBadge = document.getElementById('betaBadge');
        const curveStatsBtn = document.getElementById('curveStatsBtn');

        if (address) {
            if (gemBalanceSpan) {
                gemBalanceSpan.style.display = 'flex';
                const amountSpan = gemBalanceSpan.querySelector('.gem-amount');
                if (amountSpan) amountSpan.innerText = this.formatBalance(balance);
            }
            if (betaBadge) betaBadge.style.display = 'flex';
            if (curveStatsBtn) curveStatsBtn.style.display = 'flex';
            if (connectBtn) {
                connectBtn.style.display = 'flex';
                const btnSpan = connectBtn.querySelector('span:last-child');
                if (btnSpan) btnSpan.innerText = `${address.slice(0,6)}...${address.slice(-4)}`;
            }
            if (disconnectBtn) disconnectBtn.style.display = 'flex';
        } else {
            if (gemBalanceSpan) gemBalanceSpan.style.display = 'none';
            if (betaBadge) betaBadge.style.display = 'none';
            if (curveStatsBtn) curveStatsBtn.style.display = 'none';
            if (connectBtn) {
                connectBtn.style.display = 'flex';
                const btnSpan = connectBtn.querySelector('span:last-child');
                if (btnSpan) btnSpan.innerText = 'Connect Wallet';
            }
            if (disconnectBtn) disconnectBtn.style.display = 'none';
        }
    }
}

window.HeaderComponent = HeaderComponent;