import type { NavLink } from '@/types';

/** Header Destinations dropdown + packages page filter tabs (live order). */
export const navbarDestinations = [
  'All Destinations',
  'Rajasthan',
  'Kashmir',
  'Nepal',
  'Himachal Pradesh',
  'Uttarakhand',
  'Bhutan',
  'South India',
  'Andaman Islands',
  'North East',
  'Sri Lanka',
  'Maldives',
  'Ladakh',
];

/** Extra keywords a destination tab matches against package category, location and title. */
export const destinationFilterAliases: Record<string, string[]> = {
  'Andaman Islands': ['andaman'],
  'South India': ['kerala', 'tamil nadu', 'karnataka', 'munnar', 'ooty', 'coorg', 'alleppey', 'kodaikanal'],
  'North East': ['northeast', 'north-east', 'sikkim', 'meghalaya', 'arunachal', 'assam', 'darjeeling'],
  'Himachal Pradesh': ['himachal', 'manali', 'shimla', 'spiti'],
};

/** Site structure routes only — not destination content. */
export const navigationLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Destinations',
    href: '/destinations',
    children: [
      { label: 'Popular Destinations', href: '/destinations?category=popular' },
      { label: 'Hill Stations', href: '/destinations?category=hills' },
      { label: 'Beaches', href: '/destinations?category=beaches' },
      { label: 'Spiritual', href: '/destinations?category=spiritual' },
      { label: 'Wildlife', href: '/destinations?category=wildlife' },
      { label: 'International', href: '/destinations?category=international' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];
