import {querySongById, querySongs, type Song} from '../models/songModel'

export const getSongById = async (id: number): Promise<Song | undefined> => {
  const result = await querySongById(id);
  return result
}

export const searchSongs = async (searchTerm: string, limit = 10): Promise<Song[] | undefined> => {
	const result = await querySongs(searchTerm, limit)
  return result
}
