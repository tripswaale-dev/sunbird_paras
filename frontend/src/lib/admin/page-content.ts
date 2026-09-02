import { adminApiGet, adminApiPatch } from '@/lib/admin/client';
import type {
  AboutPageContentFormValues,
  ContactPageContentFormValues,
  PageContentFormValues,
} from '@/lib/admin/page-content-form-schema';

export const PAGE_CONTENT_KEYS = ['about', 'contact'] as const;

export type PageContentKey = (typeof PAGE_CONTENT_KEYS)[number];

export interface PageContentOption {
  value: PageContentKey;
  label: string;
  path: string;
}

export const PAGE_CONTENT_OPTIONS: PageContentOption[] = [
  { value: 'about', label: 'About', path: '/about' },
  { value: 'contact', label: 'Contact', path: '/contact' },
];

export interface AdminPageContent {
  page_key: PageContentKey;
  hero_image: string;
  hero_title: string;
  hero_subtitle: string | null;
  intro_text: string | null;
  body: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_address: string | null;
  working_hours: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PageContentApiPayload = {
  hero_image: string;
  hero_title: string;
  hero_subtitle: string | null;
  intro_text: string | null;
  body: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_address: string | null;
  working_hours: string | null;
  is_active: boolean;
};

export function isValidPageContentKey(key: string): key is PageContentKey {
  return (PAGE_CONTENT_KEYS as readonly string[]).includes(key);
}

export function getPageContentOption(key: PageContentKey): PageContentOption {
  const option = PAGE_CONTENT_OPTIONS.find((item) => item.value === key);

  if (!option) {
    throw new Error(`Unknown page content key: ${key}`);
  }

  return option;
}

export function toPageContentFormValues(item: AdminPageContent): PageContentFormValues {
  const base = {
    hero_image: item.hero_image,
    hero_title: item.hero_title,
    hero_subtitle: item.hero_subtitle ?? '',
    intro_text: item.intro_text ?? '',
    is_active: item.is_active,
  };

  if (item.page_key === 'about') {
    return {
      ...base,
      body: item.body ?? '',
    } satisfies AboutPageContentFormValues;
  }

  return {
    ...base,
    contact_phone: item.contact_phone ?? '',
    contact_email: item.contact_email ?? '',
    contact_address: item.contact_address ?? '',
    working_hours: item.working_hours ?? '',
  } satisfies ContactPageContentFormValues;
}

function trimOrNull(value: string | undefined): string | null {
  return value?.trim() || null;
}

export function toPageContentPayload(
  pageKey: PageContentKey,
  values: PageContentFormValues
): PageContentApiPayload {
  const base = {
    hero_image: values.hero_image.trim(),
    hero_title: values.hero_title.trim(),
    hero_subtitle: trimOrNull(values.hero_subtitle),
    intro_text: trimOrNull(values.intro_text),
    is_active: values.is_active,
  };

  if (pageKey === 'about') {
    const aboutValues = values as AboutPageContentFormValues;

    return {
      ...base,
      body: trimOrNull(aboutValues.body),
      contact_phone: null,
      contact_email: null,
      contact_address: null,
      working_hours: null,
    };
  }

  const contactValues = values as ContactPageContentFormValues;

  return {
    ...base,
    body: null,
    contact_phone: trimOrNull(contactValues.contact_phone),
    contact_email: trimOrNull(contactValues.contact_email),
    contact_address: trimOrNull(contactValues.contact_address),
    working_hours: trimOrNull(contactValues.working_hours),
  };
}

export function getPageContent(pageKey: PageContentKey): Promise<AdminPageContent> {
  return adminApiGet<AdminPageContent>(`/admin/page-content/${pageKey}`);
}

export function updatePageContent(
  pageKey: PageContentKey,
  payload: PageContentApiPayload
): Promise<AdminPageContent> {
  return adminApiPatch<AdminPageContent, PageContentApiPayload>(
    `/admin/page-content/${pageKey}`,
    payload
  );
}
