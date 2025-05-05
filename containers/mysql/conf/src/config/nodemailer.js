import fp from "fastify-plugin";
import nodemailer from "nodemailer";

async function nodemailerConnector(fastify, options) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: "mppd.42.transcendence@gmail.com",
			pass: "txcj prjh exya uuop"
			// user: process.env.GMAIL_USER,
			// pass: process.env.GMAIL_PASS,
		}
	});

	fastify.decorate("mailer", transporter);
};

export default fp(nodemailerConnector);
