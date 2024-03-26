export function makeUrlSafe(unsafeString: string): string {
  // Regular expression to match all characters except URL safe ones
  const urlSafeRegex = /[^a-zA-Z0-9\-._#?&@:/]/g;

  // Replace non-URL safe characters with an empty string
  return unsafeString.replace(urlSafeRegex, "");
}

export const sanitizeString = (str: string) => str?.trim()?.replace(/[^a-zA-Z 0-9-]+/gi,'');
