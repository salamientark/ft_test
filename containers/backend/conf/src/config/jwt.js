import fastifyJwt from '@fastify/jwt';
import fastifyPlugin from 'fastify-plugin';

async function jwt(fastify, options) {
	fastify.register(fastifyJwt, {
		secret: "secret",
		cookie: {
			cookieName: "access_token",
			signed: false
		}
	});

	// fastify.decorate("authenticate",
	// );
}
