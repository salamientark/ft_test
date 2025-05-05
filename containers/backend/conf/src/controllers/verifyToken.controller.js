export default async function verifyToken() {
	try {
		const token = request.cookies.access_token;
		const decoded = request.server.jwt.verify(token);
		console.log(decoded);
		return reply.code(200).send({ message: "Token is valid" });
	}
}
