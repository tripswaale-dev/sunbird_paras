'use client';

import { useId, useRef, useState } from 'react';
import { ApiError } from '@/lib/api/client';
import {
  ADMIN_IMAGE_ACCEPT,
  uploadAdminImage,
  validateAdminImageFile,
} from '@/lib/admin/media';
import { GalleryImagePreview } from '@/components/admin/gallery/GalleryImagePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  previewAlt?: string;
  placeholder?: string;
  disabled?: boolean;
  fieldId?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  error,
  helperText = 'JPEG, PNG, WebP, or GIF. Max 5 MB.',
  previewAlt,
  placeholder = '/images/...',
  disabled = false,
  fieldId,
}: ImageUploadFieldProps) {
  const generatedId = useId();
  const pasteInputId = fieldId ?? `${generatedId}-path`;
  const fileInputId = `${pasteInputId}-file`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    const validationError = validateAdminImageFile(file);

    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadAdminImage(file);
      onChange(uploaded.path);
    } catch (caught) {
      setUploadError(
        caught instanceof ApiError ? caught.message : 'Unable to upload image. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  }

  const displayError = error || uploadError;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <GalleryImagePreview
          src={value}
          alt={previewAlt || label}
          size="md"
          className="shrink-0"
        />

        <div className="min-w-0 flex-1 space-y-3">
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept={ADMIN_IMAGE_ACCEPT}
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
              {isUploading ? 'Uploading...' : 'Upload image'}
            </Button>
            <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
          </div>

          <Input
            id={pasteInputId}
            label="Or paste a path or URL"
            placeholder={placeholder}
            value={value}
            disabled={disabled || isUploading}
            onChange={(event) => {
              setUploadError(null);
              onChange(event.target.value);
            }}
          />
        </div>
      </div>

      {displayError ? (
        <p className="text-sm text-red-600" role="alert">
          {displayError}
        </p>
      ) : null}
    </div>
  );
}
