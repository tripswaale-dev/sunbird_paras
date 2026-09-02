import { adminApiGet, adminApiPatch } from '@/lib/admin/client';
import type { CustomerPromiseItemFormValues } from '@/lib/admin/customer-promise-item-form-schema';

export const CUSTOMER_PROMISE_ITEM_IDS = [1, 2, 3, 4] as const;

export type CustomerPromiseItemId = (typeof CUSTOMER_PROMISE_ITEM_IDS)[number];

export type PromiseItemIcon = 'headphones' | 'alarm-clock' | 'handshake' | 'users';

export interface AdminCustomerPromiseItem {
  id: number;
  title: string;
  description: string;
  icon: PromiseItemIcon;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type CustomerPromiseItemApiPayload = {
  title: string;
  description: string;
  icon: PromiseItemIcon;
  sort_order: number;
  is_active: boolean;
};

export const PROMISE_ICON_OPTIONS: Array<{ value: PromiseItemIcon; label: string }> = [
  { value: 'headphones', label: 'Headphones' },
  { value: 'alarm-clock', label: 'Alarm Clock' },
  { value: 'handshake', label: 'Handshake' },
  { value: 'users', label: 'Users' },
];

export function isValidCustomerPromiseItemId(id: string | number): id is CustomerPromiseItemId {
  const numericId = typeof id === 'string' ? Number(id) : id;

  return (CUSTOMER_PROMISE_ITEM_IDS as readonly number[]).includes(numericId);
}

export function toCustomerPromiseItemFormValues(
  item: AdminCustomerPromiseItem
): CustomerPromiseItemFormValues {
  return {
    title: item.title,
    description: item.description,
    icon: item.icon,
    sort_order: item.sort_order,
    is_active: item.is_active,
  };
}

export function toCustomerPromiseItemPayload(
  values: CustomerPromiseItemFormValues
): CustomerPromiseItemApiPayload {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    icon: values.icon,
    sort_order: Math.trunc(values.sort_order),
    is_active: values.is_active,
  };
}

export function getCustomerPromiseItems(): Promise<AdminCustomerPromiseItem[]> {
  return adminApiGet<AdminCustomerPromiseItem[]>('/admin/customer-promise-items');
}

export function getCustomerPromiseItem(id: CustomerPromiseItemId): Promise<AdminCustomerPromiseItem> {
  return adminApiGet<AdminCustomerPromiseItem>(`/admin/customer-promise-items/${id}`);
}

export function updateCustomerPromiseItem(
  id: CustomerPromiseItemId,
  payload: CustomerPromiseItemApiPayload
): Promise<AdminCustomerPromiseItem> {
  return adminApiPatch<AdminCustomerPromiseItem, CustomerPromiseItemApiPayload>(
    `/admin/customer-promise-items/${id}`,
    payload
  );
}
