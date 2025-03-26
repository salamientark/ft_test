import fastify, { FastifyInstance } from 'fastify';
import path from 'node:path';
import fastifyStatic from '@fastify/static';
import fastifyView from "@fastify/view";

import ejs from "ejs";
import routes from "./routes/routes"

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
		prefix: "/"
	});

	frontend.register(routes);

	return frontend;
};

const startServer = async (): Promise<void> => {
	try {
		initServer();
		await frontend.ready();
		frontend.listen({ host: "0.0.0.0", port: 3001 });
	} catch (err: any) {
		frontend.log.error(err);
		process.exit(1);
	}
}

startServer();
