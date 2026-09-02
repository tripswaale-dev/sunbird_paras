'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { logout } from '@/lib/admin/auth';
import type { AdminUser } from '@/lib/admin/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminShellProps {
  user: AdminUser;
  children: React.ReactNode;
}

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Inquiries', href: '/admin/inquiries' },
  { label: 'Packages', href: '/admin/packages' },
  { label: 'Blogs', href: '/admin/blogs' },
  { label: 'Gallery', href: '/admin/gallery' },
  { label: 'Homepage', href: '/admin/homepage' },
  { label: 'Sections', href: '/admin/sections' },
  { label: 'Destinations', href: '/admin/destinations' },
  { label: 'Pages', href: '/admin/pages' },
] as const;

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === '/admin') {
    return pathname === '/admin';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ user, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
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
    <div className="flex h-full min-h-0 bg-gray-50">
      <aside className="flex w-60 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-6">
          <p className="text-lg font-semibold text-gray-900">Sunbird Admin</p>
          <p className="mt-1 text-xs text-gray-500">Content management</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm transition',
                      isActive
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
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

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">{children}</main>
      </div>
    </div>
  );
}
