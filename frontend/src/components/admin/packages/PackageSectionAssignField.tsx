'use client';

import type { AdminSection } from '@/lib/admin/sections';

interface PackageSectionAssignFieldProps {
  sections: AdminSection[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  isLoading?: boolean;
  loadError?: string | null;
  disabled?: boolean;
  error?: string;
}

export function PackageSectionAssignField({
  sections,
  selectedIds,
  onChange,
  isLoading = false,
  loadError = null,
  disabled = false,
  error,
}: PackageSectionAssignFieldProps) {
  const activeSections = [...sections]
    .filter((section) => section.is_active)
    .sort((left, right) => left.sort_order - right.sort_order);

  function toggleSection(sectionId: number) {
    if (selectedIds.includes(sectionId)) {
      onChange(selectedIds.filter((id) => id !== sectionId));
      return;
    }

    onChange([...selectedIds, sectionId]);
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900">Assign to sections</p>
        <div className="animate-pulse space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
          <div className="h-4 w-2/5 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900">Assign to sections</p>
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {loadError}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-900">Assign to sections</p>
        <p className="mt-1 text-sm text-gray-600">
          Select homepage sections where this package should appear. Optional — you can assign later
          in Sections → Content → Packages.
        </p>
      </div>

      {activeSections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-600">
          No active sections available.
        </p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {activeSections.map((section) => {
            const isChecked = selectedIds.includes(section.id);

            return (
              <label
                key={section.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-primary/30"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={isChecked}
                  disabled={disabled}
                  onChange={() => toggleSection(section.id)}
                />
                <span>
                  <span className="block text-sm font-medium text-gray-900">{section.title}</span>
                  <span className="block font-mono text-xs text-gray-500">{section.slug}</span>
                </span>
              </label>
            );
          })}
        </div>
      )}

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
