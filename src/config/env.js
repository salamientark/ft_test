import path from 'node:path';
import fastifyEnv from "@fastify/env";

const schema = {
	type: "object",
	required: ["PORT", "JWTSECRET"],
	properties: {
		PORT: {
			type: "number",
			default: "3000"
		},
		JWTSECRET: {
			type: "string",
			default: "secret"
		}
	}
};

export default schema;
