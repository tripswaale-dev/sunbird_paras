import { adminApiUpload } from '@/lib/admin/client';

export const ADMIN_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
export const ADMIN_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export interface AdminMediaUpload {
  path: string;
  url: string;
  original_name: string;
  mime_type: string | null;
}

export function uploadAdminImage(file: File): Promise<AdminMediaUpload> {
  return adminApiUpload<AdminMediaUpload>('/admin/media', file);
}

export async function uploadAdminImages(
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<AdminMediaUpload[]> {
  const uploads: AdminMediaUpload[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const validationError = validateAdminImageFile(file);

    if (validationError) {
      throw new Error(`${file.name}: ${validationError}`);
    }

    try {
      const uploaded = await uploadAdminImage(file);
      uploads.push(uploaded);
      onProgress?.(index + 1, files.length);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to upload image. Please try again.';

      throw new Error(`${file.name}: ${message}`);
    }
  }

  return uploads;
}

export function validateAdminImageFile(file: File): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type) && !/\.(jpe?g|png|gif|webp)$/i.test(file.name)) {
    return 'Upload a JPEG, PNG, WebP, or GIF image.';
  }

  if (file.size > ADMIN_IMAGE_MAX_BYTES) {
    return 'Images must be 5 MB or smaller.';
  }

  return null;
}
