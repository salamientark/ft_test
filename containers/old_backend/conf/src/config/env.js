import path from 'node:path';
import fastifyEnv from "@fastify/env";

const schema = {
	type: "object",
	required: ["PORT", "JWT_SECRET", "COOKIE_SECRET", "RPC_URL",
		"WALLET_OWNER_PRIVATE_KEY", "FRONTEND_URL"],
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
		},
		RPC_URL: {
			type: "string"
		},
		WALLET_OWNER_PRIVATE_KEY: {
			type: "string",
		},
		FRONTEND_URL {
			type: "string",
		}
	}
};

export default schema;
