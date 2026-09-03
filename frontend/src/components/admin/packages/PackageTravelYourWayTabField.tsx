'use client';

import { SECTION_LISTING_TAB_CONFIG } from '@/lib/admin/package-placement-groups';
import { PackageSectionListingTabField } from '@/components/admin/packages/PackageSectionListingTabField';

interface PackageTravelYourWayTabFieldProps {
  sectionId: number | null;
  isSectionSelected: boolean;
  categoryOption: string;
  categoryCustom: string;
  onCategoryChange: (option: string, custom: string) => void;
  disabled?: boolean;
}

/** @deprecated Use PackageSectionListingTabField with SECTION_LISTING_TAB_CONFIG */
export function PackageTravelYourWayTabField({
  sectionId,
  isSectionSelected,
  categoryOption,
  categoryCustom,
  onCategoryChange,
  disabled = false,
}: PackageTravelYourWayTabFieldProps) {
  if (!isSectionSelected || !sectionId) {
    return null;
  }

  const config = SECTION_LISTING_TAB_CONFIG['travel-your-way'];

  return (
    <PackageSectionListingTabField
      sectionId={sectionId}
      config={config}
      categoryOption={categoryOption}
      categoryCustom={categoryCustom}
      onCategoryChange={onCategoryChange}
      disabled={disabled}
      fieldId="travel_your_way_tab"
    />
  );
}
