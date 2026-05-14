let headerComponent = null;

const GAMES = [
    { id: 'snake', name: 'GEM SNAKE', icon: '🐍', description: 'Classic snake game', badge: 'popular', color: '#4caf50' },
    { id: 'flappy', name: 'GEM FLAPPY', icon: '🕊️', description: 'Flappy Bird style', badge: 'new', color: '#ff9800' },
    { id: 'tetris', name: 'GEM TETRIS', icon: '🧩', description: 'Stack and clear', badge: 'coming', color: '#2196f3' },
    { id: 'pong', name: 'GEM PONG', icon: '🏓', description: 'Classic ping pong', badge: 'coming', color: '#9c27b0' },
    { id: 'pacman', name: 'GEM PACMAN', icon: '👻', description: 'Eat dots, avoid ghosts', badge: 'coming', color: '#ff5722' },
    { id: 'space-invaders', name: 'SPACE INVADERS', icon: '👾', description: 'Shoot aliens', badge: 'coming', color: '#00bcd4' },
    { id: 'breakout', name: 'BREAKOUT', icon: '🧱', description: 'Break the bricks', badge: 'coming', color: '#e91e63' },
    { id: 'minesweeper', name: 'MINESWEEPER', icon: '💣', description: 'Find the mines', badge: 'coming', color: '#795548' },
    { id: 'memory', name: 'MEMORY MATCH', icon: '🎴', description: 'Match the pairs', badge: 'coming', color: '#8bc34a' },
    { id: 'tic-tac-toe', name: 'TIC TAC TOE', icon: '❌', description: 'Classic XO game', badge: 'coming', color: '#ffc107' }
];

function toggleBannerSection() {
    const bannerSection = document.querySelector('.banner-section');
    if (!bannerSection) return;
    bannerSection.style.display = !window.userAddress ? 'block' : 'none';
}

function toggleLeaderboardForLoggedIn() {
    const leaderboardSection = document.getElementById('leaderboardSection');
    if (!leaderboardSection) return;
    leaderboardSection.style.display = window.userAddress ? 'block' : 'none';
}

function updateRequirementMessage(balance) {
    const requirementMsg = document.querySelector('.gem-requirement');
    if (!requirementMsg) return;
    
    const whyPlay = document.querySelector('.why-play');
    const rankingsCustom = document.querySelector('.ranking-custom');
    const rewards = document.querySelector('.rewards');
    const events = document.querySelector('.events');
    const whyLogin = document.querySelector('.why-login');
    const howItWorks = document.querySelector('.how-it-works');
    const tokenEcosystem = document.getElementById('tokenEcosystemSection');
    
    const minRequired = window.getMinGemRequired ? window.getMinGemRequired() : 10000;
    const tokenAddress = '0xf8a02b86e09319e615534cd8ff034a527261072f';
    const buyLink = 'https://hashcoin.farm/gem';
    
    if (!window.userAddress) {
        if (whyPlay) whyPlay.style.display = 'block';
        if (rankingsCustom) rankingsCustom.style.display = 'block';
        if (rewards) rewards.style.display = 'block';
        if (events) events.style.display = 'block';
        if (whyLogin) whyLogin.style.display = 'block';
        if (howItWorks) howItWorks.style.display = 'block';
        if (tokenEcosystem) tokenEcosystem.style.display = 'block';
        requirementMsg.style.display = 'block';
        requirementMsg.innerHTML = '🔌 Please connect your wallet first to play games!';
        requirementMsg.style.borderColor = '#ff9800';
        requirementMsg.style.background = 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(0,0,0,0.3))';
        requirementMsg.style.borderRadius = '40px';
        requirementMsg.style.padding = '12px 24px';
        requirementMsg.style.maxWidth = '100%';
        requirementMsg.style.margin = '20px 0';
    } else if (balance < minRequired) {
        if (whyPlay) whyPlay.style.display = 'none';
        if (rankingsCustom) rankingsCustom.style.display = 'none';
        if (rewards) rewards.style.display = 'none';
        if (events) events.style.display = 'none';
        if (whyLogin) whyLogin.style.display = 'none';
        if (howItWorks) howItWorks.style.display = 'none';
        if (tokenEcosystem) tokenEcosystem.style.display = 'none';
        requirementMsg.style.display = 'block';
        requirementMsg.innerHTML = `
            ⚠️ You need <strong>${minRequired.toLocaleString()} GEM FUN</strong> to play games.<br>
            You have <strong>${balance.toLocaleString()} GEM FUN</strong><br>
            <span style="font-size: 0.75rem; opacity: 0.8;">Contract: </span>
            <span class="contract-address" onclick="copyContractAddress(this)" style="font-family: monospace; font-size: 0.75rem; background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 20px; cursor: pointer; display: inline-block; margin-top: 6px;">
                📋 ${tokenAddress}
            </span><br>
            <a href="${buyLink}" target="_blank" rel="noopener noreferrer" style="color: #ffd700; text-decoration: none; display: inline-block; margin-top: 10px; padding: 6px 16px; background: rgba(255,215,0,0.1); border-radius: 30px; font-size: 0.8rem; transition: all 0.2s;">
                🛒 Buy GEM FUN on HashCoin →
            </a>
        `;
        requirementMsg.style.borderColor = '#f44336';
        requirementMsg.style.background = 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(0,0,0,0.3))';
        requirementMsg.style.borderRadius = '40px';
        requirementMsg.style.padding = '12px 24px';
        requirementMsg.style.maxWidth = '100%';
        requirementMsg.style.margin = '20px 0';
    } else {
        if (whyPlay) whyPlay.style.display = 'none';
        if (rankingsCustom) rankingsCustom.style.display = 'none';
        if (rewards) rewards.style.display = 'none';
        if (events) events.style.display = 'none';
        if (whyLogin) whyLogin.style.display = 'none';
        if (howItWorks) howItWorks.style.display = 'none';
        if (tokenEcosystem) tokenEcosystem.style.display = 'none';
        requirementMsg.style.display = 'none';
    }
    toggleBannerSection();
}

