import { type Party, selectSlugCount, insertParty, selectPartyBySlug } from "../models/partyModel";
import { selectPartySlugByQueueId } from "../models/queueModel";
import { sanitizeString } from "../helpers/string";
import PubSub from "../helpers/pubSub";

export const createParty = async (name: string) => {
  // Strip dangerous characters.
  const sanitizedName = sanitizeString(name);
  // Create sluggified version.
  const sluggified = sanitizedName.toLowerCase().replace(/[^a-z0-9]+/gi,'-');
  let slug = sluggified

  const count = await selectSlugCount(sluggified);

  if (typeof count === 'number' && count > 0) {
    slug = slug + `-${count + 1}`;
  }

  try {
    const result = await insertParty(sanitizedName, slug)
    if (result.rowsAffected === 1) {
      PubSub.publish('partyCreated', {partySlug: slug})
      return {created: true, slug}
    }
  } catch (e) {
    console.error(e);
    return {created: false}
  }
}

export const getPartyBySlug = async (slug: string): Promise<Party | null> => {
  const sanitizedSlug = sanitizeString(slug)
  const result = await selectPartyBySlug(sanitizeString(sanitizedSlug))
  return result as Party
}

export const getPartySlugByQueueItemId = async (id: number | string): Promise<string | null> => {
  const sanitizedId = sanitizeString(id as string);
  const result = await selectPartySlugByQueueId(id as number);
  return result as string;
}