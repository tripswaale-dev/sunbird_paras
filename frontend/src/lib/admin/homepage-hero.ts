import { adminApiGet, adminApiPatch } from '@/lib/admin/client';
import type { HomepageHeroFormValues } from '@/lib/admin/homepage-hero-form-schema';

export type HeroChipIcon = 'mountain' | 'umbrella' | 'tree-pine' | 'map-pin';

export interface HeroChip {
  icon: HeroChipIcon;
  label: string;
}

export interface AdminHomepageHero {
  id: number;
  background_video: string;
  chips: HeroChip[];
  featured_chip: HeroChip | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type HomepageHeroApiPayload = {
  background_video: string;
  chips: HeroChip[];
  featured_chip: HeroChip | null;
  is_active: boolean;
};

export const HERO_CHIP_ICON_OPTIONS: Array<{ value: HeroChipIcon; label: string }> = [
  { value: 'mountain', label: 'Mountain' },
  { value: 'umbrella', label: 'Beaches' },
  { value: 'tree-pine', label: 'Nature' },
  { value: 'map-pin', label: 'Map Pin' },
];

export function toHomepageHeroFormValues(item: AdminHomepageHero): HomepageHeroFormValues {
  return {
    background_video: item.background_video,
    chips: item.chips.length > 0 ? item.chips : [{ icon: 'mountain', label: '' }],
    featured_chip_enabled: item.featured_chip !== null,
    featured_chip_icon: item.featured_chip?.icon,
    featured_chip_label: item.featured_chip?.label ?? '',
    is_active: item.is_active,
  };
}

export function toHomepageHeroPayload(values: HomepageHeroFormValues): HomepageHeroApiPayload {
  return {
    background_video: values.background_video.trim(),
    chips: values.chips.map((chip) => ({
      icon: chip.icon,
      label: chip.label.trim(),
    })),
    featured_chip:
      values.featured_chip_enabled && values.featured_chip_icon
        ? {
            icon: values.featured_chip_icon,
            label: values.featured_chip_label?.trim() ?? '',
          }
        : null,
    is_active: values.is_active,
  };
}

export function getHomepageHero(): Promise<AdminHomepageHero> {
  return adminApiGet<AdminHomepageHero>('/admin/homepage-hero');
}

export function updateHomepageHero(payload: HomepageHeroApiPayload): Promise<AdminHomepageHero> {
  return adminApiPatch<AdminHomepageHero, HomepageHeroApiPayload>(
    '/admin/homepage-hero',
    payload
  );
}
