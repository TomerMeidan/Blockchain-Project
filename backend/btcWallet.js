require("dotenv").config();

const bip39 = require("bip39");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const { default: axios } = require("axios");
const bitcore = require("bitcore-lib");
// You must wrap a tiny-secp256k1 compatible implementation
const bip32 = BIP32Factory(ecc);


const block_cypher_api = process.env.block_cypher_api;


//   create wallet instance by mnemonic ------
const createBitcoinWallet = async (mnemonic, accountNo) => {
  // generate mnemonic
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  console.log("child nodes ----------------");
  // path for testnet
  const path = "m/49'/1'/0'/0";
  return await derivedWalletsFromBitcoinNode(root, path, accountNo);
};

// restore the btc wallet by given mnemonic ---------
const restoreBtcWallet = async (mnemonic, index) => {
  const accounts = await createBitcoinWallet(mnemonic, index);
  const updatedAccounts = await getBtcAccountsBalance(accounts);
  return updatedAccounts;
};

const getBtcAccountsBalance = async (accounts) => {
  //   let newAccounts = accounts?.accounts;
  console.log("accounts : ", accounts);
  console.log("accounts : ", accounts?.length);
  for (let i = 0; i < accounts.length; i++) {
    const address = accounts[i].address;
    const url = `https://blockchain.info/balance?active=${address}`;
    await axios.get(url).then((response) => {
      console.log(response.data[address]);
      accounts[i].balance = response.data[address].final_balance;
    });
  }
  console.log("newAccounts :", accounts);
  return accounts;
};

const derivedWalletsFromBitcoinNode = async (
  root,
  derivationPath,
  numberOfAccounts
) => {
  let accounts = [];
  const network = bitcoin.networks.bitcoin;
  // bip49 derived path for mainnet =0 , testnet =1
  for (let i = 0; i < numberOfAccounts; i++) {
    let childNode = root.derivePath(derivationPath + "/" + i);

    const privateKey = childNode.privateKey.toString("hex");
    const address = bitcoin.payments.p2pkh({
      pubkey: childNode.publicKey,
      network,
    }).address;
    accounts.push({ privateKey: privateKey, address: address });
  }
  console.log("derived wallets successfully executed ------");
  return accounts;
};

// generate new wallet by randomly generating mnemonic ------
const generateBtcWallet = async (index) => {
  const mnemonic = bip39.generateMnemonic();
  const updatedAccounts = await createBitcoinWallet(mnemonic, index);
  for (let i = 0; i < updatedAccounts.length; i++) {
    updatedAccounts[i].balance = 0;
  }
  return { mnemonic, updatedAccounts };
};

const sendBtcTransaction = async (
  fromAddress,
  privateKey,
  toAddress,
  value
) => {
  const url = `https://blockchain.info/unspent?active=${fromAddress}`;
  axios.get(url).then((response) => {
    let inputs = [];
    let utxos = response.data.unspent_outputs;
    let totalAmountAvailable = 0;
    let inputCount = 0;

    for (const ele of utxos) {
      let utxo = {};
      utxo.satoshi = ele.value;
      utxo.script = ele.script;
      utxo.address = fromAddress;
      utxo.txid = ele.tx_hash;
      utxo.outputIndex = ele.tx_output_n;
      totalAmountAvailable += utxo.satoshi;
      inputCount += 1;
      inputs.push(utxo);
    }
    console.log(inputs);

    const transaction = new bitcore.Transaction();
    const satoshiToSend = value * 1e8;
    const outputCount = 2;

    const transactionSize =
      inputCount * 180 + outputCount * 34 + 10 - inputCount;
    let fee = transactionSize * 33;

    transaction.from(inputs);
    //meet.google.com/cwy-ssfi-ytq
    https: transaction.to(toAddress, satoshiToSend);
    transaction.change(fromAddress);
    transaction.fee(Math.round(fee));
    transaction.sign(privateKey);

    const serializedTransaction = transaction.serialize();

    // broadcast the transaction

    axios
      .post(
        `https://api.blockcypher.com/v1/btc/main/txs/push?token = ${block_cypher_api}`,
        JSON.stringify(serializedTransaction)
      )
      .then((result) => {
        console.log(result);
        return "success";
      })
      .catch((e) => {
        console.log(e);
        return "failure";
      });
  });
};

module.exports = {
  generateBtcWallet,
  restoreBtcWallet,
  sendBtcTransaction,
  getBtcAccountsBalance,
};
