'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFieldArray, useForm, type Control, type FieldArrayPath, type Path } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  packageDetailFormSchema,
  type PackageDetailFormValues,
} from '@/lib/admin/package-detail-form-schema';
import {
  adminPackageDetailToFormValues,
  createPackageDetail,
  deletePackageDetail,
  getDefaultPackageDetailFormValues,
  getPackageDetail,
  isPackageDetailNotFound,
  toPackageDetailPayload,
  updatePackageDetail,
} from '@/lib/admin/package-detail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PackageDetailTabProps {
  packageId: number;
}

type DetailArrayField = 'destinations' | 'sightseeing' | 'inclusions' | 'exclusions' | 'highlights';

function StringListSection({
  label,
  name,
  control,
  register,
}: {
  label: string;
  name: DetailArrayField;
  control: Control<PackageDetailFormValues>;
  register: ReturnType<typeof useForm<PackageDetailFormValues>>['register'];
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as FieldArrayPath<PackageDetailFormValues>,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg"
          onClick={() => append('' as never)}
        >
          Add row
        </Button>
      </div>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              className="flex-1"
              {...register(`${name}.${index}` as Path<PackageDetailFormValues>)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg shrink-0"
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PackageDetailTab({ packageId }: PackageDetailTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [hasDetail, setHasDetail] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<PackageDetailFormValues>({
    defaultValues: getDefaultPackageDetailFormValues(),
  });

  const loadDetail = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const detail = await getPackageDetail(packageId);
      reset(adminPackageDetailToFormValues(detail));
      setHasDetail(true);
    } catch (error) {
      if (isPackageDetailNotFound(error)) {
        reset(getDefaultPackageDetailFormValues());
        setHasDetail(false);
        return;
      }

      setLoadError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load package detail. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [packageId, reset]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  function showSavedBanner() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'detail');
    params.set('saved', 'detail');
    router.replace(`${pathname}?${params.toString()}`);
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const parsed = packageDetailFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        if (issue.path.length > 0) {
          setError(issue.path.join('.') as Path<PackageDetailFormValues>, {
            message: issue.message,
          });
        }
      }

      return;
    }

    const payload = toPackageDetailPayload(parsed.data);

    try {
      if (hasDetail) {
        await updatePackageDetail(packageId, payload);
      } else {
        await createPackageDetail(packageId, payload);
        setHasDetail(true);
      }

      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to save package detail. Please try again.');
    }
  });

  async function handleDelete() {
    if (!hasDetail) {
      return;
    }

    const confirmed = window.confirm('Delete this package detail record?');

    if (!confirmed) {
      return;
    }

    setFormError(null);

    try {
      await deletePackageDetail(packageId);
      reset(getDefaultPackageDetailFormValues());
      setHasDetail(false);
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'Unable to delete package detail. Please try again.'
      );
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-24 rounded bg-gray-200" />
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
          onClick={() => void loadDetail()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {!hasDetail ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No detail record exists yet. Fill in the form below to create one.
        </p>
      ) : null}

      {formError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6">
          <Textarea label="Overview" rows={6} {...register('overview')} />

          <StringListSection
            label="Destinations"
            name="destinations"
            control={control}
            register={register}
          />
          <StringListSection
            label="Sightseeing"
            name="sightseeing"
            control={control}
            register={register}
          />
          <StringListSection
            label="Inclusions"
            name="inclusions"
            control={control}
            register={register}
          />
          <StringListSection
            label="Exclusions"
            name="exclusions"
            control={control}
            register={register}
          />
          <StringListSection
            label="Highlights"
            name="highlights"
            control={control}
            register={register}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : hasDetail ? 'Save detail' : 'Create detail'}
        </Button>
        {hasDetail ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => void handleDelete()}
          >
            Delete detail
          </Button>
        ) : null}
      </div>
    </form>
  );
}
