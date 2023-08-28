const ETHERSCAN_API_KEY = '';

const DISTRIBUTION_CONTRACT_ADDRESS = '';
const DISTRIBUTION_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"uint256[]","name":"transactionAmounts","type":"uint256[]"},{"internalType":"uint256[]","name":"transactionTimestamps","type":"uint256[]"},{"internalType":"uint256","name":"userInitialBalance","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"getUserLastClaimTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"uint256[]","name":"timestamps","type":"uint256[]"},{"internalType":"uint256","name":"initialBalance","type":"uint256"}],"name":"pendingRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"revenuePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"setTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userClaimTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];


let account;

let provider = new WalletConnectProvider.default({
  rpc: {
    1: "https://eth.llamarpc.com",
  },
});

let web3;

let connectWC = async () => {
  await provider.enable();
  web3 = new Web3(provider);

  var accounts = await web3.eth.getAccounts();
  account = accounts[0];
  var balance = await web3.eth.getBalance(account);
  console.log("See your address:", account);
  console.log("Your balance:", web3.utils.fromWei(balance, "ether"));
};

var disconnect = async () => {
  await provider.disconnect();
  console.log("wallet disconnected");
};