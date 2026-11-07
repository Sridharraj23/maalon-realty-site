'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  CheckCircle,
  Calendar,
  MessageCircle,
  Phone,
  FileCheck,
  Building2,
  Compass,
  Car,
  Clock,
  Shield,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { Property } from '@/lib/types';
import { createWhatsAppUrl, formatArea, formatDate, formatIndianCurrency } from '@/lib/utils';
import { DEFAULT_SITE_SETTINGS } from '@/lib/constants';

export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Enquiry Modal State
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    minBudget: '',
    maxBudget: '',
    message: '',
  });
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Site Visit Modal State
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitForm, setVisitForm] = useState({
    visitorName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '11:00 AM',
    notes: '',
  });
  const [visitSubmitting, setVisitSubmitting] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        const res = await fetch(`/api/properties/${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setProperty(json.data);
          setSelectedImage(json.data.primaryImage || json.data.images[0]);
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadProperty();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="h-[450px] bg-gray-200 animate-pulse rounded-2xl mb-8" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          Property Not Found
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          The property listing you requested may have been archived or updated.
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Properties</span>
        </Link>
      </div>
    );
  }

  const whatsappMsg = `Hello Maalon Realty, I am interested in Property ID ${property.id} (${property.title}). Please share more details.`;
  const whatsappUrl = createWhatsAppUrl(DEFAULT_SITE_SETTINGS.whatsapp, whatsappMsg);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitting(true);
    try {
      const res = await fetch('/api/enquiries/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...enquiryForm,
          category: property.category,
          preferredLocation: property.location,
          minBudget: Number(enquiryForm.minBudget || property.price * 0.9),
          maxBudget: Number(enquiryForm.maxBudget || property.price * 1.1),
          propertyId: property.id,
          propertyName: property.title,
          preferences: enquiryForm.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquirySuccess(true);
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch {
      alert('Error submitting enquiry, please try again.');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVisitSubmitting(true);
    try {
      const res = await fetch('/api/site-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...visitForm,
          propertyId: property.id,
          propertyName: property.title,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVisitSuccess(true);
      } else {
        alert(data.error || 'Failed to schedule visit');
      }
    } catch {
      alert('Error scheduling visit, please try again.');
    } finally {
      setVisitSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-brand-600">
            Properties
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">
            {property.title}
          </span>
        </div>

        {/* Top Header: Title, Price, Location, ID */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {property.listingType === 'Rent' ? (
                  <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-emerald-600 text-white">
                    For Rent
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-brand-500 text-white">
                    For Sale
                  </span>
                )}
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-800">
                  {property.category}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-800 font-mono">
                  ID: {property.id}
                </span>
                {property.verified && (
                  <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Mandate</span>
                  </span>
                )}
                {property.status !== 'Available' && (
                  <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-md bg-amber-500 text-white">
                    {property.status}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-2">
                {property.title}
              </h1>

              <p className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{property.address || property.location}</span>
              </p>
            </div>

            <div className="md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400 block mb-1">
                {property.listingType === 'Rent' ? 'Monthly Rent' : 'Asking Price'}
              </span>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 font-sans tracking-tight">
                {formatIndianCurrency(property.price, property.listingType)}
              </p>
              {property.listingType !== 'Rent' && property.pricePerSqFt && (
                <p className="text-xs text-gray-500 mt-1">
                  ₹{property.pricePerSqFt.toLocaleString('en-IN')} per sq.ft
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Gallery & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Gallery Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Primary Image Stage */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-900 shadow-md">
              <Image
                src={selectedImage || property.primaryImage}
                alt={property.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Thumbnails Row */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {property.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-24 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === imgUrl
                        ? 'border-brand-500 scale-95 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Key Specifications Grid */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                Property Overview
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase mb-1">
                    <Maximize2 className="w-3.5 h-3.5 text-brand-600" />
                    <span>Total Area</span>
                  </span>
                  <p className="text-base font-bold text-gray-900">
                    {formatArea(property.area, property.areaUnit)}
                  </p>
                </div>

                {property.bedrooms && (
                  <div>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase mb-1">
                      <Bed className="w-3.5 h-3.5 text-brand-600" />
                      <span>Bedrooms</span>
                    </span>
                    <p className="text-base font-bold text-gray-900">
                      {property.bedrooms} BHK
                    </p>
                  </div>
                )}

                {property.bathrooms && (
                  <div>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase mb-1">
                      <Bath className="w-3.5 h-3.5 text-brand-600" />
                      <span>Bathrooms</span>
                    </span>
                    <p className="text-base font-bold text-gray-900">
                      {property.bathrooms} Baths
                    </p>
                  </div>
                )}

                {property.facing && (
                  <div>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase mb-1">
                      <Compass className="w-3.5 h-3.5 text-brand-600" />
                      <span>Facing</span>
                    </span>
                    <p className="text-base font-bold text-gray-900">
                      {property.facing}
                    </p>
                  </div>
                )}

                {property.parking && (
                  <div>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase mb-1">
                      <Car className="w-3.5 h-3.5 text-brand-600" />
                      <span>Parking</span>
                    </span>
                    <p className="text-base font-bold text-gray-900">
                      {property.parking}
                    </p>
                  </div>
                )}

                {property.furnishing && (
                  <div>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase mb-1">
                      <Building2 className="w-3.5 h-3.5 text-brand-600" />
                      <span>Furnishing</span>
                    </span>
                    <p className="text-base font-bold text-gray-900">
                      {property.furnishing}
                    </p>
                  </div>
                )}

                {property.possession && (
                  <div>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase mb-1">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>Possession</span>
                    </span>
                    <p className="text-base font-bold text-gray-900">
                      {property.possession}
                    </p>
                  </div>
                )}

                <div>
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase mb-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>Listing Date</span>
                  </span>
                  <p className="text-base font-bold text-gray-900">
                    {formatDate(property.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Detailed Property Description
              </h2>
              <div className="prose prose-sm text-gray-700 leading-relaxed max-w-none">
                <p className="whitespace-pre-line">{property.description}</p>
              </div>
            </div>

            {/* Features & Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  Key Features & Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-semibold text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100"
                    >
                      <CheckCircle className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Facilities */}
            {property.nearbyFacilities && property.nearbyFacilities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-serif font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  Nearby Landmarks & Infrastructure
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.nearbyFacilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50 text-xs"
                    >
                      <span className="font-semibold text-gray-800">{fac.name}</span>
                      <span className="text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded">
                        {fac.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal & Advisory Disclaimer */}
            <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200/80 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Shield className="w-4 h-4 text-amber-700" />
                <span>Advisory & Compliance Disclaimer</span>
              </div>
              <p className="leading-relaxed text-[11px] text-amber-800">
                Property details, measurements, and approvals presented are compiled in good faith from owner declarations and revenue records. Prospective buyers are encouraged to engage independent legal counsels for parent title due diligence. Maalon Realty coordinates documentation and site inspection support without charging undisclosed buyer premiums.
                {property.reraId && ` RERA Registration Reference: ${property.reraId}.`}
              </p>
            </div>
          </div>

          {/* Sticky Action Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md sticky top-28 space-y-5">
              <h3 className="text-base font-serif font-bold text-gray-900 pb-2 border-b border-gray-100">
                Interested in This Property?
              </h3>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEnquiryModal(true);
                    setEnquirySuccess(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Enquire About This Property</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowVisitModal(true);
                    setVisitSuccess(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-brand-500 text-brand-700 hover:bg-brand-50 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <span>Schedule a Site Visit</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact on WhatsApp</span>
                </a>

                <a
                  href={`tel:${DEFAULT_SITE_SETTINGS.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-700 hover:text-brand-600 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>Direct Call: {DEFAULT_SITE_SETTINGS.phone}</span>
                </a>
              </div>

              {/* Advisory Guarantee Box */}
              <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-2">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <CheckCircle className="w-4 h-4 text-brand-600" />
                  <span>The Maalon Advisory Promise</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every enquiry is assigned directly to a founding partner. No unsolicited broker circulars or spam calls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENQUIRY MODAL */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            {enquirySuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-brand-500 mx-auto mb-3" />
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Enquiry Registered Successfully
                </h3>
                <p className="text-xs text-gray-600 mb-6">
                  Thank you! Your interest in <span className="font-semibold text-gray-900">{property.title}</span> (ID: {property.id}) has been recorded. A founding partner will reach out to you within business hours.
                </p>
                <button
                  onClick={() => setShowEnquiryModal(false)}
                  className="px-6 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 block mb-1">
                  Property Enquiry (ID: {property.id})
                </span>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
                  Enquire: {property.title}
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Asking Price: {formatIndianCurrency(property.price)} • {property.location}
                </p>

                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Chandran"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+91..."
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Specific Questions or Timelines
                    </label>
                    <textarea
                      rows={3}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="Ask about document status, loan eligibility, or when you wish to view the property..."
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all disabled:opacity-50"
                  >
                    {enquirySubmitting ? 'Submitting Enquiry...' : 'Submit Property Enquiry'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SITE VISIT MODAL */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowVisitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            {visitSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-brand-500 mx-auto mb-3" />
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Site Visit Request Received
                </h3>
                <p className="text-xs text-gray-600 mb-6">
                  We have received your requested inspection date for <span className="font-semibold text-gray-900">{property.title}</span>. Our founder will call you to confirm access timing and provide directions.
                </p>
                <button
                  onClick={() => setShowVisitModal(false)}
                  className="px-6 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 block mb-1">
                  Private Site Inspection (ID: {property.id})
                </span>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
                  Schedule Site Visit
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  {property.title} • {property.location}
                </p>

                <form onSubmit={handleVisitSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={visitForm.visitorName}
                      onChange={(e) => setVisitForm({ ...visitForm, visitorName: e.target.value })}
                      placeholder="e.g. S. Ramanathan"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={visitForm.phone}
                        onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })}
                        placeholder="+91..."
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={visitForm.email}
                        onChange={(e) => setVisitForm({ ...visitForm, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={visitForm.preferredDate}
                        onChange={(e) => setVisitForm({ ...visitForm, preferredDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Preferred Time
                      </label>
                      <select
                        value={visitForm.preferredTime}
                        onChange={(e) => setVisitForm({ ...visitForm, preferredTime: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      >
                        <option value="10:00 AM">Morning (10:00 AM)</option>
                        <option value="11:30 AM">Late Morning (11:30 AM)</option>
                        <option value="03:00 PM">Afternoon (3:00 PM)</option>
                        <option value="04:30 PM">Evening (4:30 PM)</option>
                        <option value="05:30 PM">Sunset / Twilight (5:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={visitForm.notes}
                      onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                      placeholder="e.g. Bringing family / Need taxi landmark guidance..."
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={visitSubmitting}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all disabled:opacity-50"
                  >
                    {visitSubmitting ? 'Booking Visit...' : 'Confirm Site Visit Request'}
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
