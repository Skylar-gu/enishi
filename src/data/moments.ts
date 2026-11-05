import type { Tone } from './projects';

// Photographs of rooms and gatherings. Drop a file in
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
  { caption: 'Dinner', place: 'London', want: 'the table, mid-dinner', ratio: '4 / 5', tone: 'clay' },
  { caption: 'The Residency', place: 'San Francisco', want: 'the house or a work session', ratio: '3 / 2', tone: 'sky' },
  { caption: 'Dinner', place: 'San Francisco', want: 'faces, candlelight', ratio: '1 / 1', tone: 'blush' },
  { caption: 'Hackerspace', place: 'San Francisco', want: 'benches, robots, people', ratio: '3 / 4', tone: 'sage' },
  { caption: 'Talk To Me About', place: 'workshop poster', want: 'the poster with sticky notes', ratio: '4 / 5', tone: 'sand' },
];
