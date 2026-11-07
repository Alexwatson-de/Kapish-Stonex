// Reproducible, original web assets using the same self-hosted OFL fonts as the site.
// Run after Playwright Chromium is installed. No network or font-provider request.
import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../public/', import.meta.url);
const emblem = await readFile(new URL('brand/hanuman-emblem.svg', root), 'utf8');
const serif = await readFile(new URL('fonts/-nFnOHM81r4j6k0gjAW3mujVU2B2K_c.ttf', root));
const sans = await readFile(new URL('fonts/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAkJxhTg.ttf', root));
await sharp(fileURLToPath(new URL('brand/favicon.svg', root))).resize(180, 180).png().toFile(fileURLToPath(new URL('brand/apple-touch-icon.png', root)));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face{font-family:BrandSerif;src:url(data:font/ttf;base64,${serif.toString('base64')})}
    @font-face{font-family:BrandSans;src:url(data:font/ttf;base64,${sans.toString('base64')})}
    *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#22221f;color:#f5eee3}
    .border{position:absolute;inset:30px;border:1px solid #b7894e70}.sign{position:absolute;left:132px;top:110px;width:142px;height:170px}
    .title{position:absolute;left:306px;top:147px;font:84px BrandSerif;letter-spacing:-2px}.subtitle{position:absolute;left:310px;top:267px;font:15px BrandSans;letter-spacing:4px;color:#c8b99f}
    .rule{position:absolute;left:140px;top:443px;width:590px;border-top:1px solid #b7894e80}.caption{position:absolute;left:142px;top:470px;font:22px BrandSans;color:#c8b99f}
    .veins{position:absolute;inset:0;opacity:.15}
    </style></head><body><div class="border"></div><svg class="veins" width="1200" height="630"><path d="M860 30C790 160 1080 205 975 320S805 480 1090 600M890 30C820 160 1110 205 1005 320S835 480 1120 600" fill="none" stroke="#b7894e" stroke-width="2"/></svg>
    <div class="sign">${emblem}</div><div class="title">Kapish Stonex</div><div class="subtitle">THE MATERIAL ATLAS</div><div class="rule"></div><div class="caption">Natural stone. Considered spaces.</div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: fileURLToPath(new URL('brand/social-card.png', root)) });
} finally { await browser.close(); }
console.log('Generated apple-touch-icon.png (180 x 180) and social-card.png (1200 x 630).');
