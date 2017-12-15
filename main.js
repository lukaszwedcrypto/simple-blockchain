class Block {
  constructor(index, timestamp, data, previousHash = "0") {
    this.index = index,
    this.timestamp = timestamp,
    this.data = data,
    this.previousHash = previousHash,
    this.hash  = this.calculateHash(),
    this.nonce = 0;
  }

  calculateHash() {
    const msg = this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce
    const hash = require('crypto').createHash('sha256').update(msg, 'utf8').digest('hex')
    return hash
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join(0)) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log("Block minded: " + this.hash)
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 4
  }

  createGenesisBlock() {
    const timestamp = new Date().getTime()
    return new Block(0, timestamp, {"Genesis Block": "LukSzw"}, "0")
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (currentBlock.hash !== currentBlock.calculateHash()) return false


      if (currentBlock.previousHash !== previousBlock.hash) return false

      return true
    }
  }

}


const simpleBlockchain = new Blockchain()
 simpleBlockchain.addBlock(new Block(1, new Date().getTime(), { amount: 4}))
 simpleBlockchain.addBlock(new Block(2, new Date().getTime(), { amount: 7}))
 simpleBlockchain.addBlock(new Block(3, new Date().getTime(), { amount: 10}))

console.log(JSON.stringify(simpleBlockchain, null, 4))

console.log("Is blockchain valid? " + simpleBlockchain.isChainValid())

console.log('changing block...')
simpleBlockchain.chain[1].data = { amount: 100}
console.log("Is blockchain valid? " + simpleBlockchain.isChainValid())