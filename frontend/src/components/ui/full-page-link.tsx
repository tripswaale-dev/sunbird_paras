'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { withTrailingSlash } from '@/lib/public-href';

type FullPageLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
};

/**
 * Full document navigation (not Next.js soft nav).
 * Required for static-export package/blog slugs so the browser does not get
 * stuck on the trailing-slash 308 "Redirecting..." page.
 */
export function FullPageLink({ href, children, ...props }: FullPageLinkProps) {
  return (
    <a href={withTrailingSlash(href)} {...props}>
      {children}
    </a>
  );
}
