import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import fetch from "node-fetch";
import fp from "fastify-plugin";

async function jwtHandler(fastify: FastifyInstance, options: FastifyPluginOptions) {
	fastify.decorate("authenticate",
			async function (request: FastifyRequest, reply: FastifyReply) {
		try {
			const	token_header = request.headers["access-token"];
			if (!token_header)
				throw new Error("No token provided");

			// Send token to the jwt server
			const response = await fetch("http://jwt:3003/verify",
			{
				method: "POST",
				body: JSON.stringify({
					token: token_header
				}),
			});

			if (response.status == 400)
				throw new Error("Invalid token");
			if (!response.ok)
				throw new Error("Invalid token or internal server error");
			if (response.status != 200)
				throw new Error("Invalid token");
			// Depending on server response continue or throw error

		} catch (err) {
			console.log(err);
			return reply.view("login", { title: "Login" });
		}

	});
};

export default fp(jwtHandler);
