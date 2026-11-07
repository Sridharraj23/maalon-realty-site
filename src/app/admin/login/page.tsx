'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (
        (email.trim().toLowerCase() === 'admin@maalonrealty.in' && password === 'Maalon@2026') ||
        (email.trim().toLowerCase() === 'sridhar@maalonrealty.in' && password === 'Maalon@2026')
      ) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            'maalon_admin_session',
            JSON.stringify({ email, loggedInAt: new Date().toISOString() })
          );
        }
        router.push('/admin/dashboard');
      } else {
        setError('Authentication failed. Please verify founder credentials.');
      }
    } catch {
      setError('Authentication error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial accent in brand teal */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-950/30 via-charcoal-950 to-black pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-block mb-6 transition-opacity hover:opacity-90">
          <Image
            src={BRAND.logos.horizontal}
            alt="MAALON REALTY"
            width={850}
            height={186}
            priority
            className="h-14 sm:h-16 w-auto mx-auto object-contain brightness-0 invert"
          />
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Executive Management Portal</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
          Founding Partners Authentication
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Secure administrative access for Maalon Realty founders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-charcoal-900 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-white/10">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Founder Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maalonrealty.in"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-brand-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Helper Credentials Note */}
          <div className="mt-8 pt-6 border-t border-white/10 text-[11px] text-gray-400 bg-charcoal-800/50 p-3.5 rounded-lg border border-white/5 space-y-1">
            <span className="font-bold text-brand-300 block uppercase tracking-wider">
              Default Founder Credentials:
            </span>
            <p>Email: <span className="text-white font-mono">admin@maalonrealty.in</span></p>
            <p>Password: <span className="text-white font-mono">Maalon@2026</span></p>
            <p className="text-[10px] text-gray-500 pt-1">
              (Configurable via environment variables ADMIN_EMAIL & ADMIN_PASSWORD)
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-brand-400 transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
