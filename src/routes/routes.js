import { getRegisterView, registerUser } from "../controllers/register.controller.js";
import { loginUser, getLoginView  } from "../controllers/login.controller.js";
import { getRoot } from "../controllers/root.controller.js";

export default async function routes(fastify, options) {
	// fastify.get("/", getRoot);
	fastify.get("/", getLoginView);
	// fastify.get("/root", getLogin);
	fastify.register(
		async function (authRoute) {
			// Views
			authRoute.get("/register", getRegisterView);
			authRoute.get("/login", getLoginView);

			// Request
			authRoute.post("/register/new", registerUser);
		},
		{ prefix: "/auth" }
	);
};
