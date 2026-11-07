'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle,
  Send,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '@/lib/constants';
import { createWhatsAppUrl } from '@/lib/utils';
import { submitContactSubmission } from '@/lib/supabase-service';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Buying a Property',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const whatsappUrl = createWhatsAppUrl(
    DEFAULT_SITE_SETTINGS.whatsapp,
    'Hello Maalon Realty, I would like to schedule an advisory consultation.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await submitContactSubmission({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        subject: formData.category,
        message: formData.message,
      });
      if (data.success) {
        setSubmittedId(data.id || 'CNT-REGISTERED');
      } else {
        alert('Failed to submit enquiry');
      }
    } catch {
      alert('Network error, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
            Advisory Headquarters
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-4">
            Connect With Maalon Realty
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Reach out to our founding team for confidential consultations regarding property acquisition, sales representation, or institutional partnerships across Tamil Nadu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details & Office Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-lg font-serif font-bold text-gray-900 pb-3 border-b border-gray-100">
                Direct Channels
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                      Phone Call
                    </span>
                    <a
                      href={`tel:${DEFAULT_SITE_SETTINGS.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-sm font-semibold text-gray-900 hover:text-brand-600"
                    >
                      {DEFAULT_SITE_SETTINGS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                      WhatsApp Direct
                    </span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-700 hover:underline"
                    >
                      Chat with Founding Partner
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                      Official Email
                    </span>
                    <a
                      href={`mailto:${DEFAULT_SITE_SETTINGS.email}`}
                      className="text-sm font-semibold text-gray-900 hover:text-brand-600"
                    >
                      {DEFAULT_SITE_SETTINGS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                      Office Address
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {DEFAULT_SITE_SETTINGS.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                      Operating Hours
                    </span>
                    <p className="text-xs text-gray-700">
                      {DEFAULT_SITE_SETTINGS.workingHours}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="text-[11px] text-gray-400 block">
                  RERA Compliance:
                </span>
                <p className="text-xs text-gray-600 font-medium">
                  {DEFAULT_SITE_SETTINGS.reraNumber}
                </p>
              </div>
            </div>

            {/* Embedded Google Map Placeholder Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm overflow-hidden">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center text-center p-4">
                <div className="space-y-2">
                  <MapPin className="w-8 h-8 text-brand-600 mx-auto" />
                  <p className="text-xs font-bold text-gray-800">
                    Alwarpet / TTK Road Advisory Office
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Chennai, Tamil Nadu 600018
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Enquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-sm">
              {submittedId ? (
                <div className="text-center py-12 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-600 block mb-1">
                    Enquiry ID: {submittedId}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                    Message Received
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed mb-8">
                    Thank you for reaching out to Maalon Realty. Your message has been routed to our founding partners. We will respond promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedId(null);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        category: 'Buying a Property',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">
                    Send an Enquiry Message
                  </h3>
                  <p className="text-xs text-gray-500 mb-8">
                    Fill out the form below and an advisor will connect with you within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. V. Balasubramanian"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91..."
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Enquiry Nature / Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      >
                        <option value="Buying a Property">Buying a Property</option>
                        <option value="Selling a Property">Selling a Property</option>
                        <option value="Developer Partnership">Developer Mandate Partnership</option>
                        <option value="Broker Partnership">Broker / Channel Partner Alliance</option>
                        <option value="General Enquiry">General Advisory Enquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Your Message / Project Details *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us how we can assist you..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Sending Enquiry...' : 'Submit Contact Enquiry'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
