"use client";

import React, { useState } from "react";
import { ChevronDown, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyBookingProps {
  startingPrice: number;
  packageTitle: string;
}

export const StickyBooking = ({ startingPrice, packageTitle }: StickyBookingProps) => {
  const [adults, setAdults] = useState(4);
  const [children, setChildren] = useState(0);
  const [isTravellerDropdownOpen, setIsTravellerDropdownOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(startingPrice);

  const handleWhatsApp = () => {
    const message = `Hi, I am interested in the ${packageTitle} package.\n\n*Details:*\nName: ${name || 'Not provided'}\nPhone: ${phone || 'Not provided'}\nTravel Date: ${date || 'Not decided'}\nTravellers: ${adults} Adults, ${children} Children\n\nPlease share more details.`;
    const whatsappNumber = "+918141267610"; // Placeholder as per plan
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please enter your name and phone number.");
      return;
    }
    handleWhatsApp();
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-elevated p-6 md:p-8 sticky top-24 z-30">
      <div className="mb-6">
        <p className="text-text-muted text-sm uppercase tracking-wider mb-1">Starting from</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-primary-900">
            <IndianRupee className="inline-block w-8 h-8 mr-0.5 -mt-1" strokeWidth={2.5} />{formattedPrice}
          </span>
          <span className="text-text-muted text-sm">(Per Person)</span>
        </div>
      </div>

      <form onSubmit={handleEnquiry} className="space-y-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-text mb-2">Full Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Phone Number <span className="text-red-500">*</span></label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text"
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">Travel Date</label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text"
            />
          </div>
        </div>

        {/* Traveller Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-text mb-2">Travellers</label>
          <button
            type="button"
            onClick={() => setIsTravellerDropdownOpen(!isTravellerDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-white text-text hover:border-primary-300 transition-colors"
          >
            <span>
              {adults} Adults, {children} Children
            </span>
            <ChevronDown className="w-5 h-5 text-text-muted" />
          </button>

          {isTravellerDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-card p-4 z-50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-text">Adults</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-surface-alt"
                  >
                    -
                  </button>
                  <span className="w-4 text-center">{adults}</span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-surface-alt"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-text">Children</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-surface-alt"
                  >
                    -
                  </button>
                  <span className="w-4 text-center">{children}</span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-surface-alt"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <Button type="submit" className="w-full py-6 text-lg rounded-xl">
            Send Enquiry
          </Button>
        <button
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-medium bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
        >
          {/* Custom SVG for WhatsApp since lucide doesn't have the exact brand icon by default, but we can use a message circle for now if needed, or simple text. Let's use standard text with icon */}
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat on WhatsApp
        </button>
        </div>
      </form>


    </div>
  );
};
