import { type QueueItem, selectQueueByPartySlug, insertQueueItem, getQueueLengthByPartyId, selectCurrentSongByPartySlug, hideQueueItem} from "../models/queueModel";
import { type CurrentSong } from '../models/songModel';
import { getPartyBySlug } from "./partyController";
import { sanitizeString } from "../helpers/string";

export const getQueueBySlug = async (slug: string): Promise<QueueItem[]> => {
  const sanitizedSlug = sanitizeString(slug);
  const result = await selectQueueByPartySlug(sanitizedSlug);
  return result as unknown as QueueItem[];
}

export const addSongToQueue = async (partySlug: string, songId: string | number, addedBy = '') => {
  const slug = sanitizeString(partySlug);
  const party = await getPartyBySlug(slug);
  const queueLength = await getQueueLengthByPartyId(party?.id as number);
  if (typeof songId === 'string') {
    songId = parseInt(songId);
  }
  if (party) {
    const result = await insertQueueItem(party.id, songId, sanitizeString(addedBy), queueLength + 1);
    return result;
  }
}

export const getCurrentSong = async (partySlug: string) => {
  const sanitizedSlug = sanitizeString(partySlug);
  const song = await selectCurrentSongByPartySlug(partySlug) as unknown as CurrentSong
  return song;
}

export const removeSongFromQueue = async (queueItemId: string | number) => {
  let id: number;
  typeof queueItemId === 'string' ? id = parseInt(queueItemId) : id = queueItemId;
  const result = await hideQueueItem(id)
  return result
}