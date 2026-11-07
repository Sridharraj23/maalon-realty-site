'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '@/lib/constants';
import { createWhatsAppUrl } from '@/lib/utils';

export default function WhatsAppFloating() {
  const [showTooltip, setShowTooltip] = useState(true);

  const defaultMessage = 'Hello Maalon Realty, I would like to know more about your real estate services.';
  const whatsappUrl = createWhatsAppUrl(DEFAULT_SITE_SETTINGS.whatsapp, defaultMessage);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 pointer-events-none">
      {/* Friendly Tooltip Pill */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-gray-800 text-xs py-2 px-3.5 rounded-full shadow-lg border border-gray-100 pointer-events-auto animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Chat directly with a founding partner</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-600 p-0.5 ml-1"
            aria-label="Dismiss chat tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-label="Chat with Maalon Realty on WhatsApp"
        title="WhatsApp Maalon Realty"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 group-hover:opacity-40" />
        <MessageCircle className="w-7 h-7 relative z-10" />
      </a>
    </div>
  );
}
