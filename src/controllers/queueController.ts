import { type QueueItem, selectQueueByPartySlug, insertQueueItem, getQueueLengthByPartyId, selectCurrentSongIdByPartyId, selectCurrentSongByPartySlug} from "../models/queueModel";
import { getPartyBySlug } from "./partyController";
import { sanitizeString } from "../helpers/string";
import { getPartyIdFromSlug } from '../models/partyModel';
import { getSongById } from './songController';

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
  const song = await selectCurrentSongByPartySlug(partySlug)
  return song;
}
