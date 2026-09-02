'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { getMe } from '@/lib/admin/auth';
import { clearAdminToken, getAdminToken } from '@/lib/admin/token';
import type { AdminUser } from '@/lib/admin/types';
import { AdminShell } from '@/components/admin/AdminShell';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    let cancelled = false;

    async function validateSession() {
      try {
        const currentUser = await getMe();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          clearAdminToken();
        }

        router.replace('/admin/login');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void validateSession();

    return () => {
      cancelled = true;
    };
  }, [mounted, router]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center bg-gray-50 text-sm text-gray-600">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
