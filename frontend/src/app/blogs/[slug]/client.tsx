'use client';

import { useCallback } from 'react';
import { useSlug } from '@/hooks/use-slug';
import { Calendar, Clock, User } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { HeroBanner } from '@/components/common/HeroBanner';
import { PackageList } from '@/components/sections/packages/PackageList';
import { BlogContentRenderer } from '@/components/blogs/BlogContentRenderer';
import { EmptyState } from '@/components/common/EmptyState';
import { PageDetailSkeleton } from '@/components/ui/skeleton';
import { useApiDataByKey } from '@/hooks/use-api-data';
import { getBlogBySlug, getBlogFeaturedPackages } from '@/lib/api/blogs';
import type { Blog } from '@/data/blogsData';
import type { TravelPackage } from '@/data/travelPackages';

interface BlogPageData {
  blog: Blog | undefined;
  featuredPackages: TravelPackage[];
}

export function BlogDetailClient() {
  const slug = useSlug();

  const fetcher = useCallback(async (s: string): Promise<BlogPageData> => {
    const blog = await getBlogBySlug(s);
    if (!blog) return { blog: undefined, featuredPackages: [] };
    const featuredPackages = await getBlogFeaturedPackages();
    return { blog, featuredPackages };
  }, []);

  const { data, isLoading } = useApiDataByKey<BlogPageData>(
    slug,
    fetcher,
    { blog: undefined, featuredPackages: [] }
  );

  if (isLoading) {
    return <PageDetailSkeleton />;
  }

  const { blog, featuredPackages } = data;

  if (!blog) {
    return (
      <div className="bg-surface min-h-screen py-20">
        <EmptyState
          message="Blog not found"
          subMessage="The article you're looking for doesn't exist or has been removed."
        />
      </div>
    );
  }

  return (
    <>
      <HeroBanner
        image={blog.image}
        title={blog.title}
        subtitle={blog.category}
        heightClass="h-[50vh]"
        contentPosition="bottom"
        overlayClass="bg-gradient-to-t from-black/90 via-black/40 to-transparent"
      />

      <section className="bg-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-gray-100 mb-10 text-gray-500">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-primary">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-900">{blog.author}</span>
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {blog.date}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {blog.readTime}</span>
              </div>
            </div>

            <div className="prose prose-lg prose-teal max-w-none text-gray-700">
              <p className="text-xl leading-relaxed text-primary mb-8 font-medium border-l-4 border-primary pl-6 py-2 bg-teal-50/50 rounded-r-lg whitespace-pre-line">
                {blog.excerpt}
              </p>

              {blog.contentBlocks && blog.contentBlocks.length > 0 ? (
                <BlogContentRenderer blocks={blog.contentBlocks} />
              ) : (
                blog.content?.split('\n').map((paragraph, idx) =>
                  paragraph.trim() ? (
                    <p
                      key={idx}
                      className={
                        idx === 0
                          ? 'first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none pt-2 mb-6'
                          : 'mb-6 whitespace-pre-line'
                      }
                    >
                      {paragraph}
                    </p>
                  ) : null
                )
              )}
            </div>
          </div>
        </Container>
      </section>

      {featuredPackages.length > 0 && (
        <section className="bg-gray-50 py-16">
          <Container>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Featured Packages
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our handpicked travel packages and start planning your next adventure today.
              </p>
            </div>

            <PackageList
              packages={featuredPackages}
              baseRoute="/packages"
              variant="horizontal"
            />
          </Container>
        </section>
      )}
    </>
  );
}
