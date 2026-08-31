import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ArrowRight, Heart } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TwitterIcon } from '@/components/ui/social-icons';
import { siteConfig } from '@/lib/utils';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Tour Packages', href: '/packages' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Cancellation & Refund Policy', href: '/cancellation-policy' },
  { label: 'Payment Policy', href: '/payment-policy' },
];

const destinationLinks = [
  { label: 'Rajasthan', href: '/destinations?q=rajasthan' },
  { label: 'Kerala', href: '/destinations?q=kerala' },
  { label: 'Himachal Pradesh', href: '/destinations?q=himachal' },
  { label: 'Nepal', href: '/destinations?q=nepal' },
  { label: 'srilanka', href: '/destinations?q=srilanka' },
  { label: 'ladakh', href: '/destinations?q=ladakh' },
];

const socialLinks = [
  { icon: InstagramIcon, href: siteConfig.social.instagram, label: 'Instagram' },
  { icon: FacebookIcon, href: siteConfig.social.facebook, label: 'Facebook' },
  { icon: YoutubeIcon, href: siteConfig.social.youtube, label: 'YouTube' },
  { icon: TwitterIcon, href: siteConfig.social.twitter, label: 'Twitter' },
];

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white/80" role="contentinfo">
      {/* Main Footer */}
      <Container className="section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Sunbird Vacations - Home">
              <Image
                src="/logo.svg"
                alt="Sunbird Vacations"
                width={200}
                height={100}
                className="h-22 w-auto mb-4"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 transition-all hover:bg-secondary hover:text-white hover:scale-110"
                  aria-label={`Follow us on ${social.label}`}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h3 className="text-white font-heading text-lg font-semibold mb-4">
              Top Destinations
            </h3>
            <ul className="space-y-2.5">
              {destinationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-heading text-lg font-semibold mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 text-sm transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-start gap-3 text-sm transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
                <span>{siteConfig.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <Container className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/50">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-secondary fill-secondary" /> in India
          </p>
        </Container>
      </div>
    </footer>
  );
}
