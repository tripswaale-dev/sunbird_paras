import { Suspense } from 'react';
import { BlogsList } from '@/components/admin/blogs/BlogsList';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

export default function AdminBlogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Blogs</h1>
          <p className="mt-2 text-sm text-gray-600">Manage blog posts for the public site.</p>
        </div>
        <Button href="/admin/blogs/new" className="rounded-lg">
          New blog
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex min-h-[240px] items-center justify-center">
            <Loader />
          </div>
        }
      >
        <BlogsList />
      </Suspense>
    </div>
  );
}
