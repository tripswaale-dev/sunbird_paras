'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import {
  packageImageFormSchema,
  type PackageImageFormValues,
} from '@/lib/admin/package-image-form-schema';
import {
  adminPackageImageToFormValues,
  createPackageImage,
  deletePackageImage,
  getDefaultPackageImageFormValues,
  getPackageImages,
  toPackageImagePayload,
  updatePackageImage,
  type AdminPackageImage,
} from '@/lib/admin/package-images';
import { GalleryImagePreview } from '@/components/admin/gallery/GalleryImagePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PackageImagesTabProps {
  packageId: number;
}

export function PackageImagesTab({ packageId }: PackageImagesTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [images, setImages] = useState<AdminPackageImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const addForm = useForm<PackageImageFormValues>({
    defaultValues: getDefaultPackageImageFormValues(),
  });

  const editForm = useForm<PackageImageFormValues>({
    defaultValues: getDefaultPackageImageFormValues(),
  });

  const addPath = addForm.watch('path');
  const editPath = editForm.watch('path');

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getPackageImages(packageId);
      setImages(data);
    } catch (error) {
      setImages([]);
      setLoadError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load package images. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  function showSavedBanner() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'images');
    params.set('saved', 'image');
    router.replace(`${pathname}?${params.toString()}`);
  }

  const onAddSubmit = addForm.handleSubmit(async (values) => {
    setFormError(null);

    const parsed = packageImageFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          addForm.setError(field as keyof PackageImageFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await createPackageImage(packageId, toPackageImagePayload(parsed.data));
      addForm.reset(getDefaultPackageImageFormValues());
      await loadImages();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(addForm.setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to add image. Please try again.');
    }
  });

  function startEdit(image: AdminPackageImage) {
    setEditingId(image.id);
    setEditError(null);
    editForm.reset(adminPackageImageToFormValues(image));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError(null);
    editForm.reset(getDefaultPackageImageFormValues());
  }

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (editingId === null) {
      return;
    }

    setEditError(null);

    const parsed = packageImageFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          editForm.setError(field as keyof PackageImageFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await updatePackageImage(packageId, editingId, toPackageImagePayload(parsed.data));
      setEditingId(null);
      await loadImages();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(editForm.setError, error);
        }

        setEditError(error.message);
        return;
      }

      setEditError('Unable to update image. Please try again.');
    }
  });

  async function handleDelete(image: AdminPackageImage) {
    const confirmed = window.confirm(`Delete image "${image.path}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deletePackageImage(packageId, image.id);

      if (editingId === image.id) {
        cancelEdit();
      }

      await loadImages();
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'Unable to delete image. Please try again.'
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
          onClick={() => void loadImages()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {images.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-600">No images yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Preview
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Path
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Alt text
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
                {images.map((image) => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <GalleryImagePreview src={image.path} alt={image.alt_text ?? ''} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{image.path}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                          image.type === 'hero'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        )}
                      >
                        {image.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{image.alt_text ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{image.sort_order}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => startEdit(image)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:underline"
                          onClick={() => void handleDelete(image)}
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
        <form onSubmit={onEditSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Edit image</h2>

          {editError ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{editError}</p>
          ) : null}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Path"
              error={editForm.formState.errors.path?.message}
              {...editForm.register('path')}
            />
            <div>
              <label htmlFor="edit-image-type" className="mb-1.5 block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="edit-image-type"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                {...editForm.register('type')}
              >
                <option value="hero">Hero</option>
                <option value="gallery">Gallery</option>
              </select>
            </div>
            <Input
              label="Alt text"
              error={editForm.formState.errors.alt_text?.message}
              {...editForm.register('alt_text')}
            />
            <Input
              label="Sort order"
              type="number"
              min={0}
              error={editForm.formState.errors.sort_order?.message}
              {...editForm.register('sort_order', { valueAsNumber: true })}
            />
          </div>

          {editPath ? (
            <div className="mt-4">
              <GalleryImagePreview src={editPath} alt="Edit preview" size="md" />
            </div>
          ) : null}

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

      <form onSubmit={onAddSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Add image</h2>

        {formError ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Path"
            error={addForm.formState.errors.path?.message}
            {...addForm.register('path')}
          />
          <div>
            <label htmlFor="add-image-type" className="mb-1.5 block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="add-image-type"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...addForm.register('type')}
            >
              <option value="hero">Hero</option>
              <option value="gallery">Gallery</option>
            </select>
          </div>
          <Input
            label="Alt text"
            error={addForm.formState.errors.alt_text?.message}
            {...addForm.register('alt_text')}
          />
          <Input
            label="Sort order"
            type="number"
            min={0}
            error={addForm.formState.errors.sort_order?.message}
            {...addForm.register('sort_order', { valueAsNumber: true })}
          />
        </div>

        {addPath ? (
          <div className="mt-4">
            <GalleryImagePreview src={addPath} alt="Add preview" size="md" />
          </div>
        ) : null}

        <Button type="submit" className="mt-4 rounded-lg" disabled={addForm.formState.isSubmitting}>
          {addForm.formState.isSubmitting ? 'Adding...' : 'Add image'}
        </Button>
      </form>
    </div>
  );
}
