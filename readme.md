# Basic Blockhain in JS

This project creates a blockchain using the JavaScript language.
It is created using basic constructors, using verification methods
to prevent the data from being manipulated.

It utilises the crypto-js package, and the elliptic curve package,
both of which can be downloaded using npm.

- npm install crypto-js, used to calculate hash - generate a random key)
- npm install elliptic, used to create public and private keys, to sign something, and to verify a signature)

## Simple Explanation on Blockchain:

- Blockchain involves nodes on a P2P network and consists of blocks of data.
- Each 'block' has a hash - a randomly generated string of characters and numbers (like a fingerprint) to uniquely reference a block.
- Blocks can contain any data, in the case of cryptocurrencies such as Bitcoin, they contain data on an amount of funds
- Excluding the first block (called genesis block), each block along with a hash, also has a previousBlock hash to reference the previous Block.
- The previousBlock hash is important, as any time a block of data is tampered with, it's hash is also recalculated (ie the fingerprint is changed).
- Example: Block ABC. Block B has it's data manipulated, meaning it's hash is recalculated. Now Block C has an incorrect reference to the previousBlock, invalidating the chain.

This essentially makes it impossible for data to be manipulated on a blockhain without it being visible on the chain, which is why it is so useful. Each node on the P2P network also
has a copy of the chain, so even if manipulation occurs, it is visible on the network - acting as a consensus where the nodes can reject false blocks.
