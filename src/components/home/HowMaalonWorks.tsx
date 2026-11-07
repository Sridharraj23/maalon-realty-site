'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function HowMaalonWorks() {
  const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('seller');

  const sellerSteps = [
    {
      num: '01',
      title: 'Share Your Property',
      icon: FileText,
    },
    {
      num: '02',
      title: 'Information & Document Review',
      icon: Search,
    },
    {
      num: '03',
      title: 'Listing Authorisation & Advisory',
      icon: CheckCircle,
    },
    {
      num: '04',
      title: 'Connect With Suitable Buyers',
      icon: Users,
    },
    {
      num: '05',
      title: 'Negotiation & Transaction Support',
      icon: Handshake,
    },
  ];

  const buyerSteps = [
    {
      num: '01',
      title: 'Tell Us Your Requirements',
      icon: Compass,
    },
    {
      num: '02',
      title: 'Discover Suitable Properties',
      icon: Search,
    },
    {
      num: '03',
      title: 'Schedule Property Visits',
      icon: Eye,
    },
    {
      num: '04',
      title: 'Evaluate & Negotiate',
      icon: ShieldAlert,
    },
    {
      num: '05',
      title: 'Proceed With Informed Decisions',
      icon: Handshake,
    },
  ];

  const currentSteps = activeTab === 'seller' ? sellerSteps : buyerSteps;

  return (
    <section className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
            Transparent Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
            How Maalon Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            A structured, human-first process built to protect your interests whether you are selling an ancestral property or buying your family’s next home.
          </p>

          {/* Interactive Journey Switcher Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'seller'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Seller Journey (5 Steps)
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'buyer'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Buyer Journey (5 Steps)
            </button>
          </div>
        </div>

        {/* Visual Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {currentSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-brand-500 hover:shadow-card transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-serif font-bold text-brand-500 group-hover:scale-110 transition-transform">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {step.title}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center text-[11px] font-semibold text-brand-600">
                  <span>Step {idx + 1} of 5</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Journey Bottom CTA */}
        <div className="mt-12 text-center">
          {activeTab === 'seller' ? (
            <Link
              href="/sell-property"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all hover:scale-105"
            >
              <span>Begin Seller Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/find-property"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all hover:scale-105"
            >
              <span>Submit Your Buyer Requirements</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
