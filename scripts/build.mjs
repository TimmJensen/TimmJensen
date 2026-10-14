// Builds every profile panel into assets/
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildHero } from './sections/hero.mjs';
import { buildAbout } from './sections/about.mjs';
import { buildFocus } from './sections/focus.mjs';
import { buildStack } from './sections/stack.mjs';
import { buildActivityHeader } from './sections/activity.mjs';
import { buildQuote } from './sections/quote.mjs';

const OUT_DIR = 'assets';

const SECTIONS = {
  'hero.svg': buildHero,
  'about.svg': buildAbout,
  'focus.svg': buildFocus,
  'stack.svg': buildStack,
  'activity.svg': buildActivityHeader,
  'quote.svg': buildQuote,
};

for (const [file, build] of Object.entries(SECTIONS)) {
  writeFileSync(join(OUT_DIR, file), build());
  console.log(`Wrote ${join(OUT_DIR, file)}`);
}
