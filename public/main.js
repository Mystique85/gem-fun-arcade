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
    
    const heroSection = document.querySelector('.hero');
    const whyPlay = document.querySelector('.why-play');
    const rankingsCustom = document.querySelector('.ranking-custom');
    const rewards = document.querySelector('.rewards');
    const events = document.querySelector('.events');
    const whyLogin = document.querySelector('.why-login');
    const howItWorks = document.querySelector('.how-it-works');
    const finalCta = document.querySelector('.final-cta');
    const tokenEcosystem = document.getElementById('tokenEcosystemSection');
    
    const minRequired = window.getMinGemRequired ? window.getMinGemRequired() : 10000;
    const tokenAddress = '0xf8a02b86e09319e615534cd8ff034a527261072f';
    const buyLink = 'https://hashcoin.farm/gem';
    
    if (!window.userAddress) {
        if (heroSection) heroSection.style.display = 'block';
        if (whyPlay) whyPlay.style.display = 'block';
        if (rankingsCustom) rankingsCustom.style.display = 'block';
        if (rewards) rewards.style.display = 'block';
        if (events) events.style.display = 'block';
        if (whyLogin) whyLogin.style.display = 'block';
        if (howItWorks) howItWorks.style.display = 'block';
        if (finalCta) finalCta.style.display = 'flex';
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
        if (heroSection) heroSection.style.display = 'none';
        if (whyPlay) whyPlay.style.display = 'none';
        if (rankingsCustom) rankingsCustom.style.display = 'none';
        if (rewards) rewards.style.display = 'none';
        if (events) events.style.display = 'none';
        if (whyLogin) whyLogin.style.display = 'none';
        if (howItWorks) howItWorks.style.display = 'none';
        if (finalCta) finalCta.style.display = 'none';
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
        if (heroSection) heroSection.style.display = 'none';
        if (whyPlay) whyPlay.style.display = 'none';
        if (rankingsCustom) rankingsCustom.style.display = 'none';
        if (rewards) rewards.style.display = 'none';
        if (events) events.style.display = 'none';
        if (whyLogin) whyLogin.style.display = 'none';
        if (howItWorks) howItWorks.style.display = 'none';
        if (finalCta) finalCta.style.display = 'none';
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
                if (window.refreshBalance) currentBalance = await window.refreshBalance();
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

function initHeader() {
    const headerInner = document.querySelector('#mainHeader .header-inner');
    if (headerInner && window.HeaderComponent) {
        headerComponent = new window.HeaderComponent();
        headerInner.innerHTML = headerComponent.getHTML();
        if (window.setHeaderComponent) window.setHeaderComponent(headerComponent);
    }
}

function initProfileDropdown() {
    const profileBtn = document.getElementById('userProfileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const copyBtn = document.getElementById('dropdownCopyBtn');
    const disconnectBtn = document.getElementById('disconnectFromDropdownBtn');

    if (profileBtn) {
        profileBtn.onclick = (e) => {
            e.stopPropagation();
            if (dropdownMenu) {
                const isVisible = dropdownMenu.style.display === 'block';
                dropdownMenu.style.display = isVisible ? 'none' : 'block';
            }
        };
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-dropdown') && dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }
    });

    if (copyBtn) {
        copyBtn.onclick = () => {
            const address = document.getElementById('dropdownAddressValue')?.innerText;
            if (address) {
                navigator.clipboard.writeText(address).then(() => {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '✅';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                });
            }
        };
    }

    if (disconnectBtn) {
        disconnectBtn.onclick = () => {
            if (dropdownMenu) dropdownMenu.style.display = 'none';
            if (window.disconnectWallet) window.disconnectWallet();
        };
    }
}

function updateDropdownData() {
    if (window.userAddress) {
        const dropdownAddressValue = document.getElementById('dropdownAddressValue');
        const dropdownBalanceValue = document.getElementById('dropdownBalanceValue');
        if (dropdownAddressValue) dropdownAddressValue.innerText = window.userAddress;
        if (dropdownBalanceValue && window.gemBalance !== undefined) {
            const headerComponent = new window.HeaderComponent();
            dropdownBalanceValue.innerText = headerComponent.formatBalance(window.gemBalance) + ' GEM';
        }
    }
}

function initApp() {
    initHeader();
    renderGamesGrid();
    setupLeaderboardFilters();
    updateLeaderboard('all');
    toggleLeaderboardForLoggedIn();
    initProfileDropdown();
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
    updateDropdownData();
};

window.onAccountChange = (address) => {
    updateLeaderboard('all');
    toggleLeaderboardForLoggedIn();
    if (window.refreshBalance) {
        window.refreshBalance().then(balance => updateRequirementMessage(balance));
    }
    toggleBannerSection();
    updateDropdownData();
};

window.onBalanceUpdateForGames = (balance) => {
    updateRequirementMessage(balance);
};

window.updateGlobalRanking = () => updateLeaderboard('all');

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

if (typeof window.web3Initialized === 'undefined') {
    window.web3Initialized = true;

    let web3;
    let userAddress = null;
    let tokenContract = null;
    let userGemBalance = 0;
    let tradingEnabled = false;
    let headerComponent = null;

    const MIN_GEM_REQUIRED = 10000;

    window.setHeaderComponent = (component) => {
        headerComponent = component;
        updateHeaderUI();
        setTimeout(() => attachWalletEvents(), 100);
    };

    function attachWalletEvents() {
        const connectBtn = document.getElementById('connectWalletBtn');
        if (connectBtn) {
            const newConnectBtn = connectBtn.cloneNode(true);
            connectBtn.parentNode.replaceChild(newConnectBtn, connectBtn);
            newConnectBtn.onclick = (e) => { e.preventDefault(); connectWallet(); };
        }
    }

    function updateHeaderUI() {
        if (headerComponent) headerComponent.updateWalletUI(userAddress, userGemBalance, tradingEnabled);
        window.userAddress = userAddress;
        window.gemBalance = userGemBalance;
        if (window.onBalanceUpdateForGames) window.onBalanceUpdateForGames(userGemBalance);
        toggleBannerSection();
        toggleLeaderboardForLoggedIn();
        updateDropdownData();
    }

    function disconnectWallet() {
        userAddress = null;
        tokenContract = null;
        web3 = null;
        updateHeaderUI();
        window.spendGem = async () => false;
        window.gemBalance = 0;
        if (window.refreshGameAfterWallet) window.refreshGameAfterWallet();
        attachWalletEvents();
        toggleBannerSection();
        toggleLeaderboardForLoggedIn();
        
        location.reload();
    }

    async function refreshBalance() {
        if (!userAddress || !tokenContract) return 0;
        try {
            const rawBalance = await tokenContract.methods.balanceOf(userAddress).call();
            userGemBalance = rawBalance / (10 ** TOKEN_DECIMALS);
            window.gemBalance = userGemBalance;
            updateHeaderUI();
            if (window.onBalanceUpdate) window.onBalanceUpdate(userGemBalance);
            return userGemBalance;
        } catch (err) {
            return 0;
        }
    }

    async function checkTradingStatus() {
        if (!tokenContract) return false;
        try {
            tradingEnabled = await tokenContract.methods.tradingStarted().call();
            updateHeaderUI();
            return tradingEnabled;
        } catch (err) {
            return false;
        }
    }

    async function checkMinimumBalance() {
        if (!userAddress) return false;
        return userGemBalance >= MIN_GEM_REQUIRED;
    }

    async function spendGem(amount) {
        if (!userAddress || !tokenContract) return false;
        const hasMinimum = await checkMinimumBalance();
        if (!hasMinimum) return false;
        if (!tradingEnabled) return false;
        if (userGemBalance < amount) return false;
        try {
            const amountWei = web3.utils.toWei(amount.toString(), 'ether');
            await tokenContract.methods.transfer(GAME_WALLET_ADDRESS, amountWei).send({ from: userAddress, gas: 100000 });
            await refreshBalance();
            return true;
        } catch (err) {
            return false;
        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (!accounts || accounts.length === 0) throw new Error('No accounts returned');
                userAddress = accounts[0];
                web3 = new Web3(window.ethereum);
                const chainId = await web3.eth.getChainId();
                if (chainId !== 8453) {
                    try {
                        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x2105' }] });
                    } catch (e) {}
                }
                tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
                await checkTradingStatus();
                await refreshBalance();
                updateHeaderUI();
                window.spendGem = spendGem;
                window.refreshBalance = refreshBalance;
                window.ethereum.on('accountsChanged', async (newAccounts) => {
                    if (newAccounts && newAccounts.length > 0) {
                        userAddress = newAccounts[0];
                        await refreshBalance();
                        await checkTradingStatus();
                        updateHeaderUI();
                        if (window.onAccountChange) window.onAccountChange(userAddress);
                        toggleBannerSection();
                        toggleLeaderboardForLoggedIn();
                    } else {
                        disconnectWallet();
                        if (window.onAccountChange) window.onAccountChange(null);
                        toggleBannerSection();
                        toggleLeaderboardForLoggedIn();
                    }
                });
                if (window.onWalletConnect) window.onWalletConnect(userAddress);
                attachWalletEvents();
                toggleBannerSection();
                toggleLeaderboardForLoggedIn();
            } catch (err) {
                userAddress = null;
                updateHeaderUI();
                toggleBannerSection();
                toggleLeaderboardForLoggedIn();
            }
        } else {
            window.open('https://metamask.io/', '_blank');
        }
    }

    async function restoreConnection() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts && accounts.length > 0) {
                    userAddress = accounts[0];
                    web3 = new Web3(window.ethereum);
                    const chainId = await web3.eth.getChainId();
                    if (chainId !== 8453) {
                        try {
                            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x2105' }] });
                        } catch (e) {}
                    }
                    tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
                    await checkTradingStatus();
                    await refreshBalance();
                    updateHeaderUI();
                    window.spendGem = spendGem;
                    window.refreshBalance = refreshBalance;
                    if (window.onWalletConnect) window.onWalletConnect(userAddress);
                    attachWalletEvents();
                    toggleBannerSection();
                    toggleLeaderboardForLoggedIn();
                } else {
                    toggleBannerSection();
                    toggleLeaderboardForLoggedIn();
                }
            } catch (err) {
                toggleBannerSection();
                toggleLeaderboardForLoggedIn();
            }
        } else {
            toggleBannerSection();
            toggleLeaderboardForLoggedIn();
        }
    }

    window.spendGem = async () => false;
    window.gemBalance = 0;
    window.userAddress = null;
    window.connectWallet = connectWallet;
    window.disconnectWallet = disconnectWallet;
    window.getMinGemRequired = () => MIN_GEM_REQUIRED;
    window.checkMinimumBalance = checkMinimumBalance;
    
    window.getGameWalletBalance = async function() {
        if (!tokenContract) return 0;
        try {
            const rawBalance = await tokenContract.methods.balanceOf(GAME_WALLET_ADDRESS).call();
            return rawBalance / (10 ** TOKEN_DECIMALS);
        } catch (err) {
            return 0;
        }
    };

    setTimeout(() => restoreConnection(), 500);
}