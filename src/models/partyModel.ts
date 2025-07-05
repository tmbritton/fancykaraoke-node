import client from '../db/client';

export type Party = {
	id: number;
	name: string;
	slug: string;
	created_at: string;
	last_played: string;
};

export const selectSlugCount = async (slug: string): Promise<number> => {
	const result = await client.execute({
		sql: 'SELECT COUNT(*) FROM parties WHERE slug LIKE ?',
		args: [`${slug}%`]
	});
	return result?.rows?.[0]?.['COUNT(*)'] as number;
};

export const insertParty = async (name: string, slug: string) => {
	const result = await client.execute(
		`INSERT INTO parties (name, slug) VALUES ('${name}', '${slug}')`
	);
	return result;
};

export const selectPartyBySlug = async (slug: string): Promise<Party | null> => {
	const result = await client.execute({
		sql: 'SELECT * FROM parties WHERE slug = ?',
		args: [slug]
	});
	return (result.rows[0] as unknown as Party) || null;
};

export const getPartyIdFromSlug = async (slug: string) => {
	const result = await client.execute({
		sql: 'SELECT id from parties WHERE slug = ?',
		args: [slug]
	});
	return result?.rows?.[0]?.id as number;
};
