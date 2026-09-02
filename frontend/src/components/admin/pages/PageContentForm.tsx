'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  getPageContentFormSchema,
  type AboutPageContentFormValues,
  type ContactPageContentFormValues,
  type PageContentFormValues,
} from '@/lib/admin/page-content-form-schema';
import {
  getPageContentOption,
  toPageContentPayload,
  updatePageContent,
  type PageContentKey,
} from '@/lib/admin/page-content';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PageContentFormProps {
  pageKey: PageContentKey;
  defaultValues: PageContentFormValues;
}

export function PageContentForm({ pageKey, defaultValues }: PageContentFormProps) {
  const router = useRouter();
  const page = getPageContentOption(pageKey);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PageContentFormValues>({
    defaultValues,
  });

  const heroImage = watch('hero_image');
  const aboutErrors = errors as Partial<
    Record<keyof AboutPageContentFormValues, { message?: string }>
  >;
  const contactErrors = errors as Partial<
    Record<keyof ContactPageContentFormValues, { message?: string }>
  >;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = getPageContentFormSchema(pageKey).safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          setError(field as keyof PageContentFormValues, { message: issue.message });
        }
      }

      return;
    }

    try {
      await updatePageContent(pageKey, toPageContentPayload(pageKey, parsed.data));
      router.push(`/admin/pages?saved=${pageKey}`);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save page content. Please try again.');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{page.label} content</h1>
          <p className="mt-1 text-sm text-gray-600">
            Edit page content for <span className="font-mono">{pageKey}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={`/admin/pages/${pageKey}/seo`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Edit SEO
          </Link>
          <Link
            href={page.path}
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

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
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

          {pageKey === 'about' ? (
            <>
              <Textarea
                label="Intro text"
                rows={3}
                error={aboutErrors.intro_text?.message}
                {...register('intro_text')}
              />
              <div>
                <Textarea
                  label="Body"
                  rows={16}
                  error={aboutErrors.body?.message}
                  {...register('body')}
                />
                <p className="mt-1.5 text-sm text-gray-500">
                  Separate paragraphs with a blank line (press Enter twice).
                </p>
              </div>
            </>
          ) : (
            <>
              <Textarea
                label="Intro text"
                rows={3}
                error={contactErrors.intro_text?.message}
                {...register('intro_text')}
              />
              <Input
                label="Contact phone"
                error={contactErrors.contact_phone?.message}
                {...register('contact_phone')}
              />
              <Input
                label="Contact email"
                type="email"
                error={contactErrors.contact_email?.message}
                {...register('contact_email')}
              />
              <Input
                label="Contact address"
                error={contactErrors.contact_address?.message}
                {...register('contact_address')}
              />
              <div>
                <Textarea
                  label="Working hours"
                  rows={4}
                  error={contactErrors.working_hours?.message}
                  {...register('working_hours')}
                />
                <p className="mt-1.5 text-sm text-gray-500">
                  Use line breaks for multiple lines.
                </p>
              </div>
            </>
          )}

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register('is_active')}
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">Active</span>
              <span className="block text-sm text-gray-600">
                Inactive pages return 404 on the public API (static fallback is used).
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
