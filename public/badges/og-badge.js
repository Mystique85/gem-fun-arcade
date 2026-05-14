// og-badge.js - Moduł dla OG badge

const OGBadgeModule = {
    // ========================================
    // 🔥 TO JEST TA MAGICZNA ZMIENNA 🔥
    // true = można claimować OG badge
    // false = NIKT już nie może claimować (blokada na zawsze)
    // ========================================
    OG_CLAIM_ACTIVE: true,  // <----- ZMIENIAJ TYLKO TO!
    // ========================================

    // Sprawdzenie czy użytkownik kwalifikuje się do OG badge
    async checkQualification(address, balance) {
        // 1. Sprawdź czy claimowanie jest aktywne
        if (!this.isActive()) {
            return {
                qualified: false,
                message: 'OG Badge is no longer available (TGE has passed)'
            };
        }

        // 2. Sprawdź czy użytkownik jest zalogowany
        if (!address) {
            return {
                qualified: false,
                message: 'Connect wallet first'
            };
        }

        // 3. Sprawdź czy użytkownik posiada tokeny GEM FUN
        const hasTokens = balance > 0;
        
        if (!hasTokens) {
            return {
                qualified: false,
                message: 'You need to hold GEM FUN tokens to claim OG Badge'
            };
        }

        // 4. Wszystko OK - kwalifikuje się
        return {
            qualified: true,
            message: 'You qualify for OG Badge!'
        };
    },

    // Sprawdzenie czy OG badge jest nadal aktywny
    isActive() {
        return this.OG_CLAIM_ACTIVE === true;
    },

    // Nazwa badge'a
    getName() {
        return 'OG';
    },

    // ID badge'a
    getId() {
        return 'og';
    }
};

// Eksportuj moduł globalnie
window.ogBadgeModule = OGBadgeModule;

console.log('✅ OG Badge module loaded (ACTIVE: ' + OGBadgeModule.isActive() + ')');