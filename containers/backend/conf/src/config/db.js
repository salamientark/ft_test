import fp from "fastify-plugin";
import Database from "better-sqlite3";
import env from "./env.js";

async function dbConnector(fastify, options) {
	const dbFile = env.DBFILE || "./user.db";
	const db = new Database(dbFile, { verbose: console.log });

	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			username TEXT PRIMARY KEY,
			password TEXT NOT NULL,
			email TEXT NOT NULL
		);`
	);

	fastify.decorate("db", db);

	fastify.addHook("onClose", (fastify, done) => {
		db.close();
		done();
	});
	console.log("Database connected");
};

export default fp(dbConnector);
