import type { BlogContentBlock } from '@/lib/blog-content-blocks';

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  contentBlocks?: BlogContentBlock[];
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

export const blogsData: Blog[] = [
  {
    id: "blog-1",
    slug: "story-behind-sunbird-vacations",
    title: "The Story Behind Sunbird Vacations",
    excerpt: "\"Travel isn't just about reaching a destination. It's about collecting stories, creating memories, and discovering a part of yourself along the way.\"",
    content: `Two years ago, Sunbird Vacations was born from a simple dream—to transform a passion for travel into meaningful experiences for others. What started as an idea has now grown into a travel company built on trust, personalized service, and the joy of helping people explore the world with confidence.

Hi, I'm Shwetangi, the founder of Sunbird Vacations. Like many travelers, I have always believed that every journey has the power to teach, inspire, and create lifelong memories. From wandering through peaceful mountain villages and exploring vibrant cities to witnessing breathtaking sunsets by the sea, travel has always been more than just a hobby for me—it has been a way of life.

During my own travels, I realized that planning a holiday isn't always easy. Finding the right hotels, trustworthy local partners, seamless transportation, and well-crafted itineraries can often become overwhelming. That's when I decided to create Sunbird Vacations—a company that doesn't just book trips but designs experiences with care, attention to detail, and a personal touch. Every family, couple, solo explorer, corporate group, or group of friends has a unique travel style. That's why we take the time to understand your preferences and create journeys that are tailored to your interests, pace, and budget.

At Sunbird Vacations, we believe that travel isn't always about perfect plans—it's about unforgettable experiences. While we meticulously plan every journey, unexpected situations like weather changes, traffic, flight delays, or local restrictions can sometimes arise. What truly matters is knowing that you're never alone. Our team is just a call away, ready to assist, guide, and support you every step of the way, ensuring your journey continues with confidence and peace of mind.

Over the past two years, we have had the privilege of helping travellers create cherished memories across India. Our focus has always remained the same—providing reliable guidance, carefully selected stays, transparent pricing, and genuine hospitality that makes every guest feel valued.

For us, success isn't measured by the number of bookings we make—it's measured by the smiles, stories, and friendships we build along the way. Every traveller who chooses Sunbird Vacations becomes a part of our growing travel family, and that is something we truly cherish.

This is just the beginning of our journey, and we're excited to continue exploring new destinations, creating meaningful travel experiences, and inspiring more people to discover the incredible beauty our world has to offer.

Welcome to Sunbird Vacations-
Where every journey is thoughtfully planned and every traveller returns home with memories to cherish for a lifetime.`,
    author: "Shwetangi",
    date: "July 13, 2026",
    category: "Story",
    image: "/images/destinations/ladakh.jpg",
    readTime: "3 min read"
  }
];
