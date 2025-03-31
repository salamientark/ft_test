import fastify from 'fastify';
import routes from "./routes/routes.js"
import fastifyHttpProxy from '@fastify/http-proxy';

/* Create fastify Instance */
const backend = new fastify({ logger: true });

/* Register fastify plugin */
const initServer= async () => {
	backend.register(fastifyHttpProxy, {
		upstream: "http://mysql:3004",
		prefix: "/db",
	});

	backend.register(routes);

	return (backend);
};

const startServer = async () => {
	try {
		initServer();
		await backend.ready();
		backend.listen({ host: "0.0.0.0", port: 3001 });
	} catch (err) {
		backend.log.error(err);
		process.exit(1);
	}
};

startServer();
