// ============================================
// MAIN APP - GAMES LAUNCHER
// ============================================

let headerComponent = null;

// Games Database
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

// Render games grid
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
        card.onclick = () => {
            const gameId = card.dataset.game;
            const game = GAMES.find(g => g.id === gameId);
            if (game) {
                if (game.badge === 'coming') {
                    alert(`🎮 ${game.name} is coming soon! Stay tuned.`);
                } else {
                    if (!window.userAddress) {
                        alert('🔌 Please connect your wallet first to play!');
                        return;
                    }
                    if (window.openGameModal) {
                        window.openGameModal(gameId, game.name, game);
                    }
                }
            }
        };
    });
    console.log('✅ Games grid rendered');
}

// Update leaderboard
function updateLeaderboard(filter = 'all') {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    let allScores = [];
    
    if (filter === 'all') {
        GAMES.forEach(game => {
            const scores = JSON.parse(localStorage.getItem(`${game.id}_ranking`) || '[]');
            allScores.push(...scores.map(s => ({ ...s, game: game.name, gameIcon: game.icon })));
        });
        allScores.sort((a, b) => b.score - a.score);
        allScores = allScores.slice(0, 20);
    } else {
        const scores = JSON.parse(localStorage.getItem(`${filter}_ranking`) || '[]');
        allScores = scores.slice(0, 10);
    }
    
    if (allScores.length === 0) {
        leaderboardList.innerHTML = '<div class="loading-scores">No scores yet. Play a game!</div>';
        return;
    }
    
    leaderboardList.innerHTML = allScores.map((entry, index) => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}</div>
            <div class="leaderboard-player">
                ${entry.gameIcon || '🎮'} ${entry.address || 'Player'}${filter === 'all' ? ` - ${entry.game || ''}` : ''}
            </div>
            <div class="leaderboard-score">${entry.score} pts</div>
        </div>
    `).join('');
    console.log('✅ Leaderboard updated');
}

// Setup leaderboard filters
function setupLeaderboardFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        btn.onclick = () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateLeaderboard(btn.dataset.game);
        };
    });
    console.log('✅ Leaderboard filters setup');
}

// Inicjalizacja headera
function initHeader() {
    const headerContainer = document.getElementById('mainHeader');
    if (headerContainer && window.HeaderComponent) {
        headerComponent = new window.HeaderComponent();
        headerContainer.innerHTML = headerComponent.getHTML();
        console.log('✅ Header HTML injected');
        
        // Przekaż referencję do web3-core
        if (window.setHeaderComponent) {
            window.setHeaderComponent(headerComponent);
        }
    } else {
        console.error('❌ Cannot initialize header - container or component missing');
    }
}

// Główna inicjalizacja
function initApp() {
    console.log('🚀 GEM FUN Arcade initializing...');
    initHeader();
    renderGamesGrid();
    setupLeaderboardFilters();
    updateLeaderboard('all');
    console.log('✅ App initialized');
}

// Wallet event handlers (będą wywoływane przez web3-core)
window.onWalletConnect = (address) => {
    console.log('Wallet connected:', address);
    updateLeaderboard('all');
};

window.onAccountChange = (address) => {
    console.log('Account changed:', address);
    updateLeaderboard('all');
};

window.updateGlobalRanking = () => updateLeaderboard('all');

// Uruchom po załadowaniu DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

console.log('✅ Main.js loaded');