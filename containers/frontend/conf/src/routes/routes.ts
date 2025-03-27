import { FastifyInstance } from "fastify";
// import { getRegisterView, registerUser } from "../controllers/register.controller.js";
import getLoginView from "../controllers/getLoginView.controller";
import getRegisterView from "../controllers/getRegisterView.controller";
// import logoutUser from "../controllers/logout.controller.js";
import getRoot from "../controllers/root.controller";
// import { getAllTournamentScore } from "../controllers/getScore.controller.js";
// import { saveScore } from "../controllers/saveScore.controller.js";

export default async function(fastify: FastifyInstance, options: any): Promise<void> {
	fastify.get("/", getRoot);
	// fastify.get("/root", getLogin);
	fastify.register(
		async function (authRoute) {
			// Views
			authRoute.get("/register", getRegisterView);
			authRoute.get("/login", getLoginView);

			// Request
			// authRoute.post("/register", registerUser);
			// authRoute.post("/login", loginUser);
		},
		{ prefix: "/auth" }
	);
};
