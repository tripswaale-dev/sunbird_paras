'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm, type Path } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  homepageHeroFormSchema,
  type HomepageHeroFormValues,
} from '@/lib/admin/homepage-hero-form-schema';
import {
  HERO_CHIP_ICON_OPTIONS,
  toHomepageHeroPayload,
  updateHomepageHero,
  type HeroChipIcon,
} from '@/lib/admin/homepage-hero';
import { HomepageIconSelect } from '@/components/admin/homepage/HomepageIconSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resolveHeroChipIcon } from '@/lib/mappers/homepage-icons';

interface HomepageHeroFormProps {
  defaultValues: HomepageHeroFormValues;
}

export function HomepageHeroForm({ defaultValues }: HomepageHeroFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HomepageHeroFormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chips',
  });

  const featuredChipEnabled = watch('featured_chip_enabled');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = homepageHeroFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        if (issue.path.length > 0) {
          setError(issue.path.join('.') as Path<HomepageHeroFormValues>, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await updateHomepageHero(toHomepageHeroPayload(parsed.data));
      router.push('/admin/homepage?saved=hero');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save homepage hero. Please try again.');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Homepage hero</h1>
          <p className="mt-1 text-sm text-gray-600">
            Edit background video and hero chips on the homepage.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-sm font-medium text-primary hover:underline"
        >
          View homepage
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
            label="Background video path"
            placeholder="/bg1.mp4"
            error={errors.background_video?.message}
            {...register('background_video')}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Hero chips</p>
                <p className="text-sm text-gray-600">At least one chip is required.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => append({ icon: 'mountain', label: '' })}
              >
                Add chip
              </Button>
            </div>

            {typeof errors.chips?.message === 'string' ? (
              <p className="text-sm text-secondary">{errors.chips.message}</p>
            ) : null}

            <div className="space-y-4">
              {fields.map((field, index) => {
                const chipErrors = errors.chips?.[index];

                return (
                  <div
                    key={field.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-gray-900">Chip {index + 1}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Controller
                        control={control}
                        name={`chips.${index}.icon`}
                        render={({ field: iconField }) => (
                          <HomepageIconSelect
                            label="Icon"
                            value={iconField.value}
                            onChange={iconField.onChange}
                            options={HERO_CHIP_ICON_OPTIONS}
                            resolveIcon={resolveHeroChipIcon}
                            error={chipErrors?.icon?.message}
                          />
                        )}
                      />
                      <Input
                        label="Label"
                        error={chipErrors?.label?.message}
                        {...register(`chips.${index}.label`)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...register('featured_chip_enabled')}
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">Enable featured chip</span>
                <span className="block text-sm text-gray-600">
                  Optional highlighted chip shown on the hero.
                </span>
              </span>
            </label>

            {featuredChipEnabled ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="featured_chip_icon"
                  render={({ field }) => (
                    <HomepageIconSelect
                      label="Featured chip icon"
                      value={field.value ?? 'map-pin'}
                      onChange={(value) => field.onChange(value as HeroChipIcon)}
                      options={HERO_CHIP_ICON_OPTIONS}
                      resolveIcon={resolveHeroChipIcon}
                      error={errors.featured_chip_icon?.message}
                    />
                  )}
                />
                <Input
                  label="Featured chip label"
                  error={errors.featured_chip_label?.message}
                  {...register('featured_chip_label')}
                />
              </div>
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
                Inactive hero is excluded from the public homepage API.
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
          onClick={() => router.push('/admin/homepage')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
