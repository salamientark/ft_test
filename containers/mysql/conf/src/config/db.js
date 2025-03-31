import fp from "fastify-plugin";
import Database from "better-sqlite3";

async function dbConnector(fastify, options) {
	const dbFile = "./db/user.db";
	const db = new Database(dbFile, { verbose: console.log });

	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			username TEXT PRIMARY KEY,
			email TEXT NOT NULL,
			password TEXT NOT NULL
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
