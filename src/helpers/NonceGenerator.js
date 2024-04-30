import crypto from 'crypto';

class NonceGenerator {
  constructor() {
    this.secret = process.env.FK_NONCE_SECRET;
    //console.log(`Secret: ${process.env.FK_NONCE_SECRET} Length: ${process.env.FK_NONCE_SECRET.length}`);
    //this.secret = 'foo';
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