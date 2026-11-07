import React from 'react';
import Link from 'next/link';
import {
  Building,
  Users,
  FileCheck2,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import {
  getBuyers,
  getContacts,
  getProperties,
  getSellers,
  getSiteVisits,
  getTestimonials,
} from '@/lib/store';
import { formatIndianCurrency, formatDate } from '@/lib/utils';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [properties, buyers, sellers, testimonials, visits, contacts] =
    await Promise.all([
      getProperties(),
      getBuyers(),
      getSellers(),
      getTestimonials(false), // All testimonials including pending
      getSiteVisits(),
      getContacts(),
    ]);

  const activeProperties = properties.filter((p) => p.status === 'Available');
  const soldProperties = properties.filter((p) => p.status === 'Sold');
  const negotiationProperties = properties.filter(
    (p) => p.status === 'Under Negotiation'
  );
  const pendingTestimonials = testimonials.filter((t) => !t.approved);
  const scheduledVisits = visits.filter((v) => v.status === 'Scheduled');

  // Stats calculation
  const totalInventoryValue = activeProperties.reduce(
    (acc, curr) => acc + (curr.price || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1 block">
            Founding Partner Cockpit
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Portfolio & Advisory Overview
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time synchronization across live listings, private buyer leads, and property mandates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Property</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span>View Live Site</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Properties */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Listings
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {activeProperties.length}
            </div>
            <p className="text-xs text-brand-600 font-semibold mt-1">
              {formatIndianCurrency(totalInventoryValue)} total value
            </p>
          </div>
        </div>

        {/* Card 2: Buyer Inquiries */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Buyer Leads (CRM)
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {buyers.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {buyers.filter((b) => b.status === 'New').length} new unassigned
            </p>
          </div>
        </div>

        {/* Card 3: Seller Submissions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Seller Submissions
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {sellers.length}
            </div>
            <p className="text-xs text-purple-600 font-semibold mt-1">
              {sellers.filter((s) => s.status === 'New').length} pending review
            </p>
          </div>
        </div>

        {/* Card 4: Scheduled Site Visits */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Site Visits
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {scheduledVisits.length}
            </div>
            <p className="text-xs text-amber-600 font-semibold mt-1">
              Upcoming client visits
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Status Pipeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <span className="text-xs text-gray-400 font-medium">Under Negotiation</span>
          <p className="text-xl font-bold text-amber-600 mt-0.5">{negotiationProperties.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <span className="text-xs text-gray-400 font-medium">Sold Portfolio</span>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">{soldProperties.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <span className="text-xs text-gray-400 font-medium">Pending Testimonials</span>
          <p className="text-xl font-bold text-indigo-600 mt-0.5">{pendingTestimonials.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
          <span className="text-xs text-gray-400 font-medium">General Contact Queries</span>
          <p className="text-xl font-bold text-gray-800 mt-0.5">{contacts.length}</p>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Buyer Leads */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-sm font-serif font-bold text-gray-900 uppercase tracking-wide">
                Recent Buyer Enquiries
              </h3>
              <Link
                href="/admin/buyers"
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
              >
                <span>View All ({buyers.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {buyers.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{b.name}</span>
                      <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border text-gray-500">
                        {b.id}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-0.5">
                      {b.category} • Budget: {formatIndianCurrency(b.maxBudget)} • {b.preferredLocation}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-brand-50 text-brand-700 border border-brand-200">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Seller Submissions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-sm font-serif font-bold text-gray-900 uppercase tracking-wide">
                Recent Property Submissions
              </h3>
              <Link
                href="/admin/sellers"
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
              >
                <span>Review Mandates ({sellers.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {sellers.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{s.name}</span>
                      <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border text-gray-500">
                        {s.id}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-0.5">
                      {s.propertyType} in {s.location} • Asking {formatIndianCurrency(s.expectedPrice)}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
