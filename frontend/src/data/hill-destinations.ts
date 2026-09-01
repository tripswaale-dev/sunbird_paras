export interface HillDestination {
  title: string;
  category: string;
  image: string;
  featured?: boolean;
}

export const hillDestinations: HillDestination[] = [
  {
    title: "Northern Himalayas",
    category: "Northern Himalayas",
    image: "/images/hills/himalayas.jpg",
  },
  {
    title: "North-East",
    category: "North-East",
    image: "/images/hills/northeast.jpg",
  },
  {
    title: "Southern Hill Escapes",
    category: "Southern Hill Escape",
    image: "/images/hills/southern-hills.jpg",
    featured: true,
  },
];
