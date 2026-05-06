// curve-progress.js
console.log('🔵 curve-progress.js LOADED');

const FACTORY_ADDRESS = '0x25064346f8E910Ea710d93e15a0E24d0233e60F2';
const CURVE_TARGET = 300000000;

const FACTORY_ABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"migrated","type":"bool"},{"name":"curveCompleted","type":"bool"},{"name":"sold","type":"uint256"},{"name":"raised","type":"uint256"},{"name":"miningReserve","type":"uint256"}],"type":"function"}];

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(0);
}

async function updateCurveProgressUI() {
    console.log('📊 updateCurveProgressUI called');
    
    const section = document.getElementById('curveModal');
    if (!section) {
        console.log('❌ Modal not found');
        return;
    }
    
    if (!window.userAddress) {
        return;
    }
    
    if (!window.web3) return;
    
    try {
        const factoryContract = new window.web3.eth.Contract(FACTORY_ABI, FACTORY_ADDRESS);
        const tokenData = await factoryContract.methods.tokens(TOKEN_ADDRESS).call();
        
        const sold = Number(tokenData.sold) / 1e18;
        const percentage = (sold / CURVE_TARGET) * 100;
        const isCompleted = tokenData.curveCompleted;
        const isMigrated = tokenData.migrated;
        
        document.getElementById('soldAmount').innerText = formatNumber(sold);
        document.getElementById('curvePercent').innerHTML = percentage.toFixed(1) + '%';
        document.getElementById('remainingAmount').innerHTML = formatNumber(Math.max(0, CURVE_TARGET - sold));
        document.getElementById('curveProgressFill').style.width = percentage + '%';
        document.getElementById('progressText').innerText = percentage.toFixed(1) + '%';
        
        const badge = document.getElementById('curveStatusBadge');
        const messageDiv = document.getElementById('curveMessage');
        
        if (isMigrated) {
            badge.className = 'curve-status-badge migrated';
            badge.innerText = '✅ MIGRATED';
            messageDiv.className = 'curve-message success';
            messageDiv.innerHTML = '🎉 Token migrated to Uniswap V3! Trading is LIVE!';
        } else if (isCompleted) {
            badge.className = 'curve-status-badge completed';
            badge.innerText = '🎯 READY';
            messageDiv.className = 'curve-message success';
            messageDiv.innerHTML = '🔥 100% achieved! Ready for migration!';
        } else {
            badge.className = 'curve-status-badge';
            badge.innerText = '📈 ACTIVE';
            messageDiv.className = 'curve-message info';
            messageDiv.innerHTML = `⏳ Need ${(100 - percentage).toFixed(1)}% more to unlock migration`;
        }
        
        console.log(`✅ Curve: ${formatNumber(sold)} / 300M (${percentage.toFixed(1)}%)`);
    } catch (err) {
        console.error('Error:', err);
    }
}

// Obsługa modala
document.addEventListener('DOMContentLoaded', function() {
    // Nasłuchuj na przycisk w headerze
    document.addEventListener('click', function(e) {
        if (e.target.closest('#curveStatsBtn')) {
            e.preventDefault();
            const modal = document.getElementById('curveModal');
            if (modal) {
                modal.style.display = 'block';
                modal.classList.add('active');
                updateCurveProgressUI();
            }
        }
        
        if (e.target.closest('#closeCurveModalBtn') || e.target.closest('.curve-modal-overlay')) {
            const modal = document.getElementById('curveModal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }
        }
    });
    
    // Odświeżanie co 30 sekund gdy modal otwarty
    setInterval(function() {
        const modal = document.getElementById('curveModal');
        if (modal && modal.style.display === 'block') {
            updateCurveProgressUI();
        }
    }, 30000);
});