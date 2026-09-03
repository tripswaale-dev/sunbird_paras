import { getPageKeyParams } from '@/lib/build/static-params';

export async function generateStaticParams() {
  return getPageKeyParams();
}

export default function AdminPageKeyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
