import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  CheckCircle,
  Users,
  Handshake,
  Compass,
  Eye,
  ShieldAlert,
  ArrowRight,
  ClipboardList,
  Building2,
  Scale,
  FileCheck2,
  Clock,
  HeartHandshake,
} from 'lucide-react';

export const metadata = {
  title: 'Our Process | Structured Real Estate Advisory',
  description:
    'Explore the comprehensive 8-step Seller Journey and Buyer Journey that guides every property transaction at Maalon Realty.',
};

export default function ProcessPage() {
  const sellerStages = [
    {
      num: '01',
      title: 'Initial Consultation',
      desc: 'We meet in person or virtually to understand your motivations for selling, desired timeframe, and property background.',
      icon: Users,
    },
    {
      num: '02',
      title: 'Property Information Collection',
      desc: 'We gather revenue documents (Patta, Chitta, FMB, plan approvals, tax receipts) and schedule professional on-site photography.',
      icon: ClipboardList,
    },
    {
      num: '03',
      title: 'Listing Authorisation & Pricing',
      desc: 'We calibrate realistic market valuations based on recent registered transactions and sign a clear advisory representation agreement.',
      icon: FileCheck2,
    },
    {
      num: '04',
      title: 'Property Review & Verification',
      desc: 'Internal review of document chains ensures that title defects or pending dues are addressed before presenting to buyers.',
      icon: Search,
    },
    {
      num: '05',
      title: 'Marketing & Buyer Matching',
      desc: 'Direct presentation to pre-qualified buyers in our private network and targeted, high-touch marketing without circular spam.',
      icon: Building2,
    },
    {
      num: '06',
      title: 'Curated Site Visits',
      desc: 'All site inspections are escorted personally by our team, with strict pre-screening of visitor financial capability.',
      icon: Eye,
    },
    {
      num: '07',
      title: 'Transparent Negotiations',
      desc: 'We facilitate balanced, honest price discussions and formalize payment schedules acceptable to both parties.',
      icon: Handshake,
    },
    {
      num: '08',
      title: 'Transaction & Registration Support',
      desc: 'Drafting of Sale Agreement, coordinating advocate title opinions, Sub-Registrar Office scheduling, and fund transfers.',
      icon: Scale,
    },
  ];

  const buyerStages = [
    {
      num: '01',
      title: 'Requirement Consultation',
      desc: 'We listen to your family lifestyle needs, space requirements, vaastu preferences, and workplace commuting priorities.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'Budget & Location Assessment',
      desc: 'We analyze overall acquisition costs including registration charges, stamp duty, interior provisions, and home loan eligibility.',
      icon: Clock,
    },
    {
      num: '03',
      title: 'Property Shortlisting',
      desc: 'We curate a shortlist of verified properties matching your parameters, eliminating fake or disputed listings.',
      icon: Search,
    },
    {
      num: '04',
      title: 'Guided Property Visits',
      desc: 'Accompanied site visits with unbiased commentary on neighborhood water table, master plan zoning, and infrastructure.',
      icon: Eye,
    },
    {
      num: '05',
      title: 'Offer & Terms Negotiation',
      desc: 'We assist in making an informed purchase offer and negotiating terms that safeguard your earnest money deposit.',
      icon: Handshake,
    },
    {
      num: '06',
      title: 'Legal Due Diligence',
      desc: 'We coordinate parent document sets for scrutiny by qualified independent advocates and verify 30-year Encumbrance Certificates.',
      icon: Scale,
    },
    {
      num: '07',
      title: 'Transaction Coordination',
      desc: 'Sale agreement execution, bank loan document processing support, demand draft coordination, and registration day escort.',
      icon: FileCheck2,
    },
    {
      num: '08',
      title: 'Post-Transaction Relationship',
      desc: 'Assistance with utility name transfers (TNEB, Corporation Tax, Water connection) and ongoing property advisory.',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <section className="py-20 bg-charcoal-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2 block">
            Advisory Excellence
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Our 8-Step Advisory Process
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Eliminating guesswork, legal ambiguities, and pressure tactics. Here is how Maalon Realty coordinates your property journey from first consultation to final key handover.
          </p>
        </div>
      </section>

      {/* SELLER JOURNEY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              For Property Owners
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">
              The 8-Stage Seller Journey
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              From market valuation to legal closing, how we protect your asset and connect you with qualified buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellerStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.num}
                  className="p-6 rounded-2xl bg-gray-50 border border-gray-200 hover:border-brand-500 hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-serif font-bold text-brand-600">
                        {stage.num}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      {stage.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/sell-property"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-105"
            >
              <span>Submit Property for Valuation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BUYER JOURNEY */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              For Homebuyers & Investors
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">
              The 8-Stage Buyer Journey
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              How we guide your discovery, title scrutiny, and closing with complete transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.num}
                  className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-brand-500 hover:shadow-card transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-serif font-bold text-brand-600">
                        {stage.num}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      {stage.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/find-property"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:scale-105"
            >
              <span>Register Buyer Requirements</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
