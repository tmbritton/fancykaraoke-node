import client from './client'

export type Song = {
  id: number,
  title: string,
  artist: string,
  uploader: string,
  youtube_id: string,
  created_at: string
}

export const getSongById = async (id: string | number): undefined | Song => {
  try {
    const result = await client.execute({
      sql: "select * from songs where id = :id",
      args: {id}
    });
    if (result.rows[0]) return result.rows[0]
  }
  catch (e) {
    console.error(e);
  }
}

export const searchSongs = async (searchTerm: string, limit = 10): undefined | Song[] => {
  try {
    // Split the search string into keywords
    const keywords = searchTerm.split(/\s+/).map(keyword => `%${keyword.trim()}%`);

    const result = await client.execute({
      sql: "SELECT * FROM songs WHERE title LIKE :searchTerm OR artist LIKE :searchTerm LIMIT :limit",
      args: { searchTerm: `%${searchTerm}%`, limit }
    });

    return result.rows;
  } catch (e) {
    console.error(e);
  }
};
