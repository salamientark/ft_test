import ajv from "../config/ajv.js";

export function getRegisterView(request, reply) {
	return reply.view("register", { title: "register" });
}

export async function registerUser(request, reply) {
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
	console.log("Registering user");

	// Check for already existing user
	
	registerStatement.run(username, password, email);
	reply.status(200).send("User registered");
	// return reply.view("login", { title: "Login" });
	// return reply.redirect("/", 200);
};
