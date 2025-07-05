import { createClient } from '@libsql/client';

const client = createClient({
	url: process.env.FK_DB_URL,
	authToken: process.env.FK_DB_TOKEN
});

export default client;
