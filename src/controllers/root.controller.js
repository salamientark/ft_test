// import slugify from "slugify";
// import Ajv from "ajv";

export function getRoot(request, reply) {
	console.log(reply);
	return reply.send({ hello: "World" });
}

export function getLogin(request, reply) {
	return reply.view("login", { title: "Login" });

}
