'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Convenience alias — admin auth lives at /admin/login */
export default function LoginAliasPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/login');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <p className="text-sm text-gray-600">Redirecting to admin login…</p>
    </div>
  );
}
