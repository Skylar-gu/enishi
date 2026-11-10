import type { Tone } from './projects';

// Everything on the art page. To add a piece: drop the file in
// public/images/art/ (or photos/, dance/) and set `image`.
// `ratio` is width / height of the frame. A piece without an image
// shows a placeholder carrying its `want` note. The titles below are
// working titles — rename freely.

export interface Piece {
  title: string;
  medium?: string;
  year?: string;
  image?: string;
  ratio: string;
  tone: Tone;
  with?: string; // the essay or project a piece belongs to
  want?: string;
}

export const art: Piece[] = [
  {
    title: 'Flowing forms',
    medium: 'painting',
    image: '/images/art/flowing-forms.webp',
    ratio: '768 / 1024',
    tone: 'sky',
  },
  {
    title: 'Figure behind glass',
    medium: 'graphite',
    image: '/images/art/figure-behind-glass.webp',
    ratio: '721 / 1090',
    tone: 'sand',
  },
  {
    title: 'Blind contour, self',
    medium: 'ink',
    image: '/images/art/blind-contour-self.webp',
    ratio: '784 / 1002',
    tone: 'sage',
  },
  {
    title: 'Hands, earth, gold',
    medium: 'painting',
    image: '/images/art/hands-earth-gold.webp',
    ratio: '762 / 1030',
    tone: 'dusk',
  },
];

export const photos: Piece[] = [
  {
    title: 'Specimens',
    image: '/images/photos/specimens.webp',
    ratio: '768 / 1024',
    tone: 'sage',
  },
  {
    title: 'Furnace and sky',
    image: '/images/photos/furnace-sky.webp',
    ratio: '768 / 1024',
    tone: 'sky',
  },
  {
    title: 'Ribbons',
    image: '/images/photos/ribbon-books.webp',
    ratio: '1024 / 768',
    tone: 'clay',
  },
  // Chosen, but the files have not reached the site yet.
  { title: 'Figure in fog', year: '2023', ratio: '2 / 3', tone: 'sage', want: 'white figure in the fog' },
  { title: 'Pillars in cloud', ratio: '3 / 4', tone: 'sky', want: 'stone pillars in cloud' },
  { title: 'Bridge at dusk', ratio: '4 / 3', tone: 'dusk', want: 'arched bridge at dusk' },
  { title: 'Birdcage', ratio: '1 / 1', tone: 'sand', want: 'birdcage on the air conditioner' },
];

export const dance: Piece[] = [
  { title: 'Movement', ratio: '4 / 5', tone: 'blush', want: 'dance clip to come' },
];
