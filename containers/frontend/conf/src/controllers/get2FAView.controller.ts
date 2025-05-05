import { FastifyRequest, FastifyReply } from "fastify";

export default function get2FView(Request: FastifyRequest, reply: FastifyReply) {
	return reply.view("2fa", { title: "2FA" });
}
