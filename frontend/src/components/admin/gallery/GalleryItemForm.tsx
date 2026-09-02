'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  galleryItemFormSchema,
  type GalleryItemFormValues,
} from '@/lib/admin/gallery-item-form-schema';
import {
  createGalleryItem,
  GALLERY_ASPECT_RATIO_OPTIONS,
  GALLERY_CATEGORY_OPTIONS,
  slugifyExternalId,
  toGalleryItemPayload,
  updateGalleryItem,
} from '@/lib/admin/gallery-items';
import { GalleryItemDeleteButton } from '@/components/admin/gallery/GalleryItemDeleteButton';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GalleryItemFormProps {
  mode: 'create' | 'edit';
  defaultValues: GalleryItemFormValues;
  itemId?: number;
}

export function GalleryItemForm({ mode, defaultValues, itemId }: GalleryItemFormProps) {
  const router = useRouter();
  const externalIdTouchedRef = useRef(mode === 'edit');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GalleryItemFormValues>({
    defaultValues,
  });

  const isActive = watch('is_active');
  const src = watch('src');
  const title = watch('title');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = galleryItemFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          setError(field as keyof GalleryItemFormValues, { message: issue.message });
        }
      }

      return;
    }

    const payload = toGalleryItemPayload(parsed.data);

    try {
      if (mode === 'create') {
        await createGalleryItem(payload);
      } else if (itemId) {
        await updateGalleryItem(itemId, payload);
      }

      router.push('/admin/gallery');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save gallery item. Please try again.');
    }
  });

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextTitle = event.target.value;

    if (mode === 'create' && !externalIdTouchedRef.current) {
      setValue('external_id', slugifyExternalId(nextTitle));
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {mode === 'create' ? 'New gallery item' : 'Edit gallery item'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {mode === 'create'
              ? 'Create a new image for the public gallery.'
              : 'Update gallery item details and visibility.'}
          </p>
        </div>

        {mode === 'edit' && itemId ? (
          <div className="flex flex-wrap items-center gap-3">
            {isActive ? (
              <Link
                href="/gallery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                View on site
              </Link>
            ) : null}
            <GalleryItemDeleteButton itemId={itemId} itemTitle={title || 'this item'} />
          </div>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Item details</h2>

        <div className="mt-6 grid gap-5">
          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title', { onChange: handleTitleChange })}
          />

          <Input
            label="External ID"
            helperText="Lowercase kebab-case, e.g. raj-1 (maps to public API id)"
            error={errors.external_id?.message}
            {...register('external_id', {
              onChange: () => {
                externalIdTouchedRef.current = true;
              },
            })}
          />

          <Input label="Subtitle" error={errors.subtitle?.message} {...register('subtitle')} />

          <ImageUploadField
            label="Image"
            value={src ?? ''}
            onChange={(path) => setValue('src', path, { shouldDirty: true, shouldValidate: true })}
            error={errors.src?.message}
            previewAlt={title || 'Gallery preview'}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                {...register('category')}
              >
                {GALLERY_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <p className="mt-1.5 text-sm text-red-600">{errors.category.message}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="aspect_ratio"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Aspect ratio
              </label>
              <select
                id="aspect_ratio"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                {...register('aspect_ratio')}
              >
                {GALLERY_ASPECT_RATIO_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.aspect_ratio ? (
                <p className="mt-1.5 text-sm text-red-600">{errors.aspect_ratio.message}</p>
              ) : null}
            </div>
          </div>

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
                Inactive items are hidden from the public gallery.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create item'
              : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => router.push('/admin/gallery')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
