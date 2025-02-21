import ajv from "../config/ajv.js";
import { verifyPassword } from "../config/bcrypt.js";

/**
 * @brief Return login page view
 */
export function getLoginView(request, reply) {
	return reply.view("login", { title: "Login" });
}

/**
 * @brief Login user on site and send JWT token
 *
 * Login user on site by generating and sending jwt token
 *
 * @param request Fastify request object
 * @param reply Fastify reply object
 */
export async function loginUser(request, reply) {

	const formData = await request.formData();
	const username = formData.get("username");
	const password = formData.get("password");
	const { db } = request.server;

	// Parse username and password
	const validateInput = ajv.getSchema("login");
	if (!validateInput({ username, password })) {
		return reply.code(400).send(
			validateLogin.errors
		);
	}

	// Check if user or email exist in db
	let dbUser = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);
	if (!dbUser)
		dbUser = db.prepare(`SELECT * FROM users WHERE email = ?`).get(username);
	if (!dbUser)
		return reply.code(401).send("Invalid username or password");

	if (!verifyPassword(password, dbUser.password))
		return reply.code(401).send("Invalid username or password");

	let token;
	try {
		token = request.server.jwt.sign({ email: dbUser.email, username: dbUser.username });
		console.log(token);
		console.log("In login");
	} catch(err) {
		console.log(err);
		return reply.status(500).send("Internal server error");
	}
	console.log(token);

	// Prepare response
	reply.setCookie("access_token", token, {
		path: "/",
		httpOnly: true,
		secure: true
	});
	return ({ accessToken: token });
}
