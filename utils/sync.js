import axios from 'axios';
import nonceGenerator from '../src/helpers/NonceGenerator.js';

const main = async () => {
  const timestamp = Date.now().toString();
  const nonce = nonceGenerator.generateNonce([timestamp]);
  const url = 'https://fancykaraoke-node.fly.dev/api/sync';

  axios.post(url, {}, {
    headers: {
      'X-Nonce': nonce,
      'X-Timestamp': timestamp
    }
  })
  .then(res => /*console.log(res)*/()=>{})
  .catch(e => /*console.error(e)*/()=>{});
};

main()
