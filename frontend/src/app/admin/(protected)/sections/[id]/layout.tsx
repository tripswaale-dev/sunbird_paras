import { getSectionIdParams } from '@/lib/build/static-params';

export async function generateStaticParams() {
  return getSectionIdParams();
}

export default function AdminSectionIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
