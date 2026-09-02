'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  destinationCategoryFormSchema,
  type DestinationCategoryFormValues,
} from '@/lib/admin/destination-category-form-schema';
import {
  getDestinationCategoryPublicUrl,
  toDestinationCategoryPayload,
  updateDestinationCategory,
  type AdminDestinationCategory,
  type DestinationCategoryCode,
} from '@/lib/admin/destination-categories';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface DestinationCategoryFormProps {
  code: DestinationCategoryCode;
  category: AdminDestinationCategory;
  defaultValues: DestinationCategoryFormValues;
}

export function DestinationCategoryForm({
  code,
  category,
  defaultValues,
}: DestinationCategoryFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DestinationCategoryFormValues>({
    defaultValues,
  });

  const heroImage = watch('hero_image');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = destinationCategoryFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          setError(field as keyof DestinationCategoryFormValues, { message: issue.message });
        }
      }

      return;
    }

    try {
      await updateDestinationCategory(code, toDestinationCategoryPayload(parsed.data));
      router.push(`/admin/destinations?saved=${code}`);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save destination category. Please try again.');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit destination category</h1>
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-mono">{code}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/admin/destinations"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to destinations
          </Link>
          <Link
            href={getDestinationCategoryPublicUrl(code)}
            target="_blank"
            className="text-sm font-medium text-primary hover:underline"
          >
            View on site
          </Link>
        </div>
      </div>

      {formError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Structural fields (read-only)</h2>
        <p className="mt-1 text-sm text-gray-600">
          Structural fields are managed in the database and cannot be edited here.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Code</dt>
            <dd className="mt-1 font-mono text-sm text-gray-900">{category.code}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Section slug
            </dt>
            <dd className="mt-1 font-mono text-sm text-gray-900">
              {category.section_slug ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Package category
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{category.package_category ?? '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <Input label="Title" error={errors.title?.message} {...register('title')} />

          <ImageUploadField
            label="Hero image"
            value={heroImage ?? ''}
            onChange={(path) => setValue('hero_image', path, { shouldDirty: true, shouldValidate: true })}
            error={errors.hero_image?.message}
            previewAlt="Hero image preview"
          />

          <Input
            label="Hero title"
            error={errors.hero_title?.message}
            {...register('hero_title')}
          />

          <Textarea
            label="Hero subtitle"
            rows={3}
            error={errors.hero_subtitle?.message}
            {...register('hero_subtitle')}
          />

          <Input
            label="Listing path"
            placeholder="/popular-destinations"
            error={errors.listing_path?.message}
            {...register('listing_path')}
          />

          <Input
            label="Sort order"
            type="number"
            min={0}
            error={errors.sort_order?.message}
            {...register('sort_order', { valueAsNumber: true })}
          />

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('is_active')}
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">Active</span>
              <span className="block text-sm text-gray-600">
                Inactive categories are hidden from the public destinations API.
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
          onClick={() => router.push('/admin/destinations')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
