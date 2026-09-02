import { DashboardInquiriesTeaser } from '@/components/admin/DashboardInquiriesTeaser';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-3 text-gray-600">More admin modules coming in Step 3.</p>
      </div>

      <div className="max-w-sm">
        <DashboardInquiriesTeaser />
      </div>
    </div>
  );
}
