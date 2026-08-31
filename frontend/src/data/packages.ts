import { Package } from "@/types/package";
import { TravelPackage } from "./travelPackages";
import { popularPackages } from './popularDestinationsData';
import { acrossBoundariesPackages } from './acrossBoundariesData';
import { bestOfIndiaPackages } from './bestOfIndiaData';
import { spiritualDestinationsPackages } from './spiritualDestinationsData';
import { exploreWildPackages } from './exploreWildData';
import { travelPackages } from './travelPackages';
import { hillPackages } from './hillPackages';

export const allTravelPackages: TravelPackage[] = [
  ...popularPackages,
  ...acrossBoundariesPackages,
  ...bestOfIndiaPackages,
  ...spiritualDestinationsPackages,
  ...exploreWildPackages,
  ...travelPackages,
  ...hillPackages
];

export const packages: Package[] = [
  // -----------------------------------------------------
  // Detailed Package Example (from original packages.ts)
  // -----------------------------------------------------
  {
    id: "pkg-1",
    slug: "kashmir-paradise",
    title: "Kashmir Paradise",
    subtitle: "Experience the Heaven on Earth",
    startingPrice: 7999,
    duration: { nights: 6, days: 7 },
    destinations: ["Srinagar", "Gulmarg", "Sonmarg", "Pahalgam"],
    heroImages: [
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    ],
    gallery: [
      "/Package details.jpg",
      "/Package details (1).jpg",
      "/Package details(2).jpg",
      "/Package details(3).jpg",
      "/Package details(4).jpg",
    ],
    overview: "Embark on a mesmerizing journey to Kashmir, often described as Heaven on Earth. Experience the pristine beauty of Dal Lake, the snow-capped peaks of Gulmarg, the golden meadows of Sonmarg, and the lush valleys of Pahalgam in this comprehensive 7-day tour.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar",
        description: "Arrive at Srinagar Airport and transfer to your hotel or houseboat. After check-in, enjoy a peaceful Shikara ride on Dal Lake. Later, visit nearby local market areas for Kashmiri handcrafts, dry fruits and saffron.",
        stayInformation: "Overnight stay in Srinagar.",
      },
      {
        day: 2,
        title: "Srinagar Local Sightseeing",
        description: "After breakfast, Visit the famous Mughal Gardens of Srinagar, including Shalimar Bagh, Nishat Bagh and Chashma Shahi. These gardens are known for their royal Mughal-style terraces, fountains, flower beds, water channels and beautiful views of Dal Lake and the surrounding mountains. Visit Hazratbal Shrine and enjoy scenic views around Dal Lake.\nEvening free for shopping or leisure near Boulevard Road.",
        stayInformation: "Overnight stay in Srinagar.",
      },
      {
        day: 3,
        title: "Gulmarg Day Excursion",
        description: "After breakfast, proceed for a full-day excursion to Gulmarg, one of Kashmir's most beautiful hill stations. Enjoy the famous Gulmarg Gondola ride and admire snow-capped mountain views. Guests can enjoy activities like pony rides, snow activities or photography depending on season.",
        stayInformation: "Return to Srinagar for overnight stay.",
        notes: "Note: Gulmarg traffic/vehicle rules can change during peak season, so vehicle arrangements should be checked before travel. Sightseeing in Gulmarg by UNION cabs (of own cost)."
      },
      {
        day: 4,
        title: "Sonmarg Day Excursion",
        description: "After breakfast, drive to Sonmarg, also known as the Meadow of Gold. Enjoy the beautiful Sindh River views, mountain landscapes and glacier surroundings. Optional visit to Thajiwas Glacier can be done by local pony/union vehicle, if operational.",
        stayInformation: "Return to Srinagar by evening for overnight stay.",
      },
      {
        day: 5,
        title: "Srinagar to Pahalgam",
        description: "After breakfast, proceed towards Pahalgam, one of the most scenic valleys of Kashmir. On the way, enjoy views of saffron fields, apple orchards and the beautiful countryside. After check-in, explore local Pahalgam market or relax near the Lidder River.",
        stayInformation: "Overnight stay in Pahalgam.",
      },
      {
        day: 6,
        title: "Pahalgam sightseeing",
        description: "After breakfast, guests can explore Betaab Valley, Aru Valley and Chandanwari, three of the most beautiful sightseeing points around Pahalgam. Aru Valley is known for its peaceful meadows, pine forests, mountain views and starting points for several treks. Betaab Valley is famous for its lush green landscapes, river views and Bollywood connection, as the movie Betaab was shot here. Chandanwari is known for snow views during season and is also the starting point of the traditional Amarnath Yatra route. Enjoy the peaceful natural beauty, pine forests and mountain views.",
        stayInformation: "Overnight stay at Pahalgam.",
        notes: "NOTE: Sightseeing in Pahalgam has to be done by Union cabs."
      },
      {
        day: 7,
        title: "Departure",
        description: "Today after relishing the breakfast, get an assured transfer to Srinagar airport or railway station to wind up the Paradise tour with the most cherishable memories.",
      }
    ],
    sightseeing: [
      "Dal Lake",
      "Shikara Ride",
      "Mughal Gardens",
      "Shalimar Bagh",
      "Nishat Bagh",
      "Local Market",
      "Gulmarg Gondola",
      "Sonmarg Valley",
      "Sindh River view",
      "Pahalgam Valley",
      "Lidder River",
      "Aru Valley",
      "Betaab Valley",
      "Chandanwari",
      "Local Pahalgam Market"
    ],
    inclusions: [
      "Srinagar to Srinagar vehicle service as per itinerary",
      "Airport pick-up and drop from Srinagar Airport",
      "Accommodation for 6 nights / 7 days",
      "MAPAI meal plan: breakfast and dinner included",
      "Stay in Srinagar / Gulmarg / Pahalgam as per final hotel plan",
      "Shikara ride on Dal Lake once during the tour",
      "Sightseeing as per itinerary: Srinagar, Gulmarg, Sonmarg and Pahalgam",
      "Driver allowance, toll tax, parking and fuel charges",
      "All applicable hotel taxes, if included in final costing",
      "Assistance during the tour"
    ],
    exclusions: [
      "Airfare / train fare",
      "Lunch, snacks, beverages and personal food orders",
      "Entry tickets, garden tickets and monument fees",
      "Gulmarg Gondola tickets",
      "Pony ride, horse ride, ATV ride, skiing or snow activities",
      "Local union vehicle charges in Gulmarg, Sonmarg and Pahalgam",
      "ABC Valley sightseeing by local vehicle in Pahalgam: Aru Valley, Betaab Valley and Chandanwari",
      "Thajiwas Glacier visit charges in Sonmarg",
      "Any guide charges",
      "Room heater charges, if hotel charges separately",
      "Laundry, tips, porter, camera charges and personal expenses",
      "Any extra sightseeing not mentioned in the itinerary",
      "Costs arising due to weather, road closure, landslide, flight delay, traffic restrictions or government rules",
      "GST, if not included in package cost"
    ],
    highlights: [
      "Shikara Ride on Dal Lake",
      "Srinagar Mughal Gardens",
      "Gulmarg Gondola Experience",
      "Sonmarg Valley & Thajiwas Glacier",
      "Pahalgam Valley Stay",
      "Betaab Valley, Aru Valley & Chandanwari",
      "Houseboat / Hotel Stay Option",
      "Perfect for families, couples and group tours"
    ],
    faqs: [
      {
        question: "What is the best time to visit Kashmir?",
        answer: "The best time to visit Kashmir is from March to October when the weather is pleasant and flowers are in full bloom. However, if you want to experience snow and winter sports, December to February is ideal."
      },
      {
        question: "Is the Gondola ride included in the package?",
        answer: "No, the Gulmarg Gondola tickets are not included in the base package and need to be booked separately or added on request. It is highly recommended to book them online well in advance."
      },
      {
        question: "Are Union cabs required for local sightseeing?",
        answer: "Yes, in places like Gulmarg (for local transfers during snow) and Pahalgam (for Aru, Betaab Valley, and Chandanwari), outside vehicles are not allowed by local unions. You will need to hire local union cabs at your own cost."
      }
    ],
  }
];

