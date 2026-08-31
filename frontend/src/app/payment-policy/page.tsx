import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Payment Policy | Sunbird Vacations',
  description: 'Learn about our payment policies and terms for your bookings with Sunbird Vacations.',
};

export default function PaymentPolicyPage() {
  return (
    <>
      <div className="bg-primary-900 py-16 sm:py-24">
        <Container>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white text-center">
            Payment Policy
          </h1>
        </Container>
      </div>

      <section className="py-16 sm:py-24 bg-white">
        <Container className="max-w-4xl">
          <div className="prose prose-lg prose-teal mx-auto">
            
            {/* Payment Policy Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Policy</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold min-w-[200px]">Booking Amount:</span>
                  <span>50% advance to confirm booking</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold min-w-[200px]">Second Payment:</span>
                  <span>40-50% before 15 days of travel</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold min-w-[200px]">Final Payment:</span>
                  <span>100% before 7 days of travel</span>
                </li>
              </ul>

              <div className="mt-8 bg-teal-50 p-6 rounded-xl border border-teal-100">
                <h3 className="font-bold text-primary mb-3">Important Points:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>No services will be confirmed without advance payment.</li>
                  <li>Delayed payments may lead to cancellation without notice.</li>
                  <li>Payments once made are subject to cancellation policy.</li>
                  <li>Refunds (if applicable) will be processed within 7-10 working days.</li>
                </ul>
              </div>
            </div>

          </div>
        </Container>
      </section>
    </>
  );
}
