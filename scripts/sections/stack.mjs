// Stack panel: grouped cards of skillicons tiles, single-color brand icons and the Liquid logo
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { COLORS, INNER_WIDTH, PAD, escapeXml, panelSvg, sectionLabel } from '../lib/theme.mjs';

const ICON_DIRS = { skill: 'icons/skillicons', brand: 'icons/brands', liquid: 'icons/liquid.png' };

const OFFSET_X = PAD;
const PANEL_WIDTH = INNER_WIDTH;
const TOP = 64;
const COL_GAP = 12;
const ROW_GAP = 12;
const CARD_WIDTH = (PANEL_WIDTH - COL_GAP) / 2;
const CARD_HEIGHT = 120;
const ICON = 44;
// Icon slot width; cards with fewer icons get more room, capped for consistency
const MAX_SLOT = 70;
const SLOT_PAD = 7;
const TILE_BG = '#242938';

// Tiles that need a brand background instead of the default dark tile
const TILE_BG_OVERRIDES = { woocommerce: '#7F54B3' };

// Glyph size inside the 256 tile; wide wordmarks get more room
const GLYPH_SIZE = 150;
const GLYPH_SIZE_OVERRIDES = { woocommerce: 200, gdscript: 180 };

// Single-color icons drawn on a dark tile in their brand color
const BRAND_COLORS = {
  shopify: '#95BF47',
  woocommerce: '#FFFFFF',
  digitalocean: '#0080FF',
  railway: '#FFFFFF',
  hetzner: '#D50C2D',
  openai: '#FFFFFF',
  anthropic: '#D97757',
  grok: '#FFFFFF',
  cursor: '#FFFFFF',
  claude: '#D97757',
  gdscript: '#478CBF',
};

const GROUPS = [
  { label: 'COMMERCE & CMS', items: [['shopify', 'Shopify'], ['liquid', 'Liquid'], ['wordpress', 'WordPress'], ['woocommerce', 'WooCommerce']] },
  { label: 'FRONTEND', items: [['html', 'HTML'], ['css', 'CSS'], ['tailwind', 'Tailwind'], ['js', 'JavaScript'], ['ts', 'TypeScript']] },
  { label: 'BACKEND & APIS', items: [['nodejs', 'Node.js'], ['graphql', 'GraphQL'], ['php', 'PHP'], ['laravel', 'Laravel'], ['cs', 'C#']] },
  { label: 'DATA', items: [['postgres', 'PostgreSQL'], ['mysql', 'MySQL'], ['redis', 'Redis']] },
  { label: 'HOSTING & DEVOPS', items: [['docker', 'Docker'], ['digitalocean', 'DigitalOcean'], ['railway', 'Railway'], ['hetzner', 'Hetzner'], ['git', 'Git']] },
  { label: 'AI & TOOLING', items: [['openai', 'OpenAI'], ['anthropic', 'Anthropic'], ['grok', 'Grok'], ['claude', 'Claude Code'], ['cursor', 'Cursor']] },
  { label: 'GAME DEV', fullWidth: true, items: [['unity', 'Unity'], ['cs', 'C#'], ['godot', 'Godot'], ['gdscript', 'GDScript']] },
];

function skillTile(name) {
  const svgText = readFileSync(join(ICON_DIRS.skill, `${name}.svg`), 'utf8');
  const match = svgText.match(/<g transform="translate\(0, 0\)">([\s\S]*)<\/g>\s*<\/svg>\s*$/);
  if (!match) throw new Error(`Could not find inner svg wrapper in skillicon "${name}"`);
  return match[1].trim();
}

