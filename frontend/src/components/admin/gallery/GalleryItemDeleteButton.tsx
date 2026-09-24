'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteGalleryItem } from '@/lib/admin/gallery-items';
import { Button } from '@/components/ui/button';

interface GalleryItemDeleteButtonProps {
  itemId: number;
  itemTitle: string;
  /** Compact text link for table rows; default is the outline button used on edit forms. */
  variant?: 'button' | 'link';
}

export function GalleryItemDeleteButton({
  itemId,
  itemTitle,
  variant = 'button',
}: GalleryItemDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${itemTitle}" permanently?`);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteGalleryItem(itemId);
      router.push('/admin/gallery?deleted=1');
    } catch {
      setErrorMessage('Unable to delete gallery item. Please try again.');
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
        {isDeleting ? 'Deleting...' : 'Delete item'}
      </Button>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
