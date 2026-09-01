import type { HomepageResponse } from '@/lib/api/types';

export const staticHomepage: HomepageResponse = {
  hero: {
    backgroundVideo: '/bg1.mp4',
    chips: [
      { icon: 'mountain', label: 'Mountains' },
      { icon: 'umbrella', label: 'Beaches' },
      { icon: 'tree-pine', label: 'Nature' },
    ],
    featuredChip: {
      icon: 'map-pin',
      label: 'Trending in India',
    },
  },
  customerPromises: [
    {
      id: 1,
      title: 'We Listen',
      description:
        'Facing an issue on your trip? Reach us out anytime. We are all ears.',
      icon: 'headphones',
    },
    {
      id: 2,
      title: 'We Act Fast',
      description: 'Our team works immediately to resolve the problem.',
      icon: 'alarm-clock',
    },
    {
      id: 3,
      title: 'We Take Responsibility',
      description:
        'If the issue is from our end, we take full responsibility and make it right.',
      icon: 'handshake',
    },
    {
      id: 4,
      title: 'We Stay with You',
      description:
        'From start to end, we are with you at every step of your journey.',
      icon: 'users',
    },
  ],
};
