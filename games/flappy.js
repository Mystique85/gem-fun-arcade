// ============================================
// FLAPPY BIRD GAME - Z INTEGRACJĄ GEM TOKEN
// ============================================

console.log('🕊️ Flappy game script loading...');

let flappyCanvas, flappyCtx;
let flappyGameLoop;
let flappyActive = false;
let flappyScore = 0;
let flappyHighScore = 0;
let flappyBird = { x: 100, y: 200, velocity: 0, gravity: 0.4, jumpPower: -7 };
let flappyPipes = [];
let flappyFrame = 0;
let flappyGameStarted = false;

const FLAPPY_WIDTH = 600;
const FLAPPY_HEIGHT = 400;
const PIPE_WIDTH = 60;
const PIPE_GAP = 120;

// Główna funkcja inicjalizująca grę (dla strony głównej)
function initFlappyGame(container) {
    console.log('🕊️ INIT FLAPPY GAME - container:', container);
    
    if (!container) {
        console.error('No container provided for Flappy game');
        return;
    }
    
    createFlappyGameHTML(container);
    setupFlappyGame();
    console.log('✅ Flappy game initialized');
}

// Funkcja dla modala
function initFlappyGameInModal(container) {
    console.log('🕊️ INIT FLAPPY GAME IN MODAL');
    if (!container) {
        console.error('No container provided for Flappy game modal');
        return;
    }
    
    createFlappyGameHTML(container);
    setupFlappyGame();
    console.log('✅ Flappy game initialized in modal');
}

function createFlappyGameHTML(container) {
    const saved = localStorage.getItem('flappy_highscore');
    if (saved) flappyHighScore = parseInt(saved);
    
    container.innerHTML = `
        <div class="game-frame">
            <div class="game-canvas-wrapper">
                <canvas id="flappyCanvas" class="game-canvas" width="${FLAPPY_WIDTH}" height="${FLAPPY_HEIGHT}"></canvas>
            </div>
            <div class="game-ui">
                <div class="game-stats">
                    <div class="stat"><span class="stat-label">🕊️ Score:</span><span class="stat-value" id="flappyScore">0</span></div>
                    <div class="stat"><span class="stat-label">🏆 Best:</span><span class="stat-value" id="flappyHighScore">${flappyHighScore}</span></div>
                </div>
                <div class="powerup-bar">
                    <button class="powerup-btn" data-cost="10" data-type="shield">🛡️ Shield (10 GEM)</button>
                    <button class="powerup-btn" data-cost="15" data-type="slowmo">⏱️ SlowMo (15 GEM)</button>
                </div>
                <div class="game-controls">
                    <button class="game-btn primary" id="flappyStartBtn">🎮 Start Game</button>
                    <button class="game-btn" id="flappyContinueBtn" style="display:none;">🔄 Continue (5 GEM)</button>
                </div>
            </div>
        </div>
    `;
}

function setupFlappyGame() {
    flappyCanvas = document.getElementById('flappyCanvas');
    if (!flappyCanvas) {
        console.error('Flappy canvas not found!');
        return;
    }
    flappyCtx = flappyCanvas.getContext('2d');
    
    flappyResetGame();
    flappyDraw();
    
    // Event listeners
    const startBtn = document.getElementById('flappyStartBtn');
    const continueBtn = document.getElementById('flappyContinueBtn');
    
    if (startBtn) {
        startBtn.onclick = () => flappyStartGame();
    }
    
    if (continueBtn) {
        continueBtn.onclick = () => flappyContinueGame();
    }
    
    // Powerup buttons
    document.querySelectorAll('.powerup-btn').forEach(btn => {
        btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await flappyBuyPowerup(parseInt(btn.dataset.cost), btn.dataset.type);
        };
    });
    
    // Touch/click for jump
    const jumpHandler = (e) => {
        e.preventDefault();
        if (flappyActive && flappyGameStarted) {
            flappyBird.velocity = flappyBird.jumpPower;
            if (flappyCtx) {
                flappyCtx.fillStyle = 'rgba(255,255,255,0.3)';
                flappyCtx.fillRect(0, 0, FLAPPY_WIDTH, FLAPPY_HEIGHT);
                setTimeout(() => flappyDraw(), 50);
            }
        }
    };
    
    if (window.flappyJumpHandler) {
        const oldCanvas = document.getElementById('flappyCanvas');
        if (oldCanvas) {
            oldCanvas.removeEventListener('click', window.flappyJumpHandler);
            oldCanvas.removeEventListener('touchstart', window.flappyJumpHandler);
        }
    }
    window.flappyJumpHandler = jumpHandler;
    flappyCanvas.addEventListener('click', window.flappyJumpHandler);
    flappyCanvas.addEventListener('touchstart', window.flappyJumpHandler);
    
    // Keyboard with preventDefault
    const spaceHandler = (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (flappyActive && flappyGameStarted) {
                flappyBird.velocity = flappyBird.jumpPower;
            }
        }
    };
    
    if (window.flappySpaceHandler) {
        document.removeEventListener('keydown', window.flappySpaceHandler);
    }
    window.flappySpaceHandler = spaceHandler;
    document.addEventListener('keydown', window.flappySpaceHandler);
}

