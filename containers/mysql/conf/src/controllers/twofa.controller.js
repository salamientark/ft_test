import fetch from "node-fetch";

export default async function twofa(request, reply) {
	try {
		// Check 2fa Code
		const formData = await request.formData();
		const code = formData.get("2fa-code");
		const { db } = request.server;

		console.log("Code received:", code);

		if (!code || code.length !== 6)
			return reply.code(400).send("Invalid code");

		const dbRow = db.prepare(`
			SELECT * FROM twofa WHERE code = ?
		`).get(code);
		if (!dbRow)
			return reply.code(401).send("Invalid code");
		if (dbRow.expires_at < Date.now())
			return reply.code(401).send("Code expired");
		console.log("Code valid");

		// Get user
		const dbUser = db.prepare(`
			SELECT * FROM users WHERE id = ?
		`).get(dbRow.user_id);
		if (!dbUser)
			return reply.code(401).send("Invalid user");

		// If valid request jwt token + remove token from db
		/* Fetch token from JWT */
		const	response = await fetch('http://jwt:3003/login', {
			method: 'POST',
			body: JSON.stringify({ email: dbUser.email, username: dbUser.username }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log(data);
		const	token = data.token;
		console.log(token);

		// If success send it back to user
		return reply
		.setCookie("access_token", token, {
			path: "/",
			secure: true,
			httpOnly: true,
			sameSite: true
		})
		.code(200).send();
	
	} catch (error) {
		console.error("Error in 2fa controller:", error);
		reply.code(500).send("Internal Server Error");
	}
};
