'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  sectionFormSchema,
  type SectionFormValues,
} from '@/lib/admin/section-form-schema';
import {
  createSection,
  slugifyTitle,
  toSectionPayload,
  updateSection,
} from '@/lib/admin/sections';
import { GalleryImagePreview } from '@/components/admin/gallery/GalleryImagePreview';
import { SectionDeleteButton } from '@/components/admin/sections/SectionDeleteButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface SectionFormProps {
  mode: 'create' | 'edit';
  defaultValues: SectionFormValues;
  sectionId?: number;
  viewAllPath?: string;
}

export function SectionForm({ mode, defaultValues, sectionId, viewAllPath }: SectionFormProps) {
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
  } = useForm<SectionFormValues>({
    defaultValues,
  });

  const isActive = watch('is_active');
  const heroImage = watch('hero_image');
  const title = watch('title');
  const listingPath = watch('view_all_path') || viewAllPath;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = sectionFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          setError(field as keyof SectionFormValues, { message: issue.message });
        }
      }

      return;
    }

    const payload = toSectionPayload(parsed.data);

    try {
      if (mode === 'create') {
        await createSection(payload);
      } else if (sectionId) {
        await updateSection(sectionId, payload);
      }

      router.push('/admin/sections');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save section. Please try again.');
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
            {mode === 'create' ? 'New section' : 'Edit section'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {mode === 'create'
              ? 'Create a new homepage section.'
              : 'Update section summary fields.'}
          </p>
        </div>

        {mode === 'edit' && sectionId ? (
          <div className="flex flex-wrap items-center gap-3">
            {isActive && listingPath ? (
              <Link
                href={listingPath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                View listing
              </Link>
            ) : null}
            <SectionDeleteButton sectionId={sectionId} sectionTitle={title || 'this section'} />
          </div>
        ) : null}
      </div>

      {formError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title', { onChange: handleTitleChange })}
          />

          <Input
            label="Slug"
            helperText="Unique section identifier, e.g. popular-destinations"
            error={errors.slug?.message}
            {...register('slug', {
              onChange: () => {
                slugTouchedRef.current = true;
              },
            })}
          />

          <Textarea label="Subtitle" rows={2} error={errors.subtitle?.message} {...register('subtitle')} />

          <Input
            label="View-all path"
            helperText="Public listing page path, e.g. /popular-destinations"
            error={errors.view_all_path?.message}
            {...register('view_all_path')}
          />

          <div className="space-y-3">
            <Input
              label="Hero image path or URL"
              error={errors.hero_image?.message}
              {...register('hero_image')}
            />
            {heroImage ? (
              <GalleryImagePreview src={heroImage} alt={title || 'Hero preview'} size="md" />
            ) : null}
          </div>

          <Input
            label="Sort order"
            type="number"
            min={0}
            max={255}
            step={1}
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
                Inactive sections are hidden from the public site.
              </span>
            </span>
          </label>
        </div>
      </div>

      {mode === 'edit' && sectionId ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-gray-700">
            Manage package assignments, categories, stats, and SEO on the content editor.
          </p>
          <Link
            href={`/admin/sections/${sectionId}/content`}
            className="mt-2 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            Manage content →
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create section' : 'Save changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          onClick={() => router.push('/admin/sections')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
