'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm, type Path, type UseFormReturn } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  packageItineraryFormSchema,
  type PackageItineraryFormValues,
} from '@/lib/admin/package-itinerary-form-schema';
import {
  adminPackageItineraryToFormValues,
  createPackageItineraryDay,
  deletePackageItineraryDay,
  getDefaultPackageItineraryFormValues,
  getPackageItineraryDays,
  toPackageItineraryPayload,
  updatePackageItineraryDay,
  type AdminPackageItineraryDay,
} from '@/lib/admin/package-itinerary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PackageItineraryTabProps {
  packageId: number;
}

function ImagePathsEditor({ form }: { form: UseFormReturn<PackageItineraryFormValues> }) {
  const images = form.watch('images') ?? [''];

  function addImagePath() {
    form.setValue('images', [...images, '']);
  }

  function removeImagePath(index: number) {
    if (images.length <= 1) {
      return;
    }

    form.setValue(
      'images',
      images.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-gray-900">Images</h4>
        <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addImagePath}>
          Add image path
        </Button>
      </div>
      <div className="space-y-2">
        {images.map((_, index) => (
          <div key={index} className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="/images/..."
              {...form.register(`images.${index}` as Path<PackageItineraryFormValues>)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 rounded-lg"
              onClick={() => removeImagePath(index)}
              disabled={images.length <= 1}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PackageItineraryTab({ packageId }: PackageItineraryTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [days, setDays] = useState<AdminPackageItineraryDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const addForm = useForm<PackageItineraryFormValues>({
    defaultValues: getDefaultPackageItineraryFormValues(),
  });

  const editForm = useForm<PackageItineraryFormValues>({
    defaultValues: getDefaultPackageItineraryFormValues(),
  });

  const loadDays = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getPackageItineraryDays(packageId);
      setDays(data);
    } catch (error) {
      setDays([]);
      setLoadError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load itinerary. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    void loadDays();
  }, [loadDays]);

  function showSavedBanner() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'itinerary');
    params.set('saved', 'itinerary');
    router.replace(`${pathname}?${params.toString()}`);
  }

  const onAddSubmit = addForm.handleSubmit(async (values) => {
    setFormError(null);

    const parsed = packageItineraryFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        if (issue.path.length > 0) {
          addForm.setError(issue.path.join('.') as Path<PackageItineraryFormValues>, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await createPackageItineraryDay(packageId, toPackageItineraryPayload(parsed.data));
      addForm.reset(getDefaultPackageItineraryFormValues());
      await loadDays();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(addForm.setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to add itinerary day. Please try again.');
    }
  });

  function startEdit(day: AdminPackageItineraryDay) {
    setEditingId(day.id);
    setEditError(null);
    editForm.reset(adminPackageItineraryToFormValues(day));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError(null);
    editForm.reset(getDefaultPackageItineraryFormValues());
  }

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (editingId === null) {
      return;
    }

    setEditError(null);

    const parsed = packageItineraryFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        if (issue.path.length > 0) {
          editForm.setError(issue.path.join('.') as Path<PackageItineraryFormValues>, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await updatePackageItineraryDay(packageId, editingId, toPackageItineraryPayload(parsed.data));
      setEditingId(null);
      await loadDays();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(editForm.setError, error);
        }

        setEditError(error.message);
        return;
      }

      setEditError('Unable to update itinerary day. Please try again.');
    }
  });

  async function handleDelete(day: AdminPackageItineraryDay) {
    const confirmed = window.confirm(`Delete day ${day.day}: "${day.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deletePackageItineraryDay(packageId, day.id);

      if (editingId === day.id) {
        cancelEdit();
      }

      await loadDays();
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'Unable to delete itinerary day. Please try again.'
      );
    }
  }

  function renderItineraryForm(
    form: UseFormReturn<PackageItineraryFormValues>,
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>,
    submitLabel: string,
    isSubmitting: boolean,
    errorMessage: string | null,
    onCancel?: () => void
  ) {
    return (
      <form onSubmit={onSubmit} className="space-y-4">
        {errorMessage ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Day number"
            type="number"
            min={1}
            error={form.formState.errors.day?.message}
            {...form.register('day', { valueAsNumber: true })}
          />
          <Input
            label="Sort order"
            type="number"
            min={0}
            error={form.formState.errors.sort_order?.message}
            {...form.register('sort_order', { valueAsNumber: true })}
          />
        </div>

        <Input
          label="Title"
          error={form.formState.errors.title?.message}
          {...form.register('title')}
        />

        <Textarea
          label="Description"
          rows={4}
          error={form.formState.errors.description?.message}
          {...form.register('description')}
        />

        <Input
          label="Stay information"
          error={form.formState.errors.stay_information?.message}
          {...form.register('stay_information')}
        />

        <Textarea
          label="Notes"
          rows={3}
          error={form.formState.errors.notes?.message}
          {...form.register('notes')}
        />

        <ImagePathsEditor form={form} />

        <div className="flex gap-3">
          <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
          {onCancel ? (
            <Button type="button" variant="outline" className="rounded-lg" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-16 rounded bg-gray-200" />
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
          onClick={() => void loadDays()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {formError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
      ) : null}

      <div className="space-y-4">
        {days.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
            No itinerary days yet.
          </p>
        ) : (
          days.map((day) => (
            <div
              key={day.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              {editingId === day.id ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Edit day {day.day}</h3>
                  <div className="mt-4">
                    {renderItineraryForm(
                      editForm,
                      onEditSubmit,
                      'Save day',
                      editForm.formState.isSubmitting,
                      editError,
                      cancelEdit
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Day {day.day}: {day.title}
                    </h3>
                    <p className="text-sm text-gray-700">{day.description}</p>
                    {day.stay_information ? (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Stay:</span> {day.stay_information}
                      </p>
                    ) : null}
                    {day.notes ? (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {day.notes}
                      </p>
                    ) : null}
                    {day.images.length > 0 ? (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Images:</span> {day.images.join(', ')}
                      </p>
                    ) : null}
                    <p className="text-xs text-gray-500">Sort order: {day.sort_order}</p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => startEdit(day)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() => void handleDelete(day)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Add itinerary day</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => setShowAddForm((value) => !value)}
          >
            {showAddForm ? 'Hide form' : 'Show form'}
          </Button>
        </div>

        {showAddForm ? (
          <div className="mt-4">
            {renderItineraryForm(
              addForm,
              onAddSubmit,
              'Add day',
              addForm.formState.isSubmitting,
              null
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
