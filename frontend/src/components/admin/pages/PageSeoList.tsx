import Link from 'next/link';
import { PAGE_SEO_OPTIONS } from '@/lib/admin/page-seo';

export function PageSeoList() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Page SEO</h2>
        <p className="mt-1 text-sm text-gray-600">
          SEO for static marketing pages. Blog post SEO is edited per blog.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="hidden border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:grid sm:grid-cols-[1fr_160px_120px_80px] sm:gap-4">
          <span>Page</span>
          <span>Key</span>
          <span>Path</span>
          <span className="text-right">Action</span>
        </div>

        <ul className="divide-y divide-gray-100">
          {PAGE_SEO_OPTIONS.map((page) => (
            <li
              key={page.value}
              className="grid gap-2 px-4 py-4 sm:grid-cols-[1fr_160px_120px_80px] sm:items-center sm:gap-4"
            >
              <div>
                <p className="font-medium text-gray-900">{page.label}</p>
                <p className="mt-1 text-xs text-gray-500 sm:hidden">{page.value}</p>
              </div>
              <p className="hidden font-mono text-sm text-gray-600 sm:block">{page.value}</p>
              <p className="text-sm text-gray-600">{page.path}</p>
              <div className="sm:text-right">
                <Link
                  href={`/admin/pages/${page.value}/seo`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit SEO
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
