import { describe, expect, it } from 'vitest';
import { BRAND_NAME, currentBrand, rebrandLegacyText } from '../src/lib/brand';
import { defaultSettings, settingsSchema } from '../src/lib/schema';
import { COMPARISON_KEY, readComparison, saveComparison } from '../src/lib/comparison-storage';

function storage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

describe('Kapish Stonex identity', () => {
  it('uses the new name in valid default settings', () => {
    expect(settingsSchema.parse(defaultSettings).brand).toBe(BRAND_NAME);
  });
  it('handles previously persisted names case-insensitively', () => {
    expect(currentBrand(' STILLVEIN ')).toBe(BRAND_NAME);
    expect(currentBrand('Stillvein')).toBe(BRAND_NAME);
  });
  it('does not overwrite a later administrator-selected brand', () => {
    expect(currentBrand('Future Stone')).toBe('Future Stone');
  });
  it('updates old public prose, including multiple occurrences', () => {
    expect(rebrandLegacyText('STILLVEIN and Stillvein')).toBe('Kapish Stonex and Kapish Stonex');
  });
});

describe('comparison storage migration', () => {
  it('migrates existing selections without losing them', () => {
    const s = storage({ 'stillvein.compare': '["linen","granite"]' });
    expect(readComparison(s)).toEqual(['linen', 'granite']);
    expect(s.getItem(COMPARISON_KEY)).toBe('["linen","granite"]');
    expect(s.getItem('stillvein.compare')).toBeNull();
  });
  it('prefers the new selection, including a deliberately empty one', () => {
    const s = storage({ [COMPARISON_KEY]: '[]', 'stillvein.compare': '["linen"]' });
    expect(readComparison(s)).toEqual([]);
  });
  it('preserves the old key if browser quota prevents migration', () => {
    const s = storage({ 'stillvein.compare': '["linen"]' });
    s.setItem = () => { throw new Error('quota'); };
    expect(readComparison(s)).toEqual(['linen']);
    expect(s.getItem('stillvein.compare')).toBe('["linen"]');
  });
  it('validates, de-duplicates and limits IDs', () => {
    const s = storage({ [COMPARISON_KEY]: '["a","a",null,{},"b","c","d","../bad"]' });
    expect(readComparison(s)).toEqual(['a', 'b', 'c']);
  });
  it('tolerates malformed JSON and disabled browser storage', () => {
    expect(readComparison(storage({ [COMPARISON_KEY]: '{' }))).toEqual([]);
    const s = storage();
    s.getItem = () => { throw new Error('disabled'); };
    expect(readComparison(s)).toEqual([]);
  });
  it('writes under the new identity and retires the old key', () => {
    const s = storage({ 'stillvein.compare': '["a"]' });
    saveComparison(s, ['b']);
    expect(readComparison(s)).toEqual(['b']);
    expect(s.getItem('stillvein.compare')).toBeNull();
  });
});
