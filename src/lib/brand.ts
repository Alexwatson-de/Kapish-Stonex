// Public identity is independent of existing Firebase IDs, asset URLs and hosting.
// Those infrastructure identifiers must remain stable to preserve owner data.
export const BRAND_NAME = 'Kapish Stonex';
export const BRAND_SLUG = 'kapish-stonex';

export function rebrandLegacyText(value: string): string {
  return value.replace(/stillvein/gi, BRAND_NAME);
}

export function currentBrand(value: string): string {
  return /^stillvein$/i.test(value.trim()) ? BRAND_NAME : value;
}
