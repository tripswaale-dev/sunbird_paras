import { getDestinationCodeParams } from '@/lib/build/static-params';

export async function generateStaticParams() {
  return getDestinationCodeParams();
}

export default function AdminDestinationCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
