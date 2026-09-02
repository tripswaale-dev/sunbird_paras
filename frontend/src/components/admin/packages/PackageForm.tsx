'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import {
  applyApiErrors,
  createPackage,
  slugifyTitle,
  toPackagePayload,
  updatePackage,
} from '@/lib/admin/packages';
import {
  packageFormSchema,
  type PackageFormValues,
} from '@/lib/admin/package-form-schema';
import { GalleryImagePreview } from '@/components/admin/gallery/GalleryImagePreview';
import { PackageDeleteButton } from '@/components/admin/packages/PackageDeleteButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PackageFormProps {
  mode: 'create' | 'edit';
  defaultValues: PackageFormValues;
  packageId?: number;
}

export function PackageForm({ mode, defaultValues, packageId }: PackageFormProps) {
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
  } = useForm<PackageFormValues>({
    defaultValues,
  });

  const isActive = watch('is_active');
  const slug = watch('slug');
  const image = watch('image');
  const title = watch('title');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = packageFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          setError(field as keyof PackageFormValues, { message: issue.message });
        }
      }

      return;
    }

    const payload = toPackagePayload(parsed.data);

    try {
      if (mode === 'create') {
        await createPackage(payload);
      } else if (packageId) {
        await updatePackage(packageId, payload);
      }

      router.push('/admin/packages');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save package. Please try again.');
    }
  });

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextTitle = event.target.value;

    if (mode === 'create' && !slugTouchedRef.current) {
      setValue('slug', slugifyTitle(nextTitle));
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {mode === 'create' ? 'New package' : 'Edit package'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {mode === 'create'
              ? 'Create a new travel package for the public site.'
              : 'Update package summary fields.'}
          </p>
        </div>

        {mode === 'edit' && packageId ? (
          <div className="flex flex-wrap items-center gap-3">
            {isActive && slug ? (
              <Link
                href={`/packages/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                View on site
              </Link>
            ) : null}
            <PackageDeleteButton packageId={packageId} packageTitle={title || 'this package'} />
          </div>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Package details</h2>

        <div className="mt-6 grid gap-5">
          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title', { onChange: handleTitleChange })}
          />

          <Input
            label="Slug"
            helperText="Lowercase kebab-case, e.g. kashmir-paradise"
            error={errors.slug?.message}
            {...register('slug', {
              onChange: () => {
                slugTouchedRef.current = true;
              },
            })}
          />

          <Input label="Subtitle" error={errors.subtitle?.message} {...register('subtitle')} />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Location" error={errors.location?.message} {...register('location')} />
            <Input
              label="Price (INR)"
              type="number"
              min={0}
              step={1}
              error={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Duration nights"
              type="number"
              min={0}
              step={1}
              error={errors.duration_nights?.message}
              {...register('duration_nights', { valueAsNumber: true })}
            />
            <Input
              label="Duration days"
              type="number"
              min={0}
              step={1}
              error={errors.duration_days?.message}
              {...register('duration_days', { valueAsNumber: true })}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Category" error={errors.category?.message} {...register('category')} />
            <Input label="Tag" error={errors.tag?.message} {...register('tag')} />
          </div>

          <div className="space-y-3">
            <Input
              label="Image path or URL"
              error={errors.image?.message}
              {...register('image')}
            />
            {image ? (
              <GalleryImagePreview src={image} alt={title || 'Package preview'} size="md" />
            ) : null}
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
                Inactive packages are hidden from the public site.
              </span>
            </span>
          </label>
        </div>
      </div>

      {mode === 'edit' && packageId ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-gray-700">
            Manage detail content, SEO, images, itinerary, and FAQs on the content editor.
          </p>
          <Link
            href={`/admin/packages/${packageId}/content`}
            className="mt-2 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Manage content →
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create package' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => router.push('/admin/packages')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
