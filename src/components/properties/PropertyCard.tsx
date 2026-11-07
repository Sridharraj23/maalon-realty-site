import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Maximize2, MapPin, CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { Property } from '@/lib/types';
import { createWhatsAppUrl, formatArea, formatIndianCurrency } from '@/lib/utils';
import { DEFAULT_SITE_SETTINGS } from '@/lib/constants';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const whatsappMsg = `Hello Maalon Realty, I am interested in Property ID ${property.id} (${property.title}). Please share more details.`;
  const whatsappLink = createWhatsAppUrl(DEFAULT_SITE_SETTINGS.whatsapp, whatsappMsg);

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      {/* Property Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={property.primaryImage || property.images[0]}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {property.listingType === 'Rent' ? (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-md bg-emerald-600 text-white shadow-sm">
              For Rent
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase rounded-md bg-brand-500 text-white shadow-sm">
              For Sale
            </span>
          )}
          <span className="px-2 py-1 text-[11px] font-medium tracking-wide uppercase rounded-md bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
            {property.category}
          </span>
          {property.verified && (
            <span className="px-2 py-1 text-[11px] font-medium flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-sm text-brand-800 shadow-sm">
              <CheckCircle className="w-3 h-3 text-brand-600" />
              <span>Verified Title</span>
            </span>
          )}
        </div>

        {/* Status Badge (if not Available) */}
        {property.status !== 'Available' && (
          <div className="absolute top-3 right-3">
            <span
              className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-md text-white shadow-sm ${
                property.status === 'Sold' ? 'bg-red-600' : 'bg-amber-600'
              }`}
            >
              {property.status}
            </span>
          </div>
        )}

        {/* Property ID badge */}
        <div className="absolute bottom-3 left-3 text-white text-[11px] font-mono bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
          ID: {property.id}
        </div>
      </div>

      {/* Property Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Price & Location */}
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight font-sans">
            {formatIndianCurrency(property.price, property.listingType)}
          </h3>
          {property.listingType !== 'Rent' && property.pricePerSqFt && (
            <span className="text-xs text-gray-500">
              ₹{property.pricePerSqFt.toLocaleString('en-IN')}/sq.ft
            </span>
          )}
        </div>

        <Link
          href={`/properties/${property.slug}`}
          className="text-base font-semibold text-gray-800 hover:text-brand-600 transition-colors line-clamp-1 mb-1"
        >
          {property.title}
        </Link>

        <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
          <span className="truncate">{property.location}</span>
        </p>

        {/* Key Specs Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-xs text-gray-600 mb-4 bg-gray-50/50 rounded-lg px-2">
          <div className="flex items-center gap-1.5 justify-center">
            <Maximize2 className="w-3.5 h-3.5 text-brand-600" />
            <span className="truncate font-medium">{formatArea(property.area, property.areaUnit)}</span>
          </div>
          {property.bedrooms ? (
            <div className="flex items-center gap-1.5 justify-center">
              <Bed className="w-3.5 h-3.5 text-brand-600" />
              <span className="font-medium">{property.bedrooms} Beds</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 justify-center text-gray-400">
              <span>Plot/Land</span>
            </div>
          )}
          {property.bathrooms ? (
            <div className="flex items-center gap-1.5 justify-center">
              <Bath className="w-3.5 h-3.5 text-brand-600" />
              <span className="font-medium">{property.bathrooms} Baths</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 justify-center text-gray-400">
              <span>{property.facing || 'Prime Title'}</span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-auto pt-1 flex items-center gap-2">
          <Link
            href={`/properties/${property.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white transition-all duration-200"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all duration-200"
            title="Enquire on WhatsApp"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
