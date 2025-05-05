import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import path from 'node:path';
import fastifyStatic from '@fastify/static';

/*
 * Create fastify instance
 */
const pong: FastifyInstance = fastify({
	logger: true
})

/*
 * Register fastify plugin
 */
pong.register(fastifyStatic, {
	root: path.join(__dirname, "../src/public"),
	prefix: "/"
});


pong.get('/public/pong.js', (request: FastifyRequest, reply: FastifyReply) => {
	console.log(__dirname);
	console.log("pong");
	// return reply.sendFile("../src/public/pong.js");
	return reply.header('Cache-Control', 'no-cache').sendFile("pong.js");
});

pong.listen({ host: '0.0.0.0', port: 3002 }, (err: Error | null, address: string) => {
	if (err) {
		pong.log.error(err);
		process.exit(1);
	}
	pong.log.info("Server listening on ${address}");
});
