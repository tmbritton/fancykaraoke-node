import NonceGenerator from './NonceGenerator';

export type ERROR_TYPE = 'HONEYPOT' | 'NONCE' | 'DATABASE' | 'TIMESTAMP' | 'NONE'


export default (data: FormData): ERROR_TYPE => {
  let error: ERROR_TYPE = 'NONE';

  const honeypot = data.get('email');
  if (honeypot) {
    error = 'HONEYPOT';
  }

  if (error === 'NONE') {
    const nonce = data.get('nonce');
    const timestamp = data.get('timestamp');

    const checkNonce = NonceGenerator.generateNonce([timestamp]);
    if (nonce !== checkNonce) {
      error = 'NONCE';
    }
  }

  if (error === 'NONE') {
    const timestamp = data.get('timestamp') as unknown as number;

    // Validate user has spent at least three seconds on the form.
    if (Date.now() - timestamp < 3000)  {
      error = 'TIMESTAMP';
    }
  }

  return error;
}