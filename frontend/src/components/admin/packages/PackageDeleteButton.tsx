'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { deletePackage } from '@/lib/admin/packages';
import { Button } from '@/components/ui/button';

interface PackageDeleteButtonProps {
  packageId: number;
  packageTitle: string;
  /** Compact text link for table rows; default is the outline button used on edit forms. */
  variant?: 'button' | 'link';
}

export function PackageDeleteButton({
  packageId,
  packageTitle,
  variant = 'button',
}: PackageDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${packageTitle}" permanently?\n\nThis also removes section placements, details, itinerary, FAQs, and images.`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deletePackage(packageId);
      router.push('/admin/packages?deleted=1');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Unable to delete package. Please try again.');
      }

      setIsDeleting(false);
    }
  }

  if (variant === 'link') {
    return (
      <span className="inline-flex flex-col items-start gap-1">
        <button
          type="button"
          className="text-red-600 hover:underline disabled:opacity-50"
          onClick={() => void handleDelete()}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
        {errorMessage ? <span className="text-xs text-red-600">{errorMessage}</span> : null}
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-lg border-red-200 text-red-700 hover:bg-red-50"
        onClick={() => void handleDelete()}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete package'}
      </Button>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
