'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  packageSeoFormSchema,
  type PackageSeoFormValues,
} from '@/lib/admin/package-seo-form-schema';
import {
  getPackageSeo,
  toPackageSeoFormValues,
  toPackageSeoPayload,
  updatePackageSeo,
} from '@/lib/admin/package-seo';
import type { PackageContentSavedKey } from '@/components/admin/packages/PackageContentSavedBanner';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PackageSeoTabProps {
  packageId: number;
  onSaved: (key: PackageContentSavedKey) => void;
}

export function PackageSeoTab({ packageId, onSaved }: PackageSeoTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PackageSeoFormValues>({
    defaultValues: {
      meta_title: '',
      meta_description: '',
      canonical_url: '',
      og_image: '',
      is_indexable: true,
    },
  });

  const ogImage = watch('og_image');

  const loadSeo = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const seo = await getPackageSeo(packageId);
      reset(toPackageSeoFormValues(seo));
    } catch (error) {
      setLoadError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load package SEO. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [packageId, reset]);

  useEffect(() => {
    void loadSeo();
  }, [loadSeo]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = packageSeoFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          setError(field as keyof PackageSeoFormValues, { message: issue.message });
        }
      }

      return;
    }

    try {
      await updatePackageSeo(packageId, toPackageSeoPayload(parsed.data));
      onSaved('seo');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save package SEO. Please try again.');
    }
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <p className="text-sm text-red-700">{loadError}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 rounded-lg"
          onClick={() => void loadSeo()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {formError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {formError}
        </p>
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
            placeholder="https://sunbirdvacations.com/packages/..."
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
                Uncheck to exclude this package from the sitemap.
              </span>
            </span>
          </label>
        </div>
      </div>

      <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save SEO'}
      </Button>
    </form>
  );
}
