'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  packageFaqFormSchema,
  type PackageFaqFormValues,
} from '@/lib/admin/package-faq-form-schema';
import {
  adminPackageFaqToFormValues,
  createPackageFaq,
  deletePackageFaq,
  getDefaultPackageFaqFormValues,
  getPackageFaqs,
  toPackageFaqPayload,
  updatePackageFaq,
  type AdminPackageFaq,
} from '@/lib/admin/package-faqs';
import type { PackageContentSavedKey } from '@/components/admin/packages/PackageContentSavedBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PackageFaqsTabProps {
  packageId: number;
  onSaved: (key: PackageContentSavedKey) => void;
}

function sortFaqs(faqs: AdminPackageFaq[]): AdminPackageFaq[] {
  return [...faqs].sort((left, right) => {
    if (left.sort_order !== right.sort_order) {
      return left.sort_order - right.sort_order;
    }

    return left.id - right.id;
  });
}

export function PackageFaqsTab({ packageId, onSaved }: PackageFaqsTabProps) {
  const [faqs, setFaqs] = useState<AdminPackageFaq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const addForm = useForm<PackageFaqFormValues>({
    defaultValues: getDefaultPackageFaqFormValues(),
  });

  const editForm = useForm<PackageFaqFormValues>({
    defaultValues: getDefaultPackageFaqFormValues(),
  });

  const loadFaqs = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getPackageFaqs(packageId);
      setFaqs(data);
    } catch (error) {
      setFaqs([]);
      setLoadError(
        error instanceof ApiError ? error.message : 'Unable to load FAQs. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    void loadFaqs();
  }, [loadFaqs]);

  const onAddSubmit = addForm.handleSubmit(async (values) => {
    setFormError(null);

    const parsed = packageFaqFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          addForm.setError(field as keyof PackageFaqFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      const created = await createPackageFaq(packageId, toPackageFaqPayload(parsed.data));
      addForm.reset(getDefaultPackageFaqFormValues());
      setFaqs((current) => sortFaqs([...current, created]));
      onSaved('faq');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(addForm.setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to add FAQ. Please try again.');
    }
  });

  function startEdit(faq: AdminPackageFaq) {
    setEditingId(faq.id);
    setEditError(null);
    editForm.reset(adminPackageFaqToFormValues(faq));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError(null);
    editForm.reset(getDefaultPackageFaqFormValues());
  }

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (editingId === null) {
      return;
    }

    setEditError(null);

    const parsed = packageFaqFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          editForm.setError(field as keyof PackageFaqFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      const updated = await updatePackageFaq(
        packageId,
        editingId,
        toPackageFaqPayload(parsed.data)
      );
      setEditingId(null);
      setFaqs((current) => sortFaqs(current.map((faq) => (faq.id === updated.id ? updated : faq))));
      onSaved('faq');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(editForm.setError, error);
        }

        setEditError(error.message);
        return;
      }

      setEditError('Unable to update FAQ. Please try again.');
    }
  });

  async function handleDelete(faq: AdminPackageFaq) {
    const confirmed = window.confirm(`Delete FAQ "${faq.question}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deletePackageFaq(packageId, faq.id);

      if (editingId === faq.id) {
        cancelEdit();
      }

      setFaqs((current) => current.filter((item) => item.id !== faq.id));
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : 'Unable to delete FAQ. Please try again.'
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
          onClick={() => void loadFaqs()}
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
        {faqs.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-600 shadow-sm">
            No FAQs yet.
          </p>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              {editingId === faq.id ? (
                <form onSubmit={onEditSubmit} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit FAQ</h3>

                  {editError ? (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{editError}</p>
                  ) : null}

                  <Input
                    label="Question"
                    error={editForm.formState.errors.question?.message}
                    {...editForm.register('question')}
                  />
                  <Textarea
                    label="Answer"
                    rows={4}
                    error={editForm.formState.errors.answer?.message}
                    {...editForm.register('answer')}
                  />
                  <Input
                    label="Sort order"
                    type="number"
                    min={0}
                    error={editForm.formState.errors.sort_order?.message}
                    {...editForm.register('sort_order', { valueAsNumber: true })}
                  />

                  <div className="flex gap-3">
                    <Button type="submit" className="rounded-lg" disabled={editForm.formState.isSubmitting}>
                      {editForm.formState.isSubmitting ? 'Saving...' : 'Save FAQ'}
                    </Button>
                    <Button type="button" variant="outline" className="rounded-lg" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
                    <p className="text-xs text-gray-500">Sort order: {faq.sort_order}</p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => startEdit(faq)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:underline"
                      onClick={() => void handleDelete(faq)}
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

      <form onSubmit={onAddSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Add FAQ</h2>

        <div className="mt-4 grid gap-4">
          <Input
            label="Question"
            error={addForm.formState.errors.question?.message}
            {...addForm.register('question')}
          />
          <Textarea
            label="Answer"
            rows={4}
            error={addForm.formState.errors.answer?.message}
            {...addForm.register('answer')}
          />
          <Input
            label="Sort order"
            type="number"
            min={0}
            error={addForm.formState.errors.sort_order?.message}
            {...addForm.register('sort_order', { valueAsNumber: true })}
          />
        </div>

        <Button type="submit" className="mt-4 rounded-lg" disabled={addForm.formState.isSubmitting}>
          {addForm.formState.isSubmitting ? 'Adding...' : 'Add FAQ'}
        </Button>
      </form>
    </div>
  );
}
