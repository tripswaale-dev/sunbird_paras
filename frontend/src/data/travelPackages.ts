export interface TravelPackage {
  id: string;
  title: string;
  category: string;
  duration: string;
  price: number;
  pax: number;
  image: string;
  amenities: string[];
}

export const travelCategories = ["Pocket Friendly", "Adventure & Thrill", "Off Beat", "Couple Getaways"];

export const travelPackages: TravelPackage[] = [
  {
    id: "pkg-1",
    title: "Udaipur Getaway",
    category: "Pocket Friendly",
    duration: "2 Nights / 3 Days",
    price: 7999,
    pax: 2,
    image: "/images/destinations/jaipur.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing"]
  },
  {
    id: "pkg-2",
    title: "Coorg Weekend",
    category: "Adventure & Thrill",
    duration: "2 Nights / 3 Days",
    price: 7999,
    pax: 2,
    image: "/images/hills/southern-hills.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing"]
  },
  {
    id: "pkg-3",
    title: "Spiti Valley Circuit",
    category: "Off Beat",
    duration: "7 Nights / 8 Days",
    price: 28999,
    pax: 2,
    image: "/images/destinations/spiti.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing"]
  },
  {
    id: "pkg-4",
    title: "Andaman Couple Retreat",
    category: "Couple Getaways",
    duration: "5 Nights / 6 Days",
    price: 34999,
    pax: 2,
    image: "/images/destinations/andaman.jpg",
    amenities: ["Accommodation", "Meals", "Sightseeing"]
  }
];
