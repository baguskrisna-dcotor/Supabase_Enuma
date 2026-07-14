/**
 * Generates a clean URL-friendly slug from a string with a unique random suffix.
 * @param {string} text 
 * @returns {string}
 */
export const slugify = (text) => {
  if (!text) return '';
  
  const clean = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text

  const suffix = Math.random().toString(36).substring(2, 7);
  return `${clean}-${suffix}`;
};
