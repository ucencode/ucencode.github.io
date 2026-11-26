import type { Group } from '@/lib/routes';

export type TileId = 'about' | 'work' | 'experience' | 'blog' | 'recommendations' | 'contact';

export interface Tile {
  id: TileId;
  group: Group;
  /** Set when the whole tile is a link. */
  href?: string;
  label: string;
  title: string;
  /** Secondary line; hidden when the tile is narrow. */
  line?: string;
}

/**
 * Homepage tiles in DOM order, which is also the phone and tablet order.
 * Desktop places them with grid areas (row 1 About · Work · Experience,
 * row 2 Contact · Recommendations · Blog).
 */
export const tiles: Tile[] = [
  { id: 'about', group: 'peach', href: '/about/', label: '/about', title: 'Ahmad Husein Hambali', line: 'Fullstack & Product Engineer' },
  { id: 'work', group: 'lavender', href: '/projects/', label: '/projects', title: 'My Work' },
  { id: 'experience', group: 'lavender', href: '/experience/', label: '/experience', title: 'Experience' },
  { id: 'blog', group: 'lavender', href: '/blog/', label: '/blog', title: 'Writing' },
  { id: 'recommendations', group: 'mauve', label: '/recommendations', title: 'All recommendations' },
  { id: 'contact', group: 'peach', label: '/contact', title: 'Want to hire me?', line: 'Let’s talk about the problem you need an engineer to solve.' },
];
