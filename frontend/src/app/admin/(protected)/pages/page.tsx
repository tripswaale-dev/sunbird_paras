import { Suspense } from 'react';
import { PageContentList } from '@/components/admin/pages/PageContentList';
import { PageSeoList } from '@/components/admin/pages/PageSeoList';
import { PagesSavedBanner } from '@/components/admin/pages/PagesSavedBanner';

export default function AdminPagesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Pages</h1>
        <p className="mt-1 text-sm text-gray-600">Page SEO and content</p>
      </div>

      <Suspense fallback={null}>
        <PagesSavedBanner />
      </Suspense>

      <PageSeoList />
      <PageContentList />
    </div>
  );
}
