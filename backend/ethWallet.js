const { ethers, Wallet } = require("ethers");
const { default: axios } = require("axios");
require("dotenv").config();

const alchemy_mainnet_api_key = process.env.alchemy_mainnet_api_key;
const alchemy_sepolia_api_key = process.env.alchemy_sepolia_api_key;

const ethMainNet = `https://eth-mainnet.g.alchemy.com/v2/${alchemy_mainnet_api_key}`;
const ethTestNet = `https://eth-sepolia.g.alchemy.com/v2/${alchemy_sepolia_api_key}`;

// generate new wallet with randomly generated seed phrase -----
const generateEthereumWallet = async (index) => {
  let randomEntropyBytes = ethers.utils.randomBytes(16);
  const mnemonic = ethers.utils.entropyToMnemonic(randomEntropyBytes);
  const accounts = await createEthereumWallet(mnemonic, index);
  // const updatedAccounts = await getEthAccountsBalance(accounts);
  for (let i = 0; i < accounts.length; i++) {
    accounts[i].balance = 0;
  }
  return { mnemonic, updatedAccounts: accounts };
};

// restore wallet with given seed phrase ------
const restoreEthereumWallet = async (mnemonic, index) => {
  const accounts = await createEthereumWallet(mnemonic, index);
  const updatedAccounts = await getEthAccountsBalance(accounts);
  return updatedAccounts;
};


// ethereum Wallet Functions ---------------
const deriveWalletsFromEthereumNode = async (
  mnemonic,
  derivationPath,
  numberOfAccounts
) => {
  let accounts = [];
  for (let i = 0; i < numberOfAccounts; i++) {
    let hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(
      derivationPath + "/" + i
    );
    // console.log(hdNode);
    let wallet = new ethers.Wallet(hdNode.privateKey);
    accounts.push({ privateKey: wallet.privateKey, address: wallet.address });
  }
  console.log("successfully executed wallets derived");
  return accounts;
};

// get the instanace of the wallet ------------------
const createEthereumWallet = async (mnemonic, index) => {
  const wallet = ethers.utils.HDNode.fromMnemonic(mnemonic);
  let derivationPath = "m/44'/60'/0'/0";
  return await deriveWalletsFromEthereumNode(mnemonic, derivationPath, index);
};


const sendEthTransaction = async (PrivateKey, toAddress, value) => {
  const walletPrivateKey = new Wallet(PrivateKey);
  const provider = new ethers.providers.JsonRpcProvider(ethTestNet);   // change this to ethMainNet for mainnet
  const wallet = walletPrivateKey.connect(provider);
  const balance = await wallet.getBalance();
  if (value >= balance) {
    return false;
  }
  const nonce = await wallet.getTransactionCount();
  let tx = {
    nonce: nonce,
    to: toAddress,
    gasLimit: 21000,
    value: ethers.utils.parseEther(value),
  };

  const txn = await wallet.sendTransaction(tx);
  const receipt = await txn.wait(1);
  console.log(receipt);
  //   return receipt.transactionHash;
  return Number(await wallet.getBalance()) / 1e18;
};

const getEthAccountsBalance = async (accounts) => {
  const provider = new ethers.providers.JsonRpcProvider(ethTestNet);    // change this to ethMainNet for mainnet
  for (let i = 0; i < accounts.length; i++) {
    let walletPrivateKey = new Wallet(accounts[i].privateKey);

    let wallet = walletPrivateKey.connect(provider);
    let balance = Number(await wallet.getBalance());
    balance = balance / 1e18;
    accounts[i].balance = balance;
  }
  console.log("successfully executed accountsbalance");
  return accounts;
};

module.exports = {
  generateEthereumWallet,
  restoreEthereumWallet,
  sendEthTransaction,
  getEthAccountsBalance,
};
