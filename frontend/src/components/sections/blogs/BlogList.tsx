'use client';

import React from 'react';
import { Container } from '@/components/ui/container';
import { BlogCard } from '@/components/cards/BlogCard';
import type { Blog } from '@/data/blogsData';

interface BlogListProps {
  blogs: Blog[];
}

export function BlogList({ blogs }: BlogListProps) {
  return (
    <section className="bg-gray-50 py-20 min-h-screen">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
            Latest Articles
          </h2>
          <p className="text-gray-600 text-lg">
            Discover travel tips, guides, and stories to inspire your next adventure.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </Container>
    </section>
  );
}
