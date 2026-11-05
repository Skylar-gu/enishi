// Everything on the site that is "about you" lives in src/data/.

export const site = {
  name: 'Skylar Gu',
  url: 'https://skylar-gu.vercel.app', // update once a domain is settled
  description:
    'Skylar Gu — mathematics and philosophy at McGill, researcher at Mila. Research, software, essays and art about intelligence in the space between people.',

  places: ['Montréal', 'San Francisco'],

  // Words that cycle after "I make" in the hero.
  makes: ['research', 'software', 'essays', 'rooms for people'],

  intro:
    'Mathematics and philosophy at McGill, research at Mila. Working on AI in the space between people.',

  portrait: '', // e.g. '/images/portrait.jpg'

  // The large line that opens the about section.
  thesis: 'AI is not an intelligence problem, it is a relational problem.',

  about: [
    'I am in my fifth year of Honours Mathematics and Philosophy at McGill, and a researcher at Mila – Québec AI Institute. This autumn I am Researcher in Residence at The Residency in San Francisco.',
    'My earlier research was about steering the dynamics of systems: interpretability for language models, weather models and agents. It has since converged on the relationship between people and AI — which environments, harnesses and protocols make the coupled system more intelligent, together.',
    'Alongside the research I build places for people: dinners, communities, a hackerspace.',
  ],

  facts: [
    { label: 'Now', value: 'Researcher in Residence, The Residency, San Francisco' },
    { label: 'Research', value: 'Mila – Québec AI Institute' },
    { label: 'Study', value: 'Honours Mathematics & Philosophy, McGill — Spring 2027' },
    { label: 'Community', value: 'Founder, Moxie · Space architect, Mission Robotics hackerspace' },
  ],

  // The through-line, year by year.
  research: [
    {
      year: '2025',
      text: 'Interpretability for language models, weather models, and agents.',
    },
    {
      year: '2026',
      tag: 'now',
      text: 'Neural patterns, socially emergent collective intelligence, pro-sociality.',
    },
    {
      year: '2027',
      tag: 'next',
      text: 'Unconventional forms of intelligence, substrate cohesion, AI in the spaces between.',
    },
  ],

  community:
    'I founded Moxie, a community for women in tech and AI with chapters in Montréal, London and San Francisco, and I help shape a hackerspace for hardware researchers and founders. Across all of it the goal is the same: more connection between people.',

  values: ['Causal grounding', 'Methodology first', 'Honest results over overclaiming', 'Open models'],

  links: {
    substack: 'https://skylartypical.substack.com/',
    github: 'https://github.com/Skylar-gu',
    email: '', // add an address to show a mail link in the footer
  },
};
