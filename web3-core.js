// web3-core.js

if (typeof window.web3Initialized === 'undefined') {
    window.web3Initialized = true;

    let web3;
    let userAddress = null;
    let tokenContract = null;
    let userGemBalance = 0;
    let tradingEnabled = false;
    let headerComponent = null;
    let manualDisconnect = false;

    const MIN_GEM_REQUIRED = 10000;
    const TOKEN_DECIMALS = 18;
    const TOKEN_ADDRESS = '0xf8a02b86e09319e615534cd8ff034a527261072f';
    const GAME_WALLET_ADDRESS = '0xf8a02b86e09319e615534cd8ff034a527261072f';

    const TOKEN_ABI = [
        {
            "constant": true,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
            "name": "transfer",
            "outputs": [{"name": "", "type": "bool"}],
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{"name": "", "type": "uint8"}],
            "type": "function"
        }
    ];

    window.setHeaderComponent = (component) => {
        headerComponent = component;
        updateHeaderUI();
        attachWalletEvents();
    };

    function attachWalletEvents() {
        const connectBtn = document.getElementById('connectWalletBtn');
        if (connectBtn) {
            const newConnectBtn = connectBtn.cloneNode(true);
            connectBtn.parentNode.replaceChild(newConnectBtn, connectBtn);
            newConnectBtn.onclick = async (e) => { 
                e.preventDefault(); 
                manualDisconnect = false;
                console.log('🔄 Manual connect button clicked');
                await connectWallet(true);
            };
            console.log('✅ Connect button event attached');
        }
    }

    function updateHeaderUI() {
        if (headerComponent) {
            headerComponent.updateWalletUI(userAddress, userGemBalance, tradingEnabled);
        }
        window.userAddress = userAddress;
        window.gemBalance = userGemBalance;
        
        console.log('💰 UpdateHeaderUI - Balance:', userGemBalance, 'Address:', userAddress);
        
        if (window.onBalanceUpdateForGames) {
            window.onBalanceUpdateForGames(userGemBalance);
        }
        if (window.toggleLeaderboardForLoggedIn) window.toggleLeaderboardForLoggedIn();
        if (window.toggleBannerSection) window.toggleBannerSection();
        
        if (userAddress) {
            window.dispatchEvent(new CustomEvent('walletConnected', {
                detail: { address: userAddress, balance: userGemBalance }
            }));
        } else {
            window.dispatchEvent(new CustomEvent('walletDisconnected'));
        }
        
        if (window.badgesSystem) {
            window.badgesSystem.updateBadgesUI();
        }
        
        setTimeout(() => {
            if (window.updateRequirementMessage) {
                window.updateRequirementMessage(userGemBalance);
            }
        }, 100);
    }

    function disconnectWallet() {
        console.log('🔌 Manual disconnect...');
        manualDisconnect = true;
        userAddress = null;
        tokenContract = null;
        web3 = null;
        window.web3 = null;
        userGemBalance = 0;
        
        updateHeaderUI();
        
        window.spendGem = async () => false;
        window.gemBalance = 0;
        window.refreshBalance = async () => 0;
        
        if (window.toggleLeaderboardForLoggedIn) window.toggleLeaderboardForLoggedIn();
        if (window.toggleBannerSection) window.toggleBannerSection();
        
        if (window.badgesSystem) window.badgesSystem.updateBadgesUI();
        
        attachWalletEvents();
        
        console.log('✅ Wallet disconnected');
    }

    window.refreshBalance = async function() {
        console.log('🔄 refreshBalance called - userAddress:', userAddress, 'hasTokenContract:', !!tokenContract);
        
        if (!userAddress) {
            console.log('❌ No user address');
            return 0;
        }
        
        if (!tokenContract) {
            console.log('⚠️ Token contract missing, attempting to recreate...');
            if (web3 && userAddress) {
                try {
                    tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
                    console.log('✅ Token contract recreated');
                } catch (err) {
                    console.error('❌ Failed to recreate contract:', err);
                    return userGemBalance; // Zwróć ostatnie znane saldo
                }
            } else {
                console.log('❌ Cannot recreate contract - no web3 or address');
                return userGemBalance;
            }
        }
        
        try {
            const rawBalance = await tokenContract.methods.balanceOf(userAddress).call();
            const newBalance = Number(rawBalance) / (10 ** TOKEN_DECIMALS);
            
            if (userGemBalance !== newBalance) {
                console.log('✅ Balance changed from', userGemBalance, 'to', newBalance);
                userGemBalance = newBalance;
                window.gemBalance = userGemBalance;
                updateHeaderUI();
                
                window.dispatchEvent(new CustomEvent('balanceUpdated', {
                    detail: { balance: userGemBalance }
                }));
                
                if (window.badgesSystem) window.badgesSystem.updateBadgesUI();
                
                setTimeout(() => {
                    if (window.onBalanceUpdateForGames) {
                        window.onBalanceUpdateForGames(userGemBalance);
                    }
                    if (window.updateRequirementMessage) {
                        window.updateRequirementMessage(userGemBalance);
                    }
                }, 100);
            } else {
                console.log('✅ Balance unchanged:', userGemBalance);
            }
            
            return userGemBalance;
        } catch (err) {
            console.error('❌ Error refreshing balance:', err);
            return userGemBalance;
        }
    };

    async function connectWallet(forcePrompt = false) {
        console.log('🔗 Connecting wallet... forcePrompt:', forcePrompt);
        
        if (!window.ethereum) {
            console.log('❌ MetaMask not installed');
            window.open('https://metamask.io/', '_blank');
            return;
        }
        
        try {
            let accounts;
            
            if (forcePrompt) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_revokePermissions',
                        params: [{ eth_accounts: {} }]
                    });
                } catch (e) {
                    console.log('Revoke permissions not supported or failed:', e);
                }
                
                accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts',
                    params: []
                });
            } else {
                accounts = await window.ethereum.request({ method: 'eth_accounts' });
                
                if (!accounts || accounts.length === 0) {
                    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                }
            }
            
            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts returned');
            }
            
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);
            window.web3 = web3;
            
            const chainId = await web3.eth.getChainId();
            if (chainId !== 8453) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x2105' }]
                    });
                } catch (e) {
                    console.log('Network switch cancelled or failed');
                }
            }
            
            tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
            console.log('✅ Token contract created');
            
            const rawBalance = await tokenContract.methods.balanceOf(userAddress).call();
            userGemBalance = Number(rawBalance) / (10 ** TOKEN_DECIMALS);
            window.gemBalance = userGemBalance;
            console.log('💰 Initial balance:', userGemBalance);
            
            updateHeaderUI();
            
            window.spendGem = async (amount) => {
                if (!userAddress || !tokenContract) return false;
                if (userGemBalance < amount) return false;
                try {
                    const amountWei = web3.utils.toWei(amount.toString(), 'ether');
                    await tokenContract.methods.transfer(GAME_WALLET_ADDRESS, amountWei).send({ from: userAddress, gas: 100000 });
                    await window.refreshBalance();
                    return true;
                } catch (err) {
                    console.error('Error spending gems:', err);
                    return false;
                }
            };
            
            window.ethereum.on('accountsChanged', async (newAccounts) => {
                if (newAccounts && newAccounts.length > 0) {
                    userAddress = newAccounts[0];
                    await window.refreshBalance();
                    updateHeaderUI();
                    if (window.onAccountChange) window.onAccountChange(userAddress);
                } else {
                    disconnectWallet();
                    if (window.onAccountChange) window.onAccountChange(null);
                }
            });
            
            if (window.onWalletConnect) window.onWalletConnect(userAddress);
            attachWalletEvents();
            
            setTimeout(() => {
                if (window.onBalanceUpdateForGames) {
                    window.onBalanceUpdateForGames(userGemBalance);
                }
                if (window.updateRequirementMessage) {
                    window.updateRequirementMessage(userGemBalance);
                }
            }, 200);
            
            console.log('✅ Wallet connected successfully');
            
        } catch (err) {
            console.error('❌ Error connecting wallet:', err);
            userAddress = null;
            updateHeaderUI();
            
            if (err.code === 4001) {
                console.log('User rejected the request');
                alert('Please connect your wallet to continue.');
            }
        }
    }

    async function restoreConnection() {
        if (manualDisconnect) {
            console.log('⏭️ Skipping auto-connect after manual disconnect');
            return;
        }
        
        console.log('🔄 Attempting to restore connection...');
        
        if (!window.ethereum) {
            console.log('No MetaMask detected');
            return;
        }
        
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
                userAddress = accounts[0];
                web3 = new Web3(window.ethereum);
                window.web3 = web3;
                
                const chainId = await web3.eth.getChainId();
                if (chainId !== 8453) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x2105' }]
                        });
                    } catch (e) {}
                }
                
                tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
                console.log('✅ Token contract created (restored)');
                
                const rawBalance = await tokenContract.methods.balanceOf(userAddress).call();
                userGemBalance = Number(rawBalance) / (10 ** TOKEN_DECIMALS);
                window.gemBalance = userGemBalance;
                console.log('💰 Restored balance:', userGemBalance);
                
                updateHeaderUI();
                
                window.spendGem = async (amount) => {
                    if (!userAddress || !tokenContract) return false;
                    if (userGemBalance < amount) return false;
                    try {
                        const amountWei = web3.utils.toWei(amount.toString(), 'ether');
                        await tokenContract.methods.transfer(GAME_WALLET_ADDRESS, amountWei).send({ from: userAddress, gas: 100000 });
                        await window.refreshBalance();
                        return true;
                    } catch (err) {
                        console.error('Error spending gems:', err);
                        return false;
                    }
                };
                
                if (window.onWalletConnect) window.onWalletConnect(userAddress);
                attachWalletEvents();
            } else {
                console.log('No accounts found, user not connected');
            }
        } catch (err) {
            console.error('Error restoring connection:', err);
        }
    }

    // Eksportuj funkcje globalnie
    window.spendGem = async () => false;
    window.gemBalance = 0;
    window.userAddress = null;
    window.refreshBalance = async () => 0;
    window.connectWallet = connectWallet;
    window.disconnectWallet = disconnectWallet;
    window.getMinGemRequired = () => MIN_GEM_REQUIRED;
    window.checkMinimumBalance = () => userGemBalance >= MIN_GEM_REQUIRED;
    
    window.getGameWalletBalance = async function() {
        if (!tokenContract) return 0;
        try {
            const rawBalance = await tokenContract.methods.balanceOf(GAME_WALLET_ADDRESS).call();
            return rawBalance / (10 ** TOKEN_DECIMALS);
        } catch (err) {
            return 0;
        }
    };

    // Automatyczne przywracanie połączenia
    setTimeout(() => {
        restoreConnection();
    }, 500);
}