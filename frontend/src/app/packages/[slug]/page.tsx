import { PackageDetailClient } from '@/app/packages/[slug]/client';
import { getPackageMetadata } from '@/lib/api/packages';
import { getAllPackageSlugParams } from '@/lib/build/static-params';

export async function generateStaticParams() {
  const params = await getAllPackageSlugParams();
  return params.length > 0 ? params : [{ slug: '_' }];
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return getPackageMetadata(params.slug);
}

/** CSR shell — live package data loads in the browser (works for new admin slugs). */
export default function PackageDetailsPage() {
  return <PackageDetailClient />;
}
