import { adminApiGet, adminApiPost, adminApiPostPublic } from '@/lib/admin/client';
import { clearAdminToken, setAdminToken } from '@/lib/admin/token';
import type { AdminLoginResponse, AdminLogoutResponse, AdminUser } from '@/lib/admin/types';

export async function login(email: string, password: string): Promise<AdminLoginResponse> {
  const data = await adminApiPostPublic<AdminLoginResponse>('/admin/login', {
    email,
    password,
  });

  setAdminToken(data.token);

  return data;
}

export async function logout(): Promise<void> {
  try {
    await adminApiPost<AdminLogoutResponse>('/admin/logout', {});
  } finally {
    clearAdminToken();
  }
}

export async function getMe(): Promise<AdminUser> {
  return adminApiGet<AdminUser>('/admin/me');
}
