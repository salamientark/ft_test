import fastify, { FastifyInstance } from 'fastify';
import path from 'node:path';
import fastifyStatic from '@fastify/static';
import fastifyView from "@fastify/view";
import fastifyHttpProxy from "@fastify/http-proxy";
import fastifyCookie from "@fastify/cookie";

import ejs from "ejs";
import routes from "./routes/routes"
import preHandler from "./config/preHandler";

/*
 * Create fastify instance
 */
const frontend: FastifyInstance = fastify({
	logger: true
});

/*
 * Register fastify plugin
 */
const initServer = async (): Promise<FastifyInstance> => {
	frontend.register(fastifyCookie, {
		secret: "my-secret", // for cookies signature
		parseOptions: {}     // options for parsing cookies
	});
	
	await frontend.register(fastifyView, {
		engine: {
			ejs,
		},
		root: path.join(__dirname, "../src/views"),
		viewExt: "ejs",
		layout: "layout.ejs",
	});

	frontend.register(fastifyStatic, {
		root: path.join(__dirname, "../src/public"),
		prefix: "/public",
	});

	frontend.register(preHandler);

	frontend.register(fastifyHttpProxy, {
		upstream: "http://backend:3001",
		prefix: "/db",
		rewritePrefix: "/db"
	});

	frontend.register(fastifyHttpProxy, {
		upstream: "http://backend:3001",
		prefix: "/game/pong/public",
		rewritePrefix: "/game/pong/public"
	});

	frontend.register(routes);

	return frontend;
};

const startServer = async (): Promise<void> => {
	try {
		initServer();
		await frontend.ready();
		frontend.listen({ host: "0.0.0.0", port: 3000 });
	} catch (err: any) {
		frontend.log.error(err);
		process.exit(1);
	}
}

startServer();
