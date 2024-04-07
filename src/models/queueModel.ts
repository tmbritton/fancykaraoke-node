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
    return e;
  }
}

