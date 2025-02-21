import { getRegisterView, registerUser } from "../controllers/register.controller.js";
import { loginUser, getLoginView  } from "../controllers/login.controller.js";
import logoutUser from "../controllers/logout.controller.js";
import { getRoot } from "../controllers/root.controller.js";

export default async function routes(fastify, options) {
	// fastify.get("/", getRoot);
	fastify.get("/", { onRequest: [fastify.authenticate] }, getRoot);
	// fastify.get("/root", getLogin);
	fastify.register(
		async function (authRoute) {
			// Views
			authRoute.get("/register", getRegisterView);
			authRoute.get("/login", getLoginView);

			// Request
			authRoute.post("/register/new", registerUser);
			authRoute.post("/login", loginUser);
		},
		{ prefix: "/auth" }
	);

	// Register 'secure' route
	fastify.register(
		async function (secureRoute) {
			secureRoute.get("/logout", { onRequest: [fastify.authenticate] }, logoutUser);
		},
		{ prefix: "/secure" }
	)
};