// Icon coordinate size from viewBox, falling back to the width attribute
function iconUnits(svgText, name) {
  const match = svgText.match(/viewBox="0 0 ([\d.]+)/) ?? svgText.match(/<svg[^>]*\swidth="([\d.]+)"/);
  if (!match) throw new Error(`Could not read icon size of brand icon "${name}"`);
  return Number(match[1]);
}

function brandTile(name) {
  const svgText = readFileSync(join(ICON_DIRS.brand, `${name}.svg`), 'utf8');
  const paths = svgText.match(/<path[^>]*?(?:\/>|>\s*<\/path>)/g);
  if (!paths) throw new Error(`No <path> elements found in brand icon "${name}"`);
  const fillRule = svgText.includes('fill-rule="evenodd"') ? 'evenodd' : 'nonzero';
  const units = iconUnits(svgText, name);
  const size = GLYPH_SIZE_OVERRIDES[name] ?? GLYPH_SIZE;
  const offset = (256 - size) / 2;
  return `<svg width="256" height="256" viewBox="0 0 256 256">
<rect width="256" height="256" rx="60" fill="${TILE_BG_OVERRIDES[name] ?? TILE_BG}"/>
<g transform="translate(${offset} ${offset}) scale(${size / units})" fill="${BRAND_COLORS[name]}" fill-rule="${fillRule}">${paths.map((path) => path.replace(/\sfill="[^"]*"/g, '')).join('')}</g>
</svg>`;
}

function liquidTile() {
  const pngBase64 = readFileSync(ICON_DIRS.liquid).toString('base64');
  return `<svg width="256" height="256" viewBox="0 0 256 256">
<defs><clipPath id="liquid-clip"><rect width="256" height="256" rx="60"/></clipPath></defs>
<rect width="256" height="256" rx="60" fill="#FEFDFB"/>
<image clip-path="url(#liquid-clip)" width="256" height="256" href="data:image/png;base64,${pngBase64}"/>
</svg>`;
}

function tileFor(key) {
  if (key === 'liquid') return liquidTile();
  if (key in BRAND_COLORS) return brandTile(key);
  return skillTile(key);
}

function slotWidth(itemCount, cardWidth) {
  return Math.min(MAX_SLOT, (cardWidth - 2 * SLOT_PAD) / itemCount);
}

// Places half-width cards two per row; a fullWidth card takes a row of its own
function layoutGroups(groups) {
  const placed = [];
  let row = 0;
  let col = 0;
  for (const group of groups) {
    if (group.fullWidth && col !== 0) {
      row += 1;
      col = 0;
    }
    const width = group.fullWidth ? PANEL_WIDTH : CARD_WIDTH;
    const x = OFFSET_X + col * (CARD_WIDTH + COL_GAP);
    const y = TOP + row * (CARD_HEIGHT + ROW_GAP);
    placed.push({ group, x, y, width });
    if (group.fullWidth || col === 1) {
      row += 1;
      col = 0;
    } else {
      col = 1;
    }
  }
  return { placed, rows: col === 0 ? row : row + 1 };
}

function groupCard({ group, x, y, width }) {
  const slot = slotWidth(group.items.length, width);
  const scale = ICON / 256;
  const items = group.items.map(([key, name], i) => {
    const slotX = SLOT_PAD + i * slot;
    const iconX = slotX + (slot - ICON) / 2;
    return `<g transform="translate(${iconX} 40) scale(${scale})">${tileFor(key)}</g>
<text class="name" x="${slotX + slot / 2}" y="104" text-anchor="middle">${escapeXml(name)}</text>`;
  });
  return `<g transform="translate(${x} ${y})">
<rect class="card" x="0" y="0" width="${width}" height="${CARD_HEIGHT - 2}" rx="12"/>
<text class="glabel" x="${SLOT_PAD + (slot - ICON) / 2}" y="25">${escapeXml(group.label)}</text>
${items.join('\n')}
</g>`;
}

export function buildStack() {
  const { placed, rows } = layoutGroups(GROUPS);
  const height = TOP + rows * CARD_HEIGHT + (rows - 1) * ROW_GAP + PAD;
  const style = `
.glabel{font-size:11px;font-weight:600;letter-spacing:1.5px;fill:${COLORS.accent}}
.name{font-size:10.5px;fill:${COLORS.muted}}`;
  const body = `${sectionLabel('Stack')}\n${placed.map(groupCard).join('\n')}`;
  return panelSvg({ height, body, style });
}
