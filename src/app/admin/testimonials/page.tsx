'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  PlusCircle,
  Save,
  Video,
} from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { getTestimonials } from '@/lib/supabase-service';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');

  // New Direct Testimonial Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    email: '',
    phone: '',
    transactionType: 'Buyer' as any,
    propertyLocation: '',
    rating: 5,
    content: '',
    photoUrl: '',
    videoUrl: '',
    approved: true,
    featured: false,
  });

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials(false);
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleToggleApproval = async (test: Testimonial) => {
    try {
      const nextApproved = !test.approved;
      const res = await fetch(`/api/testimonials/${test.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: nextApproved }),
      });
      const json = await res.json();
      if (json.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === test.id ? { ...t, approved: nextApproved } : t))
        );
      }
    } catch {
      alert('Failed to update approval status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch {
      alert('Failed to delete testimonial');
    }
  };

  const handleCreateDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial),
      });
      const json = await res.json();
      if (json.success) {
        // Automatically approve if added by admin directly
        await fetch(`/api/testimonials/${json.data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved: true, featured: newTestimonial.featured }),
        });
        setShowAddModal(false);
        fetchTestimonials();
      }
    } catch {
      alert('Failed to create testimonial');
    }
  };

  const pendingList = testimonials.filter((t) => !t.approved);
  const approvedList = testimonials.filter((t) => t.approved);
  const currentList = tab === 'pending' ? pendingList : approvedList;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Module 4: Quality & Validation
          </span>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Testimonial Moderation & Approvals
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review client reviews before publication to ensure authenticity and truthfulness.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Verified Review</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
            tab === 'pending'
              ? 'bg-amber-50 text-amber-800 border border-amber-300'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Pending Review ({pendingList.length})
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
            tab === 'approved'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          Published Publicly ({approvedList.length})
        </button>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 p-12 text-center text-xs text-gray-400">
            Loading testimonials...
          </div>
        ) : currentList.length > 0 ? (
          currentList.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {t.transactionType}
                  </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed italic mb-4">
                  "{t.content}"
                </p>

                {t.videoUrl && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold mb-3">
                    <Video className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">Video: {t.videoUrl}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{t.name}</h4>
                    <p className="text-[10px] text-gray-400">{t.propertyLocation}</p>
                  </div>
                  <span className="text-[10px] text-gray-400">{formatDate(t.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => handleToggleApproval(t)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold uppercase transition-colors ${
                      t.approved
                        ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {t.approved ? 'Unpublish' : 'Approve & Publish'}
                  </button>

                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white p-12 rounded-2xl border border-gray-200 text-center text-xs text-gray-400">
            No testimonials under {tab} status.
          </div>
        )}
      </div>

      {/* Add Direct Testimonial Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">
              Add Verified Testimonial
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Enter customer experience obtained with direct written consent.
            </p>

            <form onSubmit={handleCreateDirect} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  placeholder="e.g. S. Jayaram"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={newTestimonial.transactionType}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, transactionType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                    <option value="Investor">Investor</option>
                    <option value="Commercial Client">Commercial Client</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.propertyLocation}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, propertyLocation: e.target.value })}
                    placeholder="e.g. ECR, Chennai"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewTestimonial({ ...newTestimonial, rating: s })}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= newTestimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Written Testimonial *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                  placeholder="Review statement..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={newTestimonial.photoUrl}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, photoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  Video URL (YouTube/Vimeo, Optional)
                </label>
                <input
                  type="url"
                  value={newTestimonial.videoUrl}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md"
              >
                Publish Directly
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
