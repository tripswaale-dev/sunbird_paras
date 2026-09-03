export { default, generateMetadata } from '@/app/packages/[slug]/page';

import { getSectionPackageSlugParams } from '@/lib/build/static-params';
import { SECTION_API_SLUGS } from '@/lib/build/section-routes';

export async function generateStaticParams() {
  return getSectionPackageSlugParams(SECTION_API_SLUGS['best-of-india']);
}
