import crypto from 'crypto';

class NonceGenerator {
  constructor() {
    this.secret = process.env.FK_NONCE_SECRET;
    if (!this.secret) {
      throw new Error('Secret is not set. Please provide a valid secret.');
    }
  }

  generateNonce(values) {
    const vals = [...values, this.secret];
    vals.sort();

    let hash = crypto.createHash('sha256');
    const valuesString = vals.join('U');

    hash.update(valuesString);
    const generatedNonce = hash.digest('hex');

    hash = null;
    return generatedNonce;
  }
}

const nonceGeneratorInstance = new NonceGenerator();
export default nonceGeneratorInstance;