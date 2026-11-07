'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  ShieldCheck,
  Upload,
  ArrowRight,
  FileCheck2,
  Lock,
  Phone,
} from 'lucide-react';
import { PROPERTY_CATEGORIES, TAMIL_NADU_LOCATIONS } from '@/lib/constants';
import { formatIndianCurrency } from '@/lib/utils';
import { submitSellerEnquiry } from '@/lib/supabase-service';

export default function SellPropertyPage() {
  const [formData, setFormData] = useState({
    posterType: 'Owner' as 'Owner' | 'Dealer',
    listingType: 'Sale' as 'Sale' | 'Rent',
    name: '',
    phone: '',
    email: '',
    preferredContact: 'Phone Call',
    propertyType: 'Apartments',
    location: '',
    fullAddress: '',
    area: '',
    areaUnit: 'sq.ft',
    expectedPrice: '',
    bedrooms: '',
    description: '',
    ownershipStatus: 'Sole Owner',
    consent: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm consent to be contacted by our advisory team.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitSellerEnquiry({
        posterType: formData.posterType,
        listingType: formData.listingType,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        preferredContact: formData.preferredContact as any,
        propertyType: formData.propertyType as any,
        location: formData.location,
        fullAddress: formData.fullAddress,
        area: Number(formData.area || 0),
        areaUnit: formData.areaUnit as any,
        expectedPrice: Number(formData.expectedPrice || 0),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        description: formData.description,
        ownershipStatus: formData.ownershipStatus as any,
        documentAvailability: [],
        isListedElsewhere: 'No',
        timeline: 'Flexible',
        remarks: '',
        images: [],
      });

      if (res.success) {
        setSubmittedId(res.id || 'SEL-SUCCESS');
      } else {
        alert(res.error || 'Failed to submit property.');
      }
    } catch {
      alert('Network error, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
            Dedicated Seller Mandates
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
            Looking to Sell Your Property?{' '}
            <span className="italic text-brand-600 block sm:inline">
              Let Us Find the Right Buyer.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            Your property deserves the right attention and the right buyer. Share your property details with Maalon Realty, and our founding team will help you through the selling journey.
          </p>
        </div>

        {submittedId ? (
          /* Submission Success State */
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 shadow-xl text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 block mb-1">
              Submission Reference ID
            </span>
            <div className="text-2xl font-mono font-bold text-gray-900 mb-4 bg-gray-50 py-2 px-6 rounded-lg inline-block border border-gray-200">
              {submittedId}
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
              Property Details Submitted For Review
            </h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed mb-8">
              Thank you for trusting Maalon Realty. A private mandate has been registered in our secure system. To protect your property’s integrity, our founding partners will review your details, verify revenue documentation, and contact you directly before any public listing is created.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider"
              >
                Return to Homepage
              </Link>
              <Link
                href="/properties"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider"
              >
                Explore Current Inventory
              </Link>
            </div>
          </div>
        ) : (
          /* Property Submission Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-xl space-y-10"
          >
            {/* TOP MANDATE SELECTORS: POSTER TYPE & LISTING TYPE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-gray-100">
              {/* Poster Type: Owner vs Dealer */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  I Am Posting As: *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      formData.posterType === 'Owner'
                        ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="posterType"
                      checked={formData.posterType === 'Owner'}
                      onChange={() => setFormData({ ...formData, posterType: 'Owner' })}
                      className="accent-brand-500"
                    />
                    <span>Property Owner</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      formData.posterType === 'Dealer'
                        ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="posterType"
                      checked={formData.posterType === 'Dealer'}
                      onChange={() => setFormData({ ...formData, posterType: 'Dealer' })}
                      className="accent-brand-500"
                    />
                    <span>Real Estate Dealer</span>
                  </label>
                </div>
              </div>

              {/* Listing Type: Sale vs Rent */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Listing Type: *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      formData.listingType === 'Sale'
                        ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="listingType"
                      checked={formData.listingType === 'Sale'}
                      onChange={() => setFormData({ ...formData, listingType: 'Sale' })}
                      className="accent-brand-500"
                    />
                    <span>For Sale</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      formData.listingType === 'Rent'
                        ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="listingType"
                      checked={formData.listingType === 'Rent'}
                      onChange={() => setFormData({ ...formData, listingType: 'Rent' })}
                      className="accent-brand-500"
                    />
                    <span>For Rent / Lease</span>
                  </label>
                </div>
              </div>
            </div>

            {/* SECTION 1: OWNER / REPRESENTATIVE INFORMATION */}
            <div>
              <div className="flex items-center gap-2 pb-3 mb-6 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-serif font-bold text-gray-900 uppercase tracking-wide">
                  {formData.posterType === 'Dealer'
                    ? 'Dealer / Agent Information'
                    : 'Owner / Representative Information'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {formData.posterType === 'Dealer' ? 'Dealer / Agency Name *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={
                      formData.posterType === 'Dealer'
                        ? 'e.g. Metro Prime Properties / R. Rajesh'
                        : 'e.g. S. Radhakrishnan'
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Phone Number (WhatsApp Preferred) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98400 00000"
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
                    placeholder="contact@example.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Preferred Contact Method
                  </label>
                  <select
                    value={formData.preferredContact}
                    onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: PROPERTY DETAILS & VALUATION */}
            <div>
              <div className="flex items-center gap-2 pb-3 mb-6 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-serif font-bold text-gray-900 uppercase tracking-wide">
                  Property Details & Valuation
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {PROPERTY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Location / Suburb *
                  </label>
                  <input
                    type="text"
                    list="sell-locations"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. ECR, Akkarai, Chennai"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <datalist id="sell-locations">
                    {TAMIL_NADU_LOCATIONS.map((l) => (
                      <option key={l} value={l} />
                    ))}
                  </datalist>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Full Address / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullAddress}
                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                    placeholder="Door number, street name, village/ward, pincode"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Property Area & Unit *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="e.g. 2400"
                      className="w-2/3 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <select
                      value={formData.areaUnit}
                      onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as any })}
                      className="w-1/3 px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      <option value="sq.ft">sq.ft</option>
                      <option value="grounds">grounds</option>
                      <option value="acres">acres</option>
                      <option value="cents">cents</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {formData.listingType === 'Rent'
                      ? 'Expected Monthly Rent (INR) *'
                      : 'Expected Selling Price (INR) *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    placeholder={formData.listingType === 'Rent' ? 'e.g. 35000' : 'e.g. 15000000'}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  {formData.expectedPrice && (
                    <p className="text-[11px] text-brand-600 font-semibold mt-1">
                      Value: {formatIndianCurrency(Number(formData.expectedPrice), formData.listingType)}
                    </p>
                  )}
                </div>

                {(formData.propertyType === 'Apartments' ||
                  formData.propertyType === 'Villas' ||
                  formData.propertyType === 'Independent Houses') && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      <option value="">Select Bedrooms</option>
                      <option value="1">1 BHK / Single Bedroom</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4+ BHK / Luxury</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Ownership Title Type
                  </label>
                  <select
                    value={formData.ownershipStatus}
                    onChange={(e) => setFormData({ ...formData, ownershipStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Sole Owner">Sole Owner (Single Title Holder)</option>
                    <option value="Joint Ownership">Joint Ownership (Family / Spousal)</option>
                    <option value="Inherited">Inherited / Ancestral Title</option>
                    <option value="Power of Attorney">Registered Power of Attorney (POA)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Brief Property Description & Highlights
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe building age, road width, facing, water source, current status..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* MANDATORY CONSENT CHECKBOX */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="ownerConsent"
                required
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-1 accent-brand-500 shrink-0"
              />
              <label htmlFor="ownerConsent" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                I represent that I am the {formData.posterType === 'Dealer' ? 'authorized broker/representative' : 'legal owner'} of the mentioned property. I grant Maalon Realty consent to contact me regarding pricing, verification, and matching with prospective buyers. I understand that the listing will not appear publicly until verified and mutually agreed upon.
              </label>
            </div>

            {/* Submission Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-5 h-5" />
                <span>
                  {submitting ? 'Registering Submission...' : 'Submit Property Details for Review'}
                </span>
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Your contact information is strictly confidential and never shared publicly.</span>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
