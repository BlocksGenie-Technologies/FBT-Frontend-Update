const DISTRIBUTION_CONTRACT_ADDRESS = '0x7A562AaC8903cf4F50faf26AC301D5Ed3e65dAe6';
const DISTRIBUTION_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"uint256[]","name":"timestamps","type":"uint256[]"},{"internalType":"uint256","name":"initialBalance","type":"uint256"}],"name":"calculateShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256[]","name":"timestamp","type":"uint256[]"},{"internalType":"uint256[]","name":"amount","type":"uint256[]"},{"internalType":"uint256","name":"last24HourBalance","type":"uint256"}],"internalType":"struct RevenueDistributor.UserDetails[]","name":"_userDetails","type":"tuple[]"}],"name":"distribute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getLastDistributionTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDistributionTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"pendingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"revenuePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewardClaimable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"setTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRewardDistributed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const connectButton1 = document.getElementById('btn-connect');
const connectButton2 = document.getElementById('btn-connect1');
const totalRewardContent = document.getElementById('t_reward');
const pendingRewardContent = document.getElementById('pending_reward');

let provider;
let web3;
let selectedAccount;


function formatTime(secs) {
  const seconds = Math.floor(secs);
  const hours = Math.floor(seconds % 86400 / 3600);
  const minutes = Math.floor((seconds % 86400) % 3600 / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

let getAccumulatedRewards = async () =>{
  if (web3) {
    const contract = new web3.eth.Contract(DISTRIBUTION_CONTRACT_ABI, DISTRIBUTION_CONTRACT_ADDRESS);
    const accumulatedRewards = await contract.methods.totalRewardDistributed().call();
    totalRewardContent.textContent = Number(web3.utils.fromWei(accumulatedRewards, 'ether'));
    console.log("accumulatedRewards", accumulatedRewards)
  }
  else{
    totalRewardContent.textContent = 0;
  }
}



let pendingRewards = async () => {
  if (web3) {
    const contract = new web3.eth.Contract(DISTRIBUTION_CONTRACT_ABI, DISTRIBUTION_CONTRACT_ADDRESS);
    const acct = await web3.eth.getAccounts();
    const rewards = await contract.methods.pendingRewards(acct[0]).call();
    pendingRewardContent.textContent = Number(web3.utils.fromWei(rewards, 'ether'));
  }
  else{
    pendingRewardContent.textContent = "-----";
  }
}

let refresh = async () => {
    const web3_instance = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/09046699d3b24685b819c3d6fd021a40'))
    const contract = new web3_instance.eth.Contract(DISTRIBUTION_CONTRACT_ABI, DISTRIBUTION_CONTRACT_ADDRESS);
    const nextRefresh = await contract.methods.getLastDistributionTime().call();
    const target = Number(nextRefresh) + 86400;
    const  currenTime = Math.floor(Date.now() / 1000);
    const countdown_sec = target - currenTime;
    countdown_sec >= 0 ? countdown_sec : 0; 
    
    document.getElementById('countDown').textContent = formatTime(countdown_sec);
    document.getElementById('countDown1').textContent = formatTime(countdown_sec);
}

refresh()


let claim = async () => {
  try {
    if (web3) {
      const acct = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(DISTRIBUTION_CONTRACT_ABI, DISTRIBUTION_CONTRACT_ADDRESS);

      await contract.methods.claim().send({ from: acct[0] });            
    } else {
        console.log('web3 instance not found.');
    }
  } catch (error) {
      console.error('Error claiming rewards:', error.message);
  }
}


setInterval(async () => {
  await getAccumulatedRewards();
  await pendingRewards();
  refresh();
}, 1000);



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
  web3 = new Web3(provider);

  const isConnected = provider.isConnected();
  if (isConnected) {
    connectButton1.textContent = 'Disconnect';
    connectButton2.textContent = 'Claim';
    connectButton1.removeEventListener('click', onConnect);
    connectButton1.addEventListener('click', onDisconnect);
    connectButton2.removeEventListener('click', onConnect);
    connectButton2.addEventListener('click', claim);
  } else {
    connectButton1.textContent = 'Connect Wallet';
    connectButton2.textContent = 'Connect Wallet';
    connectButton1.removeEventListener('click', onDisconnect);
    connectButton1.addEventListener('click', onConnect);
    connectButton2.removeEventListener('click', claim);
    connectButton2.addEventListener('click', onConnect);
  }

  await pendingRewards();
  await getAccumulatedRewards();  
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
    connectButton2.removeEventListener('click', claim);
    connectButton2.addEventListener('click', onConnect);
    await pendingRewards();
  await getAccumulatedRewards();
  
}


window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-connect1").addEventListener("click", onConnect);
});