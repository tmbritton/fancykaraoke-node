import { type Party, selectSlugCount, insertParty } from "../models/partyModel";

export const createParty = async (name: string) => {
  // Strip dangerous characters.
  const sanitizedName = name.trim().replace(/[^a-zA-Z 0-9]+/gi,'');
  // Create sluggified version.
  const sluggified = sanitizedName.toLowerCase().replace(/[^a-z0-9]+/gi,'-');
  let slug = sluggified

  const count = await selectSlugCount(sluggified);
  //const slug = typeof count === 'number' && count === 0 ? sluggified : `${sluggified}-${count as number + 1}`

  console.log(`Count: ${count}`)
  if (typeof count === 'number' && count > 0) {
    slug = slug + `-${count + 1}`;
  }

  try {
    const result = await insertParty(sanitizedName, slug)
    if (result.rowsAffected === 1) {
      return {created: true, slug}
    }
  } catch (e) {
    console.error(e);
    return {created: false}
  }
 }