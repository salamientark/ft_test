import { FastifyRequest, FastifyReply } from "fastify";

/**
 * @brief Return login page view
 */
export default function getLoginView(request: FastifyRequest, reply: FastifyReply) {
	return reply.view("login", { title: "Login" });
}
