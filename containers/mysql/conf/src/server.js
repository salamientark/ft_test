import Fastify from 'fastify';
import fastifyMultipart from "@fastify/multipart";
import dbConnector from "./config/db.js";
import routes from "./routes/routes.js";

const fastify = new Fastify(
	{ logger: true }
);

const initServer = async () => {
	fastify.register(dbConnector);

	fastify.register(fastifyMultipart, { attachFieldsToBody: true });

	fastify.register(routes);
	
	return (fastify);
}

const startServer = async () => {
	try {
		initServer();
		await fastify.ready();
		fastify.listen({ host: "0.0.0.0", port: 3004 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

startServer();
