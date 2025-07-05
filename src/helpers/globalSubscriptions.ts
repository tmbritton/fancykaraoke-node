import pubsub from './pubSub';
// pubsub is available in global space.
const subscriptions = (() => {
	const init = () => {
		pubsub.subscribe(
			'partyCreated',
			async (payload) => {
				console.log(`Party created: ${payload?.partySlug}`);
			},
			0
		);

		pubsub.subscribe(
			'queueUpdated',
			async (payload) => {
				console.log(`Queue updated: ${payload?.slug}`);
			},
			0
		);
	};

	init();
})();

export default subscriptions;
