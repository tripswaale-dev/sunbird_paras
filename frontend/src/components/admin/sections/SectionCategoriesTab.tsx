'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  sectionCategoryFormSchema,
  type SectionCategoryFormValues,
} from '@/lib/admin/section-category-form-schema';
import {
  adminSectionCategoryToFormValues,
  createSectionCategory,
  deleteSectionCategory,
  getDefaultSectionCategoryFormValues,
  getSectionCategories,
  toSectionCategoryPayload,
  updateSectionCategory,
  type AdminSectionCategory,
} from '@/lib/admin/section-categories';
import { GalleryImagePreview } from '@/components/admin/gallery/GalleryImagePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SectionCategoriesTabProps {
  sectionId: number;
}

export function SectionCategoriesTab({ sectionId }: SectionCategoriesTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<AdminSectionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const addForm = useForm<SectionCategoryFormValues>({
    defaultValues: getDefaultSectionCategoryFormValues(),
  });

  const editForm = useForm<SectionCategoryFormValues>({
    defaultValues: getDefaultSectionCategoryFormValues(),
  });

  const addImage = addForm.watch('image');
  const editImage = editForm.watch('image');

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getSectionCategories(sectionId);
      setCategories(data);
    } catch (error) {
      setCategories([]);
      setLoadError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load section categories. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function showSavedBanner() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'categories');
    params.set('saved', 'category');
    router.replace(`${pathname}?${params.toString()}`);
  }

  const onAddSubmit = addForm.handleSubmit(async (values) => {
    setFormError(null);

    const parsed = sectionCategoryFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          addForm.setError(field as keyof SectionCategoryFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await createSectionCategory(sectionId, toSectionCategoryPayload(parsed.data));
      addForm.reset(getDefaultSectionCategoryFormValues());
      await loadCategories();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(addForm.setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to add category. Please try again.');
    }
  });

  function startEdit(category: AdminSectionCategory) {
    setEditingId(category.id);
    setEditError(null);
    editForm.reset(adminSectionCategoryToFormValues(category));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError(null);
    editForm.reset(getDefaultSectionCategoryFormValues());
  }

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (editingId === null) {
      return;
    }

    setEditError(null);

    const parsed = sectionCategoryFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          editForm.setError(field as keyof SectionCategoryFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await updateSectionCategory(sectionId, editingId, toSectionCategoryPayload(parsed.data));
      setEditingId(null);
      await loadCategories();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(editForm.setError, error);
        }

        setEditError(error.message);
        return;
      }

      setEditError('Unable to update category. Please try again.');
    }
  });

  async function handleDelete(category: AdminSectionCategory) {
    const confirmed = window.confirm(`Delete category "${category.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteSectionCategory(sectionId, category.id);

      if (editingId === category.id) {
        cancelEdit();
      }

      await loadCategories();
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'Unable to delete category. Please try again.'
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
          onClick={() => void loadCategories()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {categories.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-600">No categories yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Filter value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Sort
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{category.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {category.filter_value ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {category.filter_value ? (
                          <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            Filter tab
                          </span>
                        ) : null}
                        {category.image ? (
                          <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                            Journey card
                          </span>
                        ) : null}
                        {!category.filter_value && !category.image ? (
                          <span className="text-sm text-gray-400">—</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{category.sort_order}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                          category.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => startEdit(category)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:underline"
                          onClick={() => void handleDelete(category)}
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
          <h2 className="text-lg font-semibold text-gray-900">Edit category</h2>

          {editError ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{editError}</p>
          ) : null}

          <CategoryFormFields form={editForm} imageValue={editImage} />

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
        <h2 className="text-lg font-semibold text-gray-900">Add category</h2>

        {formError ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
        ) : null}

        <CategoryFormFields form={addForm} imageValue={addImage} />

        <Button type="submit" className="mt-4 rounded-lg" disabled={addForm.formState.isSubmitting}>
          {addForm.formState.isSubmitting ? 'Adding...' : 'Add category'}
        </Button>
      </form>
    </div>
  );
}

interface CategoryFormFieldsProps {
  form: ReturnType<typeof useForm<SectionCategoryFormValues>>;
  imageValue: string | undefined;
}

function CategoryFormFields({ form, imageValue }: CategoryFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <Input label="Title" error={errors.title?.message} {...register('title')} />
      <div>
        <Input
          label="Filter value"
          error={errors.filter_value?.message}
          {...register('filter_value')}
        />
        <p className="mt-1 text-xs text-gray-500">Leave empty for the &quot;All&quot; tab.</p>
      </div>
      <div className="space-y-3 sm:col-span-2">
        <Input label="Image path or URL" error={errors.image?.message} {...register('image')} />
        {imageValue?.trim() ? (
          <GalleryImagePreview src={imageValue} alt="Category image preview" size="md" />
        ) : null}
      </div>
      <Input
        label="Sort order"
        type="number"
        min={0}
        max={255}
        error={errors.sort_order?.message}
        {...register('sort_order', { valueAsNumber: true })}
      />
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          {...register('is_featured')}
        />
        <span>
          <span className="block text-sm font-medium text-gray-900">Featured</span>
        </span>
      </label>
      <label className="flex items-start gap-3 sm:col-span-2">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          {...register('is_active')}
        />
        <span>
          <span className="block text-sm font-medium text-gray-900">Active</span>
        </span>
      </label>
    </div>
  );
}
