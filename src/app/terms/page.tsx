import React from 'react';
import Link from 'next/link';
import { BRAND, DEFAULT_SITE_SETTINGS } from '@/lib/constants';

export const metadata = {
  title: 'Terms & Conditions | Real Estate Advisory Standards',
  description:
    'Legal terms, brokerage representation conditions, and regulatory compliance disclosures of Maalon Realty.',
};

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-200 shadow-sm space-y-8">
          <div className="border-b border-gray-100 pb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 block mb-1">
              Regulatory Disclosures
            </span>
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Terms & Conditions
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: November 2026 • Official Domain: {BRAND.domain}
            </p>
          </div>

          <div className="prose prose-sm text-gray-700 max-w-none space-y-6 text-xs sm:text-sm leading-relaxed">
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">1. Nature of Advisory & Brokerage Services</h3>
              <p>
                Maalon Realty operates as an independent real estate brokerage and property advisory firm in Tamil Nadu, India. Our role consists of introducing willing property sellers to prospective property buyers, coordinating site inspections, compiling revenue documents, and assisting in transaction administration.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">2. Independent Legal Scrutiny & Buyer Due Diligence</h3>
              <p>
                While Maalon Realty conducts rigorous preliminary document verification (including Patta, Chitta, FMB, Encumbrance Certificates, and local body planning approvals), we strongly encourage all prospective buyers to engage an independent qualified legal advocate to scrutinize parent deeds and verify title clearance prior to executing sale agreements or disbursing earnest payments.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">3. Seller Representations & Mandates</h3>
              <p>
                Property owners listing properties through Maalon Realty warrant that they are the legal owners or holding valid registered Power of Attorney to market the asset. Properties submitted through our portal undergo administrative scrutiny and do not automatically become public listings until mutually agreed.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">4. Commercial & Rental Transaction Guidelines</h3>
              <p>
                Brokerage, leasing, and acquisitions facilitated by Maalon Realty are strictly conducted in compliance with applicable local revenue bylaws, registered lease standards, and statutory property regulations in Tamil Nadu.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">5. No Unsupported Appreciation Claims</h3>
              <p>
                Maalon Realty does not guarantee future financial appreciation rates, rental yields, or municipal zoning alterations. Real estate values depend on market dynamics, government infrastructure execution, and broader economic indicators.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">6. RERA Regulatory Compliance</h3>
              <p>
                Registration Reference: {DEFAULT_SITE_SETTINGS.reraNumber}. All relevant real estate project listings carry applicable RERA project registration references where required by law.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
