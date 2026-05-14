// badges-system.js - Główny system zarządzania badge'ami

class BadgesSystem {
    constructor() {
        this.badgesModules = {};
        this.claimedBadges = new Set();
        this.userAddress = null;
        this.userBalance = 0;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        this.loadClaimedBadges();
        await this.loadAllBadgesModules();
        this.setupWalletListener();
        this.isInitialized = true;
        
        console.log('✅ Badges System initialized');
    }

    setupWalletListener() {
        const checkWallet = setInterval(() => {
            if (window.userAddress !== this.userAddress) {
                this.userAddress = window.userAddress;
                this.userBalance = window.gemBalance || 0;
                this.updateBadgesUI();
            } else if (window.gemBalance !== this.userBalance) {
                this.userBalance = window.gemBalance || 0;
                this.updateBadgesUI();
            }
        }, 1000);
    }

    async loadAllBadgesModules() {
        if (window.ogBadgeModule) {
            this.badgesModules['og-badge'] = window.ogBadgeModule;
            console.log('✅ Loaded: og-badge module');
        }
        
        console.log('Loaded modules:', Object.keys(this.badgesModules));
    }

    loadClaimedBadges() {
        const saved = localStorage.getItem('gemfun_claimed_badges');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.claimedBadges = new Set(data);
                console.log('Loaded claimed badges:', [...this.claimedBadges]);
            } catch(e) {}
        }
    }

    saveClaimedBadges() {
        localStorage.setItem('gemfun_claimed_badges', JSON.stringify([...this.claimedBadges]));
    }

    isBadgeClaimed(badgeId) {
        return this.claimedBadges.has(badgeId);
    }

    async claimBadge(badgeId, moduleName) {
        const module = this.badgesModules[moduleName];
        if (!module && !['hodler', 'epic-hodler', 'legendary-hodler'].includes(badgeId)) {
            console.error('Module not found:', moduleName);
            return { success: false, message: 'Badge module not found' };
        }

        if (this.isBadgeClaimed(badgeId)) {
            return { success: false, message: 'Badge already claimed!' };
        }

        // Sprawdzenie kwalifikacji dla hodler badge'y
        if (badgeId === 'hodler') {
            if (this.userBalance < 5000000) {
                return { success: false, message: 'Need 5,000,000 GEM FUN tokens' };
            }
        } else if (badgeId === 'epic-hodler') {
            if (this.userBalance < 15000000) {
                return { success: false, message: 'Need 15,000,000 GEM FUN tokens' };
            }
        } else if (badgeId === 'legendary-hodler') {
            if (this.userBalance < 30000000) {
                return { success: false, message: 'Need 30,000,000 GEM FUN tokens' };
            }
        } else {
            const qualification = await module.checkQualification(this.userAddress, this.userBalance);
            if (!qualification.qualified) {
                return { success: false, message: qualification.message };
            }
        }

        this.claimedBadges.add(badgeId);
        this.saveClaimedBadges();
        
        return { success: true, message: 'Badge claimed successfully!' };
    }

    // Sprawdzenie czy użytkownik kwalifikuje się do badge'a Hodler
    checkHodlerQualification(balance) {
        return balance >= 5000000;
    }

    // Sprawdzenie czy użytkownik kwalifikuje się do badge'a Epic Hodler
    checkEpicHodlerQualification(balance) {
        return balance >= 15000000;
    }

    // Sprawdzenie czy użytkownik kwalifikuje się do badge'a Legendary Hodler
    checkLegendaryHodlerQualification(balance) {
        return balance >= 30000000;
    }

    getBadgesList() {
        return [
            // Wiersz 1
            { 
                id: 'og', 
                name: 'OG', 
                image: '/OG.png', 
                module: 'og-badge',
                description: 'OG Player - Hold GEM FUN tokens before TGE to claim this badge!'
            },
            { 
                id: 'retro', 
                name: 'Retro', 
                image: '/Retro.png', 
                module: null,
                locked: true,
                description: 'Retro Player - Classic arcade enthusiast (Coming soon)'
            },
            { 
                id: 'soon1', 
                name: 'SOON', 
                image: null, 
                module: null,
                isPlaceholder: true,
                description: 'Coming soon...'
            },
            { 
                id: 'soon2', 
                name: 'SOON', 
                image: null, 
                module: null,
                isPlaceholder: true,
                description: 'Coming soon...'
            },
            // Wiersz 2
            { 
                id: 'hodler', 
                name: 'Hodler', 
                image: '/Hodler.png', 
                module: null,
                requirement: 5000000,
                description: 'Hodler - Hold 5,000,000+ GEM FUN tokens'
            },
            { 
                id: 'epic-hodler', 
                name: 'Epic Hodler', 
                image: '/Epic.png', 
                module: null,
                requirement: 15000000,
                description: 'Epic Hodler - Hold 15,000,000+ GEM FUN tokens'
            },
            { 
                id: 'legendary-hodler', 
                name: 'Legendary Hodler', 
                image: '/Legendary.png', 
                module: null,
                requirement: 30000000,
                description: 'Legendary Hodler - Hold 30,000,000+ GEM FUN tokens'
            },
            { 
                id: 'soon3', 
                name: 'SOON', 
                image: null, 
                module: null,
                isPlaceholder: true,
                description: 'Coming soon...'
            },
            // Wiersz 3
            { 
                id: 'soon4', 
                name: 'SOON', 
                image: null, 
                module: null,
                isPlaceholder: true,
                description: 'Coming soon...'
            },
            { 
                id: 'support', 
                name: 'Support', 
                image: '/Support.png', 
                module: null,
                locked: true,
                description: 'Supporter - Helped support the project (Coming soon)'
            }
        ];
    }

    async updateBadgesUI() {
        const dropdownMenu = document.getElementById('dropdownMenu');
        if (!dropdownMenu) return;

        const badgesSection = dropdownMenu.querySelector('.dropdown-badges-section');
        if (!badgesSection) return;

        const badgesHTML = await this.renderBadges();
        badgesSection.outerHTML = badgesHTML;
        
        this.attachClaimEvents();
    }

    async renderBadges() {
        const badges = this.getBadgesList();
        
        let html = `
            <div class="dropdown-divider"></div>
            <div class="dropdown-badges-section">
                <div class="dropdown-badges-header">
                    <span class="badges-title">ACHIEVEMENTS</span>
                </div>
                <div class="dropdown-badges-grid">
        `;

        for (const badge of badges) {
            const isClaimed = this.isBadgeClaimed(badge.id);
            
            if (badge.isPlaceholder) {
                html += `
                    <div class="badge-slot placeholder" data-badge="${badge.id}">
                        <div class="badge-icon-placeholder">
                            <span class="placeholder-text">soon</span>
                        </div>
                        <span class="tooltip-text">${badge.description}</span>
                    </div>
                `;
                continue;
            }
            
            let showClaimButton = false;
            let isQualified = false;
            
            // Sprawdzenie dla OG
            if (badge.id === 'og') {
                isQualified = !isClaimed && this.userAddress && this.userBalance > 0;
                if (isQualified) {
                    const module = this.badgesModules['og-badge'];
                    if (module && module.isActive && module.isActive()) {
                        showClaimButton = true;
                    }
                }
            }
            // Sprawdzenie dla hodler badge'y
            else if (badge.id === 'hodler') {
                isQualified = this.checkHodlerQualification(this.userBalance);
                showClaimButton = isQualified && !isClaimed;
            }
            else if (badge.id === 'epic-hodler') {
                isQualified = this.checkEpicHodlerQualification(this.userBalance);
                showClaimButton = isQualified && !isClaimed;
            }
            else if (badge.id === 'legendary-hodler') {
                isQualified = this.checkLegendaryHodlerQualification(this.userBalance);
                showClaimButton = isQualified && !isClaimed;
            }
            
            const lockedClass = (!isClaimed && !showClaimButton && badge.locked !== false) ? 'locked' : '';
            const claimedClass = isClaimed ? 'claimed' : '';
            
            html += `
                <div class="badge-slot ${lockedClass} ${claimedClass}" data-badge="${badge.id}">
                    <div class="badge-icon">
                        <img src="${badge.image}" alt="${badge.name}" class="badge-icon-img">
                        ${(!isClaimed && !showClaimButton) ? '<div class="lock-overlay">🔒</div>' : ''}
                    </div>
                    <span class="tooltip-text">${badge.description}</span>
                    ${showClaimButton ? '<button class="badge-claim-btn" data-badge-id="' + badge.id + '" data-badge-module="' + (badge.module || 'hodler-badge') + '"><span class="claim-text">CLAIM</span><span class="claim-glow"></span></button>' : ''}
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        return html;
    }

    attachClaimEvents() {
        document.querySelectorAll('.badge-claim-btn').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const badgeId = newBtn.dataset.badgeId;
                const moduleName = newBtn.dataset.badgeModule;
                
                if (!badgeId || !moduleName) return;
                
                newBtn.classList.add('loading');
                newBtn.disabled = true;
                
                const result = await this.claimBadge(badgeId, moduleName);
                
                if (result.success) {
                    newBtn.classList.add('success');
                    newBtn.innerHTML = '✓ CLAIMED!';
                    
                    if (typeof canvasConfetti === 'function') {
                        canvasConfetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 },
                            colors: ['#ffd700', '#ff8c00', '#ffffff']
                        });
                    }
                    
                    setTimeout(() => {
                        this.updateBadgesUI();
                    }, 1500);
                } else {
                    newBtn.classList.add('error');
                    newBtn.innerHTML = '❌';
                    setTimeout(() => {
                        newBtn.classList.remove('error', 'loading');
                        newBtn.disabled = false;
                        newBtn.innerHTML = '<span class="claim-text">CLAIM</span><span class="claim-glow"></span>';
                    }, 2000);
                }
            };
        });
    }
}

// Inicjalizacja systemu
window.badgesSystem = new BadgesSystem();

// Uruchom po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.badgesSystem.init();
    }, 2000);
});