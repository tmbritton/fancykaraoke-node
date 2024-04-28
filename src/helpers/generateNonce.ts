import crypto from 'crypto';

/**
 * Generate a nonce from array of values.
 * @param values array of values to be used to generate hash
 * @returns
 */
const generateNonce = (values: string[]) => {
	const secret = process.env.FK_NONCE_SECRET || crypto.randomBytes(32).toString('hex');
	const hash = crypto.createHash('sha256');
	values.unshift(secret);
	hash.update(values.join('U'));
	return hash.digest('hex');
};

export default generateNonce;
