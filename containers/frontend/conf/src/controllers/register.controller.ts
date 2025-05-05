import { FastifyRequest, FastifyReply } from 'fastify';
import fetch from 'node-fetch';

export default async function register(request: FastifyRequest, reply: FastifyReply) {
	try {
		const response = await fetch('http://backend:3001/db/register', {
			method: 'POST',
			body: JSON.stringify(request.body),
			headers: { 'Content-Type': 'application/json' },
		});
		if (!response.ok)
			return reply.code(response.status).send("Registration failed");
		const	data = await response.text();
		return reply.code(response.status).send(data);
	} catch (err) {
		console.error(err);
		reply.code(500).send('Internal server error');
	}
};
