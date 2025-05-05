import getRoot from "../controllers/root.controller.js";
import getGame from "../controllers/game.controller.js";

export default async function routes(fastify, options) {
	fastify.get("/", getRoot);

	fastify.get("/game/pong",getGame);
}
