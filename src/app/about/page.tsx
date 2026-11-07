import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Target,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Award,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { DEFAULT_FOUNDERS, DEFAULT_SITE_SETTINGS } from '@/lib/constants';

export const metadata = {
  title: 'About Us | Connecting People. Creating Possibilities',
  description:
    'Learn about Maalon Realty, our core founding partners, our property advisory philosophy, and our commitment to transparent real estate brokerage across Tamil Nadu.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="relative py-24 bg-charcoal-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-900/90 to-brand-950/50" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-3 block">
            About Maalon Realty
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-white mb-6">
            Connecting People.{' '}
            <span className="italic text-brand-300 font-medium">Creating Possibilities.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            We are an independent property advisory and real estate brokerage company founded on the principle that property transactions are not merely financial events—they are vital life milestones.
          </p>
        </div>
      </section>

      {/* Brand Philosophy & Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
                Our Genesis & Ethos
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight leading-tight mb-6">
                Every Property Has a Purpose.{' '}
                <span className="italic text-brand-600 font-medium">Every Buyer Has a Place.</span>
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Maalon Realty was established by three founding partners who recognized a critical gap in the regional real estate landscape: the absence of genuine advisory, objective diligence, and transparent stewardship for both property owners and homebuyers.
                </p>
                <p>
                  For property sellers, we don’t treat listings as casual classified ads. We conduct thorough revenue documentation reviews, create high-impact presentations, and bring financially qualified buyers to the table.
                </p>
                <p>
                  For property buyers, we step away from aggressive sales quotas. We listen intently to understand your budget realities, long-term family aspirations, and lifestyle priorities, matching you only with properties that have clear legal titles and genuine value.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-2xl font-serif font-bold text-brand-600 mb-1">Tamil Nadu</h4>
                  <p className="text-xs text-gray-500">
                    Primary focus spanning Chennai, Coimbatore, Madurai, Trichy & Hosur.
                  </p>
                </div>
                <div>
                  <h4 className="text-2xl font-serif font-bold text-brand-600 mb-1">100%</h4>
                  <p className="text-xs text-gray-500">
                    Direct mandate verification before any listing is published.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Maalon Realty Architecture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent flex items-end p-8">
                <p className="text-white text-xs font-serif italic max-w-sm">
                  "Real estate advisory is built on trust, transparency, and lifelong client relationships."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To connect property sellers with the right buyers and help people find properties where they can build their future through integrity, clarity, and uncompromised professional diligence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Our Vision</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To become Tamil Nadu’s most trusted real estate advisory partner—making property buying and selling simpler, more transparent, and more meaningful for generations of clients.
              </p>
            </div>
          </div>

          {/* Core Values Bar */}
          <div>
            <h3 className="text-center text-xs font-bold uppercase tracking-widest text-brand-600 mb-8">
              Our 6 Core Operating Values
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: 'Trust', desc: 'Earned through consistency' },
                { title: 'Transparency', desc: 'No hidden agendas' },
                { title: 'Customer-First', desc: 'Your needs prioritize all' },
                { title: 'Integrity', desc: 'Uncompromised ethics' },
                { title: 'Professionalism', desc: 'Rigorous legal coordination' },
                { title: 'Long-term', desc: 'Generational relationships' },
              ].map((val, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-xs"
                >
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{val.title}</h4>
                  <p className="text-[11px] text-gray-500">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDERS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2 block">
              Founding Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
              Meet the Founding Partners
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Maalon Realty is actively operated and led by three founding partners who oversee client mandates personally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DEFAULT_FOUNDERS.map((founder) => (
              <div
                key={founder.id}
                className="bg-gray-50/70 rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-gray-200">
                    <Image
                      src={founder.image}
                      alt={founder.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-serif font-bold text-gray-900">
                      {founder.name}
                    </h3>
                    <p className="text-xs font-semibold text-brand-600 mb-1">
                      {founder.designation}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-4">
                      {founder.role}
                    </p>

                    <p className="text-xs text-gray-600 leading-relaxed mb-6">
                      {founder.bio}
                    </p>

                    <div className="space-y-1.5 pt-4 border-t border-gray-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                        Key Areas of Responsibility:
                      </span>
                      {founder.areasOfResponsibility.map((resp, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700">
                          <CheckCircle className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <a
                    href={`mailto:${founder.email}`}
                    className="block text-center py-2 px-3 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
                  >
                    Direct Contact: {founder.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Action Banner */}
      <section className="py-16 bg-brand-500 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4">
            Partner With Maalon Realty Today
          </h2>
          <p className="text-sm text-brand-100 max-w-xl mx-auto mb-8">
            Whether you wish to discuss selling an asset, acquiring a property, or exploring a developer alliance, our founding partners are ready to meet with you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-brand-800 text-xs font-bold uppercase tracking-wider hover:bg-brand-50 shadow-md transition-all"
            >
              Contact Advisory Office
            </Link>
            <Link
              href="/properties"
              className="px-6 py-3 rounded-full border border-white/40 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              Explore Property Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
