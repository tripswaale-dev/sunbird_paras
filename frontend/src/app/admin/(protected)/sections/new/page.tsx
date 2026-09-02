import { SectionForm } from '@/components/admin/sections/SectionForm';
import { getDefaultSectionFormValues } from '@/lib/admin/sections';

export default function AdminSectionNewPage() {
  return <SectionForm mode="create" defaultValues={getDefaultSectionFormValues()} />;
}
