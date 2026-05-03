let snakeCanvas, snakeCtx;
let snakeGameLoop;
let snakeData, snakeDirection, snakeNextDirection;
let snakeScore = 0;
let snakeLives = 1;
let snakeGameActive = false;
let snakePowerups = { x2: false, slow: false };
let snakeFood;

const SNAKE_COLS = 30;
const SNAKE_ROWS = 20;
const SNAKE_CELL_SIZE = 20;

function initSnakeGame(container) {
    if (!container) return;
    createSnakeGameHTML(container);
    setupSnakeGame();
}

function initSnakeGameInModal(container) {
    if (!container) return;
    createSnakeGameHTML(container);
    setupSnakeGame();
}

function createSnakeGameHTML(container) {
    container.innerHTML = `
        <div class="game-frame">
            <div class="game-canvas-wrapper">
                <canvas id="snakeCanvas" class="game-canvas" width="${SNAKE_COLS * SNAKE_CELL_SIZE}" height="${SNAKE_ROWS * SNAKE_CELL_SIZE}"></canvas>
            </div>
            <div class="game-ui">
                <div class="game-stats">
                    <div class="stat"><span class="stat-label">🐍 Score:</span><span class="stat-value" id="snakeScore">0</span></div>
                    <div class="stat"><span class="stat-label">⭐ Multi:</span><span class="stat-value" id="snakeMulti">x1</span></div>
                    <div class="stat"><span class="stat-label">❤️ Lives:</span><span class="stat-value" id="snakeLives">1</span></div>
                </div>
                <div class="powerup-bar">
                    <button class="powerup-btn" data-cost="10" data-type="2x">⚡ x2 (10 GEM)</button>
                    <button class="powerup-btn" data-cost="15" data-type="life">❤️ +Life (15 GEM)</button>
                    <button class="powerup-btn" data-cost="20" data-type="slow">🐢 Slow (20 GEM)</button>
                </div>
                <div class="game-controls">
                    <button class="game-btn primary" id="snakeStartBtn">🎮 Start Game</button>
                    <button class="game-btn" id="snakeContinueBtn" style="display:none;">🔄 Continue (5 GEM)</button>
                </div>
            </div>
        </div>
    `;
}

function setupSnakeGame() {
    snakeCanvas = document.getElementById('snakeCanvas');
    if (!snakeCanvas) return;
    snakeCtx = snakeCanvas.getContext('2d');
    
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.moveTo(x+r, y);
            this.lineTo(x+w-r, y);
            this.quadraticCurveTo(x+w, y, x+w, y+r);
            this.lineTo(x+w, y+h-r);
            this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
            this.lineTo(x+r, y+h);
            this.quadraticCurveTo(x, y+h, x, y+h-r);
            this.lineTo(x, y+r);
            this.quadraticCurveTo(x, y, x+r, y);
            return this;
        };
    }
    
    snakeInitGame();
    snakeDraw();
    
    const startBtn = document.getElementById('snakeStartBtn');
    const continueBtn = document.getElementById('snakeContinueBtn');
    
    if (startBtn) {
        startBtn.onclick = (e) => {
            e.preventDefault();
            snakeStartGame();
        };
    }
    
    if (continueBtn) {
        continueBtn.onclick = async (e) => {
            e.preventDefault();
            await snakeContinueGame();
        };
    }
    
    document.querySelectorAll('.powerup-btn').forEach(btn => {
        btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await snakeBuyPowerup(parseInt(btn.dataset.cost), btn.dataset.type);
        };
    });
    
    // Obsługa klawiszy - strzałki + WASD
    const keyHandler = (e) => {
        const key = e.key;
        // Blokuj scrollowanie dla wszystkich klawiszy nawigacji
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' || 
            key === 'w' || key === 'W' || key === 's' || key === 'S' || key === 'a' || key === 'A' || key === 'd' || key === 'D') {
            e.preventDefault();
        }
        
        if (!snakeGameActive) return;
        
        // Strzałki
        if (key === 'ArrowRight' && snakeDirection !== 'LEFT') {
            snakeNextDirection = 'RIGHT';
        } else if (key === 'ArrowLeft' && snakeDirection !== 'RIGHT') {
            snakeNextDirection = 'LEFT';
        } else if (key === 'ArrowUp' && snakeDirection !== 'DOWN') {
            snakeNextDirection = 'UP';
        } else if (key === 'ArrowDown' && snakeDirection !== 'UP') {
            snakeNextDirection = 'DOWN';
        }
        // Klawisze WASD
        else if ((key === 'd' || key === 'D') && snakeDirection !== 'LEFT') {
            snakeNextDirection = 'RIGHT';
        } else if ((key === 'a' || key === 'A') && snakeDirection !== 'RIGHT') {
            snakeNextDirection = 'LEFT';
        } else if ((key === 'w' || key === 'W') && snakeDirection !== 'DOWN') {
            snakeNextDirection = 'UP';
        } else if ((key === 's' || key === 'S') && snakeDirection !== 'UP') {
            snakeNextDirection = 'DOWN';
        }
    };
    
    if (window.snakeKeyHandler) {
        document.removeEventListener('keydown', window.snakeKeyHandler);
    }
    window.snakeKeyHandler = keyHandler;
    document.addEventListener('keydown', window.snakeKeyHandler);
    
    const preventScroll = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
            e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S' || e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D' || e.key === ' ') {
            e.preventDefault();
        }
    };
    if (window.preventScrollGlobal) {
        document.removeEventListener('keydown', window.preventScrollGlobal);
    }
    window.preventScrollGlobal = preventScroll;
    document.addEventListener('keydown', window.preventScrollGlobal);
}

