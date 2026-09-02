'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  pageSeoFormSchema,
  type PageSeoFormValues,
} from '@/lib/admin/page-seo-form-schema';
import {
  getPageSeoOption,
  toPageSeoPayload,
  updatePageSeo,
  type PageSeoKey,
} from '@/lib/admin/page-seo';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PageSeoFormProps {
  pageKey: PageSeoKey;
  defaultValues: PageSeoFormValues;
}

export function PageSeoForm({ pageKey, defaultValues }: PageSeoFormProps) {
  const router = useRouter();
  const page = getPageSeoOption(pageKey);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PageSeoFormValues>({
    defaultValues,
  });

  const ogImage = watch('og_image');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = pageSeoFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          setError(field as keyof PageSeoFormValues, { message: issue.message });
        }
      }

      return;
    }

    try {
      await updatePageSeo(pageKey, toPageSeoPayload(parsed.data));
      router.push('/admin/pages');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save page SEO. Please try again.');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{page.label} SEO</h1>
          <p className="mt-1 text-sm text-gray-600">
            Edit metadata for <span className="font-mono">{pageKey}</span>
          </p>
        </div>

        <Link
          href={page.path}
          target="_blank"
          className="text-sm font-medium text-primary hover:underline"
        >
          View on site
        </Link>
      </div>

      {formError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
            placeholder="https://sunbirdvacations.com/..."
            error={errors.canonical_url?.message}
            {...register('canonical_url')}
          />
          <ImageUploadField
            label="OG image"
            value={ogImage ?? ''}
            onChange={(path) => setValue('og_image', path, { shouldDirty: true, shouldValidate: true })}
            error={errors.og_image?.message}
            previewAlt="OG image preview"
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
                Uncheck to exclude this page from the sitemap.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => router.push('/admin/pages')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
