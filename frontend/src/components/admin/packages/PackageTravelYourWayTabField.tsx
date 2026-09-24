'use client';

import { SECTION_LISTING_TAB_CONFIG } from '@/lib/admin/package-placement-groups';
import { PackageSectionListingTabField } from '@/components/admin/packages/PackageSectionListingTabField';

interface PackageTravelYourWayTabFieldProps {
  sectionId: number | null;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/** @deprecated Use PackageSectionListingTabField with SECTION_LISTING_TAB_CONFIG */
export function PackageTravelYourWayTabField({
  sectionId,
  value,
  onChange,
  disabled = false,
}: PackageTravelYourWayTabFieldProps) {
  if (!sectionId) {
    return null;
  }

  const config = SECTION_LISTING_TAB_CONFIG['travel-your-way'];

  return (
    <PackageSectionListingTabField
      sectionId={sectionId}
      config={config}
      value={value}
      onChange={onChange}
      disabled={disabled}
      fieldId="travel_your_way_tab"
    />
  );
}
