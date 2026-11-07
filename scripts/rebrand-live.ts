// Owner-authorized rename only. Never seed, replace materials or change project IDs.
// Dry-run by default. --apply updates only branding fields and adds one audit event.
import { createHash } from 'node:crypto';
import { services } from '../src/lib/server/firebase';
import { BRAND_NAME, rebrandLegacyText } from '../src/lib/brand';

async function main() {
  if (process.env.CONFIRM_PROJECT !== 'stillvein' || process.env.FIREBASE_PROJECT_ID !== 'stillvein' || process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST)
    throw new Error('Requires explicit CONFIRM_PROJECT=stillvein and the existing live project, without emulators.');
  const { db } = services();
  const collections = ['products', 'assets', 'enquiries', 'users', 'taxonomy'];
  const inventory = async () => {
    const snapshots = await Promise.all(collections.map((name) => db.collection(name).select().get()));
    return Object.fromEntries(snapshots.map((s, i) => [collections[i], {
      count: s.size,
      fingerprint: createHash('sha256').update(JSON.stringify(s.docs.map((d) => [d.id, d.updateTime?.toMillis()]).sort())).digest('hex'),
    }]));
  };
  const before = await inventory();
  const apply = process.argv.includes('--apply');
  const ref = db.doc('settings/public');
  const result = await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) throw new Error('Existing site settings not found; refusing to create replacement settings.');
    const original = doc.data()!;
    const patch: Record<string, string> = {};
    if (original.brand !== BRAND_NAME) patch.brand = BRAND_NAME;
    for (const key of ['tagline', 'heroTitle', 'heroDescription', 'seoDescription', 'privacyText', 'termsText', 'enquiryCta']) {
      if (typeof original[key] === 'string' && rebrandLegacyText(original[key]) !== original[key])
        patch[key] = rebrandLegacyText(original[key]);
    }
    if (apply && Object.keys(patch).length) {
      tx.update(ref, patch);
      tx.set(db.collection('audit').doc(), {
        actor: 'trusted-maintenance', action: 'settings.rebrand', target: ref.path,
        from: original.brand, to: BRAND_NAME, fields: Object.keys(patch), at: new Date().toISOString(),
      });
    }
    return { mode: apply ? 'apply' : 'dry-run', from: original.brand, to: BRAND_NAME, fields: Object.keys(patch) };
  });
  const after = await inventory();
  if (JSON.stringify(before) !== JSON.stringify(after))
    throw new Error('Non-brand inventory changed during the run. Review concurrent activity; no automatic rollback of user data.');
  console.log(JSON.stringify({ ...result, nonBrandInventoryUnchanged: true, inventory: after }, null, 2));
}
main().catch((e) => { console.error(e.message); process.exitCode = 1; });
