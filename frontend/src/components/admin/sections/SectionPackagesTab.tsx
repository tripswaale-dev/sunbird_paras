'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ApiError } from '@/lib/api/client';
import { applyApiErrors } from '@/lib/admin/form-errors';
import { formatPackagePrice, getPackages, type AdminPackage } from '@/lib/admin/packages';
import {
  sectionPackageAssignFormSchema,
  sectionPackageUpdateFormSchema,
  type SectionPackageAssignFormValues,
  type SectionPackageUpdateFormValues,
} from '@/lib/admin/section-package-form-schema';
import {
  adminSectionPackageToUpdateFormValues,
  assignPackageToSection,
  getDefaultSectionPackageAssignFormValues,
  getSectionPackages,
  removePackageFromSection,
  toSectionPackageAssignPayload,
  toSectionPackageUpdatePayload,
  updateSectionPackage,
  type AdminSectionPackage,
} from '@/lib/admin/section-packages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SectionPackagesTabProps {
  sectionId: number;
}

export function SectionPackagesTab({ sectionId }: SectionPackagesTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<AdminSectionPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editingPackageId, setEditingPackageId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<AdminPackage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const addForm = useForm<SectionPackageAssignFormValues>({
    defaultValues: getDefaultSectionPackageAssignFormValues(),
  });

  const editForm = useForm<SectionPackageUpdateFormValues>({
    defaultValues: { display_order: 0, is_featured: false },
  });

  const selectedPackageId = addForm.watch('package_id');
  const assignedIds = useMemo(() => new Set(packages.map((pkg) => pkg.id)), [packages]);

  const loadPackages = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await getSectionPackages(sectionId);
      setPackages(data);
    } catch (error) {
      setPackages([]);
      setLoadError(
        error instanceof ApiError
          ? error.message
          : 'Unable to load section packages. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    void loadPackages();
  }, [loadPackages]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;

    async function searchPackages() {
      setIsSearching(true);

      try {
        const result = await getPackages({ search: debouncedSearch, per_page: 15 });
        if (!cancelled) {
          setSearchResults(result.data.filter((pkg) => !assignedIds.has(pkg.id)));
        }
      } catch {
        if (!cancelled) {
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }

    void searchPackages();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, assignedIds]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function showSavedBanner() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'packages');
    params.set('saved', 'packages');
    router.replace(`${pathname}?${params.toString()}`);
  }

  function selectPackage(pkg: AdminPackage) {
    addForm.setValue('package_id', pkg.id, { shouldValidate: true });
    setSearchQuery(`${pkg.title} (${pkg.slug})`);
    setShowResults(false);
  }

  function clearSelectedPackage() {
    addForm.setValue('package_id', 0);
    setSearchQuery('');
    setSearchResults([]);
  }

  const onAddSubmit = addForm.handleSubmit(async (values) => {
    setFormError(null);

    const parsed = sectionPackageAssignFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          addForm.setError(field as keyof SectionPackageAssignFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await assignPackageToSection(sectionId, toSectionPackageAssignPayload(parsed.data));
      addForm.reset(getDefaultSectionPackageAssignFormValues());
      setSearchQuery('');
      setSearchResults([]);
      await loadPackages();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(addForm.setError, error);
        }

        setFormError(error.message);
        return;
      }

      setFormError('Unable to assign package. Please try again.');
    }
  });

  function startEdit(pkg: AdminSectionPackage) {
    setEditingPackageId(pkg.id);
    setEditError(null);
    editForm.reset(adminSectionPackageToUpdateFormValues(pkg));
  }

  function cancelEdit() {
    setEditingPackageId(null);
    setEditError(null);
    editForm.reset({ display_order: 0, is_featured: false });
  }

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    if (editingPackageId === null) {
      return;
    }

    setEditError(null);

    const parsed = sectionPackageUpdateFormSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (typeof field === 'string') {
          editForm.setError(field as keyof SectionPackageUpdateFormValues, {
            message: issue.message,
          });
        }
      }

      return;
    }

    try {
      await updateSectionPackage(
        sectionId,
        editingPackageId,
        toSectionPackageUpdatePayload(parsed.data)
      );
      setEditingPackageId(null);
      await loadPackages();
      showSavedBanner();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          applyApiErrors(editForm.setError, error);
        }

        setEditError(error.message);
        return;
      }

      setEditError('Unable to update assignment. Please try again.');
    }
  });

  async function handleRemove(pkg: AdminSectionPackage) {
    const confirmed = window.confirm(`Remove "${pkg.title}" from this section?`);

    if (!confirmed) {
      return;
    }

    try {
      await removePackageFromSection(sectionId, pkg.id);

      if (editingPackageId === pkg.id) {
        cancelEdit();
      }

      await loadPackages();
    } catch (error) {
      setFormError(
        error instanceof ApiError
          ? error.message
          : 'Unable to remove package. Please try again.'
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
          onClick={() => void loadPackages()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-900">Tip:</span> Assign packages to multiple
          homepage sections at once from{' '}
          <span className="font-medium">Packages → Edit → Homepage &amp; listings</span>. Use this
          tab to adjust display order and featured status per section.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {packages.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-600">No packages assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Featured
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
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{pkg.title}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{pkg.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{pkg.category ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatPackagePrice(pkg.price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{pkg.display_order}</td>
                    <td className="px-4 py-3">
                      {pkg.is_featured ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                          Featured
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                          pkg.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => startEdit(pkg)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:underline"
                          onClick={() => void handleRemove(pkg)}
                        >
                          Remove
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

      {editingPackageId !== null ? (
        <form
          onSubmit={onEditSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900">Edit assignment</h2>

          {editError ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{editError}</p>
          ) : null}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Display order"
              type="number"
              min={0}
              error={editForm.formState.errors.display_order?.message}
              {...editForm.register('display_order', { valueAsNumber: true })}
            />
            <label className="flex items-start gap-3 sm:col-span-2">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...editForm.register('is_featured')}
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">Featured</span>
                <span className="block text-sm text-gray-600">
                  Highlight this package in the section.
                </span>
              </span>
            </label>
          </div>

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
        <h2 className="text-lg font-semibold text-gray-900">Assign package</h2>

        {formError ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div ref={searchContainerRef} className="relative sm:col-span-2">
            <label htmlFor="package-search" className="mb-1.5 block text-sm font-medium text-gray-700">
              Package
            </label>
            <div className="flex gap-2">
              <input
                id="package-search"
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  addForm.setValue('package_id', 0);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Search by title or slug..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {selectedPackageId > 0 ? (
                <Button type="button" variant="outline" className="shrink-0 rounded-lg" onClick={clearSelectedPackage}>
                  Clear
                </Button>
              ) : null}
            </div>
            {addForm.formState.errors.package_id?.message ? (
              <p className="mt-1 text-sm text-red-600">{addForm.formState.errors.package_id.message}</p>
            ) : null}

            {showResults && debouncedSearch ? (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {isSearching ? (
                  <p className="px-4 py-3 text-sm text-gray-500">Searching...</p>
                ) : searchResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-500">No packages found.</p>
                ) : (
                  <ul>
                    {searchResults.map((pkg) => (
                      <li key={pkg.id}>
                        <button
                          type="button"
                          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                          onClick={() => selectPackage(pkg)}
                        >
                          <span className="font-medium text-gray-900">{pkg.title}</span>
                          <span className="ml-2 font-mono text-gray-500">{pkg.slug}</span>
                          {pkg.category ? (
                            <span className="ml-2 text-gray-400">· {pkg.category}</span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </div>

          <Input
            label="Display order"
            type="number"
            min={0}
            error={addForm.formState.errors.display_order?.message}
            {...addForm.register('display_order', { valueAsNumber: true })}
          />

          <label className="flex items-start gap-3 sm:col-span-2">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...addForm.register('is_featured')}
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">Featured</span>
              <span className="block text-sm text-gray-600">
                Highlight this package in the section.
              </span>
            </span>
          </label>
        </div>

        <Button type="submit" className="mt-4 rounded-lg" disabled={addForm.formState.isSubmitting}>
          {addForm.formState.isSubmitting ? 'Assigning...' : 'Assign package'}
        </Button>
      </form>
    </div>
  );
}
