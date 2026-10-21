// Focus areas panel: two-column grid of cards with line icons
import { COLORS, INNER_WIDTH, PAD, escapeXml, panelSvg, sectionLabel, wrapText } from '../lib/theme.mjs';

const GAP = 12;
const CARD_WIDTH = (INNER_WIDTH - GAP) / 2;
const CARD_HEIGHT = 104;
const TOP = 64;
const DESC_MAX_CHARS = 44;
// Cards start shifted left (never hidden) so a frozen animation still shows them
const SLIDE_DISTANCE = 24;

const SHINE_GRADIENT = `<defs><linearGradient id="shine" x1="0" x2="1" y1="0" y2="0">
<stop offset="0" stop-color="${COLORS.accent}" stop-opacity="0"/>
<stop offset=".5" stop-color="${COLORS.accent}" stop-opacity=".16"/>
<stop offset="1" stop-color="${COLORS.accent}" stop-opacity="0"/>
</linearGradient></defs>`;

// 24x24 stroke icons
const ICONS = {
  bag: 'M5 8h14l-1.2 12H6.2L5 8zM9 8V6.5a3 3 0 0 1 6 0V8',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14',
  nodes: 'M6 6h12M6 6l6 12M18 6l-6 12M6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM18 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  bolt: 'M13 3L5 14h6l-1 7 8-11h-6l1-7z',
  arrows: 'M4 8h14l-3-3M20 16H6l3 3',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z',
};

const AREAS = [
  { icon: 'code', title: 'End-to-end products', desc: 'React/TypeScript UIs, Node/Express or PHP/Laravel backends' },
  { icon: 'bag', title: 'Shopify', desc: 'Apps, Functions, Liquid storefronts and store integrations' },
  { icon: 'nodes', title: 'Integrations', desc: 'GraphQL and REST connecting ERP, PIM, shipping and other systems' },
  { icon: 'bolt', title: 'Performance', desc: 'Core Web Vitals, lean code, storefronts and apps that stay fast' },
  { icon: 'sparkle', title: 'LLM APIs', desc: 'Product features via OpenAI and Anthropic, not model training' },
  { icon: 'arrows', title: 'Migrations', desc: 'From WooCommerce, Magento and other platforms to Shopify' },
];

function areaCard(area, index) {
  const x = PAD + (index % 2) * (CARD_WIDTH + GAP);
  const y = TOP + Math.floor(index / 2) * (CARD_HEIGHT + GAP);
  const desc = wrapText(area.desc, DESC_MAX_CHARS)
    .map((line, i) => `<text class="desc" x="76" y="${62 + i * 18}">${escapeXml(line)}</text>`)
    .join('\n');
  const slideDelay = (index * 0.12).toFixed(2);
  const shineDelay = (1.2 + index * 0.25).toFixed(2);
  return `<g transform="translate(${x} ${y})"><g class="slide" style="animation-delay:${slideDelay}s">
<clipPath id="card-clip-${index}"><rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="12"/></clipPath>
<rect class="card" x="0" y="0" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="12"/>
<rect class="shine" x="-160" y="0" width="140" height="${CARD_HEIGHT}" fill="url(#shine)" clip-path="url(#card-clip-${index})" style="animation-delay:${shineDelay}s"/>
<rect x="20" y="20" width="40" height="40" rx="10" fill="${COLORS.accentSoft}" stroke="${COLORS.cardStroke}"/>
<g transform="translate(28 28) scale(1)" stroke="${COLORS.accent}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${ICONS[area.icon]}"/></g>
<text class="title" x="76" y="38">${escapeXml(area.title)}</text>
${desc}
</g></g>`;
}

export function buildFocus() {
  const rows = Math.ceil(AREAS.length / 2);
  const height = TOP + rows * CARD_HEIGHT + (rows - 1) * GAP + PAD;
  const style = `
.title{font-size:15px;font-weight:600;fill:${COLORS.heading}}
.desc{font-size:12.5px;fill:${COLORS.muted}}
.slide{animation:slide .7s cubic-bezier(.22,1,.36,1) backwards}
.shine{animation:shine 7s ease-in-out infinite}
@keyframes slide{from{transform:translateX(-${SLIDE_DISTANCE}px)}to{transform:none}}
@keyframes shine{0%{transform:translateX(0)}18%,100%{transform:translateX(${CARD_WIDTH + 200}px)}}`;
  const body = `${SHINE_GRADIENT}
${sectionLabel('What I work on')}\n${AREAS.map(areaCard).join('\n')}`;
  return panelSvg({ height, body, style });
}
