'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navbarDestinations } from '@/data/navigation';

const navLinks = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blogs', href: '/blogs' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  
  const isHomePage = pathname === "/";

  if (pathname !== prevPathname) {
    setIsMobileMenuOpen(false);
    setPrevPathname(pathname);
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      style={{ WebkitBackfaceVisibility: "hidden" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage
          ? isScrolled
            ? "bg-white/90 backdrop-blur-md py-1 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent py-2 text-white"
          : "bg-white py-1 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center -ml-1 md:-ml-3 lg:-ml-4 z-[60]">
          <div className="relative h-12 md:h-14 lg:h-16 w-[150px] md:w-[170px] lg:w-[200px] shrink-0">
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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
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
                        ? "text-zinc-900 font-semibold"
                        : "text-white font-semibold drop-shadow-sm"
                      : "text-zinc-900 font-semibold"
                    : isHomePage
                      ? isScrolled
                        ? "text-zinc-700 hover:text-zinc-900 font-medium"
                        : "text-white hover:text-white font-medium drop-shadow-sm"
                      : "text-zinc-700 hover:text-zinc-900 font-medium"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Destinations Dropdown */}
          <div className="relative group flex items-center h-full py-2">
            <Link
              href="/packages"
              className={`flex items-center gap-1 text-base tracking-wide transition-colors ${
                pathname === '/destinations' || pathname.startsWith('/destinations/')
                  ? isHomePage
                    ? isScrolled
                      ? 'text-zinc-900 font-semibold'
                      : 'text-white font-semibold drop-shadow-sm'
                    : 'text-zinc-900 font-semibold'
                  : isHomePage
                    ? isScrolled
                      ? 'text-zinc-700 hover:text-zinc-900 font-medium'
                      : 'text-white hover:text-white font-medium drop-shadow-sm'
                    : 'text-zinc-700 hover:text-zinc-900 font-medium'
              }`}
            >
              Destinations
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-[400px] border border-gray-100 p-3">
                <div className="grid grid-cols-2 gap-1">
                  {navbarDestinations.map((dest) => (
                    <Link
                      key={dest}
                      href={`/packages?category=${encodeURIComponent(dest)}`}
                      className="px-3 py-2 text-sm text-gray-700 hover:text-primary hover:bg-teal-50 rounded-xl transition-colors font-medium flex items-center justify-center text-center"
                    >
                      {dest}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="hidden md:flex">
          <Link
            href="/contact"
            className={`text-sm font-medium px-6 py-2.5 rounded-full transition ${
              isHomePage
                ? isScrolled
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-white text-primary hover:bg-white/90"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden z-[60] p-2 transition-colors ${
            isMobileMenuOpen 
              ? "text-zinc-900" 
              : isHomePage
                ? isScrolled
                  ? "text-zinc-600"
                  : "text-white"
                : "text-zinc-600"
          }`}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl z-[50] md:hidden overflow-y-auto"
            >
              <div className="flex flex-col pt-24 pb-8 px-6 min-h-full">
                <div className="flex flex-col gap-6">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-2xl font-semibold text-zinc-900"
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="flex flex-col gap-4 mt-2 pt-6 border-t border-gray-100">
                    <Link href="/packages" className="text-2xl font-semibold text-zinc-900">
                      Destinations
                    </Link>
                    <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-primary/20">
                      {navbarDestinations.map((dest) => (
                        <Link
                          key={dest}
                          href={`/packages?category=${encodeURIComponent(dest)}`}
                          className="text-lg text-zinc-600 font-medium py-1"
                        >
                          {dest}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-10">
                  <Link
                    href="/contact"
                    className="block w-full bg-primary text-white px-6 py-4 rounded-xl text-center font-semibold text-lg shadow-lg shadow-primary/20"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
