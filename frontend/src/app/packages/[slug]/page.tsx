import React from "react";
import { notFound } from "next/navigation";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  getPackageBySlug as fetchPackageBySlug,
  getPackageMetadata,
  getRelatedPackages,
} from "@/lib/api/packages";
import { Container } from "@/components/ui/container";
import { PackageHero } from "@/components/package/PackageHero";
import { PackageInfo } from "@/components/package/PackageInfo";
import { PackageTabs } from "@/components/package/PackageTabs";
import { StickyBooking } from "@/components/package/StickyBooking";
import { TourHighlights } from "@/components/package/TourHighlights";
import { PackageCard } from "@/components/package/PackageCard";
import { Accordion } from "@/components/ui/accordion";
import { getAllPackageSlugParams } from "@/lib/build/static-params";


export async function generateStaticParams() {
  return getAllPackageSlugParams();
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return getPackageMetadata(params.slug);
}

export default async function PackageDetailsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const pkg = await fetchPackageBySlug(params.slug);

  if (!pkg) {
    notFound();
  }

  const relatedPackages = await getRelatedPackages(pkg.slug, 3);

  const faqItems = pkg.faqs.map((faq, index) => ({
    id: `faq-${index}`,
    title: <span className="font-medium text-lg text-text">{faq.question}</span>,
    content: <p className="text-text-muted">{faq.answer}</p>,
  }));

  return (
    <div className="bg-surface pb-20">
      {/* Hero Gallery */}
      <PackageHero images={pkg.gallery} />

      <Container className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
          
          {/* Left Side: Main Content */}
          <div className="lg:col-span-2">
            <PackageInfo 
              title={pkg.title} 
              duration={pkg.duration} 
              destinations={pkg.destinations} 
            />
            
            <PackageTabs pkg={pkg} />
            
            <TourHighlights highlights={pkg.highlights} />
          </div>

          {/* Right Side: Sticky Booking */}
          <div className="lg:col-span-1 relative">
            <StickyBooking 
              startingPrice={pkg.startingPrice} 
              packageTitle={pkg.title} 
            />
          </div>
        </div>
      </Container>

      {/* FAQ Section */}
      {pkg.faqs && pkg.faqs.length > 0 && (
        <section className="py-16 bg-white mt-12">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-heading text-primary-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-text-muted">
                  Everything you need to know about this package.
                </p>
              </div>
              <Accordion items={faqItems} className="max-w-3xl mx-auto" />
            </div>
          </Container>
        </section>
      )}

      {/* Related Packages */}
      {relatedPackages.length > 0 && (
        <section className="py-16 bg-surface-alt">
          <Container>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading text-primary-900 mb-2">
                  Similar Packages
                </h2>
                <p className="text-text-muted">Other tours you might love.</p>
              </div>
              <Link href="/destinations" className="hidden md:flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPackages.map((relatedPkg) => (
                <PackageCard key={relatedPkg.id} pkg={relatedPkg} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
