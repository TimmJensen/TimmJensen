// Builds every profile panel into assets/
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildHero } from './sections/hero.mjs';
import { buildAbout } from './sections/about.mjs';
import { buildFocus } from './sections/focus.mjs';
import { buildStack } from './sections/stack.mjs';
import { buildActivityHeader } from './sections/activity.mjs';
import { buildQuote } from './sections/quote.mjs';

const OUT_DIR = 'assets';
const README = 'README.md';

const SECTIONS = {
  'hero.svg': buildHero,
  'about.svg': buildAbout,
  'focus.svg': buildFocus,
  'stack.svg': buildStack,
  'activity.svg': buildActivityHeader,
  'quote.svg': buildQuote,
};

// Content hash in the image URL so browsers and GitHub's cache fetch new versions
function withVersion(readme, file, svg) {
  const version = createHash('sha256').update(svg).digest('hex').slice(0, 8);
  const pattern = new RegExp(`assets/${file.replace('.', '\\.')}(\\?v=[a-f0-9]+)?"`, 'g');
  if (!pattern.test(readme)) throw new Error(`${README} does not reference assets/${file}`);
  return readme.replace(pattern, `assets/${file}?v=${version}"`);
}

let readme = readFileSync(README, 'utf8');
for (const [file, build] of Object.entries(SECTIONS)) {
  const svg = build();
  writeFileSync(join(OUT_DIR, file), svg);
  readme = withVersion(readme, file, svg);
  console.log(`Wrote ${join(OUT_DIR, file)}`);
}
writeFileSync(README, readme);
console.log(`Updated image versions in ${README}`);
