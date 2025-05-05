import login from "../controllers/login.controller.js";

export default async function routes(fastify, options) {
	fastify.post("/login", login);
}
