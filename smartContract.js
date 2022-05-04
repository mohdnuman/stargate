const Web3 = require("web3");

const masterAbi = require("./abi.json");
const tokenAbi = require("./abi2.json");

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

async function getBalance(address, pid) {
  const contract = "0xB0D502E938ed5f4df2E681fE6E419ff29631d62b";

  const Instance = new web3.eth.Contract(masterAbi, contract);

  let userInfo = await Instance.methods.userInfo(pid, address).call();
  let rewards = await Instance.methods.pendingStargate(pid, address).call();
  let poolInfo = await Instance.methods.poolInfo(pid).call();

  const tokenInstance = new web3.eth.Contract(tokenAbi, poolInfo.lpToken);
  let symbol = await tokenInstance.methods.symbol().call();
  let decimals = await tokenInstance.methods.decimals().call();

  let balance = (userInfo.amount / 10 ** decimals).toFixed(2);
  rewards = (rewards / 10 ** 18).toFixed(2);

  if (balance != 0) {
    console.log("balance:", balance, symbol.slice(2));
    console.log("rewards:", rewards, "STG");
  }
}

let address = "0x99459a327e2e1f7535501aff6a1aada7024c45fd";
getBalance(address, 1);
