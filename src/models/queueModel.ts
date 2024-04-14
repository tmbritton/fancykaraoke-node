import client from '../db/client';
import { getPartyIdFromSlug } from './partyModel'
import { sanitizeString } from '../helpers/string';

export type QueueItem = {
  id: number,
  party_id: string,
  song_id: number,
  added_by: string,
  priority: number,
  hidden: boolean
};

export const selectQueueByPartySlug = async (slug: string, showHidden = false) => {
  const partyId = (await getPartyIdFromSlug(sanitizeString(slug)))
  const result = await client.execute({
    sql: 'SELECT * FROM queue WHERE party_id = ? AND hidden = ? ORDER BY priority',
    args: [partyId, showHidden]  
  });
  return result?.rows;
}

export const getQueueLengthByPartyId = async (partyId: number) => {
  const result = await client.execute(`SELECT COUNT(*) from queue WHERE party_id=${partyId}`);

  return result?.rows?.[0]?.['COUNT(*)'] as number;
}

export const insertQueueItem = async (partyId: number, songId: number, addedBy = '', priority = 0) => {
  try {
    const result = await client.execute({
      sql: 'INSERT INTO queue (party_id, song_id, added_by, priority) VALUES (?, ?, ?, ?)',
      args: [partyId, songId, addedBy, priority]
    });
    await client.sync();
    return result;
  } catch(e) {
    console.error(e);
    return null;
  }
}

export const selectCurrentSongIdByPartyId = async (partyId: number) => {
  try {
    const result = await client.execute({
      sql: 'SELECT song_id FROM queue WHERE party_id = ? AND hidden = ? ORDER BY priority LIMIT 1',
      args: [partyId, false]
    });
    return result?.rows?.[0]?.song_id as number;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const selectCurrentSongByPartySlug = async (partySlug: string) => {
  const sanitizedSlug = sanitizeString(partySlug);

  try {
    const result = await client.execute({
      sql: `
        SELECT s.*, q.id AS queue_id
        FROM songs s
        JOIN queue q ON s.id = q.song_id
        JOIN parties p ON q.party_id = p.id
        WHERE p.slug = ? AND q.hidden = ? AND q.priority = (
          SELECT MIN(priority)
          FROM queue
          WHERE party_id = p.id AND hidden = ?
        )
        LIMIT 1
      `,
      args: [sanitizedSlug, false, false],
    });

    return result?.rows?.length > 0 ? result?.rows?.[0] : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const hideQueueItem = async (id: number) => {
  try {
    const result = await client.execute({
      sql: `
        UPDATE queue
        SET hidden = true
        WHERE 
          queue.id = ?
      `,
      args: [id]
    })
    console.log(result)
    await client.sync()
    return result
  } catch (e) {
    console.error(e)
    return null
  }
}
