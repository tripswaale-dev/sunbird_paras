export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  stayInformation?: string;
  notes?: string;
  images?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  startingPrice: number;
  duration: {
    nights: number;
    days: number;
  };
  destinations: string[];
  heroImages: string[];
  gallery: string[];
  overview: string;
  itinerary: ItineraryDay[];
  sightseeing: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  faqs: FAQ[];
}
