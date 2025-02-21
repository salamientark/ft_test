import path from 'node:path';
import fastifyEnv from "@fastify/env";

const schema = {
	type: "object",
	required: ["PORT", "JWT_SECRET", "COOKIE_SECRET"],
	properties: {
		PORT: {
			type: "number",
			default: "3000"
		},
		SALT_ROUNDS: {
			type: "number",
			default: "10"
		},
		JWT_SECRET: {
			type: "string",
			default: "secret"
		},
		COOKIE_SECRET: {
			type: "string",
			default: "secret_cookie"
		}
	}
};

export default schema;
