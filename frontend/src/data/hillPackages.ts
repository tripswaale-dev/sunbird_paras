import { TravelPackage } from "./travelPackages";

export const hillCategories = ["Northern Himalayas", "North-East", "Southern Hill Escape"];

export const hillPackages: TravelPackage[] = [
  {
    id: "hill-1",
    title: "Shimla Manali Tour",
    category: "Northern Himalayas",
    duration: "5 Nights / 6 Days",
    price: 12999,
    pax: 2,
    image: "/images/hills/himalayas.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing", "Transfers"]
  },
  {
    id: "hill-2",
    title: "Darjeeling & Gangtok",
    category: "North-East",
    duration: "4 Nights / 5 Days",
    price: 15999,
    pax: 2,
    image: "/images/hills/northeast.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing", "Transfers"]
  },
  {
    id: "hill-3",
    title: "Munnar & Ooty Escape",
    category: "Southern Hill Escape",
    duration: "4 Nights / 5 Days",
    price: 14500,
    pax: 2,
    image: "/images/hills/southern-hills.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing", "Transfers"]
  }
];
