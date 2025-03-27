import { FastifyRequest, FastifyReply } from "fastify";

export default function getRegisterView(request: FastifyRequest, reply: FastifyReply) {
	return reply.view("register", { title: "register" });
}
