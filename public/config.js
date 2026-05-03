// ============================================
// KONFIGURACJA TOKENA GEM FUN
// ============================================

// ADRES TWOJEGO TOKENA NA BASE
const TOKEN_ADDRESS = '0xf8a02B86e09319E615534cd8fF034A527261072f';

// ABI TWOJEGO TOKENA
const TOKEN_ABI = [
    {
        "constant": true,
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "spender", "type": "address"},
            {"name": "value", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "tradingStarted",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "to", "type": "address"},
            {"name": "value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    }
];

// NAZWA TOKENA
const TOKEN_SYMBOL = 'GEM';

// DECIMALE
const TOKEN_DECIMALS = 18;

// RPC BASE
const BASE_RPC_URL = 'https://mainnet.base.org';

// ADRES PORTFELA GRY (gdzie idą GEMy za zakupy)
const GAME_WALLET_ADDRESS = '0x443baEF78686Fc6b9e5e6DaEA24fe26a170c5ac8';