function flappyResetGame() {
    flappyBird = { x: 100, y: FLAPPY_HEIGHT / 2, velocity: 0, gravity: 0.4, jumpPower: -7 };
    flappyPipes = [];
    flappyScore = 0;
    flappyGameStarted = false;
    flappyFrame = 0;
    flappyUpdateScore();
}

function flappyUpdateScore() {
    const scoreEl = document.getElementById('flappyScore');
    if (scoreEl) scoreEl.innerText = flappyScore;
}

function flappyDraw() {
    if (!flappyCtx) return;
    
    // Sky gradient
    const gradient = flappyCtx.createLinearGradient(0, 0, 0, FLAPPY_HEIGHT);
    gradient.addColorStop(0, '#1a3a5c');
    gradient.addColorStop(1, '#2a5a8c');
    flappyCtx.fillStyle = gradient;
    flappyCtx.fillRect(0, 0, FLAPPY_WIDTH, FLAPPY_HEIGHT);
    
    // Clouds
    flappyCtx.fillStyle = 'rgba(255,255,255,0.3)';
    flappyCtx.beginPath();
    flappyCtx.ellipse(80, 60, 40, 30, 0, 0, Math.PI * 2);
    flappyCtx.ellipse(120, 50, 35, 28, 0, 0, Math.PI * 2);
    flappyCtx.ellipse(500, 80, 45, 32, 0, 0, Math.PI * 2);
    flappyCtx.fill();
    
    // Ground
    flappyCtx.fillStyle = '#8B5E3C';
    flappyCtx.fillRect(0, FLAPPY_HEIGHT - 40, FLAPPY_WIDTH, 40);
    flappyCtx.fillStyle = '#6B3E1C';
    flappyCtx.fillRect(0, FLAPPY_HEIGHT - 40, FLAPPY_WIDTH, 5);
    
    // Pipes
    flappyPipes.forEach(pipe => {
        // Top pipe
        flappyCtx.fillStyle = '#2d6a2f';
        flappyCtx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        flappyCtx.fillStyle = '#1a4a1a';
        flappyCtx.fillRect(pipe.x - 5, pipe.topHeight - 30, PIPE_WIDTH + 10, 30);
        
        // Bottom pipe
        flappyCtx.fillStyle = '#2d6a2f';
        flappyCtx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, FLAPPY_HEIGHT - pipe.topHeight - PIPE_GAP);
        flappyCtx.fillStyle = '#1a4a1a';
        flappyCtx.fillRect(pipe.x - 5, pipe.topHeight + PIPE_GAP, PIPE_WIDTH + 10, 30);
    });
    
    // Bird
    const angle = Math.min(Math.max(flappyBird.velocity * 3, -0.8), 0.8);
    flappyCtx.save();
    flappyCtx.translate(flappyBird.x, flappyBird.y);
    flappyCtx.rotate(angle);
    flappyCtx.fillStyle = '#ffcc00';
    flappyCtx.beginPath();
    flappyCtx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
    flappyCtx.fill();
    flappyCtx.fillStyle = '#ff9900';
    flappyCtx.beginPath();
    flappyCtx.moveTo(12, 0);
    flappyCtx.lineTo(22, -3);
    flappyCtx.lineTo(22, 3);
    flappyCtx.fill();
    flappyCtx.fillStyle = '#000000';
    flappyCtx.beginPath();
    flappyCtx.arc(5, -3, 2.5, 0, Math.PI * 2);
    flappyCtx.fill();
    flappyCtx.fillStyle = '#ffffff';
    flappyCtx.beginPath();
    flappyCtx.arc(4, -4, 1, 0, Math.PI * 2);
    flappyCtx.fill();
    flappyCtx.restore();
    
    // Score text
    if (!flappyGameStarted && !flappyActive) {
        flappyCtx.fillStyle = 'white';
        flappyCtx.font = 'bold 20px Inter';
        flappyCtx.shadowBlur = 0;
        flappyCtx.fillText('Click / Space to Fly', FLAPPY_WIDTH / 2 - 100, FLAPPY_HEIGHT / 2 - 30);
        flappyCtx.font = '14px Inter';
        flappyCtx.fillText('Tap screen or press space', FLAPPY_WIDTH / 2 - 90, FLAPPY_HEIGHT / 2);
    }
}

