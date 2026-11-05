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
  want?: string;
  tone: Tone;
}

export const projects: Project[] = [
  {
    title: 'Enishi',
    meta: 'Ongoing',
    blurb:
      'The computational layer for human dynamics. Per-person agents, with context you control, that talk to one another to surface who you should meet.',
    href: 'https://skylartypical.substack.com/p/enishi',
    want: 'a sketch of the agent village',
    tone: 'dusk',
  },
  {
    title: 'Auditing Learned Dynamics in Weather Models',
    meta: 'Paper · NeurIPS 2026 workshop',
    blurb:
      'Sparse autoencoders trained on GraphCast’s internal activations, then causal interventions on single features in the real model. The negative results and a retraction stay in the writeup.',
    href: 'https://github.com/Skylar-gu/causal-interp-climate',
    want: 'a feature map over a hurricane',
    tone: 'sky',
  },
  {
    title: 'worldaudit',
    meta: 'Tool · 2026',
    blurb: 'An interactive globe for watching, and intervening on, GraphCast forecasts.',
    href: 'https://github.com/Skylar-gu/world-audit',
    want: 'a screenshot of the globe',
    tone: 'sage',
  },
  {
    title: 'Cooperative Affordances in Gameplay',
    meta: 'Research · Mila',
    blurb:
      'Can a language model infer the mechanism behind cooperative behaviour, and does that mechanism have an identifiable direction in activation space? Sparse shift autoencoders and steering vectors in the iterated prisoner’s dilemma.',
    want: 'a steering plot',
    tone: 'clay',
  },
  {
    title: 'Brain–Agent Coupling',
    meta: 'Research',
    blurb:
      'Testing whether the internal states of cooperating AI agents mirror the real-time brain coupling seen between cooperating people.',
    want: 'the coupling figure',
    tone: 'blush',
  },
  {
    title: 'Playa',
    meta: 'Unity · hackathon',
    blurb:
      'A night-time desert gathering. Twenty strangers dance out of time; you walk on and tap a rhythm; a circle ignites. A playable model of collective entrainment.',
    href: 'https://github.com/Skylar-gu/playa-unity',
    want: 'a still of the dance floor',
    tone: 'dusk',
  },
  {
    title: 'The Agents We Assume',
    meta: 'Work in progress',
    blurb:
      'A cartography of the hidden metaphors, ontologies and reality gaps in multi-agent safety research — with a sixteen-type chart of assumption characters.',
    want: 'the sixteen-type chart',
    tone: 'sand',
  },
  {
    title: 'Novarc',
    meta: 'TypeScript',
    blurb: 'AI that builds human capability.',
    href: 'https://github.com/Skylar-gu/novarc',
    want: 'a screenshot of the app',
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
    want: 'a Weierstrass curve',
    tone: 'sand',
  },
  {
    title: 'A KL Divergence Estimator',
    meta: 'Statistics · in progress',
    blurb: 'Estimating the KL divergence with Sequential Monte Carlo. Unpublished.',
    want: 'particles converging',
    tone: 'blush',
  },
];
