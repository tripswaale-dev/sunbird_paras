import { TravelPackage } from "./travelPackages";

export const acrossBoundariesCategories = ["All International", "Beach Escapes", "Desert Safaris"];

export const acrossBoundariesPackages: TravelPackage[] = [
  {
    id: "intl-1",
    title: "Mesmerizing Sri Lanka",
    category: "All International",
    duration: "3 Nights / 4 Days",
    price: 35999,
    pax: 2,
    image: "/images/international/srilanka.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing", "Transfers"]
  },
  {
    id: "intl-2",
    title: "Highlights of Nepal",
    category: "All International",
    duration: "4 Nights / 5 Days",
    price: 25999,
    pax: 2,
    image: "/images/international/nepal.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing"]
  },
  {
    id: "intl-3",
    title: "Maldives Gateway",
    category: "Beach Escapes",
    duration: "4 Nights / 5 Days",
    price: 65999,
    pax: 2,
    image: "/images/international/maldives.jpg",
    amenities: ["Accommodation", "Meals", "Water Sports", "Transfers"]
  },
  {
    id: "intl-4",
    title: "Dubai Desert Safari",
    category: "Desert Safaris",
    duration: "4 Nights / 5 Days",
    price: 48999,
    pax: 2,
    image: "/images/international/dubai.jpg",
    amenities: ["Accommodation", "Breakfast", "Sightseeing", "Desert Safari"]
  },
  {
    id: "intl-5",
    title: "Bali Retreat",
    category: "Beach Escapes",
    duration: "5 Nights / 6 Days",
    price: 47500,
    pax: 2,
    image: "/images/international/bali.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing", "Transfers"]
  }
];
