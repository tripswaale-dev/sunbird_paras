import { getHomepagePromiseIdParams } from '@/lib/build/static-params';

export async function generateStaticParams() {
  return getHomepagePromiseIdParams();
}

export default function AdminHomepagePromiseIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
