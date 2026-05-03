let canvas, ctx;
let gameLoop;
let snake, food, direction, nextDirection;
let score = 0;
let lives = 1;
let multiplier = 1;
let gameActive = false;
let powerupsActive = { x2: false, slow: false };
let frameInterval = 100;

const COLS = 30;
const ROWS = 20;
const CELL_SIZE = 20;

function initCanvas() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        return false;
    }
    ctx = canvas.getContext('2d');
    
    canvas.width = COLS * CELL_SIZE;
    canvas.height = ROWS * CELL_SIZE;
    
    return true;
}

function initGame() {
    snake = [{x: 15, y: 10}];
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    generateFood();
    score = 0;
    updateScoreDisplay();
    gameActive = true;
}

function generateFood() {
    let newFood;
    let maxAttempts = 1000;
    let attempts = 0;
    do {
        newFood = {
            x: Math.floor(Math.random() * COLS),
            y: Math.floor(Math.random() * ROWS)
        };
        attempts++;
        if (attempts > maxAttempts) break;
    } while (snake && snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

function updateScoreDisplay() {
    document.getElementById('score').innerText = score;
    document.getElementById('multiplier').innerText = powerupsActive.x2 ? 'x2' : 'x1';
    document.getElementById('lives').innerText = lives;
}

function draw() {
    if (!ctx || !snake) return;
    
    ctx.fillStyle = '#0a1a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(255,215,0,0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    
    snake.forEach((segment, index) => {
        const x = segment.x * CELL_SIZE;
        const y = segment.y * CELL_SIZE;
        
        const gradient = ctx.createLinearGradient(x, y, x + CELL_SIZE, y + CELL_SIZE);
        if (index === 0) {
            gradient.addColorStop(0, '#ffd700');
            gradient.addColorStop(1, '#ffaa00');
        } else {
            gradient.addColorStop(0, '#4caf50');
            gradient.addColorStop(1, '#2e7d32');
        }
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2, 4);
        ctx.fill();
        
        if (index === 0) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x + 6, y + 7, 3, 0, Math.PI * 2);
            ctx.arc(x + 14, y + 7, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#000000';
            let eyeOffsetX = 0, eyeOffsetY = 0;
            if (direction === 'RIGHT') eyeOffsetX = 1.5;
            else if (direction === 'LEFT') eyeOffsetX = -1.5;
            else if (direction === 'UP') eyeOffsetY = -1.5;
            else if (direction === 'DOWN') eyeOffsetY = 1.5;
            
            ctx.beginPath();
            ctx.arc(x + 6 + eyeOffsetX, y + 7 + eyeOffsetY, 1.8, 0, Math.PI * 2);
            ctx.arc(x + 14 + eyeOffsetX, y + 7 + eyeOffsetY, 1.8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x + 4.5, y + 5.5, 0.8, 0, Math.PI * 2);
            ctx.arc(x + 12.5, y + 5.5, 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    const foodX = food.x * CELL_SIZE;
    const foodY = food.y * CELL_SIZE;
    
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff4444';
    ctx.fillStyle = '#ff3333';
    ctx.beginPath();
    ctx.ellipse(foodX + CELL_SIZE/2, foodY + CELL_SIZE/2 - 1, CELL_SIZE/2 - 3, CELL_SIZE/2 - 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ff7777';
    ctx.beginPath();
    ctx.ellipse(foodX + CELL_SIZE/2 - 2, foodY + CELL_SIZE/2 - 3, 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.ellipse(foodX + CELL_SIZE/2, foodY + 3, 3, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    if (powerupsActive.x2) {
        ctx.fillStyle = 'rgba(255,215,0,0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const sparkle = Date.now() / 200;
        for (let i = 0; i < 12; i++) {
            const angle = sparkle + i * Math.PI * 2 / 12;
            const x = canvas.width/2 + Math.cos(angle) * 80;
            const y = canvas.height/2 + Math.sin(angle) * 60;
            ctx.fillStyle = `rgba(255, 215, 0, ${0.25 + Math.sin(sparkle) * 0.15})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    if (powerupsActive.slow) {
        ctx.fillStyle = 'rgba(100, 100, 255, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

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

function move() {
    if (!snake) return false;
    
    direction = nextDirection;
    let newHead = {...snake[0]};
    
    switch(direction) {
        case 'RIGHT': newHead.x++; break;
        case 'LEFT': newHead.x--; break;
        case 'UP': newHead.y--; break;
        case 'DOWN': newHead.y++; break;
    }
    
    if (newHead.x === food.x && newHead.y === food.y) {
        let points = 1 * (powerupsActive.x2 ? 2 : 1);
        score += points;
        updateScoreDisplay();
        generateFood();
    } else {
        snake.pop();
    }
    
    if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
        handleDeath();
        return false;
    }
    
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleDeath();
        return false;
    }
    
    snake.unshift(newHead);
    return true;
}

async function handleDeath() {
    if (lives > 1) {
        lives--;
        updateScoreDisplay();
        snake = [{x: 15, y: 10}];
        direction = 'RIGHT';
        nextDirection = 'RIGHT';
        generateFood();
        if (ctx) {
            ctx.fillStyle = 'rgba(255,0,0,0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        gameActive = false;
        clearInterval(gameLoop);
        document.getElementById('continueBtn').style.display = 'inline-block';
        alert('💀 Game Over! Score: ' + score);
        await saveScore();
    }
}

async function saveScore() {
    if (window.userAddress) {
        let ranking = JSON.parse(localStorage.getItem('snake_ranking') || '[]');
        ranking.push({address: window.userAddress.slice(0,6)+'...', score: score});
        ranking.sort((a,b) => b.score - a.score);
        ranking = ranking.slice(0, 10);
        localStorage.setItem('snake_ranking', JSON.stringify(ranking));
        updateRanking();
    }
}

function updateRanking() {
    let ranking = JSON.parse(localStorage.getItem('snake_ranking') || '[]');
    let list = document.getElementById('rankingList');
    if (list) {
        list.innerHTML = '';
        ranking.forEach(entry => {
            let li = document.createElement('li');
            li.innerText = `${entry.address}: ${entry.score} pts`;
            list.appendChild(li);
        });
    }
}

function startGameLoop() {
    if (gameLoop) clearInterval(gameLoop);
    let interval = powerupsActive.slow ? 150 : 100;
    gameLoop = setInterval(() => {
        if (gameActive) {
            move();
            draw();
        }
    }, interval);
}

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startGame');
    const continueBtn = document.getElementById('continueBtn');
    
    if (startBtn) {
        startBtn.onclick = () => {
            if (!window.userAddress) {
                alert('🔌 Connect wallet first!');
                return;
            }
            initGame();
            gameActive = true;
            if (continueBtn) continueBtn.style.display = 'none';
            startGameLoop();
            draw();
        };
    }
    
    if (continueBtn) {
        continueBtn.onclick = async () => {
            if (window.spendGem) {
                const success = await window.spendGem(5);
                if (success) {
                    initGame();
                    gameActive = true;
                    startGameLoop();
                    continueBtn.style.display = 'none';
                    if (window.refreshBalance) await window.refreshBalance();
                }
            } else {
                alert('🔌 Connect wallet to continue with GEM');
            }
        };
    }
    
    document.querySelectorAll('.powerup').forEach(btn => {
        btn.onclick = async () => {
            if (!window.userAddress) {
                alert('🔌 Connect wallet first');
                return;
            }
            let cost = parseInt(btn.dataset.cost);
            let type = btn.dataset.type;
            
            if (window.spendGem) {
                const success = await window.spendGem(cost);
                if (success) {
                    if (type === '2x') powerupsActive.x2 = true;
                    if (type === 'life') lives++;
                    if (type === 'slow') powerupsActive.slow = true;
                    updateScoreDisplay();
                    if (window.refreshBalance) await window.refreshBalance();
                }
            }
        };
    });
    
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        const key = e.key;
        if (key === 'ArrowRight' && direction !== 'LEFT') nextDirection = 'RIGHT';
        else if (key === 'ArrowLeft' && direction !== 'RIGHT') nextDirection = 'LEFT';
        else if (key === 'ArrowUp' && direction !== 'DOWN') nextDirection = 'UP';
        else if (key === 'ArrowDown' && direction !== 'UP') nextDirection = 'DOWN';
    });
});

window.onload = () => {
    if (initCanvas()) {
        updateRanking();
        draw();
    }
};