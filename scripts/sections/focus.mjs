// Focus areas panel: two-column grid of cards with line icons
import { COLORS, INNER_WIDTH, PAD, escapeXml, panelSvg, sectionLabel, wrapText } from '../lib/theme.mjs';

const GAP = 12;
const CARD_WIDTH = (INNER_WIDTH - GAP) / 2;
const CARD_HEIGHT = 104;
const TOP = 64;
const DESC_MAX_CHARS = 44;

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
  { icon: 'bag', title: 'Shopify themes', desc: 'Online Store 2.0, sections, theme blocks, metafields and metaobjects' },
  { icon: 'code', title: 'Functions & extensions', desc: 'Discounts, validation, checkout and customer account UI extensions' },
  { icon: 'nodes', title: 'Integrations', desc: 'Admin and Storefront GraphQL connecting ERP, PIM, shipping and marketing' },
  { icon: 'bolt', title: 'Performance', desc: 'Core Web Vitals, lean Liquid and storefronts that stay fast' },
  { icon: 'arrows', title: 'Migrations', desc: 'From WooCommerce, Magento and other platforms to Shopify' },
  { icon: 'sparkle', title: 'AI & automation', desc: 'AI agents and workflows for development, QA and documentation' },
];

function areaCard(area, index) {
  const x = PAD + (index % 2) * (CARD_WIDTH + GAP);
  const y = TOP + Math.floor(index / 2) * (CARD_HEIGHT + GAP);
  const desc = wrapText(area.desc, DESC_MAX_CHARS)
    .map((line, i) => `<text class="desc" x="76" y="${62 + i * 18}">${escapeXml(line)}</text>`)
    .join('\n');
  return `<g transform="translate(${x} ${y})">
<rect class="card" x="0" y="0" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="12"/>
<rect x="20" y="20" width="40" height="40" rx="10" fill="${COLORS.accentSoft}" stroke="${COLORS.cardStroke}"/>
<g transform="translate(28 28) scale(1)" stroke="${COLORS.accent}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${ICONS[area.icon]}"/></g>
<text class="title" x="76" y="38">${escapeXml(area.title)}</text>
${desc}
</g>`;
}

export function buildFocus() {
  const rows = Math.ceil(AREAS.length / 2);
  const height = TOP + rows * CARD_HEIGHT + (rows - 1) * GAP + PAD;
  const style = `
.title{font-size:15px;font-weight:600;fill:${COLORS.heading}}
.desc{font-size:12.5px;fill:${COLORS.muted}}`;
  const body = `${sectionLabel('What I work on')}\n${AREAS.map(areaCard).join('\n')}`;
  return panelSvg({ height, body, style });
}
