'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  Users,
  FileCheck2,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // If on login page, don't wrap with dashboard shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('maalon_admin_session');
    }
    router.push('/admin/login');
  };

  const navItems = [
    {
      name: 'Analytics Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Property Listings',
      href: '/admin/properties',
      icon: Building,
    },
    {
      name: 'Buyer Enquiries (CRM)',
      href: '/admin/buyers',
      icon: Users,
    },
    {
      name: 'Seller Submissions',
      href: '/admin/sellers',
      icon: FileCheck2,
    },
    {
      name: 'Testimonials Approval',
      href: '/admin/testimonials',
      icon: MessageSquare,
    },
    {
      name: 'Website Content & Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-charcoal-900 text-white shrink-0 border-r border-charcoal-800">
        {/* Brand Header */}
        <div className="p-6 border-b border-charcoal-800">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Image
              src={BRAND.logos.horizontal}
              alt="MAALON REALTY"
              width={850}
              height={186}
              className="h-9 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-brand-300 font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
        </div>

        {/* Quick Add Button */}
        <div className="p-4">
          <Link
            href="/admin/properties/new"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Property</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-500 text-white font-bold shadow-sm'
                    : 'text-gray-300 hover:bg-charcoal-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-charcoal-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 text-xs text-gray-400 hover:text-brand-300 hover:bg-charcoal-800 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </span>
            <span className="text-[10px] bg-charcoal-800 px-1.5 py-0.5 rounded text-gray-400">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="md:hidden bg-charcoal-900 text-white p-4 flex items-center justify-between border-b border-charcoal-800">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Image
              src={BRAND.logos.horizontal}
              alt="MAALON REALTY"
              width={850}
              height={186}
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-charcoal-900 border-b border-charcoal-800 p-4 space-y-2 animate-fadeIn">
            <Link
              href="/admin/properties/new"
              onClick={() => setMobileNavOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-500 text-white text-xs font-bold uppercase rounded-lg mb-3"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Property</span>
            </Link>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    isActive ? 'bg-brand-500 text-white font-bold' : 'text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-charcoal-800 flex justify-between items-center text-xs">
              <Link href="/" target="_blank" className="text-brand-300">
                View Public Site ↗
              </Link>
              <button onClick={handleLogout} className="text-red-400">
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
