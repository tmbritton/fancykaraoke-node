import client from '../db/client';

export type Song = {
  id: number,
  title: string,
  artist: string,
  uploader: string,
  youtube_id: string,
  created_at: string
}

export interface CurrentSong extends Song {
  queue_id: number
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
  const searchString = `${searchTerm}*`;
  try {
    const result = await client.execute({
      sql: `
        SELECT
          id,
          title,
          artist,
          youtube_id
        FROM song_fts
        WHERE song_fts MATCH :searchString 
        ORDER BY rank DESC
        LIMIT :limit
      `,
      args: {searchString, limit}
    });
    return result.rows as unknown as Song[] | undefined;
  } catch (e) {
    console.error(e);
  }
};

