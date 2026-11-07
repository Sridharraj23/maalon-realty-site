import React from 'react';
import Link from 'next/link';
import { ArrowRight, PhoneCall } from 'lucide-react';

export default function FinalCtaSection() {
  return (
    <section className="relative py-24 bg-charcoal-900 text-white overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-charcoal-900 to-charcoal-950" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-3 block">
          Begin Your Partnership
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight mb-6">
          Your Next Property Journey{' '}
          <span className="italic text-brand-300 font-medium">Starts Here.</span>
        </h2>

        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Whether you’re looking to sell your property or searching for your next place, Maalon Realty is here to connect the right people with the right opportunities.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/properties"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition-all hover:scale-105"
          >
            <span>Explore Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-105"
          >
            <PhoneCall className="w-4 h-4 text-brand-300" />
            <span>Connect With Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
