import type { Tone } from './projects';

// To add a piece: drop the file in public/images/art/ and set `image`.
// `ratio` is width / height of the frame; `with` names the essay a
// piece belongs to, if any.

export interface Piece {
  title: string;
  year?: string;
  image?: string;
  ratio: string;
  tone: Tone;
  with?: string;
}

export const art: Piece[] = [
  { title: 'For Enishi', year: '2026', ratio: '4 / 5', tone: 'dusk', with: 'Enishi' },
  { title: 'Untitled', ratio: '1 / 1', tone: 'blush' },
  { title: 'Untitled', ratio: '3 / 4', tone: 'sky' },
  { title: 'Untitled', ratio: '4 / 3', tone: 'sand' },
  { title: 'Untitled', ratio: '2 / 3', tone: 'sage' },
  { title: 'Untitled', ratio: '5 / 4', tone: 'clay' },
  { title: 'Untitled', ratio: '3 / 4', tone: 'blush' },
  { title: 'Untitled', ratio: '1 / 1', tone: 'sky' },
  { title: 'Untitled', ratio: '4 / 5', tone: 'sand' },
];
