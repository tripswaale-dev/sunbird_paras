'use client';

import { useId, useRef, useState } from 'react';
import {
  ADMIN_IMAGE_ACCEPT,
  uploadAdminImages,
} from '@/lib/admin/media';
import { GalleryImagePreview } from '@/components/admin/gallery/GalleryImagePreview';
import { Button } from '@/components/ui/button';

interface MultiImageUploadFieldProps {
  label?: string;
  paths: string[];
  onChange: (paths: string[]) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export function MultiImageUploadField({
  label = 'Images',
  paths,
  onChange,
  error,
  helperText = 'JPEG, PNG, WebP, or GIF. Max 5 MB each. Select multiple files at once.',
  disabled = false,
}: MultiImageUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(
    null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? [...event.target.files] : [];
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress({ completed: 0, total: files.length });

    try {
      const uploads = await uploadAdminImages(files, (completed, total) => {
        setUploadProgress({ completed, total });
      });
      const nextPaths = [...paths, ...uploads.map((upload) => upload.path)];
      onChange(nextPaths);
    } catch (caught) {
      setUploadError(
        caught instanceof Error ? caught.message : 'Unable to upload images. Please try again.'
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }

  function removePath(index: number) {
    onChange(paths.filter((_, pathIndex) => pathIndex !== index));
  }

  const displayError = error || uploadError;

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={ADMIN_IMAGE_ACCEPT}
        multiple
        className="sr-only"
        disabled={disabled || isUploading}
        onChange={(event) => {
          void handleFileChange(event);
        }}
      />

      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-900">{label}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg"
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading && uploadProgress
            ? `Uploading ${uploadProgress.completed} of ${uploadProgress.total}...`
            : 'Upload images'}
        </Button>
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      </div>

      {paths.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {paths.map((path, index) => (
            <div
              key={`${path}-${index}`}
              className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-2"
            >
              <GalleryImagePreview
                src={path}
                alt={`Upload preview ${index + 1}`}
                size="md"
                className="h-24 w-full"
              />
              <p className="truncate text-xs text-gray-600" title={path}>
                {path}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full rounded-lg"
                disabled={disabled || isUploading}
                onClick={() => removePath(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
          No images selected yet.
        </div>
      )}

      {displayError ? (
        <p className="text-sm text-red-600" role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  );
}
