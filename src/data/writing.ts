import type { Tone } from './projects';

// Essays link out to Substack. `art` is the picture that sits beside
// the essay — drop it in public/images/art/ and set the path.

export interface Essay {
  title: string;
  glyph?: string; // large faint character behind the art
  subtitle: string;
  date: string;
  quote?: string;
  href: string;
  art?: string;
  tone: Tone;
}

export const essays: Essay[] = [
  {
    title: 'Enishi',
    glyph: '縁',
    subtitle: 'Building the computational layer for human dynamics.',
    date: '19.07.2026',
    quote: 'We become ourselves through each other.',
    href: 'https://skylartypical.substack.com/p/enishi',
    tone: 'dusk',
  },
];
