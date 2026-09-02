'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/admin/auth';
import type { AdminUser } from '@/lib/admin/types';
import { Button } from '@/components/ui/button';

interface AdminShellProps {
  user: AdminUser;
  children: React.ReactNode;
}

const placeholderNavItems = ['Dashboard', 'Content'];

export function AdminShell({ user, children }: AdminShellProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      router.replace('/admin/login');
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-6">
          <p className="text-lg font-semibold text-gray-900">Sunbird Admin</p>
          <p className="mt-1 text-xs text-gray-500">Content management</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {placeholderNavItems.map((label) => (
              <li key={label}>
                <span
                  aria-disabled="true"
                  className="block cursor-not-allowed rounded-lg px-3 py-2 text-sm text-gray-400"
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Signing out...' : 'Logout'}
          </Button>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
