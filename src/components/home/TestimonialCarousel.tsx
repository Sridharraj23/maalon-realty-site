'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MessageSquarePlus, CheckCircle, MapPin, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    transactionType: 'Buyer',
    propertyLocation: '',
    rating: 5,
    content: '',
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please provide consent to publish your review.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to submit review');
      }
    } catch {
      alert('Network error, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-gray-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
              Client Experiences
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
              Trust Is Built One Relationship at a Time.
            </h2>
            <p className="mt-3 text-sm text-gray-600 max-w-xl">
              Authentic reflections from homebuyers, sellers, and corporate clients who partnered with Maalon Realty across Tamil Nadu.
            </p>
          </div>

          <button
            onClick={() => {
              setShowModal(true);
              setSubmitted(false);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-brand-500 text-brand-700 hover:bg-brand-50 shadow-sm transition-all self-start md:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4 text-brand-500" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Testimonials Grid */}
        {testimonials && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-card transition-all"
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-brand-200" />
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed italic mb-6">
                    "{t.content}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {t.photoUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src={t.photoUrl}
                          alt={t.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-xs">
                        {t.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1">
                        <span className="text-brand-600 font-medium">{t.transactionType}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3 inline text-gray-400" />
                        <span className="truncate">{t.propertyLocation}</span>
                      </p>
                    </div>
                  </div>
                  {t.createdAt && (
                    <span className="text-[10px] text-gray-400">
                      {formatDate(t.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 max-w-xl mx-auto">
            <h3 className="text-base font-bold text-gray-800 mb-2">No Published Testimonials Yet</h3>
            <p className="text-xs text-gray-500 mb-4">
              We strictly publish genuine reviews verified by our founders. If you have completed a property transaction with Maalon Realty, we invite you to share your experience.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider"
            >
              Submit Your Review
            </button>
          </div>
        )}
      </div>

      {/* Share Experience Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-brand-500 mx-auto mb-3" />
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Thank You for Your Feedback
                </h3>
                <p className="text-xs text-gray-600 mb-6">
                  Your testimonial has been submitted. To uphold authenticity, all testimonials are reviewed by our founding partners before publication.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">
                  Share Your Experience
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Help prospective buyers and sellers understand what it is like to work with Maalon Realty.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anand Sundaram"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Transaction Type
                      </label>
                      <select
                        value={formData.transactionType}
                        onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      >
                        <option value="Buyer">Property Buyer</option>
                        <option value="Seller">Property Seller</option>
                        <option value="Investor">Investor</option>
                        <option value="Commercial Client">Commercial Client</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.propertyLocation}
                        onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
                        placeholder="e.g. ECR, Chennai"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Rating (1 to 5 Stars)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= formData.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Your Testimonial *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Tell us about the service, guidance, and transaction experience..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 accent-brand-500"
                    />
                    <label htmlFor="consent" className="text-[11px] text-gray-500 leading-tight">
                      I confirm that this is my genuine experience with Maalon Realty and grant permission to display my review publicly on the website upon administrator review.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Review...' : 'Submit Testimonial for Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
