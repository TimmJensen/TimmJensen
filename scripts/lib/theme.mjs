// Shared visual system for all profile panels

export const WIDTH = 840;
export const PAD = 36;
export const INNER_WIDTH = WIDTH - PAD * 2;

export const COLORS = {
  accent: '#3B82F6',
  accentSoft: 'rgba(59,130,246,.12)',
  panel: '#0b1220',
  panelStroke: 'rgba(59,130,246,.22)',
  card: '#0f172a',
  cardStroke: 'rgba(59,130,246,.30)',
  heading: '#f1f5f9',
  text: '#cbd5e1',
  muted: '#94a3b8',
};

export const FONT_SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif';
export const FONT_MONO = 'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';

const BASE_STYLE = `
text{font-family:${FONT_SANS}}
.mono{font-family:${FONT_MONO}}
.label{font-size:11px;font-weight:600;letter-spacing:2px;fill:${COLORS.muted}}
.card{fill:${COLORS.card};stroke:${COLORS.cardStroke};stroke-width:1}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}`;

export function escapeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Greedy word wrap by character count; SVG text has no native wrapping
export function wrapText(text, maxChars) {
  const lines = [];
  let current = '';
  for (const word of text.split(' ')) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Accent dash plus spaced uppercase label, positioned at the panel's top-left
export function sectionLabel(text, x = PAD, y = 40) {
  return `<rect x="${x}" y="${y - 5}" width="20" height="2" rx="1" fill="${COLORS.accent}"/>
<text class="label" x="${x + 30}" y="${y}">${escapeXml(text.toUpperCase())}</text>`;
}

// Frameless strip holding only a section label, used above external images
export function labelSvg(text, height = 48) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" fill="none">
<style>${BASE_STYLE}</style>
${sectionLabel(text, PAD, height / 2 + 4)}
</svg>
`;
}

// Wraps content in the outer rounded panel; style holds section-specific CSS
export function panelSvg({ height, body, style = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" fill="none">
<style>${BASE_STYLE}${style}</style>
<rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="16" fill="${COLORS.panel}" stroke="${COLORS.panelStroke}"/>
${body}
</svg>
`;
}
