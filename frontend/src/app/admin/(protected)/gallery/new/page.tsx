import { GalleryItemForm } from '@/components/admin/gallery/GalleryItemForm';
import { getDefaultGalleryItemFormValues } from '@/lib/admin/gallery-items';

export default function AdminGalleryCreatePage() {
  return (
    <GalleryItemForm mode="create" defaultValues={getDefaultGalleryItemFormValues()} />
  );
}
