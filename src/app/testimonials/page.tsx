'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, MessageSquarePlus, CheckCircle, MapPin, Quote, PlayCircle } from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('All');

  // Submission Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    transactionType: 'Buyer',
    propertyLocation: '',
    rating: 5,
    content: '',
    photoUrl: '',
    videoUrl: '',
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true);
        const res = await fetch('/api/testimonials');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTestimonials(json.data);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const filtered =
    filterType === 'All'
      ? testimonials
      : testimonials.filter((t) => t.transactionType === filterType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm consent to publish your review.');
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
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
            Client Voices & Validation
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-4">
            Experiences That Speak for Us.
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Every transaction represents a family's dream, a seller's trust, or an investor’s confidence. Read genuine accounts from clients who partnered with Maalon Realty across Tamil Nadu.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setShowModal(true);
                setSubmitted(false);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all hover:scale-105"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Share Your Experience</span>
            </button>
          </div>
        </div>

        {/* Transaction Type Filters */}
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto pb-2">
          {['All', 'Buyer', 'Seller', 'Investor', 'Commercial Client'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                filterType === type
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {type === 'All' ? 'All Experiences' : `${type}s`}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-card transition-all"
              >
                <div>
                  {/* Rating Stars & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
                      {t.transactionType}
                    </span>
                  </div>

                  {/* Video Thumbnail if available */}
                  {t.videoUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 mb-4 group cursor-pointer">
                      <Image
                        src={t.photoUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                        alt="Video review"
                        fill
                        className="object-cover opacity-75 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-700 leading-relaxed italic mb-6">
                    "{t.content}"
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {t.photoUrl && !t.videoUrl ? (
                      <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={t.photoUrl}
                          alt={t.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {t.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{t.propertyLocation}</span>
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
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-gray-800 mb-2">No Reviews Under This Category</h3>
            <p className="text-xs text-gray-500 mb-6">
              All published reviews are authentic and verified by our founding partners.
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

      {/* SHARE EXPERIENCE MODAL */}
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
                <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                  Your review has been submitted to the administrator queue. Following verification, it will be published to the public website.
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
                  Tell future homebuyers and property sellers about the advisory support you received.
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
                      placeholder="e.g. Meera Raman"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91..."
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      >
                        <option value="Buyer">Property Buyer</option>
                        <option value="Seller">Property Seller</option>
                        <option value="Investor">Investor</option>
                        <option value="Commercial Client">Commercial Client</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Property Location
                      </label>
                      <input
                        type="text"
                        value={formData.propertyLocation}
                        onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
                        placeholder="e.g. Anna Nagar, Chennai"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
                      Your Written Testimonial *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Describe the consultation, negotiations, and closing experience..."
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Photo URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.photoUrl}
                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Video URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="YouTube / Vimeo link"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="testConsent"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 accent-brand-500"
                    />
                    <label htmlFor="testConsent" className="text-[11px] text-gray-500 leading-tight">
                      I confirm that this is a genuine testimonial and grant Maalon Realty consent to display this feedback publicly following administrator review.
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
    </div>
  );
}
