// import getByName from "../controllers/getByName.controller.js";
import registerUser from "../controllers/register.controller.js";
import login from "../controllers/login.controller.js";
import twofa from "../controllers/twofa.controller.js";

export default async function routes(fastify, options) {
	fastify.post("/register", registerUser);
	fastify.post("/login", login);
	fastify.post("/2fa", twofa);
}
