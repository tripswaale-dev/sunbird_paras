export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  category: DestinationCategory;
  featured: boolean;
  rating: number;
  priceStarting?: number;
}

export type DestinationCategory =
  | 'popular'
  | 'hills'
  | 'beaches'
  | 'spiritual'
  | 'wildlife'
  | 'heritage'
  | 'international'
  | 'adventure';

export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  destination: string;
  description: string;
  shortDescription: string;
  image: string;
  duration: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  highlights: string[];
  inclusions: string[];
  category: DestinationCategory;
  featured: boolean;
  badge?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  destination: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  location: string;
  width: number;
  height: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelDate: string;
  travelers: string;
  message: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}
