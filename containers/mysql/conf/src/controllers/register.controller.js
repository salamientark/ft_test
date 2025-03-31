import ajv from "../config/ajv.js";
import { hashPassword } from "../config/bcrypt.js";

export default async function registerUser(request, reply) {
	const formData = await request.formData()
	const email = formData.get("email");
	const username = formData.get("username");
	const password = formData.get("password");
	const confirm_password = formData.get("confirm_password");
	const { db } = request.server;
	const registerStatement = db.prepare(`
		INSERT INTO users (username, password, email) VALUES (?, ?, ?);
	`);

	// Verify user input
	const validateInput = ajv.getSchema("register");
	if (!validateInput({ email, username, password, confirm_password })) {
		return reply.status(400).send(validateInput.errors);
	}
	// Check password match
	if (password !== confirm_password) {
		return reply.status(400).send("Password don't match");
	}
	// Check if user or email already exist
	if (db.prepare(`SELECT email FROM users WHERE email = ?;`).all(email).length > 0) {
		return reply.code(400).send("Email adress already in use");
	}
	if (db.prepare(`SELECT username FROM users WHERE username = ?;`).all(username).length > 0) {
		return reply.code(400).send("Username already taken");
	}

	// Hash password and register user
	try {
		const hashedPassword = await hashPassword(password);
		registerStatement.run(username, hashedPassword, email);
		reply.status(200).send("User registered");
	} catch (error) {
		console.log(error);
		return reply.code(500).send("Internal server error");
	}
};
