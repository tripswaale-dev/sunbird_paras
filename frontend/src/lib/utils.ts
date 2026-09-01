import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_SITE_URL = 'https://sunbirdvacations.com';

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  return raw.replace(/\/$/, '');
}

export const siteConfig = {
  name: 'Sunbird Vacations',
  tagline: 'Your dream vacays start here!',
  description:
    'Sunbird Vacations offers premium travel experiences across India and beyond. Explore breathtaking destinations, curated tour packages, and unforgettable adventures.',
  url: getSiteUrl(),
  contact: {
    phone: '+91 81412 67610',
    email: 'vacations.sunbird@gmail.com',
    address: 'A-709, Krish elite, S P ring road- service road, Nikol- Ahmedabad, Gujarat 382350',
  },
  social: {
    instagram: 'https://instagram.com/sunbirdvacations',
    facebook: 'https://facebook.com/sunbirdvacations',
    youtube: 'https://youtube.com/@sunbirdvacations',
    twitter: 'https://twitter.com/sunbirdvacation',
  },
} as const;