function flappyUpdate() {
    if (!flappyActive) return;
    
    // Bird physics
    flappyBird.velocity += flappyBird.gravity;
    flappyBird.y += flappyBird.velocity;
    
    // Collision with ground/ceiling
    if (flappyBird.y + 15 >= FLAPPY_HEIGHT - 40 || flappyBird.y - 15 <= 0) {
        flappyGameOver();
        return;
    }
    
    // Generate pipes
    flappyFrame++;
    if (flappyFrame > 90) {
        flappyFrame = 0;
        const topHeight = Math.random() * (FLAPPY_HEIGHT - PIPE_GAP - 100) + 50;
        flappyPipes.push({
            x: FLAPPY_WIDTH,
            topHeight: topHeight,
            passed: false
        });
    }
    
    // Move pipes and check collision
    for (let i = 0; i < flappyPipes.length; i++) {
        flappyPipes[i].x -= 2.5;
        
        // Collision
        if (flappyBird.x + 12 > flappyPipes[i].x && flappyBird.x - 12 < flappyPipes[i].x + PIPE_WIDTH) {
            if (flappyBird.y - 12 < flappyPipes[i].topHeight || flappyBird.y + 12 > flappyPipes[i].topHeight + PIPE_GAP) {
                flappyGameOver();
                return;
            }
        }
        
        // Score
        if (!flappyPipes[i].passed && flappyPipes[i].x + PIPE_WIDTH < flappyBird.x) {
            flappyPipes[i].passed = true;
            flappyScore++;
            flappyUpdateScore();
            if (flappyScore > flappyHighScore) {
                flappyHighScore = flappyScore;
                localStorage.setItem('flappy_highscore', flappyHighScore);
                const highScoreEl = document.getElementById('flappyHighScore');
                if (highScoreEl) highScoreEl.innerText = flappyHighScore;
            }
        }
        
        // Remove offscreen pipes
        if (flappyPipes[i].x + PIPE_WIDTH < 0) {
            flappyPipes.splice(i, 1);
            i--;
        }
    }
    
    flappyDraw();
}

async function flappyGameOver() {
    flappyActive = false;
    flappyGameStarted = false;
    if (flappyGameLoop) clearInterval(flappyGameLoop);
    const continueBtn = document.getElementById('flappyContinueBtn');
    if (continueBtn) continueBtn.style.display = 'inline-block';
    alert(`💀 Game Over! Score: ${flappyScore}`);
    await flappySaveScore();
    flappyDraw();
}

async function flappySaveScore() {
    if (window.userAddress && flappyScore > 0) {
        let ranking = JSON.parse(localStorage.getItem('flappy_ranking') || '[]');
        ranking.push({address: window.userAddress.slice(0,6)+'...', score: flappyScore, game: 'flappy', gameIcon: '🕊️'});
        ranking.sort((a,b) => b.score - a.score);
        ranking = ranking.slice(0, 10);
        localStorage.setItem('flappy_ranking', JSON.stringify(ranking));
        if (window.updateGlobalRanking) window.updateGlobalRanking();
    }
}

function flappyStartGame() {
    console.log('Flappy start game called');
    if (!window.userAddress) {
        alert('🔌 Connect wallet first to play!');
        return;
    }
    flappyResetGame();
    flappyActive = true;
    flappyGameStarted = true;
    const continueBtn = document.getElementById('flappyContinueBtn');
    if (continueBtn) continueBtn.style.display = 'none';
    if (flappyGameLoop) clearInterval(flappyGameLoop);
    flappyGameLoop = setInterval(() => flappyUpdate(), 1000 / 60);
    flappyDraw();
    console.log('Flappy game started');
}

async function flappyContinueGame() {
    if (!window.userAddress) {
        alert('🔌 Connect wallet first!');
        return;
    }
    if (window.spendGem) {
        const success = await window.spendGem(5, 'continue flappy game');
        if (success) {
            flappyResetGame();
            flappyActive = true;
            flappyGameStarted = true;
            const continueBtn = document.getElementById('flappyContinueBtn');
            if (continueBtn) continueBtn.style.display = 'none';
            if (flappyGameLoop) clearInterval(flappyGameLoop);
            flappyGameLoop = setInterval(() => flappyUpdate(), 1000 / 60);
            flappyDraw();
            if (window.refreshBalance) await window.refreshBalance();
        }
    } else {
        alert('🔌 Wallet not ready. Please reconnect.');
    }
}

async function flappyBuyPowerup(cost, type) {
    if (!window.userAddress) {
        alert('🔌 Connect wallet first');
        return false;
    }
    if (window.spendGem) {
        const success = await window.spendGem(cost, `powerup: ${type}`);
        if (success) {
            if (type === 'shield') {
                alert('🛡️ Shield active - you get one extra life on next death!');
            }
            if (type === 'slowmo') {
                alert('⏱️ SlowMo active - game speed reduced!');
            }
            if (window.refreshBalance) await window.refreshBalance();
            return true;
        }
    }
    return false;
}

// Export functions for global use
window.initFlappyGame = initFlappyGame;
window.initFlappyGameInModal = initFlappyGameInModal;

console.log('✅ Flappy game script loaded');