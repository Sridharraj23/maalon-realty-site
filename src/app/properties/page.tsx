'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Building,
  RotateCcw,
} from 'lucide-react';
import { Property, PropertyCategory, PropertyStatus } from '@/lib/types';
import { PROPERTY_CATEGORIES, TAMIL_NADU_LOCATIONS } from '@/lib/constants';
import PropertyCard from '@/components/properties/PropertyCard';

function PropertiesContent() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [listingTypeFilter, setListingTypeFilter] = useState<string>(
    searchParams.get('listingType') || 'All'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(
    searchParams.get('location') || ''
  );
  const [statusFilter, setStatusFilter] = useState<string>('Available');
  const [minBudget, setMinBudget] = useState<string>(
    searchParams.get('minPrice') || ''
  );
  const [maxBudget, setMaxBudget] = useState<string>(
    searchParams.get('maxPrice') || ''
  );
  const [minArea, setMinArea] = useState<string>('');
  const [maxArea, setMaxArea] = useState<string>('');
  const [bedroomCount, setBedroomCount] = useState<string>(
    searchParams.get('bedrooms') || 'Any'
  );
  const [sortBy, setSortBy] = useState<string>('recent');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const res = await fetch('/api/properties');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProperties(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  // Filter and Sort Logic
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Listing Type (Sale vs Rent)
    if (listingTypeFilter && listingTypeFilter !== 'All') {
      result = result.filter(
        (p) => (p.listingType || 'Sale') === listingTypeFilter
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Status (default: Available, or specific)
    if (statusFilter && statusFilter !== 'All') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Location
    if (selectedLocation.trim()) {
      const loc = selectedLocation.toLowerCase();
      result = result.filter(
        (p) =>
          p.location.toLowerCase().includes(loc) ||
          p.city.toLowerCase().includes(loc) ||
          p.address.toLowerCase().includes(loc)
      );
    }

    // Budget
    if (minBudget) {
      result = result.filter((p) => p.price >= Number(minBudget));
    }
    if (maxBudget) {
      result = result.filter((p) => p.price <= Number(maxBudget));
    }

    // Area
    if (minArea) {
      result = result.filter((p) => p.area >= Number(minArea));
    }
    if (maxArea) {
      result = result.filter((p) => p.area <= Number(maxArea));
    }

    // Bedrooms (including 1 BHK)
    if (bedroomCount && bedroomCount !== 'Any') {
      const count = Number(bedroomCount);
      result = result.filter((p) => (p.bedrooms || 0) >= count);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'area-desc') {
      result.sort((a, b) => b.area - a.area);
    } else {
      // 'recent'
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [
    properties,
    listingTypeFilter,
    selectedCategory,
    statusFilter,
    selectedLocation,
    minBudget,
    maxBudget,
    minArea,
    maxArea,
    bedroomCount,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setListingTypeFilter('All');
    setSelectedLocation('');
    setStatusFilter('Available');
    setMinBudget('');
    setMaxBudget('');
    setMinArea('');
    setMaxArea('');
    setBedroomCount('Any');
    setSortBy('recent');
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    listingTypeFilter !== 'All',
    selectedLocation !== '',
    statusFilter !== 'Available',
    minBudget !== '',
    maxBudget !== '',
    minArea !== '',
    maxArea !== '',
    bedroomCount !== 'Any',
  ].filter(Boolean).length;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2 block">
            Tamil Nadu Real Estate Portfolio
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
            Explore Properties
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Verified residential villas, modern apartments, plotted communities, and prime commercial spaces with direct owner & developer mandates.
          </p>
        </div>

        {/* Transaction Type Filter Pills: All / For Sale / For Rent */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
            Type:
          </span>
          {[
            { label: 'All', value: 'All' },
            { label: 'For Sale', value: 'Sale' },
            { label: 'For Rent', value: 'Rent' },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setListingTypeFilter(type.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all ${
                listingTypeFilter === type.value
                  ? 'bg-charcoal-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Category Pill Navigation - TOPIC NAMES ONLY, NO NUMBERS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Categories
          </button>
          {PROPERTY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layout Grid: Sidebar Filters + Property Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-brand-600" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Filter Listings
                  </h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset ({activeFiltersCount})</span>
                  </button>
                )}
              </div>

              {/* Listing Type (Sale vs Rent) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Transaction Type
                </label>
                <select
                  value={listingTypeFilter}
                  onChange={(e) => setListingTypeFilter(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="All">All (Sale & Rent)</option>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Location
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    list="catalog-locations"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    placeholder="Search by area or city..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <datalist id="catalog-locations">
                    {TAMIL_NADU_LOCATIONS.map((l) => (
                      <option key={l} value={l} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  {listingTypeFilter === 'Rent' ? 'Monthly Rent (INR)' : 'Budget (INR)'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="Min Price"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="Max Price"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>{listingTypeFilter === 'Rent' ? 'e.g. 20000' : 'e.g. 5000000 (50L)'}</span>
                  <span>{listingTypeFilter === 'Rent' ? 'e.g. 100000' : 'e.g. 30000000 (3Cr)'}</span>
                </div>
              </div>

              {/* Area Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Property Area
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                    placeholder="Min Area"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="number"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
                    placeholder="Max Area"
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Bedrooms (1 BHK, 2 BHK, 3 BHK, 4+ BHK) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Bedrooms (BHK)
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {['Any', '1', '2', '3', '4+'].map((beds) => (
                    <button
                      key={beds}
                      type="button"
                      onClick={() =>
                        setBedroomCount(beds === '4+' ? '4' : beds)
                      }
                      className={`py-1.5 text-xs font-semibold rounded-md border text-center transition-colors ${
                        (beds === '4+' && bedroomCount === '4') ||
                        bedroomCount === beds
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {beds}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Available">Available Properties (Default)</option>
                  <option value="Under Negotiation">Under Negotiation</option>
                  <option value="Sold">Sold Portfolio</option>
                  <option value="All">All Listings</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings Column */}
          <div className="lg:col-span-3">
            {/* Top Toolbar: Count, Mobile Filter Trigger, Sort Dropdown */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase bg-brand-50 text-brand-700 rounded-lg border border-brand-200"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>

                <p className="text-xs text-gray-600 font-medium">
                  Showing <span className="font-bold text-gray-900">{filteredProperties.length}</span> properties
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500 font-medium whitespace-nowrap">
                  Sort By:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="area-desc">Area: Largest First</option>
                </select>
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-xl h-80 animate-pulse border border-gray-200"
                  />
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            ) : (
              /* Detailed Empty State */
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto my-8">
                <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No Properties Match Your Current Filter
                </h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  We frequently onboard off-market mandates across Chennai and Tamil Nadu that may not be displayed publicly yet.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50"
                  >
                    Reset All Filters
                  </button>
                  <a
                    href="/find-property"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-600"
                  >
                    Tell Us Your Requirements
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Filters
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Transaction Type
                </label>
                <select
                  value={listingTypeFilter}
                  onChange={(e) => setListingTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                >
                  <option value="All">All (Sale & Rent)</option>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                >
                  <option value="All">All Categories</option>
                  {PROPERTY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Bedrooms (BHK)
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {['Any', '1', '2', '3', '4+'].map((beds) => (
                    <button
                      key={beds}
                      type="button"
                      onClick={() =>
                        setBedroomCount(beds === '4+' ? '4' : beds)
                      }
                      className={`py-1.5 text-xs font-semibold rounded-md border text-center transition-colors ${
                        (beds === '4+' && bedroomCount === '4') ||
                        bedroomCount === beds
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-white text-gray-700 border-gray-200'
                      }`}
                    >
                      {beds}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder="Area or city..."
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Budget (Min - Max)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="Min ₹"
                    className="w-full px-2 py-1.5 text-xs border rounded-lg"
                  />
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="Max ₹"
                    className="w-full px-2 py-1.5 text-xs border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                >
                  <option value="Available">Available</option>
                  <option value="Under Negotiation">Under Negotiation</option>
                  <option value="Sold">Sold</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 border rounded-lg text-xs font-bold text-gray-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-brand-500 text-white rounded-lg text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-50 min-h-screen py-16 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mx-auto mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 bg-white rounded-xl animate-pulse border border-gray-200" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}
