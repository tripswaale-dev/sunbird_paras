import { revalidateTag } from 'next/cache';
import { PUBLIC_CACHE_TAG } from '@/lib/api/cache-tags';
import { getApiBaseUrl } from '@/lib/admin/config';

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  const verification = await fetch(`${getApiBaseUrl()}/admin/sections`, {
    headers: { Accept: 'application/json', Authorization: authorization },
    cache: 'no-store',
  });

  if (!verification.ok) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  revalidateTag(PUBLIC_CACHE_TAG, 'max');

  return Response.json({ revalidated: true });
}
