export const PACKAGE_CATEGORY_OTHER = 'other';

export interface PackageCategoryOption {
  value: string;
  label: string;
}

export const TRAVEL_YOUR_WAY_CATEGORY_OPTIONS: PackageCategoryOption[] = [
  { value: 'Pocket Friendly', label: 'Pocket Friendly (Travel Your Way)' },
  { value: 'Adventure & Thrill', label: 'Adventure & Thrill (Travel Your Way)' },
  { value: 'Off Beat', label: 'Off Beat (Travel Your Way)' },
  { value: 'Couple Getaways', label: 'Couple Getaways (Travel Your Way)' },
];

export const PACKAGE_CATEGORY_OPTIONS: PackageCategoryOption[] = [
  ...TRAVEL_YOUR_WAY_CATEGORY_OPTIONS,
  { value: 'Mountains', label: 'Mountains' },
  { value: 'Beaches', label: 'Beaches' },
  { value: 'Pilgrimage', label: 'Pilgrimage' },
  { value: 'Wildlife', label: 'Wildlife' },
  { value: 'International', label: 'International' },
  { value: 'Spiritual', label: 'Spiritual' },
  { value: 'Hills', label: 'Hills' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Ladakh', label: 'Ladakh' },
  { value: 'Goa', label: 'Goa' },
  { value: 'Nepal', label: 'Nepal' },
  { value: PACKAGE_CATEGORY_OTHER, label: 'Other (custom)' },
];

const KNOWN_CATEGORY_VALUES = new Set(
  PACKAGE_CATEGORY_OPTIONS.filter((option) => option.value !== PACKAGE_CATEGORY_OTHER).map(
    (option) => option.value
  )
);

export function getCategoryFilterValue(option: string, custom?: string): string {
  if (!option) {
    return '';
  }

  if (option === PACKAGE_CATEGORY_OTHER) {
    return custom?.trim() ?? '';
  }

  return option;
}

export function applyFilterValueToCategoryFields(filterValue: string): {
  category_option: string;
  category_custom: string;
} {
  const trimmed = filterValue.trim();

  if (!trimmed) {
    return { category_option: '', category_custom: '' };
  }

  if (KNOWN_CATEGORY_VALUES.has(trimmed)) {
    return { category_option: trimmed, category_custom: '' };
  }

  return { category_option: PACKAGE_CATEGORY_OTHER, category_custom: trimmed };
}

export function resolvePackageCategory(option: string, custom?: string): string | null {
  if (!option) {
    return null;
  }

  if (option === PACKAGE_CATEGORY_OTHER) {
    const trimmed = custom?.trim();

    return trimmed ? trimmed : null;
  }

  return option;
}

export function parseCategoryToFormValues(category: string | null | undefined): {
  category_option: string;
  category_custom: string;
} {
  const trimmed = category?.trim() ?? '';

  if (!trimmed) {
    return { category_option: '', category_custom: '' };
  }

  if (KNOWN_CATEGORY_VALUES.has(trimmed)) {
    return { category_option: trimmed, category_custom: '' };
  }

  return { category_option: PACKAGE_CATEGORY_OTHER, category_custom: trimmed };
}
