import { BRAND_SLUG } from './brand';

export const COMPARISON_KEY = `${BRAND_SLUG}.compare`;
// Retain only as a migration input; existing visitors must not lose selections.
const LEGACY_KEY = 'stillvein.compare';

type StorageAccess = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function readComparison(storage: StorageAccess): string[] {
  try {
    const current = storage.getItem(COMPARISON_KEY);
    const raw = current ?? storage.getItem(LEGACY_KEY);
    const parsed: unknown = JSON.parse(raw || '[]');
    const ids = Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is string => typeof id === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(id)))].slice(0, 3)
      : [];
    if (current === null && raw !== null) {
      // Delete the old key only after a successful write, including quota failures.
      try {
        storage.setItem(COMPARISON_KEY, JSON.stringify(ids));
        storage.removeItem(LEGACY_KEY);
      } catch { /* The original selection remains available. */ }
    }
    return ids;
  } catch {
    return [];
  }
}

export function saveComparison(storage: StorageAccess, ids: string[]) {
  storage.setItem(COMPARISON_KEY, JSON.stringify(ids));
  storage.removeItem(LEGACY_KEY);
}
