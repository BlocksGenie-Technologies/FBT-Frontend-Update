const DISTRIBUTION_CONTRACT_ADDRESS = '';
const FBT_TOKEN_CONTRACT_ADDRESS = '0x4727a02269943b225A7de9ef28496f36d454B983';
const ETHERSCAN_API_KEY = 'YAUIENIVR8F922FXDIHGFEHTN18UMB5IRH';
const URL = 'api.etherscan.io'
const DISTRIBUTION_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"uint256[]","name":"transactionAmounts","type":"uint256[]"},{"internalType":"uint256[]","name":"transactionTimestamps","type":"uint256[]"},{"internalType":"uint256","name":"userInitialBalance","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"getUserLastClaimTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"uint256[]","name":"timestamps","type":"uint256[]"},{"internalType":"uint256","name":"initialBalance","type":"uint256"}],"name":"pendingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"revenuePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"setTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRewardDistributed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userClaimTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];
const connectButton1 = document.getElementById('btn-connect');
const connectButton2 = document.getElementById('btn-connect1');

let provider;
let web3 = new Web3(provider);
let selectedAccount;
let contract;
if(web3){
    contract = new web3.eth.Contract(DISTRIBUTION_CONTRACT_ABI, DISTRIBUTION_CONTRACT_ADDRESS);
}

let getTxns =  async (address) =>{
    if (web3) {
        const lastClaimTime = await contract.methods.getUserLastClaimTimestamp(address).call();
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const twentyFourHoursAgoTimestamp = currentTimestamp - 24 * 60 * 60;
        const timestamp = Number(lastClaimTime) == 0 ? twentyFourHoursAgoTimestamp : Number(lastClaimTime);
    
        const apiUrl = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&contractaddress=${FBT_TOKEN_CONTRACT_ADDRESS}&startblock=${timestamp}&endblock=latest&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
    
        try {
            const response = await axios.get(apiUrl);
            const tokenTransfers = response.data.result;
            const filteredTxns = tokenTransfers.filter(transfer => {
                return (
                    transfer.to.toLowerCase() === address.toLowerCase()
                );
            });
    
            return filteredTxns;
        } catch (error) {
            console.error('Error retrieving token transfers:', error.message);
            return [];
        }
    }
    return [];
}

let getAccumulatedRewards = async (address) =>{}

let pendingRewards = async (address) => {}


let claim = async (address) => {}



const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const EvmChains = window.EvmChains;

let web3Modal


function init() {

  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      }
    },
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, 
    providerOptions,
  });

}


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  const isConnected = provider.isConnected();
  if (isConnected) {
    connectButton1.textContent = 'Disconnect';
    connectButton2.textContent = 'Claim';
    connectButton1.removeEventListener('click', onConnect);
    connectButton1.addEventListener('click', onDisconnect);
    connectButton2.removeEventListener('click', onConnect);
    connectButton2.addEventListener('click', onDisconnect);
  } else {
    connectButton1.textContent = 'Connect Wallet';
    connectButton2.textContent = 'Connect Wallet';
    connectButton1.removeEventListener('click', onDisconnect);
    connectButton1.addEventListener('click', onConnect);
    connectButton2.removeEventListener('click', onDisconnect);
    connectButton2.addEventListener('click', onConnect);
  }

  console.log("Web3 instance is", web3);

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
}



/**
 * Connect wallet button pressed.
 */
async function onConnect(event) {
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  fetchAccountData();
}



async function onDisconnect() {


    await web3Modal.clearCachedProvider();
    provider = null;

    selectedAccount = null;
    connectButton1.textContent = 'Connect Wallet';
    connectButton2.textContent = 'Connect Wallet';
    connectButton1.removeEventListener('click', onDisconnect);
    connectButton1.addEventListener('click', onConnect);
    connectButton2.removeEventListener('click', onDisconnect);
    connectButton2.addEventListener('click', onConnect);
}


window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-connect1").addEventListener("click", onConnect);
});