window.copyContractAddress = function(element) {
    const address = element.innerText.replace('📋 ', '');
    navigator.clipboard.writeText(address).then(() => {
        const originalText = element.innerHTML;
        element.innerHTML = '✅ Copied!';
        element.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
        setTimeout(() => {
            element.innerHTML = originalText;
            element.style.backgroundColor = 'rgba(0,0,0,0.3)';
        }, 2000);
    }).catch(() => {
        element.innerHTML = '❌ Failed';
        setTimeout(() => {
            element.innerHTML = originalText;
        }, 2000);
    });
};

function renderGamesGrid() {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    
    grid.innerHTML = GAMES.map(game => `
        <div class="game-card" data-game="${game.id}">
            <div class="game-card-icon">${game.icon}</div>
            <h4>${game.name}</h4>
            <p>${game.description}</p>
            <span class="game-card-badge">${game.badge === 'popular' ? '🔥 Popular' : game.badge === 'new' ? '✨ New' : '⏳ Soon'}</span>
        </div>
    `).join('');
    
    document.querySelectorAll('.game-card').forEach(card => {
        card.onclick = async () => {
            const gameId = card.dataset.game;
            const game = GAMES.find(g => g.id === gameId);
            if (game) {
                if (game.badge === 'coming') return;
                if (!window.userAddress) {
                    const requirementMsg = document.querySelector('.gem-requirement');
                    if (requirementMsg) {
                        requirementMsg.style.animation = 'pulse 0.5s ease';
                        setTimeout(() => { requirementMsg.style.animation = ''; }, 500);
                    }
                    return;
                }
                
                let currentBalance = window.gemBalance;
                const minRequired = window.getMinGemRequired ? window.getMinGemRequired() : 10000;
                
                if (currentBalance < minRequired) {
                    updateRequirementMessage(currentBalance);
                    const requirementMsg = document.querySelector('.gem-requirement');
                    if (requirementMsg) {
                        requirementMsg.style.animation = 'pulse 0.5s ease';
                        setTimeout(() => { requirementMsg.style.animation = ''; }, 500);
                    }
                    return;
                }
                if (window.openGameModal) window.openGameModal(gameId, game.name, game);
            }
        };
    });
}

function updateLeaderboard(filter = 'all') {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    leaderboardList.innerHTML = `
        <div class="coming-soon-message" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 2rem; margin-bottom: 12px;">🏗️</div>
            <div style="font-weight: 600; margin-bottom: 8px; color: #ffd700;">Rankings Coming Soon!</div>
            <div style="font-size: 0.8rem; opacity: 0.7; color: #8b92b0;">Leaderboards will be available after the official launch. Stay tuned!</div>
        </div>
    `;
}

function setupLeaderboardFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        btn.onclick = () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateLeaderboard(btn.dataset.game);
        };
    });
}

function initApp() {
    renderGamesGrid();
    setupLeaderboardFilters();
    updateLeaderboard('all');
    toggleLeaderboardForLoggedIn();
    setTimeout(() => {
        const balance = window.gemBalance || 0;
        updateRequirementMessage(balance);
    }, 1000);
}

window.onWalletConnect = (address) => {
    updateLeaderboard('all');
    toggleLeaderboardForLoggedIn();
    if (window.refreshBalance) {
        window.refreshBalance().then(balance => updateRequirementMessage(balance));
    }
    toggleBannerSection();
};

window.onAccountChange = (address) => {
    updateLeaderboard('all');
    toggleLeaderboardForLoggedIn();
    if (window.refreshBalance) {
        window.refreshBalance().then(balance => updateRequirementMessage(balance));
    }
    toggleBannerSection();
};

window.onBalanceUpdateForGames = (balance) => {
    updateRequirementMessage(balance);
};

window.updateGlobalRanking = () => updateLeaderboard('all');

window.addEventListener('balanceUpdated', (e) => {
    updateRequirementMessage(e.detail.balance);
});

window.addEventListener('walletConnected', (e) => {
    setTimeout(() => {
        updateRequirementMessage(e.detail.balance);
    }, 500);
});

window.refreshBalanceMessage = function() {
    updateRequirementMessage(window.gemBalance || 0);
};

const originalUpdateRequirementMessage = updateRequirementMessage;
window.updateRequirementMessage = function(balance) {
    if (balance === 0 && window.userAddress && window.gemBalance === 0) {
        setTimeout(() => {
            window.refreshBalanceMessage();
        }, 500);
        return;
    }
    originalUpdateRequirementMessage(balance);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

document.addEventListener('DOMContentLoaded', () => {
    const ctaBtn = document.getElementById('finalCtaBtn');
    const heroCtaBtn = document.getElementById('heroCtaBtn');
    const handleConnect = () => {
        if (!window.userAddress) {
            if (window.connectWallet) window.connectWallet();
            else document.getElementById('connectWalletBtn')?.click();
        } else {
            document.querySelector('.games-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    if (ctaBtn) ctaBtn.onclick = handleConnect;
    if (heroCtaBtn) heroCtaBtn.onclick = handleConnect;
    toggleBannerSection();
});