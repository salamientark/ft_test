import login from "../controllers/login.controller.js";
import verify from "../controllers/verify.controller.js";

export default async function routes(fastify, options) {
	fastify.post("/login", login);
	fastify.post("/verify", verify)
}
