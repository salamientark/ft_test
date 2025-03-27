import fetch from 'node-fetch';

export default async function getGame(request. reply) {
	try {
		/* Prasing + Error check to implement */
		

		console.log("Fetching game");
		const response = await  fetch('http://pong:3002/');
		if (!response.ok)
			return reply.code(404).send("Game script not found");
		console.log("Fetching game");
		reply.header('Content-Type', 'application/javascript');
		return reply.code(200).send(await response.text());
		} catch (err) {
			reply.code(500).send("Internal server error");
		}

	}
}
