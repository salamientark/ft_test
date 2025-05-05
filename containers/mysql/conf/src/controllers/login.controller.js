import ajv from "../config/ajv.js";
import { verifyPassword } from "../config/bcrypt.js";
import fetch from 'node-fetch';
import { randomInt } from 'crypto';

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
		const formData = await request.formData();
		const username = formData.get("username");
		const password = formData.get("password");
		const { db, mailer } = request.server;

		// Parse username and password
		const validateInput = ajv.getSchema("login");
		if (!validateInput({ username, password }))
			return reply.code(400).send(validateInput.errors);

		// Check if user or email exist in db
		let dbUser = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);
		if (!dbUser)
			dbUser = db.prepare(`SELECT * FROM users WHERE email = ?`).get(username);
		if (!dbUser)
			return reply.code(401).send("Invalid username or password");

		if (!verifyPassword(password, dbUser.password))
			return reply.code(401).send("Invalid username or password");

		/* Generate 2fa CODE */
		// db.exec(`
		// 	CREATE TABLE IF NOT EXISTS twofa (
		// 		id INTEGER PRIMARY KEY AUTOINCREMENT,
		// 		user_id INTEGER NOT NULL,
		// 		code INTEGER NOT NULL,
		// 		created_at INTEGER NOT NULL,
		// 		expires_at INTEGER NOT NULL
		// 	);
		// `);
		const code = randomInt(0, 999999);
		console.log(code);
		
		/* Storing it in db */
		console.log(dbUser);
		db.prepare(`
			INSERT INTO twofa (user_id, code, created_at, expires_at) VALUES (?, ?, ?, ?)
			`).run(dbUser.id, code, Date.now(), Date.now() + 5 * 60 * 1000);
		console.log("Inserted into db");

		console.log("Checking insertion");
		const tmp = db.prepare(`
					SELECT * FROM twofa WHERE user_id = ? AND code = ?
				`).all(dbUser.id, code);
		console.log(tmp);

		/* Sending it to user */
		const mailOptions = {
			from: 'youremail@gmail.com',
			to: dbUser.email,
			subject: '2fa code',
			text: code.toString().padStart(6, '0')
		};
		mailer.sendMail(mailOptions, function(err, info) {
			if (err) {
				console.log(err);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
		console.log("Email sent");


		/* Fetch token from JWT */
		// const	response = await fetch('http://jwt:3003/login', {
		// 	method: 'post',
		// 	body: JSON.stringify({ email: dbUser.email, username: dbUser.username }),
		// 	headers: { 'Content-Type': 'application/json' }
		// });
		// if (!response.ok) {
		// 	throw new Error(`HTTP error! status: ${response.status}`);
		// }
		//
		// const data = await response.json();
		// console.log(data);
		// const	token = data.token;
		// console.log(token);
		//
		// // Prepare response
		return reply
		// .setCookie("access_token", token, {
		// 	path: "/",
		// 	secure: true,
		// 	httpOnly: true,
		// 	sameSite: true
		// })
		.code(200).send();
	} catch(err) {
		console.log(err);
		return reply.status(500).send("Internal server error");
	}
}
