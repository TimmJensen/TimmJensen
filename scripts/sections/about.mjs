// About panel: short intro paragraph
import { COLORS, PAD, escapeXml, panelSvg, sectionLabel, wrapText } from '../lib/theme.mjs';

const LINE_HEIGHT = 24;
const MAX_CHARS = 100;

const ABOUT = 'Lead fullstack developer based in Denmark, working mainly with Shopify and e-commerce. '
  + 'I build custom themes, Shopify Functions and app extensions, and the integrations that connect stores '
  + 'to ERP, PIM and shipping systems. I care about fast storefronts, clean architecture and code the next '
  + 'developer can pick up without a guide. AI tooling is a fixed part of how I build, test and document.';

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
