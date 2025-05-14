export async function getAllTournamentScore() {
	console.log("Getting tournament score...");

	const result = await this.smart_contract.methods.getAllTournamentScore().call();

	console.log("result:", result);
}
