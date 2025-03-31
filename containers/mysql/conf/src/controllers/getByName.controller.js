export default async function getByName(request, reply) {
	const { name } = request.params;
	const { db } = request;
	const user = db.prepare("SELECT * FROM users WHERE username = ?").get(name);
	if (!user) {
		return reply.code(404).send({ message: "User not found" });
	}
	console.log(JSON.stringify(user));
	return reply.code(200).send(user);
}
