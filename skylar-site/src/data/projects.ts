// To add a project image: drop the file in public/images/projects/
// and set `image: '/images/projects/your-file.jpg'`. Until then the
// card shows a soft placeholder in the given `tone`, with `want` as a
// note of what would sit well there.

export type Tone = 'sky' | 'dusk' | 'sage' | 'clay' | 'blush' | 'sand';

export interface Project {
  title: string;
  meta: string; // role · year, or whatever fits on one line
  blurb: string;
  href?: string;
  image?: string;
  credit?: string; // for an image that is someone else's work
  want?: string;
  tone: Tone;
}

export const projects: Project[] = [
  {
    title: 'Auditing Learned Dynamics in Weather Models',
    meta: 'Paper · NeurIPS 2026 workshop',
    blurb:
      'GraphCast forecasts well, and nobody knows why. This audit edits the model’s internal features while it runs. A feature tied to the model’s own grid, not to any weather, turns out to drive forecast skill, and turning up convection and vorticity features pulls hurricane forecasts toward what happened. A plain statistical correction does about as well, and the paper says so.',
    href: 'https://github.com/Skylar-gu/causal-interp-climate',
    image: '/images/projects/weather-globe.webp',
    tone: 'sky',
  },
  {
    title: 'Dose of Sound',
    meta: 'Research · Bashivan Lab, Mila',
    blurb:
      'Toward music chosen, and eventually generated, to drive a listener’s reward circuit as a way to reduce pain. So far a model can predict how a song looks to auditory cortex and which songs a person will like. The reward regions stay hard to predict, and the pain link is still a hypothesis.',
    image: '/images/projects/dose-of-sound.webp',
    tone: 'dusk',
  },
  {
    title: 'Cooperative Affordances in Gameplay',
    meta: 'Research · Mila',
    blurb:
      'Can a language model infer the mechanism behind cooperative behaviour, and does that mechanism have an identifiable direction in activation space? Sparse shift autoencoders and steering vectors in the iterated prisoner’s dilemma.',
    image: '/images/projects/cooperative-affordances.jpg',
    tone: 'clay',
  },
  {
    title: 'Brain–Agent Coupling',
    meta: 'Research · poster',
    blurb:
      'Two agents trained on a human trust game learn an internal map of the game that matches a social region of the human brain, and only after training. The brain-to-brain coupling I set out to compare against came out null, and is reported as null.',
    image: '/images/projects/brain-agent.webp',
    tone: 'sand',
  },
  {
    title: 'Scaffold',
    meta: 'Prototype · reasoning audit',
    blurb:
      'An instrument for what AI assistance does to your own reasoning. Paste a conversation with an assistant and it scores your half: Load, the share of the thinking you carried, and Rigor, the quality of it. No score without a receipt.',
    href: 'https://github.com/Skylar-gu/novarc',
    image: '/images/projects/scaffold.webp',
    tone: 'sage',
  },
  {
    title: 'Playa',
    meta: 'Unity · hackathon',
    blurb:
      'A night-time desert gathering. Twenty strangers dance out of time; you walk on and tap a rhythm; a circle ignites. A playable model of collective entrainment.',
    href: 'https://github.com/Skylar-gu/playa-unity',
    image: '/images/projects/playa.webp',
    tone: 'blush',
  },
  {
    title: 'The Agents We Assume',
    meta: 'Cooperative AI Summer School · 2026',
    blurb:
      'A cartography of the hidden metaphors, ontologies and reality gaps in multi-agent safety research — with a sixteen-type chart of assumption characters.',
    image: '/images/projects/agents-we-assume.webp',
    tone: 'sky',
  },
  {
    title: 'The Shape of Beliefs',
    meta: 'Extension · Python',
    blurb:
      'Carrying Goodfire’s Shape of Beliefs work over to a different open model, OLMo-2 in place of Llama, to test whether the same geometry of belief shows up there and whether steering along it still works.',
    href: 'https://github.com/Skylar-gu/shape-of-beliefs',
    image: '/images/projects/shape-of-beliefs.svg',
    tone: 'sand',
  },
  {
    title: 'Tree Finder',
    meta: 'Python · PostGIS · MapLibre',
    blurb:
      'Give it a place and your height and weight, and it ranks the nearby trees that are plausibly climbable, from city tree inventories, aerial imagery and street-level photos. It ranks; it never certifies a tree as safe.',
    href: 'https://github.com/Skylar-gu/tree-finder',
    image: '/images/projects/tree-finder.webp',
    tone: 'sage',
  },
];

// The fun math. Swap these for whichever pieces you had in mind.
export const math: Project[] = [
  {
    title: 'Continuous, Nowhere Differentiable',
    meta: 'Essay · history of analysis',
    blurb:
      'From Bolzano to Weierstrass: how a family of “pathological” functions forced analysis to become rigorous, and what counterexamples do for mathematics.',
    image: '/images/projects/weierstrass.svg',
    tone: 'sand',
  },
  {
    title: 'Applications of Hyperlinear and Sofic Groups to Quantum Mechanics',
    meta: 'Honours research project · McGill, 2025',
    blurb:
      'Two classes of groups defined by how well finite and matrix groups can approximate them, and why a 2020 result in quantum computing, MIP* = RE, which disproved Connes’ embedding conjecture, suggests that groups outside both classes should exist.',
    image: '/images/projects/cayley.svg',
    tone: 'blush',
  },
];
