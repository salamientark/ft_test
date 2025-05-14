import path from "node:path";
import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import fastifyView from "@fastify/view";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import fastifyProxy from "fastify-http-proxy";

import dbConnector from "./config/db.js";
import web3Connector from "./config/web3.js";
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
	
	// cookies
	fastify.register(fastifyCookie, {
		secret: process.env.COOKIE_SECRET,
		// hook: "preHandler"
	});
	// jwt
	fastify.register(jwt);

	// web3
	fastify.register(web3Connector);

	await fastify.register(routes);

	/* PROXYING */
	fastify.register(fastifyProxy, {
		upstream: process.env.FRONTEND_URL,
		prefix: '/pong',
		httpMethods: ['GET']
	});

	return fastify;
};

const startServer = async () => {
	try {
		initServer();
		await fastify.ready();
		console.log(fastify.config);
		fastify.listen({ host: "0.0.0.0", port: process.env.PORT });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

startServer();
