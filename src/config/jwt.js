import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";
import env from "./env.js";

async function jwt(fastify, options) {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET,
	});

	fastify.decorate("authenticate", async function (request, reply) {
		try {
			await request.jwtVerify();
		} catch (err) {
			return reply.view("login", { title: "Login" });
		}
	});
};

export default fp(jwt);
