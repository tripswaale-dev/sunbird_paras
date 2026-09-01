export interface InternationalPackage {
  title: string;
  image: string;
  price: string;
  location: string;
  duration: string;
  href: string;
  rating?: number;
  reviews?: number;
}

export const internationalPackages: InternationalPackage[] = [
  {
    title: "Mesmerizing Sri Lanka",
    image: "/images/international/srilanka.jpg",
    price: "₹5,999",
    rating: 4.8,
    reviews: 69,
    location: "SRI LANKA",
    duration: "3 nights / 4 days",
    href: "/across-boundaries/intl-1",
  },
  {
    title: "Highlights of Nepal",
    image: "/images/international/nepal.jpg",
    price: "₹5,999",
    rating: 4.8,
    reviews: 69,
    location: "NEPAL",
    duration: "3 nights / 4 days",
    href: "/across-boundaries/intl-2",
  },
  {
    title: "Maldives Gateway",
    image: "/images/international/maldives.jpg",
    price: "₹5,999",
    rating: 4.8,
    reviews: 69,
    location: "MALDIVES",
    duration: "3 nights / 4 days",
    href: "/across-boundaries/intl-3",
  },
  {
    title: "Dubai Desert Safari",
    image: "/images/international/dubai.jpg",
    price: "₹8,999",
    rating: 4.9,
    reviews: 120,
    location: "DUBAI",
    duration: "4 nights / 5 days",
    href: "/across-boundaries/intl-4",
  },
  {
    title: "Bali Retreat",
    image: "/images/international/bali.jpg",
    price: "₹7,500",
    rating: 4.7,
    reviews: 85,
    location: "BALI",
    duration: "5 nights / 6 days",
    href: "/across-boundaries/intl-5",
  },
];
