import { FastifyRequest, FastifyReply } from "fastify";
import getPongView from "./getPongView.controller";
import fetch from "node-fetch";

export default async function getRoot(request: FastifyRequest, reply: FastifyReply) {
	try {
		/* Check token validity */
		// if ( )
		return getPongView(request, reply);
		// return reply.code(200).view("login", { title: "Login" });
	} catch (err) {
		return reply.code(500).view("login", { title: "Login" });
	}
}
