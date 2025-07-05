import {
	type QueueItem,
	selectQueueByPartySlug,
	insertQueueItem,
	getQueueLengthByPartyId,
	selectCurrentSongByPartySlug,
	hideQueueItem,
	selectPartySlugByQueueId,
	selectQueueCountByPartySlug,
	updateQueueItemsPriority
} from '../models/queueModel';
import { type CurrentSong } from '../models/songModel';
import { getPartyBySlug } from './partyController';
import { sanitizeString } from '../helpers/string';
import pubSub from '../helpers/pubSub';

export const getQueueBySlug = async (slug: string): Promise<QueueItem[]> => {
	const sanitizedSlug = sanitizeString(slug);
	const result = await selectQueueByPartySlug(sanitizedSlug);
	return result as unknown as QueueItem[];
};

export const addSongToQueue = async (partySlug: string, songId: string | number, addedBy = '') => {
	const slug = sanitizeString(partySlug);
	const party = await getPartyBySlug(slug);
	const queueLength = await getQueueLengthByPartyId(party?.id as number);

	console.log('Party found:', party);

	if (!party) {
		console.log('No party found for slug:', slug);
		return null;
	}

	console.log('Queue length:', queueLength);

	if (typeof songId === 'string') {
		songId = parseInt(songId);
	}

	console.log(
		'Song ID:',
		songId,
		'Party ID:',
		party.id,
		'Added by:',
		addedBy,
		'Priority:',
		queueLength + 1
	); // Add this
	if (party) {
		const result = await insertQueueItem(
			party.id,
			songId,
			sanitizeString(addedBy),
			queueLength + 1
		);
		pubSub.publish('queueUpdated', { slug: partySlug });
		return result;
	}
};

export const getCurrentSong = async (partySlug: string) => {
	const sanitizedSlug = sanitizeString(partySlug);
	const song = (await selectCurrentSongByPartySlug(sanitizedSlug)) as unknown as CurrentSong;
	return song;
};

export const removeSongFromQueue = async (queueItemId: string | number) => {
	let id: number;
	typeof queueItemId === 'string' ? (id = parseInt(queueItemId)) : (id = queueItemId);
	const result = await hideQueueItem(id);
	if (result) {
		const partySlug = await selectPartySlugByQueueId(queueItemId as number);
		if (partySlug) {
			pubSub.publish('queueUpdated', { slug: partySlug });
		}
	}
	return result;
};

export const getQueueCountByPartySlug = async (slug: string) => {
	const sanitizedSlug = sanitizeString(slug);
	const count = await selectQueueCountByPartySlug(sanitizedSlug);
	return count;
};

export const reorderQueue = async (
	queueItems: { id: number; priority: number }[],
	partySlug: string
) => {
	try {
		const result = await updateQueueItemsPriority(queueItems);
		pubSub.publish('queueUpdated', { slug: partySlug });
		return result;
	} catch (e) {
		return false;
	}
};

