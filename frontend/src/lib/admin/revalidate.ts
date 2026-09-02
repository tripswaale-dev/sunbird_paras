import { getAdminToken } from '@/lib/admin/token';

export function revalidatePublicSite(): void {
  const token = getAdminToken();

  if (!token) {
    return;
  }

  void fetch('/api/revalidate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  }).catch(() => {
    // Best-effort; public pages still refresh within the 5 minute TTL.
  });
}
