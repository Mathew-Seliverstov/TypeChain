import * as CryptoJS from 'crypto-js'
import * as fs from 'fs'


class Block {
	public id: number
	public hash: string
	public previousHash: string
	public data: string
	public timestamp: number

	static calculateBlockHash = (id: number, previousHash: string, data: string, timestamp: number): string => {
		return CryptoJS.SHA256(id + previousHash + data + timestamp).toString()
	}

	static validateStructure = (aBlock: Block): boolean => {
		return typeof aBlock.id === 'number' && typeof aBlock.hash === 'string' && typeof aBlock.previousHash === 'string' && typeof aBlock.data === 'string' && typeof aBlock.timestamp === 'number'
	}

	constructor(id: number, hash: string, previousHash: string, data: string, timestamp: number) {
		this.id = id
		this.hash = hash
		this.previousHash = previousHash
		this.data = data
		this.timestamp = timestamp
	}
}

const genesisBlock: Block = new Block(0, "db4d08d95b5af9aac17575e96e78dade418033d1f4f6bd4b87d3bef6fc883f14", "", "TypeChain", 1641449227)
let blockchain: [Block] = [genesisBlock]

const getBlockchain = (): [Block] => blockchain
const getLastBlock = (): Block => blockchain[blockchain.length - 1]
const getTimestamp = (): number => Math.round(new Date().getTime() / 1000)

const createNewBlock = (data: string): Block => {
	const lastBlock: Block = getLastBlock()
	const previousHash: string = lastBlock.hash
	const id: number = lastBlock.id + 1
	const timestamp: number = getTimestamp()
	const hash: string = Block.calculateBlockHash(id, previousHash, data, timestamp)
	const newBlock: Block = new Block(id, hash, previousHash, data, timestamp)

	addBlock(newBlock)
	return newBlock
}

const getHashForBlock = (aBlock: Block): string => Block.calculateBlockHash(aBlock.id, aBlock.previousHash, aBlock.data, aBlock.timestamp)

const isBlockValid = (candidateBlock: Block, lastBlock: Block): boolean => {
	if(!Block.validateStructure(candidateBlock)) {
		return false
	} else if(lastBlock.id + 1 !== candidateBlock.id) {
		return false
	} else if (lastBlock.hash !== candidateBlock.previousHash) {
		return false
	} else if (candidateBlock.hash !== getHashForBlock(candidateBlock)) {
		return false
	}
	return true
}

const addBlock = (candidateBlock: Block): void => {
	if(isBlockValid(candidateBlock, getLastBlock())) {
		blockchain.push(candidateBlock)
	}
}

const downloadBlockchain = (): void => {
	fs.writeFileSync('blockchain.json', JSON.stringify(blockchain, null, 2))
}

createNewBlock('First block')
createNewBlock('Second block')
downloadBlockchain()
