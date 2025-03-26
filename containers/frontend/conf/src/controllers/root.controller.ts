import { FastifyRequest, FastifyReply } from "fastify";
import fetch from "node-fetch";

export async function getRoot(request: FastifyRequest, reply: FastifyReply) {
	try {
		const response = await  fetch('http://pong/script/pong.js');
		if (!response.ok)
			return reply.code(404).send("Game script not found");
		const script = await response.text();
		return reply.view("pong", { title: "Pong", script: script });
	} catch (err) {
		reply.code(500).send("Internal server error");
	}
}
