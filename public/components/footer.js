// components/footer.js
class FooterComponent {
    constructor() {
        this.tokenAddress = '0xd483d541E0B0F322b81B97764bA71602A853021e';
    }

    getHTML() {
        return `
            <footer id="mainFooter" class="gem-footer">
                <!-- GÓRNA CZĘŚĆ - KOLUMNY -->
                <div class="footer-top">
                    <div class="footer-container">
                        <div class="footer-grid">
                            <!-- KOLUMNA 1 - GŁÓWNA -->
                            <div class="footer-main">
                                <div>
                                    <h3 class="footer-logo-text"><span class="title-blue">GEM</span><span class="title-accent">FUN</span></h3>
                                    <p class="footer-description">
                                        Next-generation arcade platform powered by GEM FUN token. 
                                        Play classic games, compete globally, and earn real rewards.
                                    </p>
                                </div>
                                
                                <div class="social-links">
                                    <a href="https://x.com/HashCoinFarm" class="social-link" target="_blank">
                                        <i class="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://github.com" class="social-link" target="_blank">
                                        <i class="fab fa-github"></i>
                                    </a>
                                    <a href="https://discord.gg/pbDQvHG3MS" class="social-link" target="_blank">
                                        <i class="fab fa-discord"></i>
                                    </a>
                                    <a href="mailto:contact@gemfun.io" class="social-link">
                                        <i class="fas fa-envelope"></i>
                                    </a>
                                </div>
                            </div>

                            <!-- KOLUMNA 2 - Ecosystem -->
                            <div class="footer-column">
                                <h3 class="footer-col-title">Ecosystem</h3>
                                <ul class="footer-links">
                                    <li><a href="#" class="footer-link">Home</a></li>
                                    <li><a href="#games-section" class="footer-link">Games</a></li>
                                    <li><a href="#leaderboard-section" class="footer-link">Leaderboard</a></li>
                                    <li><a href="#tokenEcosystemSection" class="footer-link">Tokenomics</a></li>
                                </ul>
                            </div>

                            <!-- KOLUMNA 3 - Resources -->
                            <div class="footer-column">
                                <h3 class="footer-col-title">Resources</h3>
                                <ul class="footer-links">
                                    <li><a href="https://hashcoin.farm/gem" class="footer-link" target="_blank">Buy GEM FUN</a></li>
                                    <li><a href="https://discord.gg/pbDQvHG3MS" class="footer-link" target="_blank">Community</a></li>
                                    <li><a href="#" class="footer-link">Documentation</a></li>
                                    <li><a href="#" class="footer-link">FAQ</a></li>
                                </ul>
                            </div>

                            <!-- KOLUMNA 4 - Networks -->
                            <div class="footer-column">
                                <h3 class="footer-col-title">Networks</h3>
                                <ul class="footer-links">
                                    <li><a href="#" class="footer-link">Base</a></li>
                                    <li><a href="#" class="footer-link">Celo</a></li>
                                    <li><a href="#" class="footer-link">Ethereum</a></li>
                                    <li><a href="#" class="footer-link">Polygon</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- DOLNA CZĘŚĆ - SEPARATOR I COPYRIGHT -->
                <div class="footer-bottom">
                    <div class="footer-bottom-line"></div>
                    <div class="footer-bottom-container">
                        <div class="copyright-line">
                            © 2026 GEM FUN Arcade. All rights reserved. | $GEMFUN Token: ${this.tokenAddress}
                            <a href="https://basescan.org/token/${this.tokenAddress}" class="contract-link" target="_blank">View on BaseScan</a>
                        </div>
                        <div class="contact-line">
                            <i class="fas fa-envelope"></i> Contact: <a href="mailto:contact@gemfun.io">contact@gemfun.io</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    initEvents() {
        // Inicjalizacja
    }
}

// Inicjalizacja footera
function initFooter() {
    const footerContainer = document.getElementById('mainFooter');
    if (footerContainer && window.FooterComponent) {
        const footerComponent = new window.FooterComponent();
        footerContainer.innerHTML = footerComponent.getHTML();
        footerComponent.initEvents();
    }
}

window.FooterComponent = FooterComponent;
window.initFooter = initFooter;