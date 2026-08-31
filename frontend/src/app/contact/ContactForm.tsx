'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000); // Reset after 5s
    }, 1500);
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
          Planning your next dream vacation? Have questions about our packages? 
          Our travel experts are here to help you design the perfect itinerary.
        </p>

        <div className="space-y-8 grow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary shrink-0 mt-1">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Office Location</h4>
              <p className="text-gray-600 leading-relaxed">
                A-709, Krish elite, S P ring road- service road,<br />
                Nikol- Ahmedabad, Gujarat 382350
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary shrink-0 mt-1">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Phone Number</h4>
              <p className="text-gray-600">
                +91 81412 67610
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
                vacations.sunbird@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-primary shrink-0 mt-1">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Working Hours</h4>
              <p className="text-gray-600">
                Monday - Saturday: 10:00 AM - 7:00 PM<br />
                Sunday: Closed
              </p>
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
              Thank you for reaching out. One of our travel experts will get back to you shortly.
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
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  required
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
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="+91 12345 67890"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
              <select 
                id="subject"
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
                required
                rows={4}
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
          </form>
        )}
      </motion.div>
    </div>
  );
}