function snakeInitGame() {
    snakeData = [{x: 15, y: 10}];
    snakeDirection = 'RIGHT';
    snakeNextDirection = 'RIGHT';
    snakeGenerateFood();
    snakeScore = 0;
    snakeLives = 1;
    snakePowerups = { x2: false, slow: false };
    snakeGameActive = false;
    snakeUpdateDisplay();
}

function snakeGenerateFood() {
    let newFood;
    let attempts = 0;
    do {
        newFood = {
            x: Math.floor(Math.random() * SNAKE_COLS),
            y: Math.floor(Math.random() * SNAKE_ROWS)
        };
        attempts++;
        if (attempts > 1000) break;
    } while (snakeData && snakeData.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    snakeFood = newFood;
}

function snakeUpdateDisplay() {
    const scoreEl = document.getElementById('snakeScore');
    const multiEl = document.getElementById('snakeMulti');
    const livesEl = document.getElementById('snakeLives');
    if (scoreEl) scoreEl.innerText = snakeScore;
    if (multiEl) multiEl.innerText = snakePowerups.x2 ? 'x2' : 'x1';
    if (livesEl) livesEl.innerText = snakeLives;
}

function snakeDraw() {
    if (!snakeCtx || !snakeData) return;
    
    snakeCtx.fillStyle = '#0a1a0f';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    snakeCtx.strokeStyle = 'rgba(255,215,0,0.15)';
    snakeCtx.lineWidth = 0.5;
    for (let i = 0; i <= SNAKE_COLS; i++) {
        snakeCtx.beginPath();
        snakeCtx.moveTo(i * SNAKE_CELL_SIZE, 0);
        snakeCtx.lineTo(i * SNAKE_CELL_SIZE, snakeCanvas.height);
        snakeCtx.stroke();
        snakeCtx.beginPath();
        snakeCtx.moveTo(0, i * SNAKE_CELL_SIZE);
        snakeCtx.lineTo(snakeCanvas.width, i * SNAKE_CELL_SIZE);
        snakeCtx.stroke();
    }
    
    snakeData.forEach((segment, index) => {
        const x = segment.x * SNAKE_CELL_SIZE;
        const y = segment.y * SNAKE_CELL_SIZE;
        
        const gradient = snakeCtx.createLinearGradient(x, y, x + SNAKE_CELL_SIZE, y + SNAKE_CELL_SIZE);
        if (index === 0) {
            gradient.addColorStop(0, '#ffd700');
            gradient.addColorStop(1, '#ffaa00');
        } else {
            gradient.addColorStop(0, '#4caf50');
            gradient.addColorStop(1, '#2e7d32');
        }
        snakeCtx.fillStyle = gradient;
        
        snakeCtx.beginPath();
        snakeCtx.roundRect(x + 1, y + 1, SNAKE_CELL_SIZE - 2, SNAKE_CELL_SIZE - 2, 4);
        snakeCtx.fill();
        
        if (index === 0) {
            snakeCtx.fillStyle = '#ffffff';
            snakeCtx.beginPath();
            snakeCtx.arc(x + 6, y + 7, 3, 0, Math.PI * 2);
            snakeCtx.arc(x + 14, y + 7, 3, 0, Math.PI * 2);
            snakeCtx.fill();
            
            snakeCtx.fillStyle = '#000000';
            let eyeOffsetX = 0, eyeOffsetY = 0;
            if (snakeDirection === 'RIGHT') eyeOffsetX = 1.5;
            else if (snakeDirection === 'LEFT') eyeOffsetX = -1.5;
            else if (snakeDirection === 'UP') eyeOffsetY = -1.5;
            else if (snakeDirection === 'DOWN') eyeOffsetY = 1.5;
            
            snakeCtx.beginPath();
            snakeCtx.arc(x + 6 + eyeOffsetX, y + 7 + eyeOffsetY, 1.8, 0, Math.PI * 2);
            snakeCtx.arc(x + 14 + eyeOffsetX, y + 7 + eyeOffsetY, 1.8, 0, Math.PI * 2);
            snakeCtx.fill();
            
            snakeCtx.fillStyle = '#ffffff';
            snakeCtx.beginPath();
            snakeCtx.arc(x + 4.5, y + 5.5, 0.8, 0, Math.PI * 2);
            snakeCtx.arc(x + 12.5, y + 5.5, 0.8, 0, Math.PI * 2);
            snakeCtx.fill();
        }
    });
    
    const fx = snakeFood.x * SNAKE_CELL_SIZE;
    const fy = snakeFood.y * SNAKE_CELL_SIZE;
    snakeCtx.shadowBlur = 8;
    snakeCtx.shadowColor = '#ff4444';
    snakeCtx.fillStyle = '#ff3333';
    snakeCtx.beginPath();
    snakeCtx.ellipse(fx + SNAKE_CELL_SIZE/2, fy + SNAKE_CELL_SIZE/2 - 1, SNAKE_CELL_SIZE/2 - 3, SNAKE_CELL_SIZE/2 - 2, 0, 0, Math.PI * 2);
    snakeCtx.fill();
    snakeCtx.fillStyle = '#ff7777';
    snakeCtx.beginPath();
    snakeCtx.ellipse(fx + SNAKE_CELL_SIZE/2 - 2, fy + SNAKE_CELL_SIZE/2 - 3, 2, 3, 0, 0, Math.PI * 2);
    snakeCtx.fill();
    snakeCtx.fillStyle = '#4caf50';
    snakeCtx.beginPath();
    snakeCtx.ellipse(fx + SNAKE_CELL_SIZE/2, fy + 3, 3, 4, -0.3, 0, Math.PI * 2);
    snakeCtx.fill();
    snakeCtx.shadowBlur = 0;
    
    if (snakePowerups.x2) {
        snakeCtx.fillStyle = 'rgba(255,215,0,0.06)';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    }
    if (snakePowerups.slow) {
        snakeCtx.fillStyle = 'rgba(100, 100, 255, 0.06)';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    }
}

function snakeMove() {
    if (!snakeData) return false;
    
    snakeDirection = snakeNextDirection;
    let newHead = {...snakeData[0]};
    
    switch(snakeDirection) {
        case 'RIGHT': newHead.x++; break;
        case 'LEFT': newHead.x--; break;
        case 'UP': newHead.y--; break;
        case 'DOWN': newHead.y++; break;
    }
    
    const ate = (newHead.x === snakeFood.x && newHead.y === snakeFood.y);
    
    if (ate) {
        let points = 1 * (snakePowerups.x2 ? 2 : 1);
        snakeScore += points;
        snakeUpdateDisplay();
        snakeGenerateFood();
    } else {
        snakeData.pop();
    }
    
    if (newHead.x < 0 || newHead.x >= SNAKE_COLS || newHead.y < 0 || newHead.y >= SNAKE_ROWS) {
        snakeHandleDeath();
        return false;
    }
    
    if (snakeData.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        snakeHandleDeath();
        return false;
    }
    
    snakeData.unshift(newHead);
    return true;
}

async function snakeHandleDeath() {
    if (snakeLives > 1) {
        snakeLives--;
        snakeUpdateDisplay();
        snakeData = [{x: 15, y: 10}];
        snakeDirection = 'RIGHT';
        snakeNextDirection = 'RIGHT';
        snakeGenerateFood();
        if (snakeCtx) {
            snakeCtx.fillStyle = 'rgba(255,0,0,0.3)';
            snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
            setTimeout(() => snakeDraw(), 200);
        }
    } else {
        snakeGameActive = false;
        if (snakeGameLoop) clearInterval(snakeGameLoop);
        const continueBtn = document.getElementById('snakeContinueBtn');
        if (continueBtn) continueBtn.style.display = 'inline-block';
        await snakeSaveScore();
    }
}

async function snakeSaveScore() {
    if (window.userAddress) {
        let ranking = JSON.parse(localStorage.getItem('snake_ranking') || '[]');
        ranking.push({address: window.userAddress.slice(0,6)+'...', score: snakeScore, game: 'snake', gameIcon: '🐍'});
        ranking.sort((a,b) => b.score - a.score);
        ranking = ranking.slice(0, 10);
        localStorage.setItem('snake_ranking', JSON.stringify(ranking));
        if (window.updateGlobalRanking) window.updateGlobalRanking();
    }
}

function snakeStartGame() {
    if (!window.userAddress) return;
    snakeInitGame();
    snakeGameActive = true;
    const continueBtn = document.getElementById('snakeContinueBtn');
    if (continueBtn) continueBtn.style.display = 'none';
    if (snakeGameLoop) clearInterval(snakeGameLoop);
    const interval = snakePowerups.slow ? 150 : 100;
    snakeGameLoop = setInterval(() => {
        if (snakeGameActive) {
            snakeMove();
            snakeDraw();
        }
    }, interval);
    snakeDraw();
}

async function snakeContinueGame() {
    if (!window.userAddress) return;
    if (window.spendGem) {
        const success = await window.spendGem(5, 'continue snake game');
        if (success) {
            snakeInitGame();
            snakeGameActive = true;
            const continueBtn = document.getElementById('snakeContinueBtn');
            if (continueBtn) continueBtn.style.display = 'none';
            if (snakeGameLoop) clearInterval(snakeGameLoop);
            const interval = snakePowerups.slow ? 150 : 100;
            snakeGameLoop = setInterval(() => {
                if (snakeGameActive) {
                    snakeMove();
                    snakeDraw();
                }
            }, interval);
            snakeDraw();
            if (window.refreshBalance) await window.refreshBalance();
        }
    }
}

async function snakeBuyPowerup(cost, type) {
    if (!window.userAddress) return false;
    if (window.spendGem) {
        const success = await window.spendGem(cost, `powerup: ${type}`);
        if (success) {
            if (type === '2x') snakePowerups.x2 = true;
            if (type === 'life') snakeLives++;
            if (type === 'slow') snakePowerups.slow = true;
            snakeUpdateDisplay();
            if (window.refreshBalance) await window.refreshBalance();
            return true;
        }
    }
    return false;
}

window.initSnakeGame = initSnakeGame;
window.initSnakeGameInModal = initSnakeGameInModal;