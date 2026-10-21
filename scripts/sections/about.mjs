// About panel: short intro paragraph
import { COLORS, PAD, escapeXml, panelSvg, sectionLabel, wrapText } from '../lib/theme.mjs';

const LINE_HEIGHT = 24;
const MAX_CHARS = 99;

const ABOUT = 'Fullstack developer in Denmark (~8 years). I build web products end to end, from React/TypeScript '
  + 'frontends to Node/Express and PHP/Laravel backends, and I ship product features powered by LLM APIs '
  + '(OpenAI, Anthropic). Currently at ShopHelten, building Shopify apps, integrations and storefronts. '
  + 'I care about clean architecture and code the next developer can pick up without a guide.';

export function buildAbout() {
  const lines = wrapText(ABOUT, MAX_CHARS);
  const top = 76;
  const height = top + (lines.length - 1) * LINE_HEIGHT + 34;
  const style = `.body{font-size:14.5px;fill:${COLORS.text}}`;
  const text = lines
    .map((line, i) => `<text class="body" x="${PAD}" y="${top + i * LINE_HEIGHT}">${escapeXml(line)}</text>`)
    .join('\n');
  return panelSvg({ height, body: `${sectionLabel('About')}\n${text}`, style });
}
