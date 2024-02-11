import { createClient } from "@libsql/client";

const client = createClient({
  url: 'file:./karaoke.db',
  syncUrl: process.env.FK_DB_URL,
  authToken: process.env.FK_DB_TOKEN
});

export default client
