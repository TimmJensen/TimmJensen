// Closing quote panel
import { COLORS, PAD, escapeXml, panelSvg } from '../lib/theme.mjs';

const LINES = [
  'Understand the business, design the solution, build it to last',
  'and leave the code better than I found it.',
];
const LINE_HEIGHT = 26;

export function buildQuote() {
  const top = 50;
  const height = top + (LINES.length - 1) * LINE_HEIGHT + 34;
  const style = `.quote{font-size:17px;font-style:italic;fill:${COLORS.heading}}`;
  const text = LINES
    .map((line, i) => `<text class="quote" x="${PAD + 22}" y="${top + i * LINE_HEIGHT}">${escapeXml(line)}</text>`)
    .join('\n');
  const body = `<rect x="${PAD}" y="${top - 20}" width="3" height="${(LINES.length - 1) * LINE_HEIGHT + 28}" rx="1.5" fill="${COLORS.accent}"/>\n${text}`;
  return panelSvg({ height, body, style });
}
