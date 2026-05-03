// ============================================
// GAME MODAL COMPONENT
// ============================================

class GameModal {
    constructor() {
        this.modal = document.getElementById('gameModal');
        this.modalBody = document.getElementById('modalBody');
        this.modalTitle = document.getElementById('modalGameTitle');
        this.currentGame = null;
        this.currentGameType = null;
        this.init();
    }

    init() {
        const closeBtn = document.getElementById('closeModalBtn');
        const overlay = document.querySelector('.modal-overlay');
        
        if (closeBtn) {
            closeBtn.onclick = () => this.close();
        }
        if (overlay) {
            overlay.onclick = () => this.close();
        }
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(gameType, gameTitle, gameData) {
        // Cleanup previous game
        if (this.currentGameType) {
            this.cleanupGame();
        }
        
        this.currentGameType = gameType;
        this.modalTitle.innerText = gameTitle;
        this.modalBody.innerHTML = '';
        
        // Show modal
        this.modal.classList.add('active');
        
        // Load game
        this.loadGame(gameType, gameData);
    }

    loadGame(gameType, gameData) {
        const gameFunctions = {
            snake: () => {
                if (typeof initSnakeGameInModal === 'function') {
                    initSnakeGameInModal(this.modalBody);
                } else {
                    this.modalBody.innerHTML = '<div class="game-placeholder">❌ Snake game not loaded</div>';
                }
            },
            flappy: () => {
                if (typeof initFlappyGameInModal === 'function') {
                    initFlappyGameInModal(this.modalBody);
                } else {
                    this.modalBody.innerHTML = '<div class="game-placeholder">❌ Flappy game not loaded</div>';
                }
            },
            tetris: () => {
                this.modalBody.innerHTML = '<div class="game-placeholder">🧩 Tetris - Coming Soon!</div>';
            },
            pong: () => {
                this.modalBody.innerHTML = '<div class="game-placeholder">🏓 Pong - Coming Soon!</div>';
            },
            pacman: () => {
                this.modalBody.innerHTML = '<div class="game-placeholder">👻 Pacman - Coming Soon!</div>';
            },
            'space-invaders': () => {
                this.modalBody.innerHTML = '<div class="game-placeholder">👾 Space Invaders - Coming Soon!</div>';
            },
            breakout: () => {
                this.modalBody.innerHTML = '<div class="game-placeholder">🧱 Breakout - Coming Soon!</div>';
            },
            minesweeper: () => {
                this.modalBody.innerHTML = '<div class="game-placeholder">💣 Minesweeper - Coming Soon!</div>';
            },
            memory: () => {
                this.modalBody.innerHTML = '<div class="game-placeholder">🎴 Memory Match - Coming Soon!</div>';
            },
            'tic-tac-toe': () => {
                this.modalBody.innerHTML = '<div class="game-placeholder">❌⭕ Tic Tac Toe - Coming Soon!</div>';
            }
        };
        
        const loader = gameFunctions[gameType];
        if (loader) {
            loader();
        } else {
            this.modalBody.innerHTML = '<div class="game-placeholder">🎮 Game loading...</div>';
        }
    }

    cleanupGame() {
        if (this.currentGameType === 'snake') {
            if (window.snakeGameLoop) clearInterval(window.snakeGameLoop);
            if (window.snakeKeyHandler) document.removeEventListener('keydown', window.snakeKeyHandler);
        } else if (this.currentGameType === 'flappy') {
            if (window.flappyGameLoop) clearInterval(window.flappyGameLoop);
            if (window.flappySpaceHandler) document.removeEventListener('keydown', window.flappySpaceHandler);
        }
    }

    close() {
        this.cleanupGame();
        this.modal.classList.remove('active');
        this.modalBody.innerHTML = '';
        this.currentGameType = null;
        this.currentGame = null;
    }
}

// Singleton instance
let gameModalInstance = null;

window.openGameModal = (gameType, gameTitle, gameData) => {
    if (!gameModalInstance) {
        gameModalInstance = new GameModal();
    }
    gameModalInstance.open(gameType, gameTitle, gameData);
};

window.GameModal = GameModal;