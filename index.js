const DISTRIBUTION_CONTRACT_ADDRESS = '0x54e7CeE9B608bdE62f9cf385d05725a2424592D1';
const DISTRIBUTION_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_manager","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address[]","name":"a","type":"address[]"},{"internalType":"bool","name":"status","type":"bool"}],"name":"blacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"reward","type":"uint256"}],"internalType":"struct RevenueDistributor.UserDetails[]","name":"_userDetails","type":"tuple[]"}],"name":"distribute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distributedEth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getLastDistributionTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastDistributionTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"manager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"pendingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewardClaimable","outputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"reward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_manager","type":"address"}],"name":"setManagerAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const connectButton1 = document.getElementById('btn-connect');
const connectButton2 = document.getElementById('btn-connect1');
const totalRewardContent = document.getElementById('t_reward');
const pendingRewardContent = document.getElementById('pending_reward');
const provider1 = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');


let provider;
let web3;


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
    const accumulatedRewards = await contract.methods.distributedEth().call();
    totalRewardContent.textContent = Number(web3.utils.fromWei(accumulatedRewards, 'ether')).toFixed(5);
  }
}



let pendingRewards = async () => {
  if (web3) {
    const contract = new web3.eth.Contract(DISTRIBUTION_CONTRACT_ABI, DISTRIBUTION_CONTRACT_ADDRESS);
    const acct = await web3.eth.getAccounts();
    const rewards = await contract.methods.pendingRewards(acct[0]).call();
    pendingRewardContent.textContent = Number(web3.utils.fromWei(rewards, 'ether')).toFixed(5);
  }
}

let refresh = async () => {
    const web3_instance = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/09046699d3b24685b819c3d6fd021a40'))
    const contract = new web3_instance.eth.Contract(DISTRIBUTION_CONTRACT_ABI, DISTRIBUTION_CONTRACT_ADDRESS);
    const nextRefresh = await contract.methods.getLastDistributionTime().call();
    const target = Number(nextRefresh) + 86400;
    const currenTime = Math.floor(Date.now() / 1000);
    const countdown_sec =  Number(nextRefresh) == 0 ? 0 : target - currenTime;
    countdown_sec >= 0 ? countdown_sec : 0; 
    document.getElementById('countDown').textContent = formatTime(countdown_sec);
    document.getElementById('countDown1').textContent = formatTime(countdown_sec);
}

refresh()


let claim = async () => {
  try {
    if (web3) {
      const providerObj = new ethers.providers.Web3Provider(provider);
      const _signer = providerObj.getSigner();

      const revenueDistributor = new ethers.Contract(DISTRIBUTION_CONTRACT_ADDRESS,DISTRIBUTION_CONTRACT_ABI, _signer);
      await revenueDistributor.claim();            
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