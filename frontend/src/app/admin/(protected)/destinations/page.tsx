import { Suspense } from 'react';
import { DestinationCategoriesList } from '@/components/admin/destinations/DestinationCategoriesList';
import { DestinationsSavedBanner } from '@/components/admin/destinations/DestinationsSavedBanner';

export default function AdminDestinationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Destinations</h1>
        <p className="mt-1 text-sm text-gray-600">Destination hub categories</p>
      </div>

      <Suspense fallback={null}>
        <DestinationsSavedBanner />
      </Suspense>

      <DestinationCategoriesList />
    </div>
  );
}
