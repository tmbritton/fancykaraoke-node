import { type Party } from "../models/partyModel";

export const createParty = (name: string) => {
  //const slug = 
  const sanitizedName = name.replace(/[^a-z0-9]+/gi,'');
  //const sluggifiedName = name.replace(/[^a-z0-9]+/gi,'-').toLowerCase();
  // 1. Select count where like sluggified name
  // 2. If greater than 0, add count + 1 to sluggifiedName
  // 3. Insert party into database using sanitizedName and sliggifiedName
}