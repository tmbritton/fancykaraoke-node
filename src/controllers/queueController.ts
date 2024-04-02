import { type QueueItem, selectQueueByPartyId, insertQueueItem, getQueueLengthByPartyId } from "../models/queueModel";
import { getPartyBySlug } from "./partyController";
import { sanitizeString } from "../helpers/string";

export const getQueueByPartyId = async (id: number): Promise<QueueItem[]> => {
  const result = await selectQueueByPartyId(id);
  return result?.rows as unknown as QueueItem[];
}

export const addSongToQueue = async (partySlug: string, songId: string | number, addedBy = '') => {
  const slug = sanitizeString(partySlug)
  const party = await getPartyBySlug(slug);
  const queueLength = await getQueueLengthByPartyId(party?.id as number)
  if (typeof songId === 'string') {
    songId = parseInt(songId)
  }
  if (party) {
    const result = await insertQueueItem(party.id, songId, sanitizeString(addedBy), queueLength + 1)
    return result
  }
}