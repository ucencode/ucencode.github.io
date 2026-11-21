export type Group = 'peach' | 'lavender' | 'mauve';

/** Site routes in header order, each with the accent colour of its group. */
export const routes: { href: string; label: string; group: Group }[] = [
  { href: '/about/', label: 'about', group: 'peach' },
  { href: '/projects/', label: 'projects', group: 'lavender' },
  { href: '/experience/', label: 'experience', group: 'lavender' },
  { href: '/blog/', label: 'blog', group: 'lavender' },
  { href: '/recommendations/', label: 'recommendations', group: 'mauve' },
];
