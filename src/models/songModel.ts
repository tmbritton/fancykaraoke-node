import client from '../db/client';

export type Song = {
  id: number,
  title: string,
  artist: string,
  uploader: string,
  youtube_id: string,
  created_at: string
}

export const selectSongById = async (id: string | number): Promise<Song | undefined> => {
  try {
    const result = await client.execute({
      sql: "select * from songs where id = :id",
      args: { id }
    });
    return result.rows[0] as unknown as Song | undefined;
  } catch (e) {
    console.error(e);
  }
};

export const querySongs = async (searchTerm: string, limit = 10): Promise<Song[] | undefined> => {
  try {
    // Split the search string into keywords
    const keywords = searchTerm.split(/\s+/).map(keyword => `%${keyword.trim()}%`);
    const result = await client.execute({
      sql: "SELECT * FROM songs WHERE title LIKE :searchTerm OR artist LIKE :searchTerm LIMIT :limit",
      args: { searchTerm: `%${searchTerm}%`, limit }
    });

    return result.rows as unknown as Song[] | undefined;;
  } catch (e) {
    console.error(e);
  }
};

/*
export const querySongs = async (searchTerm: string, limit = 10): Promise<Song[] | undefined> => {
  //await client.sync()
  try {
    const result = await client.execute({
      sql: `
        SELECT
          id,
          title,
          artist,
          youtube_id,
          rank
        FROM song_fts
        WHERE song_fts MATCH :searchTerm
        ORDER BY rank DESC
        LIMIT :limit
      `,
      args: [searchTerm, limit]
    });
    console.log(result)
    return result.rows as unknown as Song[] | undefined;
  } catch (e) {
    console.error(e);
  }
};
*/
