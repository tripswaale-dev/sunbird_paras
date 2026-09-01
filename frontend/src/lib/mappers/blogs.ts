import type { Blog } from '@/data/blogsData';
import type { BlogDetail, BlogSummary } from '@/lib/api/types';

function mapBlogSummaryToBlog(summary: BlogSummary): Omit<Blog, 'content'> {
  return {
    id: summary.slug,
    slug: summary.slug,
    title: summary.title,
    excerpt: summary.excerpt,
    author: summary.author,
    date: summary.date,
    category: summary.category,
    image: summary.image,
    readTime: summary.readTime,
  };
}

export function mapBlogSummariesToBlogs(summaries: BlogSummary[]): Blog[] {
  return summaries.map(mapBlogSummaryToBlog);
}

export function mapBlogDetailToBlog(detail: BlogDetail): Blog {
  return {
    ...mapBlogSummaryToBlog(detail),
    content: detail.content,
  };
}
