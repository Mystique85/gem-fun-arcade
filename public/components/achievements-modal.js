// components/achievements-modal.js

class AchievementsModal {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createModal();
    }

    createModal() {
        if (document.getElementById('achievementsModal')) return;
        
        const modalHTML = `
            <div id="achievementsModal" class="achievements-modal" style="display: none;">
                <div class="achievements-modal-overlay"></div>
                <div class="achievements-modal-container">
                    <div class="achievements-modal-header">
                        <span class="achievements-modal-title">ACHIEVEMENTS</span>
                        <button class="achievements-modal-close" id="closeAchievementsModal">✕</button>
                    </div>
                    <div class="achievements-modal-body" id="achievementsModalBody">
                        <div class="achievements-loading">Loading achievements...</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const closeBtn = document.getElementById('closeAchievementsModal');
        const overlay = document.querySelector('#achievementsModal .achievements-modal-overlay');
        
        if (closeBtn) {
            closeBtn.onclick = () => this.close();
        }
        if (overlay) {
            overlay.onclick = () => this.close();
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        const modal = document.getElementById('achievementsModal');
        if (modal) {
            this.loadBadges();
            modal.style.display = 'flex';
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        const modal = document.getElementById('achievementsModal');
        if (modal) {
            modal.style.display = 'none';
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }

    async loadBadges() {
        const modalBody = document.getElementById('achievementsModalBody');
        if (!modalBody) return;
        
        if (!window.badgesSystem) {
            modalBody.innerHTML = '<div class="achievements-error">System not ready. Please refresh.</div>';
            return;
        }
        
        const badges = window.badgesSystem.getBadgesList();
        let html = '<div class="achievements-badges-grid">';
        
        for (const badge of badges) {
            const isClaimed = window.badgesSystem.isBadgeClaimed(badge.id);
            
            if (badge.isPlaceholder) {
                html += `
                    <div class="achievement-card placeholder" data-tooltip="${badge.description}">
                        <div class="achievement-icon-placeholder">
                            <span class="placeholder-text">soon</span>
                        </div>
                    </div>
                `;
            } else {
                // Sprawdź kwalifikację dla hodler badge'y
                let isQualified = false;
                let showClaimButton = false;
                
                if (badge.id === 'hodler') {
                    isQualified = window.badgesSystem.checkHodlerQualification(window.gemBalance);
                    showClaimButton = isQualified && !isClaimed;
                } else if (badge.id === 'epic-hodler') {
                    isQualified = window.badgesSystem.checkEpicHodlerQualification(window.gemBalance);
                    showClaimButton = isQualified && !isClaimed;
                } else if (badge.id === 'legendary-hodler') {
                    isQualified = window.badgesSystem.checkLegendaryHodlerQualification(window.gemBalance);
                    showClaimButton = isQualified && !isClaimed;
                } else if (badge.id === 'og') {
                    // OG - pokaż claim tylko jeśli NIE jest claimowany i spełnia warunki
                    showClaimButton = !isClaimed && window.userAddress && window.gemBalance > 0;
                }
                
                // OG Claimowany - specjalny tooltip
                let tooltipText = badge.description;
                if (badge.id === 'og' && isClaimed) {
                    tooltipText = 'OG Player - Claimed';
                }
                
                // Dla badge'y które mają przycisk CLAIM
                if (showClaimButton) {
                    html += `
                        <div class="achievement-card" data-tooltip="${tooltipText}">
                            <div class="achievement-icon">
                                <img src="${badge.image}" alt="${badge.name}">
                            </div>
                            <button class="achievement-claim-btn" data-badge-id="${badge.id}">CLAIM</button>
                        </div>
                    `;
                }
                // Dla już claimowanych badge'y (bez kłódki, bez przycisku)
                else if (isClaimed) {
                    html += `
                        <div class="achievement-card claimed" data-tooltip="${tooltipText}">
                            <div class="achievement-icon">
                                <img src="${badge.image}" alt="${badge.name}">
                            </div>
                        </div>
                    `;
                }
                // Dla odblokowanych ale nieclaimowanych (retro, support itp - ale one nie mają claim)
                else if (isQualified && !isClaimed && badge.id !== 'og') {
                    html += `
                        <div class="achievement-card" data-tooltip="${badge.description}">
                            <div class="achievement-icon">
                                <img src="${badge.image}" alt="${badge.name}">
                            </div>
                        </div>
                    `;
                }
                // Dla zablokowanych badge'y
                else {
                    html += `
                        <div class="achievement-card locked" data-tooltip="${badge.description}">
                            <div class="achievement-icon">
                                <img src="${badge.image}" alt="${badge.name}">
                                <div class="lock-icon">🔒</div>
                            </div>
                        </div>
                    `;
                }
            }
        }
        
        html += '</div>';
        modalBody.innerHTML = html;
        
        // Eventy dla przycisków CLAIM
        document.querySelectorAll('.achievement-claim-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const badgeId = btn.dataset.badgeId;
                btn.classList.add('loading');
                btn.textContent = '...';
                
                const result = await window.badgesSystem.claimBadge(badgeId, 'og-badge');
                
                if (result.success) {
                    btn.classList.add('success');
                    btn.textContent = '✓';
                    if (typeof canvasConfetti === 'function') {
                        canvasConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ffd700', '#ff8c00', '#ffffff'] });
                    }
                    setTimeout(() => {
                        this.loadBadges();
                        if (window.badgesSystem) window.badgesSystem.updateBadgesUI();
                    }, 1500);
                } else {
                    btn.classList.add('error');
                    btn.textContent = '❌';
                    setTimeout(() => {
                        btn.classList.remove('error', 'loading');
                        btn.textContent = 'CLAIM';
                    }, 2000);
                }
            };
        });
    }
}

function initAchievementsModal() {
    window.achievementsModal = new AchievementsModal();
}

window.AchievementsModal = AchievementsModal;
window.initAchievementsModal = initAchievementsModal;