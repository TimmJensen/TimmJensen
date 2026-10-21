// Hero panel: name, title, tags and a LinkedIn call to action
import { COLORS, PAD, WIDTH, escapeXml, panelSvg } from '../lib/theme.mjs';

const HEIGHT = 230;
const TAG_CHAR_WIDTH = 6.6;
const TAG_GAP = 8;

const PROFILE = {
  name: 'Timm Jensen',
  title: 'Fullstack Developer',
  location: 'Based in Denmark',
  tags: ['Fullstack', 'Shopify', 'Integrations', 'LLM APIs'],
  cta: 'Connect on LinkedIn',
};

function tagPills(tags, x, y) {
  let cursor = x;
  return tags
    .map((tag) => {
      const width = Math.round(tag.length * TAG_CHAR_WIDTH + 24);
      const pill = `<rect x="${cursor}" y="${y}" width="${width}" height="26" rx="13" fill="${COLORS.card}" stroke="${COLORS.cardStroke}"/>
<text x="${cursor + width / 2}" y="${y + 17}" text-anchor="middle" class="tag">${escapeXml(tag)}</text>`;
      cursor += width + TAG_GAP;
      return pill;
    })
    .join('\n');
}

// Code-bracket emblem with a slowly rotating dotted orbit
function emblem(cx, cy) {
  return `<circle cx="${cx}" cy="${cy}" r="60" stroke="${COLORS.accent}" stroke-opacity=".35" stroke-dasharray="2 7" class="orbit"/>
<circle cx="${cx}" cy="${cy}" r="44" fill="${COLORS.accentSoft}" stroke="${COLORS.accent}" stroke-width="1.5"/>
<g transform="translate(${cx - 18} ${cy - 18}) scale(1.5)" stroke="${COLORS.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none">
<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14"/>
</g>`;
}

function linkedInButton(x, y) {
  const width = 212;
  return `<rect x="${x}" y="${y}" width="${width}" height="34" rx="17" fill="${COLORS.accent}"/>
<rect x="${x + 12}" y="${y + 9}" width="16" height="16" rx="3" fill="#ffffff"/>
<text x="${x + 20}" y="${y + 21.5}" text-anchor="middle" class="in">in</text>
<text x="${x + 38}" y="${y + 22}" class="cta">${escapeXml(PROFILE.cta)}</text>
<path d="M${x + width - 26} ${y + 17}h10m-4-4 4 4-4 4" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export function buildHero() {
  const style = `
.name{font-size:40px;font-weight:700;fill:${COLORS.heading};letter-spacing:-.5px}
.title{font-size:17px;fill:${COLORS.muted}}
.loc{font-size:13px;font-weight:600;fill:${COLORS.accent}}
.tag{font-size:11.5px;font-weight:600;fill:${COLORS.text}}
.cta{font-size:13px;font-weight:600;fill:#ffffff}
.in{font-size:11px;font-weight:700;fill:${COLORS.accent}}
.orbit{transform-box:fill-box;transform-origin:center;animation:spin 40s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}`;
  const body = `<rect x="${PAD}" y="${PAD + 4}" width="28" height="3" rx="1.5" fill="${COLORS.accent}"/>
<text class="name" x="${PAD}" y="${PAD + 56}">${escapeXml(PROFILE.name)}</text>
<text class="title" x="${PAD}" y="${PAD + 88}">${escapeXml(PROFILE.title)}</text>
<text class="loc" x="${PAD}" y="${PAD + 114}">${escapeXml(PROFILE.location)}</text>
${tagPills(PROFILE.tags, PAD, PAD + 132)}
${emblem(WIDTH - PAD - 106, 92)}
${linkedInButton(WIDTH - PAD - 212, PAD + 128)}`;
  return panelSvg({ height: HEIGHT, body, style });
}
