import { selectQueueByPartySlug, type QueueItem } from "../models/queueModel";

export const getQueueByPartyId = async (slug: string): Promise<QueueItem[]> => {
  const result = await selectQueueByPartySlug(slug)
  return result?.rows as unknown as QueueItem[]
}