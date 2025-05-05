import { FastifyInstance } from "fastify";
// import { getRegisterView, registerUser } from "../controllers/register.controller.js";
import getRoot from "../controllers/root.controller";
import getLoginView from "../controllers/getLoginView.controller";
import get2FAView from "../controllers/get2FAView.controller";
import getRegisterView from "../controllers/getRegisterView.controller";
import getPongView from "../controllers/getPongView.controller";

import registerUser from "../controllers/register.controller";
// import logoutUser from "../controllers/logout.controller.js";
// import { getAllTournamentScore } from "../controllers/getScore.controller.js";
// import { saveScore } from "../controllers/saveScore.controller.js";

export default async function(fastify: FastifyInstance, options: any): Promise<void> {
	fastify.get("/", { onRequest: [fastify.authenticate] }, getRoot);
	// fastify.get("/root", getLogin);
	fastify.register(
		async function (authRoute) {
			// Views
			authRoute.get("/register", getRegisterView);
			authRoute.get("/login", getLoginView);
			authRoute.get("/2fa", get2FAView);

			// Request
			// authRoute.post("/register", registerUser);
			// authRoute.post("/login", loginUser);
		},
		{ prefix: "/auth" }
	);

	fastify.get("/game/pong", { onRequest: [fastify.authenticate] }, getPongView);

	// fastify.register(
	// 	async function (dbRoute) {
	// 		// Views
	// 		dbRoute.post("/register", registerUser);
	// 		// dbRoute.post("/login", getLoginView);
	//
	// 		// Request
	// 		// authRoute.post("/register", registerUser);
	// 		// authRoute.post("/login", loginUser);
	// 	},
	// 	{ prefix: "/db" }
	// );
};
