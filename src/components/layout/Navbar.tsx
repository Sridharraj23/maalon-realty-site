'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import { BRAND, DEFAULT_SITE_SETTINGS } from '@/lib/constants';
import { createWhatsAppUrl } from '@/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Sell Property', href: '/sell-property' },
    { name: 'Find Property', href: '/find-property' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const whatsappUrl = createWhatsAppUrl(
    DEFAULT_SITE_SETTINGS.whatsapp,
    'Hello Maalon Realty, I would like to know more about your real estate services.'
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5'
          : 'bg-white/95 backdrop-blur-sm py-3.5 border-b border-gray-100/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Main Logo on Top Left - Prominent, Bold, Perfectly Aligned */}
          <Link
            href="/"
            className="flex items-center group focus:outline-none shrink-0 transition-opacity hover:opacity-95"
            aria-label="Maalon Realty Homepage"
          >
            <Image
              src={BRAND.logos.horizontal}
              alt="MAALON REALTY - Powering Growth"
              width={850}
              height={186}
              priority
              className="h-11 sm:h-14 md:h-16 lg:h-[74px] xl:h-[80px] w-auto object-contain object-left"
            />
          </Link>

          {/* Minimalist, Clean Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[13px] tracking-wide font-medium transition-colors duration-200 relative py-1.5 ${
                    isActive
                      ? 'text-brand-600 font-bold'
                      : 'text-gray-700 hover:text-brand-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sleek, Catchy Right Action */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/sell-property"
              className="group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 text-white shadow-sm hover:bg-brand-600 transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <span>List Property</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin"
              className="p-2 text-gray-400 hover:text-brand-600 transition-colors rounded-full hover:bg-gray-100"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/sell-property"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 text-white shadow-xs"
            >
              List Property
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-brand-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-5 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-brand-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/process"
              onClick={() => setIsOpen(false)}
              className="block px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-600"
            >
              Our Process
            </Link>
            <Link
              href="/testimonials"
              onClick={() => setIsOpen(false)}
              className="block px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-600"
            >
              Testimonials
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
            <a
              href={`tel:${DEFAULT_SITE_SETTINGS.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-50 text-xs font-semibold text-gray-800"
            >
              <Phone className="w-3.5 h-3.5 text-brand-600" />
              <span>Call: {DEFAULT_SITE_SETTINGS.phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-50 text-xs font-semibold text-emerald-800"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Direct</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 text-[11px] text-gray-400 hover:text-brand-600"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Founder Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
