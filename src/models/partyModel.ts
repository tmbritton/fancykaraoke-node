import client from '../db/client';

export type Party = {
  id: number,
  name: string,
  slug: string,
  created_at: string,
  last_played: string,
}

export const selectSlugCount = async (slug: string) => {
  const result = await client.execute(`SELECT COUNT(*) FROM parties WHERE slug LIKE "${slug}"`);
  return result?.rows?.[0]?.['COUNT(*)'];
}

export const insertParty = async (name: string, slug: string) => {
  const result = await client.execute(`INSERT INTO parties (name, slug) VALUES ('${name}', '${slug}')`);
  await client.sync()
  return result;
}

export const selectPartyBySlug = async(slug: string) => {
  const result = await client.execute(`SELECT * FROM parties WHERE slug="${slug}"`)
  return result
}
