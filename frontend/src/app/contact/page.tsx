import React from 'react';
import { Metadata } from 'next';
import { HeroBanner } from '@/components/common/HeroBanner';
import { Container } from '@/components/ui/container';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Sunbird Vacations',
  description: 'Get in touch with our travel experts to plan your dream vacation. We are here to answer your questions and design your perfect itinerary.',
};

export default function ContactPage() {
  return (
    <>
      <HeroBanner
        image="/images/destinations/kerala.jpg"
        title="Contact Us"
        subtitle="Let's start planning your next great adventure."
      />

      <section className="bg-gray-50 py-20 min-h-screen">
        <Container>
          <ContactForm />
        </Container>
      </section>


    </>
  );
}
