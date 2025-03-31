// import getByName from "../controllers/getByName.controller.js";
import registerUser from "../controllers/register.controller.js";

export default async function routes(fastify, options) {
	fastify.post("/register", registerUser);
}
