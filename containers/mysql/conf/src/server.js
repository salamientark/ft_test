import Fastify from 'fastify';
import fastifyMultipart from "@fastify/multipart";
import fastifyCookie from "@fastify/cookie";
import dbConnector from "./config/db.js";
import mailConnector from "./config/nodemailer.js";
import routes from "./routes/routes.js";

const fastify = new Fastify(
	{ logger: true }
);

const initServer = async () => {
	fastify.register(dbConnector);

	fastify.register(fastifyMultipart, { attachFieldsToBody: true });

	fastify.register(fastifyCookie, {
		secret: "cookie"
		// secret: process.env.COOKIE_SECRET,
	});

	fastify.register(mailConnector);

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
