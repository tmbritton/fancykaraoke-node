import generateNonce from '../../helpers/generateNonce';
import { type APIRoute } from 'astro';
import client from '../../db/client';

export const POST: APIRoute = async ({ request }) => {
	const requestNonce = request.headers.get('X-Nonce');
	const requestTimestamp = request.headers.get('X-Timestamp');
	if (requestNonce && requestTimestamp) {
		if (requestNonce === generateNonce([requestTimestamp])) {
			try {
				await client.sync();
			} catch (e) {
				console.error(`Database sync failed: ${e}`);
				return new Response(
					JSON.stringify({
						message: 'Service unavailable'
					}),
					{ status: 503 }
				);
			}
			console.log(`Database sync successful`);
			return new Response(
				JSON.stringify({
					message: 'Database synced'
				}),
				{ status: 200 }
			);
		}
	}
	return new Response(
		JSON.stringify({
			message: 'Bad request'
		}),
		{ status: 400 }
	);
};
