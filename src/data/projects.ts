// To add a project image: drop the file in public/images/projects/
// and set `image: '/images/projects/your-file.jpg'`. Until then the
// card shows a soft placeholder in the given `tone`.

export type Tone = 'sky' | 'dusk' | 'sage' | 'clay' | 'blush' | 'sand';

export interface Project {
  title: string;
  meta: string; // role · year, or whatever fits on one line
  blurb: string;
  href?: string;
  image?: string;
  tone: Tone;
}

const TODO = 'A line or two about this one — to come.';

export const projects: Project[] = [
  {
    title: 'Enishi',
    meta: 'Ongoing',
    blurb:
      'A computational layer for human dynamics — modelling how two minds shape one another in conversation.',
    href: 'https://github.com/Skylar-gu/enishi',
    tone: 'dusk',
  },
  {
    title: 'Novarc',
    meta: 'TypeScript',
    blurb: 'AI that builds human capability.',
    href: 'https://github.com/Skylar-gu/novarc',
    tone: 'sage',
  },
  {
    title: 'Causal Interp · Climate',
    meta: 'Research · Python',
    blurb: 'Causal discovery and interventions inside GraphCast.',
    href: 'https://github.com/Skylar-gu/causal-interp-climate',
    tone: 'sky',
  },
  {
    title: 'Trace Monitor',
    meta: 'JavaScript',
    blurb: TODO,
    href: 'https://github.com/Skylar-gu/trace-monitor',
    tone: 'clay',
  },
  {
    title: 'Agentic Preferences',
    meta: 'Research · Python',
    blurb: TODO,
    href: 'https://github.com/Skylar-gu/agentic-preferences',
    tone: 'blush',
  },
  {
    title: 'Sea Ice Processing',
    meta: 'Python',
    blurb: TODO,
    href: 'https://github.com/Skylar-gu/SeaIceProcessing',
    tone: 'sand',
  },
];

// The one or two fun math projects.
export const math: Project[] = [
  {
    title: 'Untitled, for now',
    meta: 'Mathematics',
    blurb: 'A fun math project — title, picture and a line to come.',
    tone: 'sand',
  },
  {
    title: 'Untitled, also',
    meta: 'Mathematics',
    blurb: 'A second one, if there is a second one.',
    tone: 'blush',
  },
];
