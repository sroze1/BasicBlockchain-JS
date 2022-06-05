const SHA256 = require("crypto-js/sha256");

class Block {
  get amount() {
    return this._amount;
  }

  getHash() {
    return this._hash;
  }

  get index() {
    return this._index;
  }

  get timestamp() {
    return this._timestamp;
  }

  constructor(index, amount, prevHash = "") {
    // make all props private so they can be written only once
    this._index = index;
    this._timestamp = +new Date();
    this._amount = amount;
    this._hash = SHA256(
      `${this.index}-${prevHash}-${this.timestamp}-${this.amount}`
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.addBlock(0, "Genesis block");
  }

  getCurrentHash() {
    return this.chain[this.chain.length - 1].getHash();
  }

  addBlock(amount, prevHash = this.getCurrentHash()) {
    this.chain.push(new Block(this.chain.length - 1, amount, prevHash));
  }
}

let savejeeCoin = new Blockchain();
savejeeCoin.addBlock(4);
savejeeCoin.addBlock(10);

console.log(JSON.stringify(savejeeCoin, null, 4));
