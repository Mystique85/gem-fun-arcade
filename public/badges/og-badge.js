const OGBadgeModule = {
    OG_CLAIM_ACTIVE: true,

    async checkQualification(address, balance) {
        if (!this.isActive()) {
            return {
                qualified: false,
                message: 'OG Badge is no longer available (TGE has passed)'
            };
        }

        if (!address) {
            return {
                qualified: false,
                message: 'Connect wallet first'
            };
        }

        const hasTokens = balance > 0;
        
        if (!hasTokens) {
            return {
                qualified: false,
                message: 'You need to hold GEM FUN tokens to claim OG Badge'
            };
        }

        return {
            qualified: true,
            message: 'You qualify for OG Badge!'
        };
    },

    isActive() {
        return this.OG_CLAIM_ACTIVE === true;
    },

    getName() {
        return 'OG';
    },

    getId() {
        return 'og';
    }
};

window.ogBadgeModule = OGBadgeModule;