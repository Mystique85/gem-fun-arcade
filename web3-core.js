if (typeof window.web3Initialized === 'undefined') {
    window.web3Initialized = true;

    let web3;
    let userAddress = null;
    let tokenContract = null;
    let userGemBalance = 0;
    let tradingEnabled = false;
    let headerComponent = null;

    window.setHeaderComponent = (component) => {
        headerComponent = component;
        updateHeaderUI();
        setTimeout(() => {
            attachWalletEvents();
        }, 100);
    };

    function attachWalletEvents() {
        const connectBtn = document.getElementById('connectWalletBtn');
        const disconnectBtn = document.getElementById('disconnectWalletBtn');
        
        if (connectBtn) {
            const newConnectBtn = connectBtn.cloneNode(true);
            connectBtn.parentNode.replaceChild(newConnectBtn, connectBtn);
            newConnectBtn.onclick = (e) => {
                e.preventDefault();
                connectWallet();
            };
        }
        
        if (disconnectBtn) {
            const newDisconnectBtn = disconnectBtn.cloneNode(true);
            disconnectBtn.parentNode.replaceChild(newDisconnectBtn, disconnectBtn);
            newDisconnectBtn.onclick = (e) => {
                e.preventDefault();
                disconnectWallet();
            };
        }
    }

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
            return true;
        };
        window.gemBalance = 100;
        
        if (window.refreshGameAfterWallet) window.refreshGameAfterWallet();
        attachWalletEvents();
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
            return false;
        }
    }

    async function spendGem(amount, purpose = 'game') {
        if (!userAddress || !tokenContract) {
            return false;
        }
        
        if (!tradingEnabled) {
            return false;
        }
        
        if (userGemBalance < amount) {
            return false;
        }
        
        try {
            const amountWei = web3.utils.toWei(amount.toString(), 'ether');
            const tx = await tokenContract.methods.transfer(GAME_WALLET_ADDRESS, amountWei).send({
                from: userAddress,
                gas: 100000
            });
            
            await refreshBalance();
            return true;
            
        } catch (err) {
            return false;
        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
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
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x2105' }]
                        });
                    } catch (e) {}
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
                        if (window.onAccountChange) window.onAccountChange(userAddress);
                    } else {
                        disconnectWallet();
                        if (window.onAccountChange) window.onAccountChange(null);
                    }
                });
                
                if (window.onWalletConnect) window.onWalletConnect(userAddress);
                attachWalletEvents();
                
            } catch (err) {
                userAddress = null;
                updateHeaderUI();
            }
        } else {
            window.open('https://metamask.io/', '_blank');
        }
    }

    window.spendGem = async (amount, purpose) => {
        return true;
    };
    window.gemBalance = 100;
    window.userAddress = null;

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
}