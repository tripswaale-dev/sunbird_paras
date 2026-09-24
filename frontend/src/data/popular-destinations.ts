export interface PopularDestination {
  name: string;
  location: string;
  duration: string;
  imageSrc: string;
  href: string;
}

export interface PopularStat {
  value: string;
  label: string;
}

export const popularDestinations: PopularDestination[] = [
  { name: 'Essence of Nepal', location: 'Starts at ₹28,500', duration: '5N / 6D', imageSrc: '/images/international/nepal.jpg', href: '/packages/essence-of-nepal' },
  { name: 'Spiti Valley', location: 'Starts at ₹42,000', duration: '10N / 11D', imageSrc: '/images/destinations/spiti.jpg', href: '/packages/spiti-valley' },
  { name: 'Explore Arunachal', location: 'Starts at ₹33,700', duration: '6N / 7D', imageSrc: '/images/hills/northeast.jpg', href: '/packages/explore-arunachal' },
  { name: 'Tirthan Valley', location: 'Starts at ₹21,400', duration: '4N / 5D', imageSrc: '/images/hills/himalayas.jpg', href: '/packages/tirthan-valley' },
  { name: 'Heavenly Kashmir', location: 'Starts at ₹29,000', duration: '6N / 7D', imageSrc: '/images/india/kashmir.jpg', href: '/packages/heavenly-kashmir' },
];

export const popularDestinationsGridSlots = [
  { colSpan: 'col-span-12 lg:col-span-3', rowSpan: 'lg:row-span-2', height: 'h-[300px] lg:h-[420px]' },
  { colSpan: 'col-span-12 lg:col-span-3', rowSpan: 'lg:row-span-2', height: 'h-[300px] lg:h-[420px]' },
  { colSpan: 'col-span-12 lg:col-span-6', rowSpan: 'lg:row-span-1', height: 'h-[250px] lg:h-[200px]' },
  { colSpan: 'col-span-12 md:col-span-6 lg:col-span-3', rowSpan: 'lg:row-span-1', height: 'h-[250px] lg:h-[200px]' },
  { colSpan: 'col-span-12 md:col-span-6 lg:col-span-3', rowSpan: 'lg:row-span-1', height: 'h-[250px] lg:h-[200px]' },
];

export const popularStats: PopularStat[] = [
  { value: '2+', label: 'years of experience' },
  { value: '90+', label: 'happy travellers' },
  { value: '50+', label: 'curated travel packages' },
  { value: '15+', label: 'destinations covered' },
];
