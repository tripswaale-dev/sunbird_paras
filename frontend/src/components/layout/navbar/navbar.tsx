'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useApiData } from '@/hooks/use-api-data';
import { apiGet } from '@/lib/api/client';
import type { DestinationCategorySummary } from '@/lib/api/types';

const navLinks = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blogs', href: '/blogs' },
];

async function fetchNavbarDestinations(): Promise<string[]> {
  try {
    const data = await apiGet<{ categories: DestinationCategorySummary[] }>('/destinations');
    return data.categories.map((c) => c.title);
  } catch {
    return [];
  }
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const destFetcher = useCallback(() => fetchNavbarDestinations(), []);
  const { data: navbarDestinations } = useApiData<string[]>(destFetcher, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('lenis:start'));
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('lenis:stop'));

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.dispatchEvent(new CustomEvent('lenis:start'));
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const mobileMenu = (
    <AnimatePresence>
      {isMobileMenuOpen ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[2px] md:hidden"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 z-[101] flex w-[min(100%,20rem)] flex-col bg-white shadow-2xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Menu
              </span>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="rounded-full p-2 text-zinc-700 transition-colors hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div
              className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-6"
              data-lenis-prevent
            >
              <div className="flex flex-col gap-5">
                {navLinks.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`text-xl font-semibold transition-colors ${
                        isActive ? 'text-primary' : 'text-zinc-900'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="mt-2 border-t border-gray-100 pt-6">
                  <Link
                    href="/packages"
                    onClick={closeMobileMenu}
                    className="text-xl font-semibold text-zinc-900"
                  >
                    Destinations
                  </Link>
                  <div className="mt-4 grid grid-cols-1 gap-2 border-l-2 border-primary/20 pl-4">
                    {navbarDestinations.map((dest) => (
                      <Link
                        key={dest}
                        href={`/packages?category=${encodeURIComponent(dest)}`}
                        onClick={closeMobileMenu}
                        className="py-1.5 text-base font-medium text-zinc-600 transition-colors hover:text-primary"
                      >
                        {dest}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="block w-full rounded-xl bg-primary px-6 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-primary/20"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );

  return (
    <nav
      style={{ WebkitBackfaceVisibility: 'hidden' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage
          ? isScrolled
            ? 'bg-white/90 backdrop-blur-md py-1 shadow-[0_1px_0_rgba(0,0,0,0.06)]'
            : 'bg-transparent py-2 text-white'
          : 'bg-white py-1 shadow-[0_1px_0_rgba(0,0,0,0.06)]'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 lg:px-12">
        <Link href="/" className="relative z-[102] -ml-1 flex items-center md:-ml-3 lg:-ml-4">
          <div className="relative h-12 w-[150px] shrink-0 md:h-14 md:w-[170px] lg:h-16 lg:w-[200px]">
            <Image
              src="/svlogo.png"
              alt="Sunbird Vacations Logo"
              fill
              sizes="(max-width: 768px) 150px, (max-width: 1024px) 170px, 200px"
              className="object-contain"
              priority
              quality={100}
            />
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base tracking-wide transition-colors ${
                  isActive
                    ? isHomePage
                      ? isScrolled
                        ? 'font-semibold text-zinc-900'
                        : 'font-semibold text-white drop-shadow-sm'
                      : 'font-semibold text-zinc-900'
                    : isHomePage
                      ? isScrolled
                        ? 'font-medium text-zinc-700 hover:text-zinc-900'
                        : 'font-medium text-white drop-shadow-sm hover:text-white'
                      : 'font-medium text-zinc-700 hover:text-zinc-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="group relative flex h-full items-center py-2">
            <Link
              href="/packages"
              className={`flex items-center gap-1 text-base tracking-wide transition-colors ${
                pathname === '/destinations' || pathname.startsWith('/destinations/')
                  ? isHomePage
                    ? isScrolled
                      ? 'font-semibold text-zinc-900'
                      : 'font-semibold text-white drop-shadow-sm'
                    : 'font-semibold text-zinc-900'
                  : isHomePage
                    ? isScrolled
                      ? 'font-medium text-zinc-700 hover:text-zinc-900'
                      : 'font-medium text-white drop-shadow-sm hover:text-white'
                    : 'font-medium text-zinc-700 hover:text-zinc-900'
              }`}
            >
              Destinations
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
              <div className="w-[400px] overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl">
                <div className="grid grid-cols-2 gap-1">
                  {navbarDestinations.map((dest) => (
                    <Link
                      key={dest}
                      href={`/packages?category=${encodeURIComponent(dest)}`}
                      className="flex items-center justify-center rounded-xl px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-teal-50 hover:text-primary"
                    >
                      {dest}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex">
          <Link
            href="/contact"
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
              isHomePage
                ? isScrolled
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-white text-primary hover:bg-white/90'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            Contact Us
          </Link>
        </div>

        {!isMobileMenuOpen ? (
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className={`relative z-[102] rounded-full p-2 transition-colors md:hidden ${
              isHomePage
                ? isScrolled
                  ? 'text-zinc-600'
                  : 'text-white'
                : 'text-zinc-600'
            }`}
            aria-label="Open menu"
            aria-expanded={false}
          >
            <Menu size={28} />
          </button>
        ) : null}
      </div>

      {isMounted ? createPortal(mobileMenu, document.body) : null}
    </nav>
  );
}
