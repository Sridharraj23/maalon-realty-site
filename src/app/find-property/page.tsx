'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Compass,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { PROPERTY_CATEGORIES, TAMIL_NADU_LOCATIONS } from '@/lib/constants';
import { formatIndianCurrency } from '@/lib/utils';

export default function FindPropertyPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    listingType: 'Sale' as 'Sale' | 'Rent',
    category: 'Apartments',
    preferredLocation: '',
    alternativeLocations: '',
    minBudget: '',
    maxBudget: '',
    requiredArea: '',
    bedrooms: '3',
    bathrooms: '3',
    purpose: 'Self-use',
    timeline: '1 to 3 Months',
    fundingPreference: 'Home loan',
    preferences: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries/buyers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          minBudget: Number(formData.minBudget || 0),
          maxBudget: Number(formData.maxBudget || 0),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSubmittedLeadId(json.id || 'BUY-REGISTERED');
      } else {
        alert(json.error || 'Failed to submit requirements.');
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
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
            Tailored Buyer Discovery
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
            Tell Us What You're Looking For.{' '}
            <span className="italic text-brand-600 block sm:inline">
              We'll Help You Find It.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            Every buyer has different priorities. Share your requirements with us, and our founding team will help identify properties across Tamil Nadu that fit your needs.
          </p>
        </div>

        {submittedLeadId ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 shadow-xl text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 block mb-1">
              Your Confidential Buyer Reference ID
            </span>
            <div className="text-2xl font-mono font-bold text-gray-900 mb-4 bg-gray-50 py-2 px-6 rounded-lg inline-block border border-gray-200">
              {submittedLeadId}
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
              Buyer Profile Registered
            </h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed mb-8">
              Thank you for sharing your aspirations. Your profile has been assigned to a founding partner. We will match your parameters against our active and off-market mandates and present only properties that genuinely fit your criteria.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/properties"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider"
              >
                Browse Current Properties
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider"
              >
                Return Home
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-xl space-y-10"
          >
            {/* SECTION 1: BUYER DETAILS */}
            <div>
              <div className="flex items-center gap-2 pb-3 mb-6 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-serif font-bold text-gray-900 uppercase tracking-wide">
                  Your Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anbu Selvan"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Phone Number (WhatsApp) *
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
                    placeholder="anbu@example.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: PROPERTY REQUIREMENTS */}
            <div>
              <div className="flex items-center gap-2 pb-3 mb-6 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-serif font-bold text-gray-900 uppercase tracking-wide">
                  Property Category & Location Preferences
                </h3>
              </div>

              {/* Requirement Type: Buy vs Rent */}
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Looking To: *
                </label>
                <div className="flex gap-3">
                  <label
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      formData.listingType === 'Sale'
                        ? 'bg-brand-50 border-brand-500 text-brand-900'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="findListingType"
                      checked={formData.listingType === 'Sale'}
                      onChange={() => setFormData({ ...formData, listingType: 'Sale' })}
                      className="accent-brand-500"
                    />
                    <span>Buy Property</span>
                  </label>
                  <label
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      formData.listingType === 'Rent'
                        ? 'bg-brand-50 border-brand-500 text-brand-900'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="findListingType"
                      checked={formData.listingType === 'Rent'}
                      onChange={() => setFormData({ ...formData, listingType: 'Rent' })}
                      className="accent-brand-500"
                    />
                    <span>Rent / Lease</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Property Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
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
                    Preferred Primary Location *
                  </label>
                  <input
                    type="text"
                    list="buyer-locations"
                    required
                    value={formData.preferredLocation}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                    placeholder="e.g. ECR, Akkarai or Anna Nagar"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <datalist id="buyer-locations">
                    {TAMIL_NADU_LOCATIONS.map((l) => (
                      <option key={l} value={l} />
                    ))}
                  </datalist>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Alternative Locations (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.alternativeLocations}
                    onChange={(e) => setFormData({ ...formData, alternativeLocations: e.target.value })}
                    placeholder="e.g. Neelankarai, Thoraipakkam, Velachery..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Minimum Budget (INR)
                  </label>
                  <input
                    type="number"
                    value={formData.minBudget}
                    onChange={(e) => setFormData({ ...formData, minBudget: e.target.value })}
                    placeholder="e.g. 5000000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  {formData.minBudget && (
                    <p className="text-[11px] text-brand-600 font-semibold mt-1">
                      Min: {formatIndianCurrency(Number(formData.minBudget))}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Maximum Budget (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.maxBudget}
                    onChange={(e) => setFormData({ ...formData, maxBudget: e.target.value })}
                    placeholder="e.g. 15000000"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  {formData.maxBudget && (
                    <p className="text-[11px] text-brand-600 font-semibold mt-1">
                      Max: {formatIndianCurrency(Number(formData.maxBudget))}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 3: PURPOSE, TIMELINE & AMENITIES */}
            <div>
              <div className="flex items-center gap-2 pb-3 mb-6 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-base font-serif font-bold text-gray-900 uppercase tracking-wide">
                  Purpose, Specifications & Amenities
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Purpose of Purchase
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Self-use">Primary Self-use</option>
                    <option value="Investment">Long-term Investment / Rental</option>
                    <option value="Business">Commercial / Business Use</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Purchase Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Immediate (Within 30 days)">Immediate (Within 30 days)</option>
                    <option value="1 to 3 Months">1 to 3 Months</option>
                    <option value="3 to 6 Months">3 to 6 Months</option>
                    <option value="Exploring">Exploring Options</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Funding Preference
                  </label>
                  <select
                    value={formData.fundingPreference}
                    onChange={(e) => setFormData({ ...formData, fundingPreference: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Self-funded">Self-funded / Liquid Funds</option>
                    <option value="Home loan">Pre-approved Home Loan</option>
                    <option value="Exploring options">Exploring Home Loan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Required Area / Size
                  </label>
                  <input
                    type="text"
                    value={formData.requiredArea}
                    onChange={(e) => setFormData({ ...formData, requiredArea: e.target.value })}
                    placeholder="e.g. 2000+ sq.ft or 1 ground"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <select
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4+">4+ BHK / Villa</option>
                    <option value="Plot">Not Applicable (Plot/Land)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <select
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="2">2 Baths</option>
                    <option value="3">3 Baths</option>
                    <option value="4+">4+ Baths</option>
                    <option value="Plot">N/A</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Specific Preferences & Must-Haves
                </label>
                <textarea
                  rows={3}
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  placeholder="e.g. Gated community, East facing, EV charging, 40-ft wide access road, nearby CBSE school..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submission CTA */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Compass className="w-5 h-5" />
                <span>
                  {submitting ? 'Registering Your Requirement...' : 'Find My Property'}
                </span>
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Buyer information is 100% private. We never sell or share your contact number with external telemarketers.</span>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
