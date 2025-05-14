export async function saveScore(request, reply) {
	console.log("Saving score...");
	
	const tournamentData = await request.formData();
	console.log(tournamentData);
	const playerOneName = tournamentData.get("player-one-name");
	const playerTwoName = tournamentData.get("player-two-name");
	const playerOneScore = tournamentData.get("player-one-score");
	const playerTwoScore = tournamentData.get("player-two-score");
	const { db } = request.server;

	// TODO: Verify input
	
	const saveScoreResponse = await request.server.smart_contract.methods.addScore(playerOneName, playerTwoName, playerOneScore, playerTwoScore, playerOneName).send({ from: request.server.account });

	console.log("saveScoreResponse:", saveScoreResponse);
}
