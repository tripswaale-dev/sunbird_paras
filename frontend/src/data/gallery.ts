export type GalleryCategory = 'ALL' | 'RAJASTHAN' | 'UTTARAKHAND' | 'HIMACHAL' | 'KASHMIR' | 'KERALA' | 'GOA' | 'LADAKH' | 'ANDAMAN' | 'INTERNATIONAL';

export interface GalleryItem {
  id: string;
  src: string;
  category: GalleryCategory;
  title: string;
  subtitle: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
}

export const galleryCategories: GalleryCategory[] = [
  'ALL', 
  'RAJASTHAN', 
  'UTTARAKHAND', 
  'HIMACHAL', 
  'KASHMIR', 
  'KERALA', 
  'GOA', 
  'LADAKH', 
  'ANDAMAN', 
  'INTERNATIONAL'
];

export const galleryItems: GalleryItem[] = [
  // RAJASTHAN
  {
    id: 'raj-1',
    src: '/images/destinations/jaipur.jpg',
    category: 'RAJASTHAN',
    title: 'Jaipur City',
    subtitle: 'The Pink City',
    aspectRatio: 'landscape',
  },
  {
    id: 'raj-2',
    src: '/images/destinations/jaisalmer.jpg',
    category: 'RAJASTHAN',
    title: 'Jaisalmer Fort',
    subtitle: 'Golden City of India',
    aspectRatio: 'portrait',
  },
  {
    id: 'raj-3',
    src: '/images/destinations/udaipurr.jpg',
    category: 'RAJASTHAN',
    title: 'Udaipur Lakes',
    subtitle: 'Venice of the East',
    aspectRatio: 'square',
  },
  {
    id: 'raj-4',
    src: '/images/india/rajasthan.jpg',
    category: 'RAJASTHAN',
    title: 'Desert Safari',
    subtitle: 'Thar Desert Experience',
    aspectRatio: 'landscape',
  },

  // UTTARAKHAND
  {
    id: 'uk-1',
    src: '/images/spiritual/kedarnath.jpg',
    category: 'UTTARAKHAND',
    title: 'Kedarnath Temple',
    subtitle: 'High in the Himalayas',
    aspectRatio: 'portrait',
  },
  {
    id: 'uk-2',
    src: '/images/spiritual/chardham.jpg',
    category: 'UTTARAKHAND',
    title: 'Char Dham Yatra',
    subtitle: 'Sacred Pilgrimage',
    aspectRatio: 'landscape',
  },

  // HIMACHAL
  {
    id: 'hp-1',
    src: '/images/destinations/spiti.jpg',
    category: 'HIMACHAL',
    title: 'Spiti Valley',
    subtitle: 'Cold Mountain Desert',
    aspectRatio: 'landscape',
  },
  {
    id: 'hp-2',
    src: '/images/hills/himalayas.jpg',
    category: 'HIMACHAL',
    title: 'Himalayan Peaks',
    subtitle: 'Snow-capped Mountains',
    aspectRatio: 'square',
  },

  // KASHMIR
  {
    id: 'kas-1',
    src: '/images/india/kashmir.jpg',
    category: 'KASHMIR',
    title: 'Kashmir Valley',
    subtitle: 'Paradise on Earth',
    aspectRatio: 'portrait',
  },

  // KERALA
  {
    id: 'ker-1',
    src: '/images/destinations/kerala.jpg',
    category: 'KERALA',
    title: 'Munnar Tea Gardens',
    subtitle: 'Lush Green Slopes',
    aspectRatio: 'landscape',
  },
  {
    id: 'ker-2',
    src: '/images/india/kerala.jpg',
    category: 'KERALA',
    title: 'Alleppey Backwaters',
    subtitle: 'Tranquil Houseboats',
    aspectRatio: 'portrait',
  },
  {
    id: 'ker-3',
    src: '/images/wildlife/periyar.jpg',
    category: 'KERALA',
    title: 'Periyar National Park',
    subtitle: 'Wildlife Sanctuary',
    aspectRatio: 'square',
  },

  // GOA
  {
    id: 'goa-1',
    src: '/images/destinations/goa.jpg',
    category: 'GOA',
    title: 'Palolem Beach',
    subtitle: 'Tropical Paradise',
    aspectRatio: 'landscape',
  },
  {
    id: 'goa-2',
    src: '/images/india/goa.jpg',
    category: 'GOA',
    title: 'Goan Churches',
    subtitle: 'Portuguese Heritage',
    aspectRatio: 'portrait',
  },

  // LADAKH
  {
    id: 'lad-1',
    src: '/images/destinations/ladakh.jpg',
    category: 'LADAKH',
    title: 'Pangong Lake',
    subtitle: 'High Altitude Lake',
    aspectRatio: 'landscape',
  },
  {
    id: 'lad-2',
    src: '/images/india/ladakh.jpg',
    category: 'LADAKH',
    title: 'Nubra Valley',
    subtitle: 'Cold Desert Mountains',
    aspectRatio: 'square',
  },

  // ANDAMAN
  {
    id: 'and-1',
    src: '/images/destinations/andaman.jpg',
    category: 'ANDAMAN',
    title: 'Havelock Island',
    subtitle: 'Crystal Clear Waters',
    aspectRatio: 'landscape',
  },

  // INTERNATIONAL
  {
    id: 'int-1',
    src: '/images/international/bali.jpg',
    category: 'INTERNATIONAL',
    title: 'Bali, Indonesia',
    subtitle: 'Island of the Gods',
    aspectRatio: 'portrait',
  },
  {
    id: 'int-2',
    src: '/images/international/dubai.jpg',
    category: 'INTERNATIONAL',
    title: 'Dubai, UAE',
    subtitle: 'City of Gold',
    aspectRatio: 'landscape',
  },
  {
    id: 'int-3',
    src: '/images/international/maldives.jpg',
    category: 'INTERNATIONAL',
    title: 'Maldives',
    subtitle: 'Tropical Heaven',
    aspectRatio: 'square',
  },
  {
    id: 'int-4',
    src: '/images/international/nepal.jpg',
    category: 'INTERNATIONAL',
    title: 'Nepal',
    subtitle: 'Heart of the Himalayas',
    aspectRatio: 'landscape',
  },
  {
    id: 'int-5',
    src: '/images/international/srilanka.jpg',
    category: 'INTERNATIONAL',
    title: 'Sri Lanka',
    subtitle: 'Pearl of the Indian Ocean',
    aspectRatio: 'portrait',
  },
];
