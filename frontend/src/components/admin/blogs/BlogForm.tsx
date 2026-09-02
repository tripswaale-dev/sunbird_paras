'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import {
  applyApiErrors,
  createBlog,
  slugifyTitle,
  toBlogPayload,
  updateBlog,
} from '@/lib/admin/blogs';
import {
  blogFormSchema,
  type BlogFormValues,
} from '@/lib/admin/blog-form-schema';
import { BlogDeleteButton } from '@/components/admin/blogs/BlogDeleteButton';
import { AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BlogFormProps {
  mode: 'create' | 'edit';
  defaultValues: BlogFormValues;
  blogId?: number;
}

export function BlogForm({ mode, defaultValues, blogId }: BlogFormProps) {
  const router = useRouter();
  const slugTouchedRef = useRef(mode === 'edit');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    defaultValues,
  });

  const isActive = watch('is_active');
  const slug = watch('slug');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = blogFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          setError(field as keyof BlogFormValues, { message: issue.message });
        }
      }

      return;
    }

    const payload = toBlogPayload(parsed.data);

    try {
      if (mode === 'create') {
        await createBlog(payload);
      } else if (blogId) {
        await updateBlog(blogId, payload);
      }

      router.push('/admin/blogs');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save blog. Please try again.');
    }
  });

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const title = event.target.value;

    if (mode === 'create' && !slugTouchedRef.current) {
      setValue('slug', slugifyTitle(title));
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {mode === 'create' ? 'New blog' : 'Edit blog'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {mode === 'create'
              ? 'Create a new blog post for the public site.'
              : 'Update blog content and SEO settings.'}
          </p>
        </div>

        {mode === 'edit' && blogId ? (
          <div className="flex flex-wrap items-center gap-3">
            {isActive && slug ? (
              <Link
                href={`/blogs/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                View on site
              </Link>
            ) : null}
            <BlogDeleteButton blogId={blogId} blogTitle={watch('title') || 'this blog'} />
          </div>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Content</h2>

        <div className="mt-6 grid gap-5">
          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title', { onChange: handleTitleChange })}
          />

          <Input
            label="Slug"
            helperText="Lowercase kebab-case, e.g. my-blog-post"
            error={errors.slug?.message}
            {...register('slug', {
              onChange: () => {
                slugTouchedRef.current = true;
              },
            })}
          />

          <Textarea
            label="Excerpt"
            error={errors.excerpt?.message}
            rows={3}
            {...register('excerpt')}
          />

          <Textarea
            label="Content"
            error={errors.content?.message}
            rows={12}
            {...register('content')}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Author" error={errors.author?.message} {...register('author')} />
            <Input label="Category" error={errors.category?.message} {...register('category')} />
          </div>

          <Input
            label="Image path or URL"
            error={errors.image?.message}
            {...register('image')}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Published date"
              type="date"
              error={errors.published_at?.message}
              {...register('published_at')}
            />
            <Input
              label="Read time label"
              placeholder="e.g. 5 min read"
              error={errors.read_time_label?.message}
              {...register('read_time_label')}
            />
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('is_active')}
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">Active</span>
              <span className="block text-sm text-gray-600">
                Inactive blogs are hidden from the public site.
              </span>
            </span>
          </label>
        </div>
      </div>

      <AccordionItem
        title={<span className="text-lg font-semibold text-gray-900">SEO settings</span>}
        content={
          <div className="grid gap-5">
            <Input
              label="Meta title"
              error={errors.meta_title?.message}
              {...register('meta_title')}
            />
            <Textarea
              label="Meta description"
              error={errors.meta_description?.message}
              rows={3}
              {...register('meta_description')}
            />
            <Input
              label="Canonical URL"
              error={errors.canonical_url?.message}
              {...register('canonical_url')}
            />
            <Input
              label="OG image path or URL"
              error={errors.og_image?.message}
              {...register('og_image')}
            />
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...register('is_indexable')}
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">Indexable</span>
                <span className="block text-sm text-gray-600">
                  Uncheck to exclude this blog from the sitemap.
                </span>
              </span>
            </label>
          </div>
        }
      />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create blog' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => router.push('/admin/blogs')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
