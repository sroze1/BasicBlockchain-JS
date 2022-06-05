const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  // Calculate hash for each transaction,  which we will sign with our private key
  // Just the hash of the transaction will be signed - NOT all of the data
  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  // This will receive a signingKey -- the object from eliptic library (keyGenerator)
  // To sign transactions, we will have to give it our public and private key pair

  signTransaction(signingKey) {
    // Before signing, we want to check the publicKey is the fromAddress -- so can only spend coins for the wallet we have the private key for
    // Because the private key is linked to the public key, the fromAddress has to equall the public key
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    // Here we  create the hash of our transaction
    const hashTx = this.calculateHash();
    // Create signature, we will sign the hash of our transaction in 'base64'
    const sig = signingKey.sign(hashTx, "base64");
    // Then we will store the signature into the transaction (toDER is a special format)
    this.signature = sig.toDER("hex");
  }

  // Verify if transaction has been correctly signed
  // Special transaction we have to take into account is mining rewards -- mining a block is also a transaction
  // Which aren't signed but are valid transactions
  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    // If the two conditions above are passed, it means it's not from the null address and has a signature,
    // Then we verify that the transactions were signed with the correct key
    // Create new publicKey object from the fromAddress
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  // Hash identifies the block
  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    // This line below is key!
    // Because you cannot influence the calculateHash - you have to try your luck with many 0s in front of it
    // To show you've used a lot of computing power to verify a block,
    // Until a hash is randomly generated equal to the number of
    // Zeroes set in the difficulty, (which would take a lot of random attempts)
    // the block isn't mined (see below - line 56.)
    // This is set to create a steady amount of new blocks

    // This is a quick trick to ensure the start of the hash is equal to the number of 0s we are looking for dependent
    // On our difficult
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.parse("2017-01-01"), [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTransactions.push(rewardTx);
    // This takes a parameter of the miners address, so if he successfully mines the block, the reward is sent to the address
    // In reality miners have to pick the transactions they want to include
    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return "tatta4";
      }
    }
    return true;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
