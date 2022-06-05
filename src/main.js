const {Blockchain, Transaction} = require("./blockchain.js");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
  "1c307007009e64c5bb8a785f0bc12561842f468cc609db4f379aacd1bbebf0a7"
);
const myWalletAddress = myKey.getPublic("hex");

let savejeeCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10);
tx1.signTransaction(myKey);
savejeeCoin.addTransaction(tx1);

console.log("\n Starting the miner...");
savejeeCoin.minePendingTransactions(myWalletAddress);

console.log(
  "\n Ess balance is",
  savejeeCoin.getBalanceOfAddress(myWalletAddress)
);

console.log("Is chain valid", savejeeCoin.isChainValid());
