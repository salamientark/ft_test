import fetch from "node-fetch"

export default async function verifyToken(request, reply) {
	try {
		console.log(request.body);
		console.log(request.body.token);
		const token = request.body.token;
		if (!token)
			throw new Error("No token found");
		const decoded = request.server.jwt.verify(token);
		console.log("Decoded token: ", decoded);

		/* Check for invalid/expired token */

		/* Request on db to check if user exist */

		

	} catch (err) {
		console.log(err);
		if (err.name === 'TokenExpiredError') {
			reply.code(401).send("Token expired");
		} else {
			reply.code(500).send("Invalid jwt token"); // TODO: Change error code
		}
	}
}
