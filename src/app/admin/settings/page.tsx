'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle,
  Users,
  Bell,
  Share2,
} from 'lucide-react';
import { Founder, SiteSettings } from '@/lib/types';
import { DEFAULT_FOUNDERS, DEFAULT_SITE_SETTINGS } from '@/lib/constants';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [founders, setFounders] = useState<Founder[]>(DEFAULT_FOUNDERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    function loadConfig() {
      try {
        if (typeof window !== 'undefined') {
          const saved = window.localStorage.getItem('maalon_settings');
          if (saved) {
            setSettings(JSON.parse(saved));
          }
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('maalon_settings', JSON.stringify(settings));
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleFounderChange = (idx: number, field: keyof Founder, val: any) => {
    setFounders((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleSaveFounder = async (founder: Founder) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'founder', id: founder.id, data: founder }),
      });
      const json = await res.json();
      if (json.success) {
        alert(`Profile for ${founder.name} saved!`);
      }
    } catch {
      alert('Error updating founder');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Module 5: Global Configurations
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Website Content & Founders Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Centrally manage contact numbers, WhatsApp redirects, RERA numbers, and founder bios.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      {/* SECTION 1: BUSINESS CONTACT & WHATSAPP */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Phone className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-serif font-bold text-gray-900 uppercase tracking-wide">
              Contact Channels & Central WhatsApp Number
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Central Phone Number
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Central Business WhatsApp (with country code)
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                All property inquiry buttons route to this WhatsApp number dynamically.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Official Business Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Headquarters Office Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Applicable RERA Registration Reference
              </label>
              <input
                type="text"
                value={settings.reraNumber}
                onChange={(e) => setSettings({ ...settings, reraNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ANNOUNCEMENT BANNER */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Bell className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-serif font-bold text-gray-900 uppercase tracking-wide">
              Homepage Top Announcement Banner
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="annToggle"
              checked={settings.announcement?.enabled || false}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement: {
                    ...settings.announcement,
                    enabled: e.target.checked,
                  },
                })
              }
              className="accent-brand-500 w-4 h-4"
            />
            <label htmlFor="annToggle" className="text-xs font-bold text-gray-800">
              Display Announcement Banner on Public Header
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Banner Message Text
            </label>
            <input
              type="text"
              value={settings.announcement?.text || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement: {
                    ...settings.announcement,
                    text: e.target.value,
                  },
                })
              }
              placeholder="e.g. Exclusive residential & commercial opportunities now open across Chennai..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Save Site Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>

      {/* SECTION 3: FOUNDER PROFILES MANAGEMENT */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Users className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-serif font-bold text-gray-900 uppercase tracking-wide">
            Founding Partner Profiles (3 Founders)
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          Update founder names, titles, direct emails, bios, and areas of responsibility displayed on the About Us page.
        </p>

        <div className="space-y-6">
          {founders.map((founder, idx) => (
            <div
              key={founder.id}
              className="p-6 rounded-xl bg-gray-50 border border-gray-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Partner {idx + 1}: {founder.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleSaveFounder(founder)}
                  className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-bold uppercase rounded-md shadow-xs transition-colors"
                >
                  Save Partner Profile
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={founder.name}
                    onChange={(e) => handleFounderChange(idx, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={founder.designation}
                    onChange={(e) => handleFounderChange(idx, 'designation', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">
                    Primary Operational Role
                  </label>
                  <input
                    type="text"
                    value={founder.role}
                    onChange={(e) => handleFounderChange(idx, 'role', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-gray-600 mb-1">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    value={founder.email || ''}
                    onChange={(e) => handleFounderChange(idx, 'email', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase text-gray-600 mb-1">
                    Photograph URL
                  </label>
                  <input
                    type="url"
                    value={founder.image}
                    onChange={(e) => handleFounderChange(idx, 'image', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase text-gray-600 mb-1">
                    Short Biography
                  </label>
                  <textarea
                    rows={2}
                    value={founder.bio}
                    onChange={(e) => handleFounderChange(idx, 'bio', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
