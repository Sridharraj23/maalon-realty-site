import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Instagram, Linkedin, Youtube, ShieldCheck } from 'lucide-react';
import { BRAND, DEFAULT_SITE_SETTINGS, PROPERTY_CATEGORIES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-charcoal-DEFAULT text-gray-300 pt-16 pb-10 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <Image
                src={BRAND.logos.horizontal}
                alt="MAALON REALTY"
                width={850}
                height={186}
                className="h-12 md:h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm font-serif italic text-brand-300">
              "{BRAND.philosophy}"
            </p>
            <p className="text-xs leading-relaxed text-gray-400 max-w-sm">
              Maalon Realty is an independent real estate brokerage and property advisory company based in Tamil Nadu. We connect property owners with suitable buyers through transparency, requirement-driven matching, and end-to-end transaction coordination.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={DEFAULT_SITE_SETTINGS.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-colors text-gray-400"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={DEFAULT_SITE_SETTINGS.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-colors text-gray-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={DEFAULT_SITE_SETTINGS.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-500 hover:text-white flex items-center justify-center transition-colors text-gray-400"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/properties" className="hover:text-brand-400 transition-colors">
                  Featured Properties
                </Link>
              </li>
              <li>
                <Link href="/sell-property" className="hover:text-brand-400 transition-colors">
                  Sell Your Property
                </Link>
              </li>
              <li>
                <Link href="/find-property" className="hover:text-brand-400 transition-colors">
                  Find Your Property
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  About Our Founders
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-brand-400 transition-colors">
                  Our 8-Step Process
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-brand-400 transition-colors">
                  Client Experiences
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  Contact Advisory Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Property Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">Categories</h4>
            <ul className="space-y-2 text-xs">
              {PROPERTY_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/properties?category=${encodeURIComponent(cat)}`}
                    className="hover:text-brand-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Advisory & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white">Contact & Office</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span className="text-gray-400">{DEFAULT_SITE_SETTINGS.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a
                  href={`tel:${DEFAULT_SITE_SETTINGS.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-brand-400 transition-colors text-gray-300"
                >
                  {DEFAULT_SITE_SETTINGS.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a
                  href={`mailto:${DEFAULT_SITE_SETTINGS.email}`}
                  className="hover:text-brand-400 transition-colors text-gray-300"
                >
                  {DEFAULT_SITE_SETTINGS.email}
                </a>
              </li>
              <li className="pt-2 text-[11px] text-gray-500">
                Operating Market: Tamil Nadu (Chennai, Coimbatore, Madurai, Trichy, Hosur).
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p>© {new Date().getFullYear()} MAALON REALTY. All rights reserved.</p>
            <p className="text-[11px] text-gray-600">
              RERA Reg: {DEFAULT_SITE_SETTINGS.reraNumber} | Real Estate Brokerage & Property Advisory.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-gray-600 hover:text-brand-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
