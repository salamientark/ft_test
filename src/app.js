import path from "node:path";
import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import fastifyView from "@fastify/view";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
// import fastifyJwt from "@fastify/jwt";
import dbConnector from "./config/db.js";
import jwt from "./config/jwt.js";

import env from "./config/env.js";
import ejs from "ejs";
import routes from "./routes/routes.js";

const __dirname = import.meta.dirname;

// Init fastify instance
const fastify = Fastify(
	{ logger: true }
);

const options = {
	confKey: "config",
	schema: env,
	dotenv: true,
	data: process.env
};

const initServer = async () => {
	console.log(path.join(__dirname, "views"))
	await fastify.register(fastifyEnv, options);
	fastify.register(fastifyStatic, {
		root: path.join(__dirname, "public"),
		prefix: "/public/",
	});
	await fastify.register(fastifyView, {
		engine: {
			ejs,
		},
		root: path.join(__dirname, "views"),
		viewExt: "ejs",
		layout: "layout.ejs",
	});
	fastify.register(fastifyMultipart, { attachFieldsToBody: true });
	fastify.register(dbConnector);

	await fastify.register(routes);

	return fastify;
};

const startServer = async () => {
	try {
		initServer();
		await fastify.ready();
		console.log(fastify.config);
		fastify.listen({ port: process.env.PORT });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

startServer();
