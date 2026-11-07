import Image from 'next/image';
import { BRAND_NAME } from '@/lib/brand';

// The owner requested Kapish Stonex and a respectful Hanumanji-inspired sign.
// Use symbolic gada/tilak artwork, not a decorative portrait of the deity.
export function BrandIdentity({ name = BRAND_NAME }: { name?: string }) {
  return (
    <>
      <Image
        className="brand-emblem"
        src="/brand/hanuman-emblem.svg"
        width={44}
        height={53}
        alt=""
        aria-hidden="true"
        unoptimized
      />
      <span className="brand-type">
        {name === BRAND_NAME ? (
          <>
            <span className="brand-name">Kapish</span>{' '}
            <span className="brand-descriptor">Stonex</span>
          </>
        ) : (
          <span className="brand-name">{name}</span>
        )}
      </span>
    </>
  );
}
