import { Map } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  compact?: boolean;
}

export function EmptyState({
  message = 'No packages found',
  subMessage = "We're currently curating amazing experiences for this travel style. Please check back later!",
  compact = false,
}: EmptyStateProps) {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center px-4">
        <div className="bg-gray-50 p-4 rounded-full mb-4 text-gray-400">
          <Map className="h-8 w-8" />
        </div>
        <p className="text-sm text-gray-500 max-w-xs">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="bg-gray-50 p-6 rounded-full mb-6 text-gray-400">
        <Map className="h-12 w-12" />
      </div>
      <h3 className="text-2xl font-semibold text-primary mb-2">{message}</h3>
      <p className="text-gray-500 max-w-md">{subMessage}</p>
    </div>
  );
}
