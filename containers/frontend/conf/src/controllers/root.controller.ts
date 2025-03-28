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

export default async function getRoot(request: FastifyRequest, reply: FastifyReply) {
	try {
		console.log("Fecthing server");
		const response = await  fetch('http://backend:3001/');
		console.log("response" + response);
		if (!response.ok)
			return reply.code(404).send("Game script not found");
		const	scriptBuffer = await response.text();
		const	script = unescapeHtml(scriptBuffer.toString());
		console.log(script);
		return reply.view("pong", { title: "Pong", script: unescapeHtml(script) });
	} catch (err) {
		return reply.code(500).view("login", { title: "Login" });
	}
}
