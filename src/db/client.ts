import { createClient } from "@libsql/client";

const client = createClient({
  url: 'file:./karaoke-db',
  syncUrl: process.env.FK_DB_URL,
  authToken: process.env.FK_DB_TOKEN
});

console.log(process.env)

if (process.env.DATABASE_CONNECTION_TYPE === "local-replica") {
  await client.sync();
}

export default client
