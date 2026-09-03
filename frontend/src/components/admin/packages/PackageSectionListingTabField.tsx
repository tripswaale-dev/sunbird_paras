'use client';

import { useEffect, useState } from 'react';
import {
  applyFilterValueToCategoryFields,
  getCategoryFilterValue,
} from '@/lib/admin/package-categories';
import type { SectionListingTabConfig } from '@/lib/admin/package-placement-groups';
import {
  getSectionCategories,
  type AdminSectionCategory,
} from '@/lib/admin/section-categories';

interface PackageSectionListingTabFieldProps {
  sectionId: number;
  config: SectionListingTabConfig;
  categoryOption: string;
  categoryCustom: string;
  onCategoryChange: (option: string, custom: string) => void;
  disabled?: boolean;
  fieldId?: string;
}

export function PackageSectionListingTabField({
  sectionId,
  config,
  categoryOption,
  categoryCustom,
  onCategoryChange,
  disabled = false,
  fieldId,
}: PackageSectionListingTabFieldProps) {
  const [categories, setCategories] = useState<AdminSectionCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const selectId = fieldId ?? `section_listing_tab_${sectionId}`;

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setLoadError(null);

    getSectionCategories(sectionId)
      .then((data) => {
        if (isMounted) {
          setCategories(data.filter((category) => category.is_active));
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError(`Unable to load listing tabs for ${config.label}.`);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sectionId, config.label]);

  const activeCategories = [...categories].sort((left, right) => left.sort_order - right.sort_order);
  const currentFilterValue = getCategoryFilterValue(categoryOption, categoryCustom);

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-900">
        {config.label}
      </label>
      <p className="text-sm text-gray-600">
        Choose which tab on{' '}
        <span className="font-mono text-xs">{config.listingPath}</span> shows this package. Sets
        the package category automatically.
      </p>

      {isLoading ? (
        <div className="h-10 animate-pulse rounded-lg bg-gray-200" />
      ) : loadError ? (
        <p className="text-sm text-red-600">{loadError}</p>
      ) : (
        <select
          id={selectId}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={currentFilterValue}
          disabled={disabled || activeCategories.length === 0}
          onChange={(event) => {
            const fields = applyFilterValueToCategoryFields(event.target.value);
            onCategoryChange(fields.category_option, fields.category_custom);
          }}
        >
          <option value="">{config.placeholder}</option>
          {activeCategories.map((category) => {
            const value = category.filter_value ?? category.title;

            return (
              <option key={category.id} value={value}>
                {category.title}
                {category.filter_value && category.filter_value !== category.title
                  ? ` (${category.filter_value})`
                  : ''}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
}
