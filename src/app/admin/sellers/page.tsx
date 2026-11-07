'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileCheck2,
  Search,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Building,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { SellerEnquiry, SellerStatus } from '@/lib/types';
import { formatIndianCurrency, formatDate } from '@/lib/utils';
import { DEFAULT_FOUNDERS } from '@/lib/constants';
import { getSellerEnquiries } from '@/lib/supabase-service';

export default function AdminSellersPage() {
  const router = useRouter();
  const [sellers, setSellers] = useState<SellerEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSeller, setSelectedSeller] = useState<SellerEnquiry | null>(null);
  const [newNote, setNewNote] = useState('');

  const sellerStatuses: SellerStatus[] = [
    'New',
    'Reviewed',
    'Owner Contacted',
    'Verification In-Progress',
    'Approved',
    'Rejected',
  ];

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await getSellerEnquiries();
      setSellers(data);
    } catch (err) {
      console.error('Failed to load seller submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleStatusChange = async (id: string, status: SellerStatus) => {
    try {
      const res = await fetch(`/api/enquiries/sellers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setSellers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status } : s))
        );
        if (selectedSeller && selectedSeller.id === id) {
          setSelectedSeller((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch {
      alert('Failed to update seller status');
    }
  };

  const handleAssignChange = async (id: string, assignedTo: string) => {
    try {
      const res = await fetch(`/api/enquiries/sellers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo }),
      });
      const json = await res.json();
      if (json.success) {
        setSellers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, assignedTo } : s))
        );
        if (selectedSeller && selectedSeller.id === id) {
          setSelectedSeller((prev) => (prev ? { ...prev, assignedTo } : null));
        }
      }
    } catch {
      alert('Failed to assign partner');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeller || !newNote.trim()) return;

    try {
      const res = await fetch(`/api/enquiries/sellers/${selectedSeller.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addNote',
          noteText: newNote.trim(),
          author: selectedSeller.assignedTo || 'Partner',
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setSellers((prev) =>
          prev.map((s) => (s.id === selectedSeller.id ? json.data : s))
        );
        setSelectedSeller(json.data);
        setNewNote('');
      }
    } catch {
      alert('Failed to save note');
    }
  };

  // One-click convert seller submission to live property listing
  const handleConvertToProperty = async (seller: SellerEnquiry) => {
    if (
      !confirm(
        `Convert submission ${seller.id} by ${seller.name} into an official public property listing?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${seller.propertyType} in ${seller.location}`,
          category: seller.propertyType,
          listingType: seller.listingType || 'Sale',
          status: 'Available',
          price: seller.expectedPrice,
          area: seller.area,
          areaUnit: seller.areaUnit,
          location: seller.location,
          address: seller.fullAddress,
          bedrooms: seller.bedrooms,
          description: seller.description,
          primaryImage:
            seller.images && seller.images.length > 0
              ? seller.images[0]
              : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
          images: seller.images && seller.images.length > 0 ? seller.images : [],
          features: seller.documentAvailability || [],
          verified: true,
        }),
      });

      const json = await res.json();
      if (json.success) {
        // Mark seller submission as Approved and converted
        await handleStatusChange(seller.id, 'Approved');
        alert(`Successfully converted into Property listing ID: ${json.data.id}!`);
        router.push(`/admin/properties/${json.data.id}`);
      } else {
        alert(json.error || 'Failed to convert to property listing');
      }
    } catch {
      alert('Error converting submission');
    }
  };

  const filtered = sellers.filter((s) => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.phone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Module 3: Mandate Reviews
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Property Owner Submissions & Onboarding
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review submitted property titles, assign partners for revenue scrutiny, and convert authorized mandates into live listings.
          </p>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 py-2 px-4 rounded-xl border border-gray-200">
          Total Mandates: <span className="font-bold text-gray-900">{sellers.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Submission ID, Owner Name, Phone, or Location..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium w-full md:w-auto"
        >
          <option value="All">All Submission Statuses</option>
          {sellerStatuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Layout: Table + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${selectedSeller ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-gray-400">
                Loading seller submissions...
              </div>
            ) : filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-[10px] font-bold">
                      <th className="py-3 px-4">Mandate ID / Owner</th>
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Expected Price</th>
                      <th className="py-3 px-4">Review Status</th>
                      <th className="py-3 px-4">Partner Lead</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                          selectedSeller?.id === s.id ? 'bg-brand-50/50' : ''
                        }`}
                        onClick={() => setSelectedSeller(s)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{s.name}</span>
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                s.posterType === 'Dealer'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {s.posterType || 'Owner'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5 font-mono">
                            <span className="text-purple-700 font-semibold">{s.id}</span>
                            <span>•</span>
                            <span>{formatDate(s.createdAt)}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-800">{s.propertyType}</span>
                          <p className="text-[11px] text-gray-500 truncate max-w-[140px]">
                            {s.location}
                          </p>
                        </td>

                        <td className="py-3 px-4 font-bold text-gray-900 font-sans">
                          {formatIndianCurrency(s.expectedPrice)}
                        </td>

                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={s.status}
                            onChange={(e) =>
                              handleStatusChange(s.id, e.target.value as SellerStatus)
                            }
                            className="text-[11px] font-bold py-1 px-2 rounded-md border border-gray-200 bg-white focus:outline-none"
                          >
                            {sellerStatuses.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={s.assignedTo || ''}
                            onChange={(e) => handleAssignChange(s.id, e.target.value)}
                            className="text-[11px] py-1 px-2 rounded-md border border-gray-200 bg-white focus:outline-none"
                          >
                            <option value="">Unassigned</option>
                            {DEFAULT_FOUNDERS.map((f) => (
                              <option key={f.id} value={f.name}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleConvertToProperty(s)}
                            className="px-2.5 py-1 rounded bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white text-[10px] font-bold uppercase transition-colors"
                            title="Convert to Public Listing"
                          >
                            Convert
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-gray-400">
                No seller submissions matching filter.
              </div>
            )}
          </div>
        </div>

        {/* Selected Seller Details Panel */}
        {selectedSeller && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="font-mono text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                    {selectedSeller.id}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-gray-900 mt-1">
                    {selectedSeller.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Direct Actions */}
              <div className="space-y-2 text-xs">
                <a
                  href={`tel:${selectedSeller.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>Call: {selectedSeller.phone} ({selectedSeller.preferredContact})</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleConvertToProperty(selectedSeller)}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold uppercase text-[11px] shadow-sm transition-all"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Convert to Public Property Listing</span>
                </button>
              </div>

              {/* Details Box */}
              <div className="p-4 rounded-xl bg-gray-50 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted By:</span>
                  <span className="font-bold text-gray-900">
                    {selectedSeller.posterType === 'Dealer' ? 'Real Estate Dealer' : 'Property Owner'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Listing Intent:</span>
                  <span className="font-bold text-brand-700">
                    {selectedSeller.listingType === 'Rent' ? 'For Rent / Lease' : 'For Sale'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Property Type:</span>
                  <span className="font-bold text-gray-900">{selectedSeller.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-bold text-gray-900">{selectedSeller.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Area:</span>
                  <span className="font-medium text-gray-900">
                    {selectedSeller.area} {selectedSeller.areaUnit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expected Valuation:</span>
                  <span className="font-bold text-gray-900">
                    {formatIndianCurrency(selectedSeller.expectedPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ownership:</span>
                  <span className="font-medium text-gray-900">{selectedSeller.ownershipStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timeline:</span>
                  <span className="font-medium text-gray-900">{selectedSeller.timeline}</span>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-500 block mb-1">Full Address:</span>
                  <p className="text-gray-800">{selectedSeller.fullAddress}</p>
                </div>

                {selectedSeller.documentAvailability && selectedSeller.documentAvailability.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-500 block mb-1">Available Documents:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedSeller.documentAvailability.map((d, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-white text-[10px] text-brand-800 border">
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notes History */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
                  Partner Due Diligence Notes
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto mb-3">
                  {selectedSeller.internalNotes && selectedSeller.internalNotes.length > 0 ? (
                    selectedSeller.internalNotes.map((note) => (
                      <div key={note.id} className="p-2.5 rounded-lg bg-gray-50 text-[11px] space-y-1">
                        <p className="text-gray-800">{note.text}</p>
                        <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                          <span>By: {note.author}</span>
                          <span>{formatDate(note.timestamp)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">No notes logged yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log verification progress..."
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                    title="Save Note"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
