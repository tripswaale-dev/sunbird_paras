import { HeroBanner } from '@/components/common/HeroBanner';
import { BlogList } from '@/components/sections/blogs/BlogList';
import { getBlogsListing } from '@/lib/api/blogs';

export const metadata = {
  title: 'Travel Blogs | Sunbird Vacations',
  description: 'Read the latest travel tips, destination guides, and stories from Sunbird Vacations.',
};

export default async function BlogsPage() {
  const blogs = await getBlogsListing();

  return (
    <>
      <HeroBanner
        image="/images/destinations/ladakh.jpg"
        title="Travel Stories & Guides"
        subtitle="Get inspired for your next adventure with our expert travel insights."
        contentPosition="bottom"
        overlayClass="bg-gradient-to-t from-black/90 via-black/40 to-transparent"
      />
      <BlogList blogs={blogs} />
    </>
  );
}
