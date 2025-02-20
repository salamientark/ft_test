import Ajv from "ajv"; // Data validator

const ajv = new Ajv();

// Define schema for login
const loginSchema = {
	type: "object",
	properties: {
		username: {
			type: "string",
			minLength: 3,
			maxLength: 25,
			pattern: "^[a-zA-Z0-9]+(?:[ _-][a-zA-Z0-9]+)*$",
		},
		password: {
			type: "string",
			minLength: 8,
			maxLength: 100,
			pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])",
		},
	},
	required: ["username", "password"],
	additionalProperties: false,
}

const validateLogin = ajv.compile(loginSchema);

export function getLoginView(request, reply) {
	return reply.view("login", { title: "Login" });
}

// LogIn the user to his acount
export function loginUser(request, reply) {
	console.log(request.body);
	const { username, password } = request.body;

	console.log(username, password);

	const validInput = validateLogin({ username, password });
	if (!validInput) {
		return reply.code(400).send(
			validateLogin.errors
		);
	}

	const { db } = request.server;
	const getUserStatement = db.prepare(`
		SELECT * FROM users WHERE username = ?;
		`);
	// Parse username and password ???
	
	const user = getUserStatement.get(username);
	if (!user) {
		return reply.code(401).send("Invalid username or password");
	}
	if (user.password !== password) {
		return reply.code(401).send("Invalid username or password");
	}
	
	console.log("Succesful login");

	// Check is user exist in database
	
}
