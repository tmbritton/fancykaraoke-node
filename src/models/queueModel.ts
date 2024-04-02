import client from '../db/client';

export type QueueItem = {
  id: number,
  party_id: string,
  song_id: number,
  added_by: string,
  priority: number,
  played: boolean
}

export const selectQueueByPartyId = async (id: number, showHidden = false) => {
  const result = await client.execute(`SELECT * FROM queue WHERE party_id="${id}" AND hidden=${!showHidden}`);
  return result;
}

export const getQueueLengthByPartyId = async (partyId: number) => {
  const result = await client.execute(`SELECT COUNT(*) from queue WHERE party_id=${partyId}`)

  return result?.rows?.[0]?.['COUNT(*)'] as number
}

export const insertQueueItem = async (partyId: number, songId: number, addedBy = '', priority = 0) => {
  try {
    const result = await client.execute({
      sql: 'INSERT INTO queue (party_id, song_id, added_by, priority) VALUES (?, ?, ?, ?)',
      args: [partyId, songId, addedBy, priority]
    })
    await client.sync()
    return result
  } catch(e) {
    console.log(e)
    return e
  }
}

