'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { PropertyCategory, PropertyStatus } from '@/lib/types';
import { PROPERTY_CATEGORIES, TAMIL_NADU_LOCATIONS } from '@/lib/constants';
import { formatIndianCurrency, slugify } from '@/lib/utils';

export default function AddPropertyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: `MAG-${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    slug: '',
    listingType: 'Sale' as 'Sale' | 'Rent',
    category: 'Villas' as PropertyCategory,
    status: 'Available' as PropertyStatus,
    price: '',
    pricePerSqFt: '',
    area: '',
    areaUnit: 'sq.ft' as 'sq.ft' | 'grounds' | 'acres' | 'cents',
    city: 'Chennai',
    location: '',
    address: '',
    bedrooms: '3',
    bathrooms: '3',
    parking: '2 Covered Slots',
    facing: 'East Facing',
    furnishing: 'Semi-Furnished' as 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished',
    possession: 'Ready to Move',
    featured: false,
    verified: true,
    primaryImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    imagesText:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80\nhttps://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
    description: '',
    featuresText: '24x7 Security, Power Backup, Covered Car Parking, Landscaped Garden, Rainwater Harvesting',
    reraId: '',
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugify(`${val}-${prev.location || 'tamil-nadu'}`),
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: val,
      slug: slugify(`${prev.title || 'property'}-${val}`),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imagesArray = formData.imagesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const featuresArray = formData.featuresText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        price: Number(formData.price),
        pricePerSqFt: formData.pricePerSqFt ? Number(formData.pricePerSqFt) : undefined,
        area: Number(formData.area || 0),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        images: imagesArray.length > 0 ? imagesArray : [formData.primaryImage],
        features: featuresArray,
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        alert('Property created and published successfully!');
        router.push('/admin/properties');
        router.refresh();
      } else {
        alert(json.error || 'Failed to create property');
      }
    } catch {
      alert('Error creating property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Properties List</span>
        </Link>
        <div className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-md border border-brand-200">
          New ID: {formData.id}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-8"
      >
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Add New Property Listing
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Fill in the details below. Once submitted, the property will immediately be active in the catalog.
          </p>
        </div>

        {/* Basic Title & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Property Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. Palm Grove – Luxury Coastal Villa"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Transaction Type *
            </label>
            <select
              value={formData.listingType}
              onChange={(e) => setFormData({ ...formData, listingType: e.target.value as any })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold"
            >
              <option value="Sale">For Sale</option>
              <option value="Rent">For Rent / Lease</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {PROPERTY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Initial Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="Available">Available</option>
              <option value="Under Negotiation">Under Negotiation</option>
              <option value="Sold">Sold</option>
              <option value="Unavailable">Unavailable / Draft</option>
            </select>
          </div>
        </div>

        {/* Pricing & Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              {formData.listingType === 'Rent' ? 'Monthly Rent (INR) *' : 'Asking Price (INR) *'}
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder={formData.listingType === 'Rent' ? 'e.g. 25000' : 'e.g. 25000000'}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            {formData.price && (
              <p className="text-[11px] font-bold text-brand-600 mt-1">
                Display: {formatIndianCurrency(Number(formData.price), formData.listingType)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Price Per Sq.Ft (Optional)
            </label>
            <input
              type="number"
              value={formData.pricePerSqFt}
              onChange={(e) => setFormData({ ...formData, pricePerSqFt: e.target.value })}
              placeholder="e.g. 8500"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Total Area & Unit *
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="2400"
                className="w-2/3 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <select
                value={formData.areaUnit}
                onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value as any })}
                className="w-1/3 px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="sq.ft">sq.ft</option>
                <option value="grounds">grounds</option>
                <option value="acres">acres</option>
                <option value="cents">cents</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              City / Region *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Chennai, Coimbatore..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Location / Suburb *
            </label>
            <input
              type="text"
              list="admin-locations"
              required
              value={formData.location}
              onChange={handleLocationChange}
              placeholder="e.g. ECR, Akkarai, Chennai"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <datalist id="admin-locations">
              {TAMIL_NADU_LOCATIONS.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Detailed Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Door / Plot number, street name, pincode"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Bedrooms
            </label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              placeholder="3"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Bathrooms
            </label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              placeholder="3"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Facing
            </label>
            <input
              type="text"
              value={formData.facing}
              onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
              placeholder="East, North..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Furnishing
            </label>
            <select
              value={formData.furnishing}
              onChange={(e) => setFormData({ ...formData, furnishing: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Fully Furnished">Fully Furnished</option>
            </select>
          </div>
        </div>

        {/* Image URLs */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Primary Thumbnail Photograph URL *
          </label>
          <input
            type="url"
            required
            value={formData.primaryImage}
            onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Additional Gallery Image URLs (One URL per line)
          </label>
          <textarea
            rows={3}
            value={formData.imagesText}
            onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
            placeholder="https://...&#10;https://..."
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Description & Features */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed architectural summary, room distributions, ventilation, title history..."
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            Features & Amenities (Comma-separated)
          </label>
          <input
            type="text"
            value={formData.featuresText}
            onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
            placeholder="e.g. 100% Power Backup, Swimming Pool, Private Lift, DTCP Approved"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Toggles: Featured & Verified */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="accent-brand-500 w-4 h-4"
            />
            <span>Feature on Homepage Carousel</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.verified}
              onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
              className="accent-brand-500 w-4 h-4"
            />
            <span>Display "Verified Title" Badge</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <Link
            href="/admin/properties"
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Publishing Property...' : 'Save & Publish Property'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
