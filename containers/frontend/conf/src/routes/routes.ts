import { FastifyInstance } from "fastify";
// import { getRegisterView, registerUser } from "../controllers/register.controller.js";
// import { loginUser, getLoginView  } from "../controllers/login.controller.js";
// import logoutUser from "../controllers/logout.controller.js";
import { getRoot } from "../controllers/root.controller";
// import { getAllTournamentScore } from "../controllers/getScore.controller.js";
// import { saveScore } from "../controllers/saveScore.controller.js";

export default async function(fastify: FastifyInstance, options: any): Promise<void> {
	// fastify.get("/", getRoot);
	fastify.get("/", getRoot);
	// fastify.get("/root", getLogin);
	// fastify.register(
	// 	async function (authRoute) {
	// 		// Views
	// 		authRoute.get("/register", getRegisterView);
	// 		authRoute.get("/login", getLoginView);
	//
	// 		// Request
	// 		authRoute.post("/register/new", registerUser);
	// 		authRoute.post("/login", loginUser);
	// 	},
	// 	{ prefix: "/auth" }
	// );
	//
	// // Register 'secure' route
	// fastify.register(
	// 	async function (secureRoute) {
	// 		secureRoute.get("/logout", { onRequest: [fastify.authenticate] }, logoutUser);
	// 		fastify.register(
	// 			async function (blockchainRoute) {
	// 				blockchainRoute.get("/score", { onRequest: [fastify.authenticate] }, getAllTournamentScore);
	// 				blockchainRoute.post("/score", { onRequest: [fastify.authenticate] }, saveScore);
	// 			},
	// 			{ prefix: "/tournament" }
	// 		);
	// 	},
	// 	{ prefix: "/secure" }
	// )
};
