// The shelves that sit under the Writing section: at most four titles each.
// Titles marked "yours" are ones you named; the rest were chosen to sit
// beside them. Swap in the ones you actually carry.

export interface Entry {
  title: string;
  by?: string;
  href?: string;
}

export interface Shelf {
  label: string;
  items: Entry[];
}

export const shelves: Shelf[] = [
  {
    label: 'Love and philosophy',
    items: [
      { title: 'Being and Nothingness', by: 'Jean-Paul Sartre' }, // yours (Sartre)
      { title: 'I and Thou', by: 'Martin Buber' }, // from the quotes that used to sit here
      { title: 'The Art of Loving', by: 'Erich Fromm' }, // psychology; my pick
      { title: 'The Picture of Dorian Gray', by: 'Oscar Wilde' }, // yours
    ],
  },
  {
    label: 'Culture and identity',
    items: [
      { title: 'Pachinko', by: 'Min Jin Lee' }, // yours
      { title: 'Free Food for Millionaires', by: 'Min Jin Lee' }, // yours
      { title: 'The Tea Girl of Hummingbird Lane', by: 'Lisa See' }, // yours
      { title: 'The Woman Warrior', by: 'Maxine Hong Kingston' },
    ],
  },
  {
    label: 'Reading, on Substack',
    items: [
      { title: 'Antikythera', href: 'https://antikythera.substack.com/' },
      { title: 'Cosmos Institute', href: 'https://blog.cosmos-institute.org/' },
      { title: 'Protocolized', href: 'https://protocolized.summerofprotocols.com/' },
    ],
  },
];
