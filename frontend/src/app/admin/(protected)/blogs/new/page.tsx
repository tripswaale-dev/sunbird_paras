import { BlogForm } from '@/components/admin/blogs/BlogForm';
import { getDefaultBlogFormValues } from '@/lib/admin/blogs';

export default function AdminBlogCreatePage() {
  return <BlogForm mode="create" defaultValues={getDefaultBlogFormValues()} />;
}
