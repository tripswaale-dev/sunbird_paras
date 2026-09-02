'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import { adminBlogToFormValues, getBlog, type AdminBlog } from '@/lib/admin/blogs';
import { BlogForm } from '@/components/admin/blogs/BlogForm';
import { Loader } from '@/components/ui/loader';

export default function AdminBlogEditPage() {
  const params = useParams();
  const id = String(params.id ?? '');
  const [blog, setBlog] = useState<AdminBlog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBlog = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);

    try {
      const data = await getBlog(id);
      setBlog(data);
    } catch (error) {
      setBlog(null);

      if (error instanceof ApiError && error.status === 404) {
        setIsNotFound(true);
        return;
      }

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load blog. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadBlog();
  }, [loadBlog]);

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Blog not found</h1>
        <p className="mt-3 text-gray-600">
          This blog may have been deleted or the link is incorrect.
        </p>
        <Link
          href="/admin/blogs"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
        >
          ← Back to blogs
        </Link>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <p className="text-sm text-red-700">{errorMessage}</p>
        <button
          type="button"
          onClick={() => void loadBlog()}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <BlogForm
      mode="edit"
      blogId={blog.id}
      defaultValues={adminBlogToFormValues(blog)}
    />
  );
}