export const getPackageBySlug = (slug: string): Package | undefined => {
  const foundPackage = packages.find((p) => p.slug === slug);
  if (foundPackage) return foundPackage;

  // Fallback to dynamically constructing a detailed Package from our TravelPackage lists
  const tp = allTravelPackages.find((p) => p.id === slug);
  if (!tp) return undefined;

  const nightsMatch = tp.duration.match(/\d+/);
  const nights = nightsMatch ? parseInt(nightsMatch[0], 10) : 3;
  const days = nights + 1;

  return {
    id: tp.id,
    slug: tp.id,
    title: tp.title,
    subtitle: `Experience ${tp.title}`,
    startingPrice: tp.price,
    duration: { nights, days },
    destinations: [tp.title],
    heroImages: [tp.image],
    gallery: [tp.image, tp.image, tp.image],
    overview: `Embark on a mesmerizing journey with our ${tp.title} package. Enjoy hand-picked experiences, comfortable accommodations, and unforgettable moments curated just for you.`,
    itinerary: Array.from({ length: days }).map((_, i) => ({
      day: i + 1,
      title: `Day ${i + 1} in ${tp.title}`,
      description: `Explore the beautiful surroundings, relax, and enjoy the amenities included in your package. Our local representatives will ensure a memorable experience.`,
      stayInformation: "Overnight stay at hotel.",
    })),
    sightseeing: ["Local sights", "Popular viewpoints", "Cultural experiences"],
    inclusions: tp.amenities || ["Accommodation", "Meals", "Sightseeing"],
    exclusions: ["Airfare / train fare", "Personal expenses", "Any extra sightseeing not mentioned"],
    highlights: [`Unforgettable ${tp.title} experience`, "Comfortable stays", "Curated local sightseeing"],
    faqs: [
      {
        question: `What is the best time to book the ${tp.title} package?`,
        answer: "We recommend booking at least a few weeks in advance to secure the best accommodations and rates."
      }
    ],
  };
};

export const getRelatedPackages = (currentSlug: string, limit: number = 3): Package[] => {
  const manualRelated = packages.filter((p) => p.slug !== currentSlug);
  if (manualRelated.length >= limit) return manualRelated.slice(0, limit);

  // If we need more related packages, we can mock them from allTravelPackages
  const extraRelated = allTravelPackages
    .filter((p) => p.id !== currentSlug)
    .slice(0, limit)
    .map(p => getPackageBySlug(p.id) as Package);
    
  return [...manualRelated, ...extraRelated].slice(0, limit);
};
