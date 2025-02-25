import { Web3 } from "web3";
import { Contract } from "web3-eth-contract";
import fp from "fastify-plugin";
import contract_abi from "../config/web3/contracts/Tournament.json" with { type: "json" };

async function web3Connector(fastify, options) {
	const web3Client = new Web3(process.env.RPC_URL);
	console.log(process.env.WALLET_OWNER_PRIVATE_KEY);
	
	// const contractAddress = "0x8db97c7cece249c2b98bdc0226cc4c2a57bf52fc";
	const contractAddress = "0x4Ac1d98D9cEF99EC6546dEd4Bd550b0b287aaD6D";
	const account = web3Client.eth.accounts.wallet.add(process.env.WALLET_OWNER_PRIVATE_KEY);
	const userAddress = account[0].address;

	const contract = new web3Client.eth.Contract(contract_abi.abi, contractAddress);
	console.log(contract);

	fastify.decorate("web3_client", web3Client);
	fastify.decorate("account", userAddress);
	fastify.decorate("smart_contract", contract);
}

export default fp(web3Connector);
