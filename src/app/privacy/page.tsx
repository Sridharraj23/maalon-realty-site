import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { BRAND, DEFAULT_SITE_SETTINGS } from '@/lib/constants';

export const metadata = {
  title: 'Privacy Policy | Data Protection & Client Confidentiality',
  description:
    'Our strict data confidentiality policies protecting property owners, homebuyers, and clients of Maalon Realty.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-8">
          <div className="border-b border-gray-100 pb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 block mb-1">
              Data Governance & DPDP Compliance
            </span>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Privacy Policy
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: November 2026 • Official Domain: {BRAND.domain}
            </p>
          </div>

          <div className="prose prose-sm text-gray-700 max-w-none space-y-6 text-xs sm:text-sm leading-relaxed">
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">1. Commitment to Client Confidentiality</h3>
              <p>
                At Maalon Realty (operated under https://maalonrealty.in), we recognize that property transactions involve sensitive financial, personal, and family information. We are committed to upholding the highest standards of data security in compliance with applicable Indian data protection laws.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">2. Information We Collect</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>For Property Buyers:</strong> Full name, verified telephone number, email address, property preferences, budget parameters, and financing status.
                </li>
                <li>
                  <strong>For Property Owners / Sellers:</strong> Full name, contact details, property address, survey numbers, revenue records, ownership documentation, asking prices, and authorization mandates.
                </li>
                <li>
                  <strong>Site Visitors & Enquirers:</strong> Names, preferred visit inspection times, and general advisory queries.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">3. How Your Information Is Used</h3>
              <p>
                We use collected information solely for genuine real estate advisory purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Matching buyer requirements with verified property inventory.</li>
                <li>Conducting revenue document verification and coordinating advocate title scrutiny.</li>
                <li>Scheduling escorted site visits with verified parties.</li>
                <li>Direct communication regarding property negotiation and registration coordination.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">4. Strict Zero-Telemarketing & Third-Party Selling Policy</h3>
              <p className="font-semibold text-gray-900">
                Maalon Realty strictly does not sell, lease, rent, or distribute client contact databases, phone numbers, or property documents to third-party telemarketers, lead aggregators, or unauthorized brokers.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">5. Data Retention & Document Security</h3>
              <p>
                Revenue documents (Patta, Chitta, Parent Deeds) uploaded by property sellers are stored in encrypted environments accessible solely to authorized founding partners and retained only for the active representation period or as required by regulatory compliance.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">6. Contact Our Data Governance Team</h3>
              <p>
                For data access, update requests, or deletion of your buyer/seller records, please contact our founding office directly at:
              </p>
              <p className="font-medium text-gray-900">
                Email: {DEFAULT_SITE_SETTINGS.email} • Phone: {DEFAULT_SITE_SETTINGS.phone}
                <br />
                Office: {DEFAULT_SITE_SETTINGS.address}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
