import React from 'react';
import { Container } from '@/components/ui/container';
import { getCancellationPolicyMetadata } from '@/lib/api/page-seo';

export async function generateMetadata() {
  return getCancellationPolicyMetadata();
}

export default function CancellationPolicyPage() {
  return (
    <>
      <div className="bg-primary-900 py-16 sm:py-24">
        <Container>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white text-center">
            Cancellation & Refund Policy
          </h1>
        </Container>
      </div>

      <section className="py-16 sm:py-24 bg-white">
        <Container className="max-w-4xl">
          <div className="prose prose-lg prose-teal mx-auto space-y-12">
            
            {/* Cancellation & Refund Policy Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cancellation & Refund Policy</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold min-w-[200px]">30 days or more before travel:</span>
                  <span>10% of total cost deducted</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold min-w-[200px]">15-29 days before travel:</span>
                  <span>25% deduction</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold min-w-[200px]">7-14 days before travel:</span>
                  <span>50% deduction</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold min-w-[200px]">Less than 7 days / No-show:</span>
                  <span>100% cancellation charge</span>
                </li>
              </ul>

              <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">Note:</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Flight/train tickets follow their own cancellation rules.</li>
                  <li>Peak season bookings may have stricter cancellation terms.</li>
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
