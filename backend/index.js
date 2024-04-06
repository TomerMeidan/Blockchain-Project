const express = require("express");
const ethWallet = require("./ethWallet");
const btcWallet = require("./btcWallet");
const { ethers, Wallet } = require("ethers");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

app.get("/:network/:number_of_addresses", async (req, res) => {
  const { network, number_of_addresses } = req.params;
  console.log(network, number_of_addresses);
  let result;
  try {
    if (network == "ethereum") {
      result = await ethWallet.generateEthereumWallet(number_of_addresses);
    } else if (network == "bitcoin") {
      result = await btcWallet.generateBtcWallet(number_of_addresses);
    } else {
      res
        .status(404)
        .json({ message: "only ethereum and bitcoin networks supported" });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "error in generating wallet" });
    return;
  }
  console.log("result of the generated wallet : ", result);
  const { mnemonic: seedToSend, updatedAccounts: accounts } = result;
  res.status(200).json({ seed: seedToSend, accounts: accounts });
});

app.post("/", async (req, res) => {
  console.log("body :- ", req.body);
  let { seed, number_of_addresses, network } = req.body;
  let accounts = [];
  try {
    if (network == "ethereum") {
      if (!ethers.utils.isValidMnemonic(seed)) {
        res.status(404).json({ message: "invalid seed" });
        return;
      }
      accounts = await ethWallet.restoreEthereumWallet(
        seed,
        Number(number_of_addresses)
      );
    } else if (network == "bitcoin") {
      accounts = await btcWallet.restoreBtcWallet(
        seed,
        Number(number_of_addresses)
      );
    }
  } catch (e) {
    console.log(e);
  }
  console.log("accounts recovered : ", accounts);

  res.status(200).json({ seed: seed, accounts: accounts });
});

app.post("/sendTransaction", async (req, res) => {
  let { fromAddress, privateKey, toAddress, value, network } = req.body;
  if (!ethers.utils.isHexString(privateKey, 32)) {
    res.status(404).json({ error: "private key must be of 32 bytes" });
    return;
  }
  let result;
  try {
    if (network == "ethereum") {
      result = await ethWallet.sendEthTransaction(privateKey, toAddress, value);
      if (result == false) {
        res.status(404).json({
          error:
            "transaction will fail , value is more than the account balance",
        });
        return;
      }
    } else if (network == "bitcoin") {
      result = await btcWallet.sendBtcTransaction(
        fromAddress,
        privateKey,
        toAddress,
        value
      );
      if (!result) {
        res.status(404).json({
          error:
            "transaction will fail , value is more than the account balance",
        });
        return;
      }
    } else {
      res.status(404).json({ error: "only ethereum and bitcoin supported" });
      return;
    }
  } catch (e) {
    console.log(e);
  }
  console.log(result);
  const wallet = new Wallet(privateKey);
  res.status(200).json({ address: wallet.address, balance: result });
});

// listening on port 3000-----------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
