import Link from 'next/link';

export function InquiryNotFound() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Inquiry not found</h1>
      <p className="mt-3 text-gray-600">
        This inquiry may have been removed or the link is incorrect.
      </p>
      <Link
        href="/admin/inquiries"
        className="mt-6 inline-flex text-sm font-medium text-primary hover:underline"
      >
        ← Back to inquiries
      </Link>
    </div>
  );
}
