import client from '../db/client';

export type QueueItem = {
  id: number,
  party_id: string,
  song_id: number,
  added_by: string,
  priority: number,
  played: boolean
}

export const selectQueueByPartySlug = async (slug: string) => {
  const result = await client.execute(`SELECT * FROM queue WHERE party_id="${slug}"`)
  return result
}