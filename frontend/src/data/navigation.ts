import type { NavLink } from '@/types';

/** Header Destinations dropdown + packages page filter tabs (live order). */
export const navbarDestinations = [
  'All Destinations',
  'Rajasthan',
  'Himachal Pradesh',
  'Kashmir',
  'Kerala',
  'Goa',
  'Uttarakhand',
  'Andaman',
  'North East',
  'Nepal',
  'Ladakh',
];

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
