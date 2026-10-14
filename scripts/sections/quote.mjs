// Recommendation panel: quoted excerpt with attribution
import { COLORS, PAD, escapeXml, panelSvg, sectionLabel, wrapText } from '../lib/theme.mjs';

const QUOTE = 'What I value most about Timm is his ability to understand a task far beyond the technical '
  + 'implementation. He doesn’t just work from a list of requirements – he digs into the purpose, '
  + 'the client’s needs and the solution as a whole, and often brings ideas that lift the result '
  + 'beyond what was originally asked for.';
const AUTHOR = 'Mathias Liljeberg';
const AUTHOR_ROLE = 'Project Manager';

const MAX_CHARS = 92;
const LINE_HEIGHT = 26;
const TOP = 80;

export function buildQuote() {
  const lines = wrapText(`“${QUOTE}”`, MAX_CHARS);
  const textBottom = TOP + (lines.length - 1) * LINE_HEIGHT;
  const authorY = textBottom + 40;
  const height = authorY + PAD;
  const style = `
.quote{font-size:16.5px;font-style:italic;fill:${COLORS.heading}}
.author{font-size:14px;font-weight:600;fill:${COLORS.accent}}
.role{font-size:14px;fill:${COLORS.muted}}`;
  const text = lines
    .map((line, i) => `<text class="quote" x="${PAD + 22}" y="${TOP + i * LINE_HEIGHT}">${escapeXml(line)}</text>`)
    .join('\n');
  const body = `${sectionLabel('Recommendation')}
<rect x="${PAD}" y="${TOP - 20}" width="3" height="${textBottom - TOP + 28}" rx="1.5" fill="${COLORS.accent}"/>
${text}
<text x="${PAD + 22}" y="${authorY}"><tspan class="author">— ${escapeXml(AUTHOR)}</tspan><tspan class="role">, ${escapeXml(AUTHOR_ROLE)}</tspan></text>`;
  return panelSvg({ height, body, style });
}
