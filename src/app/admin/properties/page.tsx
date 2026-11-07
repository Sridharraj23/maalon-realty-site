'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  Building,
  RotateCcw,
} from 'lucide-react';
import { Property, PropertyCategory, PropertyStatus } from '@/lib/types';
import { formatIndianCurrency, formatArea } from '@/lib/utils';
import { PROPERTY_CATEGORIES } from '@/lib/constants';
import { getProperties, deleteProperty, updateProperty } from '@/lib/supabase-service';

export default function AdminPropertiesListPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      if (Array.isArray(data)) {
        setProperties(data);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}" (ID: ${id})?`)) {
      return;
    }

    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Error deleting property');
    }
  };

  const handleToggleStatus = async (prop: Property, newStatus: PropertyStatus) => {
    try {
      await updateProperty(prop.id, { status: newStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === prop.id ? { ...p, status: newStatus } : p))
      );
    } catch {
      alert('Failed to update status');
    }
  };

  const handleToggleFeatured = async (prop: Property) => {
    try {
      const nextFeatured = !prop.featured;
      await updateProperty(prop.id, { featured: nextFeatured });
      setProperties((prev) =>
        prev.map((p) => (p.id === prop.id ? { ...p, featured: nextFeatured } : p))
      );
    } catch {
      alert('Failed to toggle featured status');
    }
  };

  const filtered = properties.filter((p) => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(s) ||
        p.id.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Module 1: Inventory Control
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Property Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Add, update, or unpublish property records without editing any code.
          </p>
        </div>

        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 py-3 px-5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Property ID, Title, or Suburb..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            <option value="All">All Categories</option>
            {PROPERTY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Under Negotiation">Under Negotiation</option>
            <option value="Sold">Sold</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          {(search || categoryFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setStatusFilter('All');
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Reset search"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">
            Loading properties...
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Asking Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Property Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <Image
                            src={prop.primaryImage || prop.images[0]}
                            alt={prop.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1 max-w-xs">
                            {prop.title}
                          </div>
                          <span className="font-mono text-[10px] text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded font-semibold">
                            {prop.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Type */}
                    <td className="py-3 px-4 font-medium text-gray-800">
                      <div>{prop.category}</div>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${prop.listingType === 'Rent' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-50 text-brand-700'}`}>
                        {prop.listingType === 'Rent' ? 'Rent' : 'Sale'}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-gray-600 max-w-[160px] truncate">
                      {prop.location}
                    </td>

                    {/* Asking Price */}
                    <td className="py-3 px-4 font-bold text-gray-900 font-sans">
                      {formatIndianCurrency(prop.price, prop.listingType)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={prop.status}
                        onChange={(e) =>
                          handleToggleStatus(prop, e.target.value as PropertyStatus)
                        }
                        className={`text-[11px] font-bold py-1 px-2 rounded-md border focus:outline-none cursor-pointer ${
                          prop.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : prop.status === 'Sold'
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Under Negotiation">Under Negotiation</option>
                        <option value="Sold">Sold</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prop)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          prop.featured
                            ? 'bg-brand-500 text-white'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {prop.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/properties/${prop.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-gray-100 rounded-lg"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/properties/${prop.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit Property"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prop.id, prop.title)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Building className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-gray-800 mb-1">No Properties Found</h4>
            <p className="text-xs text-gray-500 mb-4">
              Try adjusting your search criteria or add a new property.
            </p>
            <Link
              href="/admin/properties/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Property</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
