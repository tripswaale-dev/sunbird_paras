'use client';

import type { AdminSection } from '@/lib/admin/sections';
import {
  HOMEPAGE_CAROUSEL_SECTION_SLUGS,
  hasSectionListingTabPicker,
  HILL_SECTION_SLUGS,
  PACKAGE_PLACEMENT_GROUP_LABELS,
  TRAVEL_YOUR_WAY_SECTION_SLUG,
} from '@/lib/admin/package-placement-groups';
import { Button } from '@/components/ui/button';

interface PackageSectionAssignFieldProps {
  sections: AdminSection[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  isLoading?: boolean;
  loadError?: string | null;
  disabled?: boolean;
  error?: string;
  grouped?: boolean;
  onApplyHomepageSpotlight?: () => void;
  onApplyTravelYourWayOnly?: () => void;
  renderListingTabField?: (section: AdminSection) => React.ReactNode;
}

interface PlacementGroup {
  key: string;
  label: string;
  helper: string;
  slugs: readonly string[];
}

const PLACEMENT_GROUPS: PlacementGroup[] = [
  {
    key: 'carousels',
    label: PACKAGE_PLACEMENT_GROUP_LABELS.carousels,
    helper: 'Package appears in the homepage carousel for each checked section.',
    slugs: HOMEPAGE_CAROUSEL_SECTION_SLUGS,
  },
  {
    key: 'travelYourWay',
    label: PACKAGE_PLACEMENT_GROUP_LABELS.travelYourWay,
    helper: 'Also pick a listing tab below so the package shows under the right category on /travelyourway.',
    slugs: [TRAVEL_YOUR_WAY_SECTION_SLUG],
  },
  {
    key: 'hills',
    label: PACKAGE_PLACEMENT_GROUP_LABELS.hills,
    helper:
      'Also pick a listing tab below so the package shows under the right category on /gateway-to-the-hills.',
    slugs: HILL_SECTION_SLUGS,
  },
];

function sortSections(sections: AdminSection[]): AdminSection[] {
  return [...sections]
    .filter((section) => section.is_active)
    .sort((left, right) => left.sort_order - right.sort_order);
}

function renderSectionCheckbox(
  section: AdminSection,
  selectedIds: number[],
  disabled: boolean,
  onChange: (ids: number[]) => void
) {
  const isChecked = selectedIds.includes(section.id);

  function toggleSection() {
    if (isChecked) {
      onChange(selectedIds.filter((id) => id !== section.id));
      return;
    }

    onChange([...selectedIds, section.id]);
  }

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
        onChange={toggleSection}
      />
      <span>
        <span className="block text-sm font-medium text-gray-900">{section.title}</span>
        <span className="block font-mono text-xs text-gray-500">{section.slug}</span>
      </span>
    </label>
  );
}

export function PackageSectionAssignField({
  sections,
  selectedIds,
  onChange,
  isLoading = false,
  loadError = null,
  disabled = false,
  error,
  grouped = false,
  onApplyHomepageSpotlight,
  onApplyTravelYourWayOnly,
  renderListingTabField,
}: PackageSectionAssignFieldProps) {
  const activeSections = sortSections(sections);

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
        <p className="text-sm text-gray-600">Loading homepage sections…</p>
        <div
          className="animate-pulse space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4"
          aria-busy="true"
          aria-label="Loading sections"
        >
          <div className="h-10 rounded-lg bg-gray-200" />
          <div className="h-10 rounded-lg bg-gray-200" />
          <div className="h-10 rounded-lg bg-gray-200" />
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
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-900">Assign to sections</p>
        <p className="mt-1 text-sm text-gray-600">
          Assign once here — homepage and listings update together. You do not need to assign again
          under Sections → Packages.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          એક વાર અહીં assign કરો — homepage અને listing બંને update થશે.
        </p>
      </div>

      {grouped && (onApplyHomepageSpotlight || onApplyTravelYourWayOnly) ? (
        <div className="flex flex-wrap gap-2">
          {onApplyHomepageSpotlight ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={disabled}
              onClick={onApplyHomepageSpotlight}
            >
              Homepage spotlight
            </Button>
          ) : null}
          {onApplyTravelYourWayOnly ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-lg"
              disabled={disabled}
              onClick={onApplyTravelYourWayOnly}
            >
              Travel Your Way only
            </Button>
          ) : null}
        </div>
      ) : null}

      {activeSections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-600">
          No active sections available.
        </p>
      ) : grouped ? (
        <div className="space-y-6">
          {PLACEMENT_GROUPS.map((group) => {
            const groupSections = activeSections.filter((section) =>
              group.slugs.includes(section.slug)
            );

            if (groupSections.length === 0) {
              return null;
            }

            const selectedSectionsWithTabPicker = groupSections.filter(
              (section) =>
                selectedIds.includes(section.id) && hasSectionListingTabPicker(section.slug)
            );

            return (
              <div key={group.key} className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{group.label}</p>
                  <p className="mt-0.5 text-sm text-gray-600">{group.helper}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {groupSections.map((section) =>
                    renderSectionCheckbox(section, selectedIds, disabled, onChange)
                  )}
                </div>
                {renderListingTabField
                  ? selectedSectionsWithTabPicker.map((section) => (
                      <div key={`tab-${section.id}`}>{renderListingTabField(section)}</div>
                    ))
                  : null}
              </div>
            );
          })}
        </div>
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
