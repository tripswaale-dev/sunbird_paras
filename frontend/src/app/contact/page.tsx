import React from 'react';
import { HeroBanner } from '@/components/common/HeroBanner';
import { Container } from '@/components/ui/container';
import { getContactPageContent } from '@/lib/api/page-content';
import { getContactMetadata } from '@/lib/api/page-seo';
import { ContactForm } from './ContactForm';

export async function generateMetadata() {
  return getContactMetadata();
}

export default async function ContactPage() {
  const content = await getContactPageContent();

  return (
    <>
      <HeroBanner
        image={content.heroImage}
        title={content.heroTitle}
        subtitle={content.heroSubtitle ?? undefined}
      />

      <section className="bg-gray-50 py-20 min-h-screen">
        <Container>
          <ContactForm
            introText={content.introText ?? ''}
            contactPhone={content.contactPhone ?? ''}
            contactEmail={content.contactEmail ?? ''}
            contactAddress={content.contactAddress ?? ''}
            workingHours={content.workingHours ?? ''}
          />
        </Container>
      </section>
    </>
  );
}
