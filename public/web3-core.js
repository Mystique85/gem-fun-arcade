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
    const TOKEN_ADDRESS = '0xd483d541E0B0F322b81B97764bA71602A853021e';
    const GAME_WALLET_ADDRESS = '0x443baEF78686Fc6b9e5e6DaEA24fe26a170c5ac8';

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
                await connectWallet(true);
            };
        }
    }

    function updateHeaderUI() {
        if (headerComponent) {
            headerComponent.updateWalletUI(userAddress, userGemBalance, tradingEnabled);
        }
        window.userAddress = userAddress;
        window.gemBalance = userGemBalance;
        
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
    }

    window.refreshBalance = async function() {
        if (!userAddress) {
            return 0;
        }
        
        if (!tokenContract) {
            if (web3 && userAddress) {
                try {
                    tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
                } catch (err) {
                    return userGemBalance;
                }
            } else {
                return userGemBalance;
            }
        }
        
        try {
            const rawBalance = await tokenContract.methods.balanceOf(userAddress).call();
            const newBalance = Number(rawBalance) / (10 ** TOKEN_DECIMALS);
            
            if (userGemBalance !== newBalance) {
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
            }
            
            return userGemBalance;
        } catch (err) {
            return userGemBalance;
        }
    };

    async function connectWallet(forcePrompt = false) {
        if (!window.ethereum) {
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
                } catch (e) {}
                
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
                } catch (e) {}
            }
            
            tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);
            
            const rawBalance = await tokenContract.methods.balanceOf(userAddress).call();
            userGemBalance = Number(rawBalance) / (10 ** TOKEN_DECIMALS);
            window.gemBalance = userGemBalance;
            
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
            
        } catch (err) {
            userAddress = null;
            updateHeaderUI();
            
            if (err.code === 4001) {
                alert('Please connect your wallet to continue.');
            }
        }
    }

    async function restoreConnection() {
        if (manualDisconnect) {
            return;
        }
        
        if (!window.ethereum) {
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
                
                const rawBalance = await tokenContract.methods.balanceOf(userAddress).call();
                userGemBalance = Number(rawBalance) / (10 ** TOKEN_DECIMALS);
                window.gemBalance = userGemBalance;
                
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
                        return false;
                    }
                };
                
                if (window.onWalletConnect) window.onWalletConnect(userAddress);
                attachWalletEvents();
            }
        } catch (err) {}
    }

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

    setTimeout(() => {
        restoreConnection();
    }, 500);
}