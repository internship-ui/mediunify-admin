import React, { useState } from 'react';
import {
  Award,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Star,
  Building2,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';

export default function FeaturedCentresView({
  centres = [],
  onMoveFeaturedOrder,
  onAddFeaturedCentre,
  onRemoveFeaturedCentre
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Featured centres sorted by featuredOrder
  const featuredCentres = centres
    .filter((c) => c.isFeatured)
    .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99));

  // Non-featured verified centres available to add
  const availableToAdd = centres.filter((c) => !c.isFeatured && c.verificationStatus === 'Verified' && c.status === 'Active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            Featured Centres
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
            Control the highlighted Ayurveda institutions displayed on the top carousel of the MediUnify Patient App
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={availableToAdd.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm self-start sm:self-auto disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Featured</span>
        </button>
      </div>

      {/* Reorder Info Card */}
      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Patient App Display Priority</p>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            Position #1 appears as the primary banner on the patient homepage. Use the <strong>Move Up</strong> and <strong>Move Down</strong> buttons to calibrate exact promotional ranking.
          </p>
        </div>
      </div>

      {/* Featured List Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-brand-slate-100 flex items-center justify-between text-xs text-brand-slate-500">
          <span>Active Featured Centres: <strong className="text-brand-navy-900">{featuredCentres.length}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4 w-20 text-center">Rank</th>
                <th className="py-3 px-4">Centre</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Featured Status</th>
                <th className="py-3 px-4 text-center">Order Controls</th>
                <th className="py-3 px-4 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {featuredCentres.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-slate-400">
                    <Award className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No featured centres currently selected.</p>
                  </td>
                </tr>
              ) : (
                featuredCentres.map((ctr, idx) => (
                  <tr key={ctr.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs inline-flex items-center justify-center border border-amber-200">
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ctr.logo || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&auto=format&fit=crop&q=80'}
                          alt={ctr.name}
                          className="w-10 h-10 rounded-xl object-cover border border-brand-slate-200 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-brand-navy-900 text-xs sm:text-sm">{ctr.name}</p>
                          <p className="text-[11px] text-brand-slate-400 truncate max-w-xs">{ctr.tagline || ctr.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-brand-navy-900">{ctr.city}</div>
                      <div className="text-[11px] text-brand-slate-400">{ctr.state}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-brand-navy-900">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{ctr.rating}</span>
                        <span className="text-[10px] text-brand-slate-400">({ctr.reviewsCount})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" />
                        Live in App
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onMoveFeaturedOrder(ctr.id, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg border border-brand-slate-200 bg-white text-brand-slate-600 hover:bg-brand-slate-100 disabled:opacity-30 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMoveFeaturedOrder(ctr.id, 'down')}
                          disabled={idx === featuredCentres.length - 1}
                          className="p-1.5 rounded-lg border border-brand-slate-200 bg-white text-brand-slate-600 hover:bg-brand-slate-100 disabled:opacity-30 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => onRemoveFeaturedCentre(ctr.id)}
                        className="p-1.5 rounded-lg text-brand-slate-400 hover:text-brand-coral-600 hover:bg-brand-coral-50 transition-colors"
                        title="Remove from Featured"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Featured Modal Picker */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Centre to Featured Showcase"
        subtitle="Select an active verified Ayurveda centre to promote in the patient application"
        maxWidth="max-w-md"
        footer={
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-brand-slate-700 hover:bg-brand-slate-100 rounded-xl"
          >
            Cancel
          </button>
        }
      >
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {availableToAdd.length === 0 ? (
            <p className="text-xs text-brand-slate-400 py-6 text-center">All verified active centres are already featured.</p>
          ) : (
            availableToAdd.map((ctr) => (
              <div
                key={ctr.id}
                className="p-3 rounded-xl border border-brand-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-brand-navy-900">{ctr.name}</h4>
                  <p className="text-[11px] text-brand-slate-400">{ctr.city}, {ctr.state} • ★ {ctr.rating}</p>
                </div>
                <button
                  onClick={() => {
                    onAddFeaturedCentre(ctr.id);
                    setIsAddModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg font-bold text-xs text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs"
                >
                  Feature
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
