// elliptic has methods to sign something and to verify signatures (npm-install elliptic)
const EC = require("elliptic").ec;

// Create instance of elliptic
const ec = new EC("secp256k1"); // the elliptic curve secp256k1 is also the algorithim in BTC wallets

// Create key pair, public and private as hex strings
const key = ec.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

// Run node keygenerator.js to obtain public and private keys
// These will be needed to sign transactions
// And also to verify our balance
console.log();
console.log("Private key:", privateKey);
console.log("Public key:", publicKey);
