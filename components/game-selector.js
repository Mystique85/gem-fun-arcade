// ============================================
// GAME SELECTOR COMPONENT - STAŁY WYBÓR GIER
// ============================================

class GameSelectorComponent {
    constructor() {
        this.currentGame = null;
        this.init();
    }

    getHTML() {
        return `
            <div class="game-selector-container">
                <h2 class="selector-title">🎮 Choose Your Game</h2>
                <div class="game-cards">
                    <div class="game-card" data-game="snake">
                        <div class="card-glow"></div>
                        <div class="card-icon">🐍</div>
                        <h3>GEM SNAKE</h3>
                        <p>Classic snake game. Eat, grow, don't crash!</p>
                        <div class="card-stats">
                            <span>🎯 skill</span>
                            <span>⚡ power-ups</span>
                        </div>
                        <button class="play-btn" data-game="snake">
                            <span>Play Snake</span>
                            <span class="btn-arrow">→</span>
                        </button>
                    </div>
                    <div class="game-card" data-game="flappy">
                        <div class="card-glow"></div>
                        <div class="card-icon">🕊️</div>
                        <h3>GEM FLAPPY</h3>
                        <p>Flappy Bird style. Tap, fly, survive!</p>
                        <div class="card-stats">
                            <span>🎯 reflexes</span>
                            <span>🏆 high score</span>
                        </div>
                        <button class="play-btn" data-game="flappy">
                            <span>Play Flappy</span>
                            <span class="btn-arrow">→</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setActiveGame(gameType) {
        this.currentGame = gameType;
        const cards = document.querySelectorAll('.game-card');
        cards.forEach(card => {
            if (card.dataset.game === gameType) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    init() {
        // Add event listeners after DOM is ready
        setTimeout(() => {
            const playBtns = document.querySelectorAll('.play-btn');
            const gameCards = document.querySelectorAll('.game-card');
            
            playBtns.forEach(btn => {
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const gameType = btn.dataset.game;
                    console.log('🎮 Game selected:', gameType);
                    this.setActiveGame(gameType);
                    if (window.onGameSelected) {
                        window.onGameSelected(gameType);
                    }
                };
            });
            
            gameCards.forEach(card => {
                card.onclick = (e) => {
                    if (e.target.closest('.play-btn')) return;
                    const gameType = card.dataset.game;
                    console.log('🎮 Game card clicked:', gameType);
                    this.setActiveGame(gameType);
                    if (window.onGameSelected) {
                        window.onGameSelected(gameType);
                    }
                };
            });
        }, 100);
        
        console.log('✅ Game selector component initialized');
    }
}

// Eksportuj dla globalnego użycia
window.GameSelectorComponent = GameSelectorComponent;