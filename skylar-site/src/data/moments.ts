import type { Tone } from './projects';

// Photographs for the Salons section. Drop a file in
// public/images/moments/ and set `image`; `want` is the note shown on
// the placeholder until then.

export interface Moment {
  caption: string;
  place?: string;
  want: string;
  image?: string;
  ratio: string;
  tone: Tone;
}

export const moments: Moment[] = [
  { caption: 'Neuro × AI', want: '', ratio: '4 / 5', tone: 'clay' },
  { caption: 'Art × Robotics', want: '', ratio: '3 / 2', tone: 'sage' },
];
