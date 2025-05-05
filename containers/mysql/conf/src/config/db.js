import fp from "fastify-plugin";
import Database from "better-sqlite3";

async function dbConnector(fastify, options) {
	const dbFile = "./db/user.db";
	const db = new Database(dbFile, { verbose: console.log });

	// Create users table
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT,
			email TEXT NOT NULL,
			password TEXT NOT NULL
		);
	`);

	// Create 2fa table
	db.exec(`
		CREATE TABLE IF NOT EXISTS twofa (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL,
			code INTEGER NOT NULL,
			created_at INTEGER NOT NULL,
			expires_at INTEGER NOT NULL
		);
	`);

	fastify.decorate("db", db);

	fastify.addHook("onClose", (fastify, done) => {
		db.close();
		done();
	});
	console.log("Database connected");
}

export default fp(dbConnector);
