import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CheckCircle2, Building2, MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-charcoal-900 text-white">
      {/* Background Architectural Image with subtle zoom overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity scale-105 transition-transform duration-10000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85')",
        }}
      />

      {/* Luxury Gradient Wash in Brand Colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/80 to-brand-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-black/40" />

      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center z-10 flex flex-col items-center">
        {/* Brand Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          <span>Real Estate Brokerage & Property Advisory • Tamil Nadu</span>
        </div>

        {/* Official Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
          Every Property Has a Purpose.{' '}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-200 to-white block sm:inline">
            Every Buyer Has a Place.
          </span>
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed mb-8">
          We connect property owners with the right buyers and help you discover properties that truly fit your needs, aspirations, and lifestyle.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-6">
          <Link
            href="/properties"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider bg-brand-500 text-white shadow-lg hover:bg-brand-600 transition-all duration-200 hover:scale-105 hover:shadow-brand-500/25"
          >
            <span>Explore Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/sell-property"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105"
          >
            <span>Sell Your Property</span>
          </Link>
        </div>

        {/* Secondary Specific Request Link */}
        <Link
          href="/find-property"
          className="inline-flex items-center gap-1.5 text-xs text-brand-300 hover:text-white transition-colors underline underline-offset-4 decoration-brand-400/50 hover:decoration-white"
        >
          <span>Looking for something specific? Tell us what you need.</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        {/* Trust Badges Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 w-full grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Title Verification</p>
              <p className="text-gray-400 text-[11px]">Strict document review</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Zero Fake Listings</p>
              <p className="text-gray-400 text-[11px]">Direct verified mandates</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-brand-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Diverse Portfolio</p>
              <p className="text-gray-400 text-[11px]">Villas, plots & commercial</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-brand-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Tamil Nadu Focus</p>
              <p className="text-gray-400 text-[11px]">Chennai & emerging hubs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
