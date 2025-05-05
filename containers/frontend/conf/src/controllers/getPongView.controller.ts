import { FastifyRequest, FastifyReply } from "fastify";
import fetch from "node-fetch";

function unescapeHtml(unsafe: string): string {
    return unsafe.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;|&#x60;|&#x3D;/g, function (match) {
        return ({
            '&amp;' : '&',
            '&lt;': '<',
            '&gt;': '>',
            '&#34;': '"',
            '&#39;': "'",
            '&#x2F;': '//',
            '&#x60;': '`',
            '&#x3D;': '='
        } as any)[match] || match;
    });
}

export default async function getPongView(request: FastifyRequest, reply: FastifyReply) {
	try {
		console.log("Fecthing server");
		const response = await  fetch('http://backend:3001/game/pong');
		console.log("response" + response);
		if (!response.ok)
			return reply.code(response.status).send("Game script not found");
		return reply.code(200)
		.header('Content-Security-Policy', "default-src 'self' 'unsafe-inline'")
		.view("pong", { title: "Pong" });
	} catch (err) {
		return reply.code(500).view("login", { title: "Login" });
	}
}
