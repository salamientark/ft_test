export default async function logoutUser(request, reply) {
	reply.clearCookie("access_token");
	return reply.status(200)
		.view("login", { title: "Login" });
}
