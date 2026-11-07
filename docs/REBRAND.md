# Kapish Stonex rebrand

Date: 7 November 2026. Owner request: rename STILLVEIN to Kapish Stonex everywhere in the interface and GitHub, with good typography and a Hanumanji-inspired sign. Preserve the existing stone reference/motion experience.

## Delivered identity

- Shared two-line **Kapish / STONEX** wordmark: self-hosted DM Serif Display and tracked DM Sans. No external font-provider requests.
- Original gold gada, sacred tilak and temple-arch emblem; a symbolic Hanumanji-inspired sign rather than a deity portrait. Simplified favicon, 180-pixel Apple touch icon and 1200 x 630 social card. No copied logo or trademark-registration claim.
- Header, footer, oversized footer lettering, staff sign-in/sidebar, hero coordinate label, metadata/Open Graph/Twitter, CSV export filenames and package identity updated.
- Existing comparison selections migrate to the new browser-storage key. Quota errors retain the old selection, and later administrator-selected branding is not silently overwritten.
- Stone choreography, viewer controls, materials, roles, forms and enquiries retained. Small-screen verification exposed pre-existing 320-pixel application-card overflow; a narrow responsive correction fixes it.

## GitHub and hosting

- Original repository **1425094762** renamed to [Alexwatson-de/Kapish-Stonex](https://github.com/Alexwatson-de/Kapish-Stonex). Original public visibility, history and main branch retained; local remote updated.
- Existing Vercel project **prj_rJyidfiuiTkVVKPGq3QedS5Ihfqe** renamed to `kapish-stonex`. Its GitHub link was repaired to the same numeric repository ID and production branch.
- Canonical origin configured as [kapish-stonex.vercel.app](https://kapish-stonex.vercel.app). Old hosted aliases are retained and redirected to the canonical origin by Next.js; strict CSRF origin checks are not weakened.
- Canonical Firebase Auth domain added; all existing authorized domains retained.
- **Live and verified:** application commit `9fe2caa51833436afe03604fe6e4d4452a522915`, GitHub-triggered production deployment `dpl_ByEHpT1LhRmUYRVfaD5kpH79CC94`, state READY. Documentation-only commits after this application commit do not change the tested application.
- The canonical address is attached as a verified production domain, not just an ad-hoc alias. Initial domain propagation returned 404 and then Vercel SSO; attaching the production domain resolved this without disabling preview/deployment protection. The complete eight-workflow hosted repeat then passed publicly, with no bypass token.

## Data safety

The live migration changed only `settings/public.brand` and appended one audit record. Before/after document-ID/update-time fingerprints matched for all **7 products, 9 assets, 2 enquiries, 2 users and 26 taxonomy records**. No customer/catalogue records, credentials, Firebase rules, IAM roles or billing settings were replaced or weakened.

The existing Firebase project/service account IDs, signed upload preset, earlier image URLs and workspace directory remain stable intentionally. They are internal identifiers, not displayed branding. Only newly authorized Cloudinary destinations use `kapish-stonex/`. Historical verification records keep their original addresses/dates.

## Executed verification

- ESLint, TypeScript and optimized Next.js production build: passed.
- **77 unit checks passed**, including 10 new identity/storage tests. **35 emulator-only tests were explicitly skipped**; the default Java here is 11, not the required 21. This is not a claim of rerunning the complete earlier integration suite.
- **8 optimized-build browser workflows passed**: four each in Chromium and WebKit. Cover eight public/staff pages, brand/name absence checks, actual loaded emblem/font styling, metadata/asset responses, existing-material comparison migration/removal and 320/360/390/768/1440-pixel layout.
- Public homepage/footer and social-card renders visually inspected. Captures are local in the QA artifact folder, not public source commits.
- Initial narrow-screen overflow and WebKit prefetch-cancellation failures were diagnosed. CSS was corrected and page transitions now await settled RSC prefetch; all eight workflows passed on a fresh full repeat.
- **8 hosted browser workflows passed**, again four each in Chromium and WebKit, against the public canonical domain. All four hosted brand assets match their local source bytes/SHA-256. The old public bookmark `/collection?q=marble` redirects with HTTP 308 to the same path/query at the canonical origin.
- Normal-motion hosted WebGL reached ready state with neither reduced-motion nor fallback active. Canvas RGB standard deviations were 67.65/66.60/66.11 (not an empty canvas); the scroll control advanced 1032 pixels and the rendered detail stage was inspected.
- Canonical-origin invalid enquiry payload returned 400 without creating a record; an unrelated-origin request returned 403. Anonymous admin-product access returned 401. A final live dry-run found no branding changes remaining and the original non-brand inventory fingerprints still matched.
- The existing Cloudinary preset remains signed, overwrite disabled, jpg/jpeg/png/webp-only, with no folder/asset-folder transformation that would conflict with the new destination prefix. No repeat authenticated live upload is claimed.

Physical-device/human visual acceptance, trademark/legal review and repeat live authenticated upload acceptance are not claimed. The owner's existing personal/non-commercial Hobby hosting constraint remains; no paid plan was enabled and no unrelated application sources were edited.
