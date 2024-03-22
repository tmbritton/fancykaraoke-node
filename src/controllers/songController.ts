import {querySongById, querySongs, type Song} from '../models/songModel'
import { sanitizeString } from '../helpers/string';

export const getSongById = async (id: number): Promise<Song | undefined> => {
  const result = await querySongById(id);
  return result
}

export const searchSongs = async (searchTerm: string, limit = 10): Promise<Song[] | undefined> => {
	const result = await querySongs(sanitizeString(searchTerm), limit)
  return result
}
