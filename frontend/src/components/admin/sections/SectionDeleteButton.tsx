'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { deleteSection } from '@/lib/admin/sections';
import { Button } from '@/components/ui/button';

interface SectionDeleteButtonProps {
  sectionId: number;
  sectionTitle: string;
}

export function SectionDeleteButton({ sectionId, sectionTitle }: SectionDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${sectionTitle}" permanently?`);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteSection(sectionId);
      router.push('/admin/sections?deleted=1');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Unable to delete section. Please try again.');
      }

      setIsDeleting(false);
    }
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
        {isDeleting ? 'Deleting...' : 'Delete section'}
      </Button>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
