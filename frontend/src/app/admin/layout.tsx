import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Sunbird Vacations',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-gray-50"
      data-lenis-prevent
    >
      {children}
    </div>
  );
}
