import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Property } from '@/lib/types';
import PropertyCard from '../properties/PropertyCard';

interface FeaturedPropertiesProps {
  properties: Property[];
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const featuredList = properties.slice(0, 6);

  return (
    <section className="py-20 bg-gray-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Curated Advisory Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Featured Properties in Tamil Nadu
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              Handpicked residential villas, premium high-rises, plotted layouts, and commercial properties verified for clear ownership and documentation.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 hover:text-brand-700 hover:translate-x-1 transition-all"
          >
            <span>Explore All Properties ({properties.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Properties Grid */}
        {featuredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredList.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8">
            <p className="text-gray-500 text-sm">
              Currently onboarding new verified property mandates. Check back shortly or submit your requirement.
            </p>
            <Link
              href="/find-property"
              className="mt-4 inline-block px-5 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider"
            >
              Tell Us Your Requirements
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
