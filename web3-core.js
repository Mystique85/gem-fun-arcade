// ============================================
// WEB3 CORE - ZARZĄDZANIE PORTFELEM I TOKENEM
// ============================================

if (typeof window.web3Initialized === 'undefined') {
    window.web3Initialized = true;

    let web3;
    let userAddress = null;
    let tokenContract = null;
    let userGemBalance = 0;
    let tradingEnabled = false;
    let headerComponent = null;

    function updateHeaderUI() {
        if (headerComponent) {
            headerComponent.updateWalletUI(userAddress, userGemBalance, tradingEnabled);
        }
        window.userAddress = userAddress;
        window.gemBalance = userGemBalance;
    }

    function disconnectWallet() {
        userAddress = null;
        tokenContract = null;
        web3 = null;
        
        updateHeaderUI();
        
        window.spendGem = async (amount, purpose = 'game') => {
            console.log(`🎮 Demo mode: would spend ${amount} GEM for ${purpose}`);
            alert(`🎮 Demo mode: spent ${amount} GEM (connect wallet to use real tokens)`);
            return true;
        };
        window.gemBalance = 100;
        
        console.log('🔌 Wallet disconnected');
        if (window.refreshGameAfterWallet) window.refreshGameAfterWallet();
    }

    async function refreshBalance() {
        if (!userAddress || !tokenContract) return 0;
        try {
            const rawBalance = await tokenContract.methods.balanceOf(userAddress).call();
            userGemBalance = rawBalance / (10 ** TOKEN_DECIMALS);
            window.gemBalance = userGemBalance;
            updateHeaderUI();
            if (window.onBalanceUpdate) window.onBalanceUpdate(userGemBalance);
            return userGemBalance;
        } catch (err) {
            console.error('Balance read error:', err);
            return 0;
        }
    }

    async function checkTradingStatus() {
        if (!tokenContract) return false;
        try {
            tradingEnabled = await tokenContract.methods.tradingStarted().call();
            updateHeaderUI();
            return tradingEnabled;
        } catch (err) {
            console.error('Trading status error:', err);
            return false;
        }
    }

    async function spendGem(amount, purpose = 'game') {
        if (!userAddress || !tokenContract) {
            alert('🔌 Connect wallet first!');
            return false;
        }
        
        if (!tradingEnabled) {
            alert('⚠️ GEM token trading is not active yet! Wait for token migration.');
            return false;
        }
        
        if (userGemBalance < amount) {
            alert(`❌ Insufficient GEM! You have: ${userGemBalance.toFixed(2)}, need: ${amount}`);
            return false;
        }
        
        try {
            const amountWei = web3.utils.toWei(amount.toString(), 'ether');
            const tx = await tokenContract.methods.transfer(GAME_WALLET_ADDRESS, amountWei).send({
                from: userAddress,
                gas: 100000
            });
            
            console.log('Transaction successful!', tx.transactionHash);
            alert(`✅ Spent ${amount} GEM for ${purpose}!`);
            await refreshBalance();
            return true;
            
        } catch (err) {
            console.error('Transaction error:', err);
            alert(`❌ Error: ${err.message.substring(0, 100)}`);
            return false;
        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                console.log('🟡 Attempting to connect wallet...');
                
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts'
                });
                
                if (!accounts || accounts.length === 0) {
                    throw new Error('No accounts returned');
                }
                
                userAddress = accounts[0];
                web3 = new Web3(window.ethereum);
                
                const chainId = await web3.eth.getChainId();
                if (chainId !== 8453) {
                    alert('⚠️ Please switch to Base Mainnet!');
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x2105' }]
                        });
                    } catch (e) {
                        console.log('Network not switched');
                    }
                }
                
                tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
                
                await checkTradingStatus();
                await refreshBalance();
                
                updateHeaderUI();
                
                window.spendGem = spendGem;
                window.refreshBalance = refreshBalance;
                
                window.ethereum.on('accountsChanged', async (newAccounts) => {
                    if (newAccounts && newAccounts.length > 0) {
                        userAddress = newAccounts[0];
                        await refreshBalance();
                        await checkTradingStatus();
                        updateHeaderUI();
                        console.log('🔄 Account changed:', userAddress);
                        if (window.onAccountChange) window.onAccountChange(userAddress);
                    } else {
                        disconnectWallet();
                        if (window.onAccountChange) window.onAccountChange(null);
                    }
                });
                
                console.log('✅ Connected to wallet:', userAddress);
                if (window.onWalletConnect) window.onWalletConnect(userAddress);
                
            } catch (err) {
                console.error('Connection error:', err);
                if (err.code === 4001) {
                    alert('❌ Connection rejected. Click "Connect Wallet" again and approve.');
                } else {
                    alert('Failed to connect: ' + (err.message || err));
                }
                userAddress = null;
                updateHeaderUI();
            }
        } else {
            alert('⚠️ No wallet detected! Install MetaMask or Rabby');
            window.open('https://metamask.io/', '_blank');
        }
    }

    // Initialize header and demo mode
    window.addEventListener('DOMContentLoaded', async () => {
        // Initialize header component
        const headerElement = document.getElementById('mainHeader');
        if (headerElement && window.HeaderComponent) {
            headerComponent = new window.HeaderComponent();
            headerElement.innerHTML = headerComponent.getHTML();
            
            // Attach wallet listeners
            const connectBtn = document.getElementById('connectWalletBtn');
            const disconnectBtn = document.getElementById('disconnectWalletBtn');
            if (connectBtn) connectBtn.onclick = connectWallet;
            if (disconnectBtn) disconnectBtn.onclick = disconnectWallet;
        }
        
        window.spendGem = async (amount, purpose) => {
            console.log(`🎮 Demo mode: spent ${amount} GEM for ${purpose}`);
            alert(`🎮 Demo mode: spent ${amount} GEM (click "Connect Wallet" to use real tokens)`);
            return true;
        };
        window.gemBalance = 100;
        window.userAddress = null;
        
        updateHeaderUI();
        console.log('✅ Web3 integration loaded');
    });

    // Expose functions globally
    window.connectWallet = connectWallet;
    window.disconnectWallet = disconnectWallet;
    window.getGameWalletBalance = async function() {
        if (!tokenContract) return 0;
        try {
            const rawBalance = await tokenContract.methods.balanceOf(GAME_WALLET_ADDRESS).call();
            return rawBalance / (10 ** TOKEN_DECIMALS);
        } catch (err) {
            return 0;
        }
    };

    console.log('✅ Web3 core initialized');
}