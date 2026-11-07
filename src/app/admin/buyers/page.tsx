'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Clock,
  Send,
  Building,
} from 'lucide-react';
import { BuyerEnquiry, LeadStatus, Property } from '@/lib/types';
import { formatIndianCurrency, formatDate } from '@/lib/utils';
import { DEFAULT_FOUNDERS } from '@/lib/constants';
import { getBuyerEnquiries, getProperties } from '@/lib/supabase-service';

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<BuyerEnquiry[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerEnquiry | null>(null);
  const [newNote, setNewNote] = useState('');

  const leadStatuses: LeadStatus[] = [
    'New',
    'Contacted',
    'Qualified',
    'Property Matched',
    'Site Visit Scheduled',
    'Negotiation',
    'Converted',
    'Lost',
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bData, pData] = await Promise.all([
        getBuyerEnquiries(),
        getProperties(),
      ]);
      setBuyers(bData);
      setProperties(pData);
    } catch (err) {
      console.error('Failed to load buyer leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/enquiries/buyers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setBuyers((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b))
        );
        if (selectedBuyer && selectedBuyer.id === id) {
          setSelectedBuyer((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const handleAssignChange = async (id: string, assignedTo: string) => {
    try {
      const res = await fetch(`/api/enquiries/buyers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo }),
      });
      const json = await res.json();
      if (json.success) {
        setBuyers((prev) =>
          prev.map((b) => (b.id === id ? { ...b, assignedTo } : b))
        );
        if (selectedBuyer && selectedBuyer.id === id) {
          setSelectedBuyer((prev) => (prev ? { ...prev, assignedTo } : null));
        }
      }
    } catch {
      alert('Failed to assign partner');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuyer || !newNote.trim()) return;

    try {
      const res = await fetch(`/api/enquiries/buyers/${selectedBuyer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addNote',
          noteText: newNote.trim(),
          author: selectedBuyer.assignedTo || 'Partner',
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBuyers((prev) =>
          prev.map((b) => (b.id === selectedBuyer.id ? json.data : b))
        );
        setSelectedBuyer(json.data);
        setNewNote('');
      }
    } catch {
      alert('Failed to save note');
    }
  };

  // Find properties matching buyer's budget and category
  const matchingProperties = selectedBuyer
    ? properties.filter(
        (p) =>
          (!selectedBuyer.category || p.category === selectedBuyer.category) &&
          (selectedBuyer.maxBudget === 0 || p.price <= selectedBuyer.maxBudget * 1.15)
      )
    : [];

  const filtered = buyers.filter((b) => {
    if (statusFilter !== 'All' && b.status !== statusFilter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(s) ||
        b.id.toLowerCase().includes(s) ||
        b.phone.includes(s) ||
        b.preferredLocation.toLowerCase().includes(s)
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
            Module 2: Lead CRM
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Buyer Enquiries & Requirement Matching
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track prospective homebuyers, log advisory notes, and match preferences against active inventory.
          </p>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 py-2 px-4 rounded-xl border border-gray-200">
          Total Leads: <span className="font-bold text-gray-900">{buyers.length}</span>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Lead ID, Buyer Name, Phone, or Location..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium w-full md:w-auto"
        >
          <option value="All">All Lead Statuses</option>
          {leadStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Layout: Table on left / Buyer Detail Drawer on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className={`${selectedBuyer ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-gray-400">
                Loading buyer enquiries...
              </div>
            ) : filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 uppercase tracking-wider text-[10px] font-bold">
                      <th className="py-3 px-4">Lead ID / Buyer</th>
                      <th className="py-3 px-4">Requirement</th>
                      <th className="py-3 px-4">Budget Range</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Assigned To</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {filtered.map((b) => (
                      <tr
                        key={b.id}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                          selectedBuyer?.id === b.id ? 'bg-brand-50/50' : ''
                        }`}
                        onClick={() => setSelectedBuyer(b)}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{b.name}</div>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5 font-mono">
                            <span className="text-brand-600 font-semibold">{b.id}</span>
                            <span>•</span>
                            <span>{formatDate(b.createdAt)}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-800">{b.category}</span>
                          <p className="text-[11px] text-gray-500 truncate max-w-[140px]">
                            {b.preferredLocation}
                          </p>
                        </td>

                        <td className="py-3 px-4 font-bold text-gray-900 font-sans">
                          {b.maxBudget > 0 ? formatIndianCurrency(b.maxBudget) : 'Flexible'}
                        </td>

                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleStatusChange(b.id, e.target.value as LeadStatus)
                            }
                            className="text-[11px] font-bold py-1 px-2 rounded-md border border-gray-200 bg-white focus:outline-none"
                          >
                            {leadStatuses.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={b.assignedTo || ''}
                            onChange={(e) => handleAssignChange(b.id, e.target.value)}
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

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedBuyer(b)}
                            className="px-2.5 py-1 rounded bg-brand-50 text-brand-700 text-[11px] font-bold uppercase hover:bg-brand-500 hover:text-white transition-colors"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-gray-400">
                No buyer enquiries matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Selected Buyer Detail Panel */}
        {selectedBuyer && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="font-mono text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {selectedBuyer.id}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-gray-900 mt-1">
                    {selectedBuyer.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBuyer(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Contact Actions */}
              <div className="space-y-2 text-xs">
                <a
                  href={`tel:${selectedBuyer.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>Call: {selectedBuyer.phone}</span>
                </a>

                {selectedBuyer.email && (
                  <a
                    href={`mailto:${selectedBuyer.email}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800"
                  >
                    <Mail className="w-3.5 h-3.5 text-brand-600" />
                    <span>Email: {selectedBuyer.email}</span>
                  </a>
                )}
              </div>

              {/* Requirement Summary */}
              <div className="p-4 rounded-xl bg-gray-50 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-bold text-gray-900">{selectedBuyer.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Preferred Location:</span>
                  <span className="font-bold text-gray-900">{selectedBuyer.preferredLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max Budget:</span>
                  <span className="font-bold text-gray-900">
                    {formatIndianCurrency(selectedBuyer.maxBudget)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Purpose:</span>
                  <span className="font-medium text-gray-900">{selectedBuyer.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timeline:</span>
                  <span className="font-medium text-gray-900">{selectedBuyer.timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Funding:</span>
                  <span className="font-medium text-gray-900">{selectedBuyer.fundingPreference}</span>
                </div>
                {selectedBuyer.preferences && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-500 block mb-1">Preferences:</span>
                    <p className="text-gray-800 italic">"{selectedBuyer.preferences}"</p>
                  </div>
                )}
              </div>

              {/* INVENTORY MATCHER */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Matching Inventory ({matchingProperties.length})</span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {matchingProperties.length > 0 ? (
                    matchingProperties.map((mp) => (
                      <Link
                        key={mp.id}
                        href={`/properties/${mp.slug}`}
                        target="_blank"
                        className="block p-2 rounded-lg border border-gray-200 hover:border-brand-500 hover:bg-brand-50/50 text-[11px] transition-colors"
                      >
                        <div className="font-bold text-gray-900 line-clamp-1">{mp.title}</div>
                        <div className="flex justify-between text-gray-500 mt-0.5">
                          <span>{mp.location}</span>
                          <span className="font-semibold text-brand-600">
                            {formatIndianCurrency(mp.price)}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">
                      No current public listings match this exact budget.
                    </p>
                  )}
                </div>
              </div>

              {/* Internal Notes Log */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">
                  Internal Notes History
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto mb-3">
                  {selectedBuyer.internalNotes && selectedBuyer.internalNotes.length > 0 ? (
                    selectedBuyer.internalNotes.map((note) => (
                      <div key={note.id} className="p-2.5 rounded-lg bg-gray-50 text-[11px] space-y-1">
                        <p className="text-gray-800">{note.text}</p>
                        <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                          <span>By: {note.author}</span>
                          <span>{formatDate(note.timestamp)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">No notes added yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add consultation note..."
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
