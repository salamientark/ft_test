import Fastify from 'fastify';
import routes from "./routes/routes.js";
import fastifyJWT from "@fastify/jwt";

const fastify = new Fastify(
	{ logger: true }
);

const initServer = async () => {
	fastify.register(fastifyJWT, {
		secret: "supersecret",
		// secret: process.env.JWT_SECRET,
		cookie: {
			cookieName: "access_token",
			signed: false
		}
	});

	fastify.register(routes);
	
	return (fastify);
}

const startServer = async () => {
	try {
		initServer();
		await fastify.ready();
		fastify.listen({ host: "0.0.0.0", port: 3003 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

startServer();
