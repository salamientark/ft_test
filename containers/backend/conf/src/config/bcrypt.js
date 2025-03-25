import bcrypt from "bcrypt";

export async function hashPassword(plainPassword) {
	try {
		const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS);
		const hashedPassword = await bcrypt.hash(plainPassword, salt);
		return hashedPassword;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export async function verifyPassword(plainPassword, hashedPassword) {
	try {
		const match = await bcrypt.compare(plainPassword, hashedPassword);
		if (match)
			return true;
		return false;
	} catch (error) {
		console.log(error);
		throw error;
	}
}
