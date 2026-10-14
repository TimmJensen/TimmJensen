// Builds the animated "What I work on" cards SVG
import { writeFileSync } from 'node:fs';

const [outFile] = process.argv.slice(2);
if (!outFile) throw new Error('Usage: node build-workon.mjs <out.svg>');

const WIDTH = 600;
const CARD_HEIGHT = 66;
const GAP = 12;
const PAD_Y = 6;
const PAD_X = 28;

const ITEMS = [
  { title: 'Custom Shopify themes', sub: 'Online Store 2.0, sections, theme blocks, metafields, metaobjects' },
  { title: 'Shopify Functions & extensions', sub: 'Discounts, validation, checkout and customer account UI' },
  { title: 'API integrations', sub: 'Admin & Storefront GraphQL: ERP, PIM, shipping, marketing' },
  { title: 'Performance', sub: 'Core Web Vitals, lean Liquid and fast storefronts' },
  { title: 'Migrations', sub: 'From WooCommerce, Magento and other platforms to Shopify' },
];

function escapeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function card(item, index) {
  const y = PAD_Y + index * (CARD_HEIGHT + GAP);
  const number = String(index + 1).padStart(2, '0');
  const slideDelay = (index * 0.15).toFixed(2);
  const shineDelay = (1.2 + index * 0.25).toFixed(2);
  return `<g transform="translate(${PAD_X} ${y})">
<g class="slide" style="animation-delay:${slideDelay}s">
<clipPath id="clip-${index}"><rect x="1" y="1" width="${WIDTH - 2}" height="${CARD_HEIGHT - 2}" rx="12"/></clipPath>
<rect class="card" x="1" y="1" width="${WIDTH - 2}" height="${CARD_HEIGHT - 2}" rx="12"/>
<g clip-path="url(#clip-${index})">
<rect class="bar" x="0" y="0" width="4" height="${CARD_HEIGHT}" fill="#3B82F6" style="animation-delay:${slideDelay}s"/>
<rect class="shine" x="-160" y="0" width="140" height="${CARD_HEIGHT}" fill="url(#shine)" style="animation-delay:${shineDelay}s"/>
</g>
<text class="num" x="24" y="40">${number}</text>
<text class="title" x="70" y="29">${escapeXml(item.title)}</text>
<text class="sub" x="70" y="49">${escapeXml(item.sub)}</text>
</g>
</g>`;
}

function buildSvg(items) {
  const height = PAD_Y * 2 + items.length * CARD_HEIGHT + (items.length - 1) * GAP;
  const style = `
text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif}
.card{fill:#0f172a;stroke:rgba(59,130,246,.35);stroke-width:1}
.num{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:17px;font-weight:600;fill:#3B82F6}
.title{font-size:16px;font-weight:600;fill:#e6edf3}
.sub{font-size:13px;fill:#94a3b8}
.slide{animation:slide .7s cubic-bezier(.22,1,.36,1) backwards}
.shine{animation:shine 7s ease-in-out infinite}
@keyframes slide{from{transform:translateX(-${PAD_X}px)}to{transform:none}}
.bar{transform-box:fill-box;transform-origin:center;animation:grow .6s ease-out .3s backwards}
@keyframes grow{from{transform:scaleY(0)}to{transform:none}}
@keyframes shine{0%{transform:translateX(0)}18%,100%{transform:translateX(${WIDTH + 200}px)}}
@media (prefers-reduced-motion:reduce){.slide,.shine,.bar{animation:none}}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH + PAD_X}" height="${height}" viewBox="0 0 ${WIDTH + PAD_X} ${height}" fill="none">
<defs><linearGradient id="shine" x1="0" x2="1" y1="0" y2="0">
<stop offset="0" stop-color="#3B82F6" stop-opacity="0"/>
<stop offset=".5" stop-color="#3B82F6" stop-opacity=".18"/>
<stop offset="1" stop-color="#3B82F6" stop-opacity="0"/>
</linearGradient></defs>
<style>${style}</style>
${items.map(card).join('\n')}
</svg>
`;
}

writeFileSync(outFile, buildSvg(ITEMS));
console.log(`Wrote ${outFile} with ${ITEMS.length} cards`);
