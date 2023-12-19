import client from '../db/client';

export type Party = {
  id: number,
  name: string,
  slug: string,
  created_at: string,
  last_played: string,
}

export const createParty = (name: string) => {
  //const slug = 
  const sanitizedName = name.replace(/[^a-z0-9]+/gi,'');
  const slug = name.replace(/[^a-z0-9]+/gi,'-').toLowerCase() + '-' + Date.now();
}