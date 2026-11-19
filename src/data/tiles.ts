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
  { id: 'work', group: 'lavender', href: '/projects/', label: '/projects', title: 'My Work', line: 'healthcare SaaS · ERP · AI' },
  { id: 'experience', group: 'lavender', href: '/experience/', label: '/experience', title: 'Founding Engineer', line: 'NoscAi GmbH · 5 roles total' },
  // `line` is completed with the post count at build time.
  { id: 'blog', group: 'lavender', href: '/blog/', label: '/blog', title: 'Writing', line: 'backend · engineering · typescript' },
  { id: 'recommendations', group: 'mauve', label: '/recommendations', title: 'All recommendations' },
  { id: 'contact', group: 'peach', label: '/contact', title: 'Get in touch' },
];
