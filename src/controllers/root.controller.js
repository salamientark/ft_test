// import slugify from "slugify";
// import Ajv from "ajv";

export function getRoot(request, reply) {
	return reply.view("game", { title: "Game" });
}
