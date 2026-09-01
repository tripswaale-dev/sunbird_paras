'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { ApiError } from '@/lib/api/client';
import { submitContactInquiry } from '@/lib/api/contact-inquiries';
import type { ContactInquiryPayload } from '@/lib/api/types';

export interface ContactFormProps {
  introText: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  workingHours: string;
}

const initialFormState: ContactInquiryPayload = {
  firstName: '',
  lastName: '',
  phone: '',
  subject: 'general',
  message: '',
};

function renderContactAddress(address: string) {
  if (address.includes('\n')) {
    return (
      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
        {address}
      </p>
    );
  }

  const parts = address.split(', ');

  if (parts.length > 2) {
    const midpoint = Math.ceil(parts.length / 2);
    const line1 = parts.slice(0, midpoint).join(', ');
    const line2 = parts.slice(midpoint).join(', ');

    return (
      <p className="text-gray-600 leading-relaxed">
        {line1},<br />
        {line2}
      </p>
    );
  }

  return <p className="text-gray-600 leading-relaxed">{address}</p>;
}

function renderWorkingHours(workingHours: string) {
  if (workingHours.includes('\n')) {
    return (
      <p className="text-gray-600 whitespace-pre-line">
        {workingHours}
      </p>
    );
  }

  return <p className="text-gray-600">{workingHours}</p>;
}

export function ContactForm({
  introText,
  contactPhone,
  contactEmail,
  contactAddress,
  workingHours,
}: ContactFormProps) {
  const [form, setForm] = useState<ContactInquiryPayload>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = <K extends keyof ContactInquiryPayload>(
    field: K,
    value: ContactInquiryPayload[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitContactInquiry(form);

      setForm({ ...initialFormState });
      setSuccessMessage(result.message);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to submit contact inquiry.', error);
      }

      if (error instanceof ApiError) {
        if (error.status === 429) {
          setErrorMessage('Too many requests, please try again later.');
        } else {
          setErrorMessage(
            error.message || 'Something went wrong. Please try again.'
          );
        }
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col"
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
          Get in Touch
        </h2>
        <p className="text-gray-600 mb-10 text-lg leading-relaxed">
          {introText}
        </p>

        <div className="space-y-8 grow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary shrink-0 mt-1">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Office Location</h4>
              {renderContactAddress(contactAddress)}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary shrink-0 mt-1">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Phone Number</h4>
              <p className="text-gray-600">
                {contactPhone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary shrink-0 mt-1">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Email Address</h4>
              <p className="text-gray-600">
                {contactEmail}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary shrink-0 mt-1">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Working Hours</h4>
              {renderWorkingHours(workingHours)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100"
      >
        <h3 className="text-2xl font-heading font-bold text-gray-900 mb-8">
          Send us a Message
        </h3>

        {isSubmitted ? (
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4">
              <Send className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-primary mb-2">Message Sent!</h4>
            <p className="text-gray-600">
              {successMessage ??
                'Thank you for reaching out. One of our travel experts will get back to you shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="+91 12345 67890"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
              <select
                id="subject"
                name="subject"
                required
                value={form.subject}
                onChange={(e) =>
                  updateField('subject', e.target.value as ContactInquiryPayload['subject'])
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
              >
                <option value="general">General Inquiry</option>
                <option value="booking">Package Booking</option>
                <option value="custom">Custom Itinerary</option>
                <option value="support">Customer Support</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">Your Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                placeholder="How can we help you plan your trip?"
              />
            </div>

            <Button
              type="submit"
              variant="pill-teal"
              className="w-full py-4 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : (
                <>Send Message <Send className="w-5 h-5 ml-2" /></>
              )}
            </Button>

            {errorMessage ? (
              <p className="text-sm text-red-600 text-center" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </form>
        )}
      </motion.div>
    </div>
  );
}
