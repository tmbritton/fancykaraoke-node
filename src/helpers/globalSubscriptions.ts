import pubsub from "./pubSub";
import client from "../db/client";
// pubsub is available in global space.
const subscriptions = (() => {
  const init = () => {
    pubsub.subscribe('createPartyFormLoad', async () => {
      console.log('Create party form loaded');
      await client.sync();
    }, 0);

    pubsub.subscribe('partyCreated', async (payload) => {
      console.log(`Party created: ${payload?.partySlug}`)
      await client.sync();
    }, 0);

    pubsub.subscribe('queueUpdated', async (payload) => {
      console.log(`Queue updated: ${payload?.slug}`)
      await client.sync();
    }, 0)
  };

  init();
})()

export default subscriptions
