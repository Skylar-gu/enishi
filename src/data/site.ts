// Everything on the site that is "about you" lives in src/data/.

export const site = {
  name: 'Skylar Gu',
  url: 'https://skylar-gu.vercel.app', // update once a domain is settled
  description:
    'Skylar Gu — mathematics and philosophy at McGill, researcher at Mila. Research, software, essays and art about intelligence in the space between people.',

  places: ['Montréal', 'San Francisco'],

  // Lines that fade from one to the next under the name.
  lines: [
    'Building the computational layer for human dynamics.',
    'Steering the dynamics of systems.',
    'Cultivating relational presence for technical people.',
  ],

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
    { label: 'Community', value: 'A community for women in tech and AI · Space architect, Mission Robotics hackerspace' },
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
    'I am part of a community for women in tech and AI, and I help shape a hackerspace for hardware researchers and founders. Across all of it the goal is the same: more connection between people.',

  values: ['Causal grounding', 'Methodology first', 'Honest results over overclaiming', 'Open models'],

  // Shown under "Say hello". Leave any of these empty to hide it.
  links: {
    email: 'skylar.l.gu@gmail.com',
    x: 'https://x.com/SkylarGu7',
    instagram: 'https://www.instagram.com/skylar.gu_/',
    substack: 'https://skylartypical.substack.com/',
    github: 'https://github.com/Skylar-gu',
  },
};
