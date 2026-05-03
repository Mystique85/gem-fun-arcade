let snakeCanvas, snakeCtx;
let snakeGameLoop;
let snakeData, snakeDirection, snakeNextDirection;
let snakeScore = 0;
let snakeLives = 1;
let snakeGameActive = false;
let snakePowerups = { x2: false, slow: false };
let snakeFood;
let snakeFoodType = 'apple';
let snakeFoodTimer = null;
let snakeSpeedBoost = false;
let snakeSpeedBoostTimer = null;
let snakeShield = false;
let showTutorial = true;

const SNAKE_COLS = 30;
const SNAKE_ROWS = 20;
let SNAKE_CELL_SIZE = 20;

const FOOD_TYPES = {
    apple: { emoji: '🍎', color: '#ff3333', points: 1, bonus: 'none', chance: 0.40, name: 'Apple', description: '+1 point', isNegative: false, duration: 0 },
    star: { emoji: '⭐', color: '#ffd700', points: 3, bonus: 'points_x3', chance: 0.20, name: 'Golden Star', description: '+3 points (instant)', isNegative: false, duration: 0 },
    skull: { emoji: '💀', color: '#555555', points: -2, bonus: 'penalty', chance: 0.08, name: 'Skull', description: '-2 points (penalty! Avoid if possible)', isNegative: true, duration: 5000 },
    lightning: { emoji: '⚡', color: '#00ffff', points: 2, bonus: 'speed_boost', chance: 0.15, name: 'Lightning', description: 'Speed boost for 10s', isNegative: false, duration: 0 },
    shield: { emoji: '🛡️', color: '#8888ff', points: 0, bonus: 'shield', chance: 0.10, name: 'Shield', description: 'Shield for 15s', isNegative: false, duration: 0 },
    diamond: { emoji: '💎', color: '#00ffff', points: 10, bonus: 'big_points', chance: 0.07, name: 'Diamond', description: '+10 points!', isNegative: false, duration: 0 }
};

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
        <div class="game-frame" style="display: flex; flex-direction: column; height: 100%;">
            <div style="display: flex; justify-content: center; padding: 10px; flex-shrink: 0;">
                <div class="game-canvas-wrapper" style="padding: 10px; background: rgba(0,0,0,0.3); border-radius: 16px; position: relative;">
                    <canvas id="snakeCanvas" class="game-canvas" width="${SNAKE_COLS * SNAKE_CELL_SIZE}" height="${SNAKE_ROWS * SNAKE_CELL_SIZE}"></canvas>
                    <div id="snakeTutorial" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
                        <div style="background: linear-gradient(135deg, #1a1a2a, #0a0a15); border-radius: 24px; padding: 20px; max-width: 280px; text-align: center; border: 1px solid #ffd700;">
                            <h3 style="color: #ffd700; margin-bottom: 12px;">🐍 HOW TO PLAY</h3>
                            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 16px;">
                                <div><span style="font-size: 1.5rem;">←↑↓→</span><br><span style="font-size: 0.7rem;">or WASD</span></div>
                                <div><span style="font-size: 1.5rem;">🍎</span><br><span style="font-size: 0.7rem;">Eat food</span></div>
                            </div>
                            <div style="background: rgba(255,215,0,0.1); border-radius: 16px; padding: 12px; margin-bottom: 16px;">
                                <div style="font-size: 0.7rem; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
                                    <span>🍎 +1</span> <span>⭐ x3</span> <span style="background: rgba(255,0,0,0.2); padding: 2px 6px; border-radius: 12px;">💀 -2 (avoid)</span>
                                    <span>⚡ speed</span> <span>🛡️ shield</span> <span>💎 +10</span>
                                </div>
                                <div style="margin-top: 8px; font-size: 0.6rem; color: #ffd700;">❤️ Extra Life - Buy with GEM FUN (15 GEM)</div>
                            </div>
                            <button id="snakeCloseTutorial" style="background: #ffd700; color: #1a1a1a; border: none; padding: 8px 24px; border-radius: 30px; font-weight: bold; cursor: pointer;">Got it!</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="game-ui" style="flex-shrink: 0;">
                <div class="game-stats">
                    <div class="stat"><span class="stat-label">🐍 Score</span><span class="stat-value" id="snakeScore">0</span></div>
                    <div class="stat"><span class="stat-label">⭐ Multi</span><span class="stat-value" id="snakeMulti">x1</span></div>
                    <div class="stat"><span class="stat-label">❤️ Lives</span><span class="stat-value" id="snakeLives">1</span></div>
                </div>
                <div class="powerup-bar">
                    <div class="powerup-tooltip" style="position: relative; display: inline-block;">
                        <button class="powerup-btn" data-cost="10" data-type="2x">⚡ x2 Points<br><span style="font-size: 0.6rem;">10 GEM</span></button>
                        <span class="tooltiptext" style="visibility: hidden; width: 160px; background: #1a1a2a; color: #ffd700; text-align: center; border-radius: 8px; padding: 6px; position: absolute; z-index: 1; bottom: 125%; left: 50%; margin-left: -80px; font-size: 0.7rem; border: 1px solid #ffd700;">Double points for 30s</span>
                    </div>
                    <div class="powerup-tooltip" style="position: relative; display: inline-block;">
                        <button class="powerup-btn" data-cost="15" data-type="life">❤️ Extra Life<br><span style="font-size: 0.6rem;">15 GEM</span></button>
                        <span class="tooltiptext" style="visibility: hidden; width: 160px; background: #1a1a2a; color: #ffd700; text-align: center; border-radius: 8px; padding: 6px; position: absolute; z-index: 1; bottom: 125%; left: 50%; margin-left: -80px; font-size: 0.7rem; border: 1px solid #ffd700;">Get one extra life instantly</span>
                    </div>
                    <div class="powerup-tooltip" style="position: relative; display: inline-block;">
                        <button class="powerup-btn" data-cost="20" data-type="slow">🐢 Slow Mode<br><span style="font-size: 0.6rem;">20 GEM</span></button>
                        <span class="tooltiptext" style="visibility: hidden; width: 160px; background: #1a1a2a; color: #ffd700; text-align: center; border-radius: 8px; padding: 6px; position: absolute; z-index: 1; bottom: 125%; left: 50%; margin-left: -80px; font-size: 0.7rem; border: 1px solid #ffd700;">Slow down game for 20s</span>
                    </div>
                </div>
                <div class="game-controls">
                    <button class="game-btn primary" id="snakeStartBtn">🎮 Start Game</button>
                    <button class="game-btn" id="snakeContinueBtn" style="display:none;">🔄 Continue (5 GEM)</button>
                    <button class="game-btn" id="snakeHelpBtn" style="background: rgba(255,215,0,0.2);">❓ Help</button>
                </div>
            </div>
            
            <div style="flex-shrink: 0; text-align: center; padding: 8px; font-size: 0.65rem; color: #8b92b0; background: rgba(0,0,0,0.2); border-radius: 12px; margin: 8px; position: relative;">
                <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;" id="snakeBonusLegend">
                    <span class="food-hint" data-food="apple" style="cursor: help;">🍎 +1</span>
                    <span class="food-hint" data-food="star" style="cursor: help;">⭐ x3</span>
                    <span class="food-hint" data-food="skull" style="cursor: help; background: rgba(255,0,0,0.2); padding: 0 6px; border-radius: 12px;">💀 -2 (avoids)</span>
                    <span class="food-hint" data-food="lightning" style="cursor: help;">⚡ speed</span>
                    <span class="food-hint" data-food="shield" style="cursor: help;">🛡️ shield</span>
                    <span class="food-hint" data-food="diamond" style="cursor: help;">💎 +10</span>
                </div>
                <div id="snakeTooltip" style="position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: #1a1a2a; color: #ffd700; padding: 6px 12px; border-radius: 8px; font-size: 0.7rem; white-space: nowrap; display: none; border: 1px solid #ffd700; z-index: 100;">Hover over items</div>
                <div style="margin-top: 6px;">🎮 Controls: ← ↑ ↓ → or W A S D | 💀 Skulls disappear after 5 seconds</div>
                <div style="margin-top: 4px; font-size: 0.6rem; color: #ffd700;">💎 GEM FUN Power-ups: x2 Points (10) | Extra Life (15) | Slow Mode (20)</div>
            </div>
        </div>
    `;
}

function setupSnakeGame() {
    snakeCanvas = document.getElementById('snakeCanvas');
    if (!snakeCanvas) return;
    snakeCtx = snakeCanvas.getContext('2d');
    
    function resizeCanvas() {
        const wrapper = snakeCanvas.parentElement;
        if (!wrapper) return;
        const maxWidth = Math.min(600, wrapper.clientWidth - 20);
        const maxHeight = window.innerHeight * 0.4;
        const scale = Math.min(maxWidth / snakeCanvas.width, maxHeight / snakeCanvas.height);
        snakeCanvas.style.width = `${snakeCanvas.width * scale}px`;
        snakeCanvas.style.height = `${snakeCanvas.height * scale}px`;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
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
    const helpBtn = document.getElementById('snakeHelpBtn');
    const closeTutorial = document.getElementById('snakeCloseTutorial');
    const tutorial = document.getElementById('snakeTutorial');
    
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
    
    if (helpBtn) {
        helpBtn.onclick = () => {
            if (tutorial) tutorial.style.display = 'flex';
        };
    }
    
    if (closeTutorial) {
        closeTutorial.onclick = () => {
            if (tutorial) tutorial.style.display = 'none';
            showTutorial = false;
        };
    }
    
    const foodHints = document.querySelectorAll('.food-hint');
    const tooltipDiv = document.getElementById('snakeTooltip');
    
    foodHints.forEach(hint => {
        hint.onmouseenter = (e) => {
            const foodType = hint.dataset.food;
            const foodData = FOOD_TYPES[foodType];
            if (foodData && tooltipDiv) {
                tooltipDiv.innerHTML = `${foodData.emoji} ${foodData.name}: ${foodData.description}`;
                tooltipDiv.style.display = 'block';
            }
        };
        hint.onmouseleave = () => {
            if (tooltipDiv) tooltipDiv.style.display = 'none';
        };
    });
    
    const powerupBtns = document.querySelectorAll('.powerup-tooltip');
    powerupBtns.forEach(container => {
        const btn = container.querySelector('.powerup-btn');
        const tooltip = container.querySelector('.tooltiptext');
        if (btn && tooltip) {
            container.onmouseenter = () => { tooltip.style.visibility = 'visible'; };
            container.onmouseleave = () => { tooltip.style.visibility = 'hidden'; };
        }
    });
    
    document.querySelectorAll('.powerup-btn').forEach(btn => {
        btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await snakeBuyPowerup(parseInt(btn.dataset.cost), btn.dataset.type);
        };
    });
    
    const keyHandler = (e) => {
        const key = e.key;
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' || 
            key === 'w' || key === 'W' || key === 's' || key === 'S' || key === 'a' || key === 'A' || key === 'd' || key === 'D') {
            e.preventDefault();
        }
        
        if (!snakeGameActive) return;
        
        if (key === 'ArrowRight' && snakeDirection !== 'LEFT') {
            snakeNextDirection = 'RIGHT';
        } else if (key === 'ArrowLeft' && snakeDirection !== 'RIGHT') {
            snakeNextDirection = 'LEFT';
        } else if (key === 'ArrowUp' && snakeDirection !== 'DOWN') {
            snakeNextDirection = 'UP';
        } else if (key === 'ArrowDown' && snakeDirection !== 'UP') {
            snakeNextDirection = 'DOWN';
        }
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

function snakeStartFoodTimer() {
    if (snakeFoodTimer) clearTimeout(snakeFoodTimer);
    
    const foodData = FOOD_TYPES[snakeFoodType];
    if (foodData && foodData.isNegative && foodData.duration > 0) {
        snakeFoodTimer = setTimeout(() => {
            snakeGenerateFood();
            snakeDraw();
        }, foodData.duration);
    }
}

function snakeGenerateFood() {
    let newFood;
    let attempts = 0;
    let foodType = 'apple';
    
    const random = Math.random();
    let cumulative = 0;
    for (const [type, data] of Object.entries(FOOD_TYPES)) {
        cumulative += data.chance;
        if (random <= cumulative) {
            foodType = type;
            break;
        }
    }
    
    do {
        newFood = {
            x: Math.floor(Math.random() * SNAKE_COLS),
            y: Math.floor(Math.random() * SNAKE_ROWS)
        };
        attempts++;
        if (attempts > 1000) break;
    } while (snakeData && snakeData.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    snakeFood = newFood;
    snakeFoodType = foodType;
    
    snakeStartFoodTimer();
}

function snakeInitGame() {
    snakeData = [{x: 15, y: 10}];
    snakeDirection = 'RIGHT';
    snakeNextDirection = 'RIGHT';
    if (snakeFoodTimer) clearTimeout(snakeFoodTimer);
    snakeGenerateFood();
    snakeScore = 0;
    snakeLives = 1;
    snakeSpeedBoost = false;
    snakeShield = false;
    if (snakeSpeedBoostTimer) clearTimeout(snakeSpeedBoostTimer);
    snakePowerups = { x2: false, slow: false };
    snakeGameActive = false;
    snakeUpdateDisplay();
}

function snakeApplyFoodBonus(bonusType) {
    switch(bonusType) {
        case 'speed_boost':
            if (!snakePowerups.slow) {
                snakeSpeedBoost = true;
                if (snakeGameLoop) {
                    clearInterval(snakeGameLoop);
                    const interval = 60;
                    snakeGameLoop = setInterval(() => {
                        if (snakeGameActive) {
                            snakeMove();
                            snakeDraw();
                        }
                    }, interval);
                }
                if (snakeSpeedBoostTimer) clearTimeout(snakeSpeedBoostTimer);
                snakeSpeedBoostTimer = setTimeout(() => {
                    snakeSpeedBoost = false;
                    if (snakeGameActive && snakeGameLoop) {
                        clearInterval(snakeGameLoop);
                        const interval = snakePowerups.slow ? 150 : 100;
                        snakeGameLoop = setInterval(() => {
                            if (snakeGameActive) {
                                snakeMove();
                                snakeDraw();
                            }
                        }, interval);
                    }
                }, 10000);
            }
            break;
        case 'shield':
            snakeShield = true;
            setTimeout(() => {
                snakeShield = false;
            }, 15000);
            break;
    }
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
    const foodData = FOOD_TYPES[snakeFoodType];
    
    snakeCtx.shadowBlur = 8;
    snakeCtx.shadowColor = '#ff4444';
    snakeCtx.fillStyle = foodData.color;
    snakeCtx.beginPath();
    snakeCtx.ellipse(fx + SNAKE_CELL_SIZE/2, fy + SNAKE_CELL_SIZE/2 - 1, SNAKE_CELL_SIZE/2 - 3, SNAKE_CELL_SIZE/2 - 2, 0, 0, Math.PI * 2);
    snakeCtx.fill();
    
    snakeCtx.font = `${SNAKE_CELL_SIZE - 8}px Arial`;
    snakeCtx.fillStyle = '#ffffff';
    snakeCtx.shadowBlur = 2;
    snakeCtx.fillText(foodData.emoji, fx + 4, fy + SNAKE_CELL_SIZE - 6);
    
    snakeCtx.shadowBlur = 0;
    
    if (snakePowerups.x2) {
        snakeCtx.fillStyle = 'rgba(255,215,0,0.06)';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    }
    if (snakePowerups.slow) {
        snakeCtx.fillStyle = 'rgba(100, 100, 255, 0.06)';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    }
    if (snakeShield) {
        snakeCtx.fillStyle = 'rgba(136, 136, 255, 0.1)';
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
    const foodData = FOOD_TYPES[snakeFoodType];
    
    if (ate) {
        let points = foodData.points;
        if (snakePowerups.x2) points *= 2;
        if (foodData.bonus === 'points_x3') {
            points = 3;
            if (snakePowerups.x2) points *= 2;
        }
        if (foodData.bonus === 'big_points') {
            points = 10;
            if (snakePowerups.x2) points *= 2;
        }
        if (foodData.bonus === 'penalty') {
            points = -2;
        }
        
        snakeScore += points;
        snakeUpdateDisplay();
        snakeApplyFoodBonus(foodData.bonus);
        if (snakeFoodTimer) clearTimeout(snakeFoodTimer);
        snakeGenerateFood();
    } else {
        snakeData.pop();
    }
    
    if (newHead.x < 0 || newHead.x >= SNAKE_COLS || newHead.y < 0 || newHead.y >= SNAKE_ROWS) {
        if (snakeShield) {
            snakeShield = false;
            return true;
        }
        snakeHandleDeath();
        return false;
    }
    
    if (snakeData.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        if (snakeShield) {
            snakeShield = false;
            return true;
        }
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
        if (snakeFoodTimer) clearTimeout(snakeFoodTimer);
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
            if (type === '2x') {
                snakePowerups.x2 = true;
                setTimeout(() => {
                    snakePowerups.x2 = false;
                    snakeUpdateDisplay();
                }, 30000);
            }
            if (type === 'life') {
                snakeLives++;
                snakeUpdateDisplay();
            }
            if (type === 'slow') {
                snakePowerups.slow = true;
                if (snakeGameLoop && !snakeSpeedBoost) {
                    clearInterval(snakeGameLoop);
                    snakeGameLoop = setInterval(() => {
                        if (snakeGameActive) {
                            snakeMove();
                            snakeDraw();
                        }
                    }, 150);
                }
                setTimeout(() => {
                    snakePowerups.slow = false;
                    if (snakeGameLoop && !snakeSpeedBoost) {
                        clearInterval(snakeGameLoop);
                        snakeGameLoop = setInterval(() => {
                            if (snakeGameActive) {
                                snakeMove();
                                snakeDraw();
                            }
                        }, 100);
                    }
                    snakeUpdateDisplay();
                }, 20000);
            }
            snakeUpdateDisplay();
            if (window.refreshBalance) await window.refreshBalance();
            return true;
        }
    }
    return false;
}

window.initSnakeGame = initSnakeGame;
window.initSnakeGameInModal = initSnakeGameInModal;