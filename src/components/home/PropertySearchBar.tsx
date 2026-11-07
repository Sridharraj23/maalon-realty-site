'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, IndianRupee, Layers } from 'lucide-react';
import { PROPERTY_CATEGORIES, TAMIL_NADU_LOCATIONS } from '@/lib/constants';

export default function PropertySearchBar() {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<'Sale' | 'Rent'>('Sale');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [bedroom, setBedroom] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    params.set('listingType', transactionType);
    if (category) params.set('category', category);
    if (location) params.set('location', location);
    if (bedroom) params.set('bedrooms', bedroom);

    if (budgetRange) {
      const [min, max] = budgetRange.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative -mt-10 z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
        {/* Top Type Selector: Buy vs Rent */}
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <button
            type="button"
            onClick={() => {
              setTransactionType('Sale');
              setBudgetRange('');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
              transactionType === 'Sale'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Buy Property
          </button>
          <button
            type="button"
            onClick={() => {
              setTransactionType('Rent');
              setBudgetRange('');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${
              transactionType === 'Rent'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Rent Property
          </button>
          <span className="text-[11px] text-gray-400 ml-auto hidden sm:inline">
            Direct Developer & Owner Mandates Only
          </span>
        </div>

        {/* Search Form Fields */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Location Field */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Location / Suburb
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-brand-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                list="tn-locations"
                placeholder="ECR, OMR, Anna Nagar..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
              <datalist id="tn-locations">
                {TAMIL_NADU_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Property Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Category
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-brand-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none transition-all"
              >
                <option value="">All Categories</option>
                {PROPERTY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bedrooms Selection including 1 BHK */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Bedrooms (BHK)
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-brand-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={bedroom}
                onChange={(e) => setBedroom(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none transition-all"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 BHK / Single Bed</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK / Villa</option>
              </select>
            </div>
          </div>

          {/* Budget Range (Dynamic for Buy vs Rent) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              {transactionType === 'Rent' ? 'Monthly Rent' : 'Budget Range'}
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-brand-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent appearance-none transition-all"
              >
                {transactionType === 'Rent' ? (
                  <>
                    <option value="">Any Rent</option>
                    <option value="0-25000">Up to ₹25,000 / mo</option>
                    <option value="25000-50000">₹25,000 – ₹50,000 / mo</option>
                    <option value="50000-100000">₹50,000 – ₹1 Lakh / mo</option>
                    <option value="100000-500000">₹1 Lakh+ / mo</option>
                  </>
                ) : (
                  <>
                    <option value="">Any Budget</option>
                    <option value="0-5000000">Up to ₹50 Lakhs</option>
                    <option value="5000000-15000000">₹50 Lakhs – ₹1.5 Crore</option>
                    <option value="15000000-30000000">₹1.5 Crore – ₹3 Crore</option>
                    <option value="30000000-60000000">₹3 Crore – ₹6 Crore</option>
                    <option value="60000000-150000000">₹6 Crore – ₹15 Crore+</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 h-[42px]"
            >
              <Search className="w-4 h-4" />
              <span>Search Properties</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
