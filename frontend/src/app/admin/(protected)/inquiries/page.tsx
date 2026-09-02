import { Suspense } from 'react';
import { InquiriesList } from '@/components/admin/inquiries/InquiriesList';
import { Loader } from '@/components/ui/loader';

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Contact Inquiries</h1>
        <p className="mt-2 text-sm text-gray-600">
          Read-only inbox for contact form submissions.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex min-h-[240px] items-center justify-center">
            <Loader />
          </div>
        }
      >
        <InquiriesList />
      </Suspense>
    </div>
  );
}
