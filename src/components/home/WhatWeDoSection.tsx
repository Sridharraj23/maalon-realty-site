import React from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, Compass, Landmark } from 'lucide-react';

export default function WhatWeDoSection() {
  const cards = [
    {
      icon: Tag,
      tag: 'For Property Owners',
      headline: 'Your Property Deserves the Right Buyer.',
      description:
        'We help property owners market their properties with dignity and discretion, targeting genuinely qualified buyers, coordinating site visits, and assisting in structured price negotiations without endless tire-kickers.',
      cta: 'Sell With Maalon',
      href: '/sell-property',
      accentColor: 'border-brand-500',
    },
    {
      icon: Compass,
      tag: 'For Homebuyers & Investors',
      headline: 'Your Next Chapter Starts With the Right Property.',
      description:
        'Instead of pushing pushy sales pitches, we sit down to understand your family’s aspirations, budget boundaries, and location priorities. We shortlist only verified properties that genuinely match your criteria.',
      cta: 'Find Your Property',
      href: '/find-property',
      accentColor: 'border-brand-600',
    },
    {
      icon: Landmark,
      tag: 'Strategic Advisory',
      headline: 'Better Decisions Begin With Better Guidance.',
      description:
        'From evaluating market valuations and reviewing parent title chains to coordinating with certified legal advocates and civil surveyors, we ensure every transaction is rooted in clarity and peace of mind.',
      cta: 'Learn More About Us',
      href: '/about',
      accentColor: 'border-brand-700',
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-3 block">
            Our Purpose & Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
            More Than Just Finding Properties.{' '}
            <span className="italic text-brand-600 font-medium">We Find the Right Fit.</span>
          </h2>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            Property transactions are life-defining milestones. We move beyond conventional transactional brokers to act as dedicated advisors focused on long-term relationships.
          </p>
        </div>

        {/* 3 Luxury Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group relative bg-gray-50/70 hover:bg-white rounded-2xl p-8 border border-gray-100 hover:border-brand-300 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-100/50 px-2.5 py-1 rounded-md">
                    {card.tag}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mt-4 mb-3 group-hover:text-brand-600 transition-colors">
                    {card.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 group-hover:text-brand-700 transition-colors"
                  >
                    <span>{card.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
