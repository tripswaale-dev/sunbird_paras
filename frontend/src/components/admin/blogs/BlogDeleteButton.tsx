'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteBlog } from '@/lib/admin/blogs';
import { Button } from '@/components/ui/button';

interface BlogDeleteButtonProps {
  blogId: number;
  blogTitle: string;
}

export function BlogDeleteButton({ blogId, blogTitle }: BlogDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${blogTitle}" permanently?`);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteBlog(blogId);
      router.push('/admin/blogs?deleted=1');
    } catch {
      setErrorMessage('Unable to delete blog. Please try again.');
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
        {isDeleting ? 'Deleting...' : 'Delete blog'}
      </Button>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
    </div>
  );
}
