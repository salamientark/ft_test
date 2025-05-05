/**
 * @brief Login user on site and send JWT token
 *
 * Login user on site by generating and sending jwt token
 *
 * @param request Fastify request object
 * @param reply Fastify reply object
 */
export default async function login(request, reply) {
	try {
		const	body = request.body;
		console.log(body);
		// const	json = json.parse(body);
		// console.log(json);
		const	token = request.server.jwt.sign({ email: body.email, username: body.username, expiresIn: '1h' });
		console.log(token);
		return reply.code(200).send({ token: token });
	} catch (err) {
		reply.code(500).send({ error: "Internal Server Error" });
	}
}
