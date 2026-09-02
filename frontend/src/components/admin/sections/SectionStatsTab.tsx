'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  sectionStatFormSchema,
  type SectionStatFormValues,
} from '@/lib/admin/section-stat-form-schema';
import {
  adminSectionStatToFormValues,
  createSectionStat,
  deleteSectionStat,
  getDefaultSectionStatFormValues,
  getSectionStats,
  toSectionStatPayload,
  updateSectionStat,
  type AdminSectionStat,
} from '@/lib/admin/section-stats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SectionStatsTabProps {
  sectionId: number;
}

export function SectionStatsTab({ sectionId }: SectionStatsTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [stats, setStats] = useState<AdminSectionStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const addForm = useForm<SectionStatFormValues>({
    defaultValues: getDefaultSectionStatFormValues(),
  });

  const editForm = useForm<SectionStatFormValues>({
    defaultValues: getDefaultSectionStatFormValues(),
  });

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getSectionStats(sectionId);
      setStats(data);
    } catch (error) {
      setStats([]);
      setLoadError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load section stats. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  function showSavedBanner() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'stats');
    params.set('saved', 'stat');
    router.replace(`${pathname}?${params.toString()}`);
  }

  const onAddSubmit = addForm.handleSubmit(async (values) => {
    setFormError(null);

    const parsed = sectionStatFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          addForm.setError(field as keyof SectionStatFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await createSectionStat(sectionId, toSectionStatPayload(parsed.data));
      addForm.reset(getDefaultSectionStatFormValues());
      await loadStats();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(addForm.setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to add stat. Please try again.');
    }
  });

  function startEdit(stat: AdminSectionStat) {
    setEditingId(stat.id);
    setEditError(null);
    editForm.reset(adminSectionStatToFormValues(stat));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError(null);
    editForm.reset(getDefaultSectionStatFormValues());
  }

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (editingId === null) {
      return;
    }

    setEditError(null);

    const parsed = sectionStatFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          editForm.setError(field as keyof SectionStatFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await updateSectionStat(sectionId, editingId, toSectionStatPayload(parsed.data));
      setEditingId(null);
      await loadStats();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(editForm.setError, error);
        }

        setEditError(error.message);
        return;
      }

      setEditError('Unable to update stat. Please try again.');
    }
  });

  async function handleDelete(stat: AdminSectionStat) {
    const confirmed = window.confirm(`Delete stat "${stat.value} — ${stat.label}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteSectionStat(sectionId, stat.id);

      if (editingId === stat.id) {
        cancelEdit();
      }

      await loadStats();
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : 'Unable to delete stat. Please try again.'
      );
    }
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
          onClick={() => void loadStats()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {stats.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-600">No stats for this section.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Label
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Sort
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.map((stat) => (
                  <tr key={stat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat.value}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{stat.label}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{stat.sort_order}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => startEdit(stat)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:underline"
                          onClick={() => void handleDelete(stat)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingId !== null ? (
        <form
          onSubmit={onEditSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900">Edit stat</h2>

          {editError ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{editError}</p>
          ) : null}

          <StatFormFields form={editForm} />

          <div className="mt-4 flex gap-3">
            <Button type="submit" className="rounded-lg" disabled={editForm.formState.isSubmitting}>
              {editForm.formState.isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
            <Button type="button" variant="outline" className="rounded-lg" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      <form
        onSubmit={onAddSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900">Add stat</h2>

        {formError ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
        ) : null}

        <StatFormFields form={addForm} />

        <Button type="submit" className="mt-4 rounded-lg" disabled={addForm.formState.isSubmitting}>
          {addForm.formState.isSubmitting ? 'Adding...' : 'Add stat'}
        </Button>
      </form>
    </div>
  );
}

interface StatFormFieldsProps {
  form: ReturnType<typeof useForm<SectionStatFormValues>>;
}

function StatFormFields({ form }: StatFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <Input label="Value" error={errors.value?.message} {...register('value')} />
      <Input label="Label" error={errors.label?.message} {...register('label')} />
      <Input
        label="Sort order"
        type="number"
        min={0}
        max={255}
        error={errors.sort_order?.message}
        {...register('sort_order', { valueAsNumber: true })}
      />
    </div>
  );
}
