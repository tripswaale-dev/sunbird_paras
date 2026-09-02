import Link from 'next/link';
import { CustomerPromiseItemsList } from '@/components/admin/homepage/CustomerPromiseItemsList';

export default function AdminHomepagePromisesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customer promises</h1>
          <p className="mt-1 text-sm text-gray-600">Edit the four homepage promise cards.</p>
        </div>

        <Link
          href="/admin/homepage"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to homepage
        </Link>
      </div>

      <CustomerPromiseItemsList />
    </div>
  );
}
