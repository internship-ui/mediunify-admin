import React, { useState, useMemo } from 'react';
import {
  Star,
  Search,
  Eye,
  EyeOff,
  RotateCcw,
  Building2,
  Filter,
  CheckCircle2
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import Modal from '../../../components/common/Modal';

export default function ReviewsView({
  reviews = [],
  centres = [],
  onToggleReviewVisibility
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [centreFilter, setCentreFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [viewingReview, setViewingReview] = useState(null);

  // Summary Metrics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews).toFixed(1)
    : '4.8';

  const breakdown = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length
  };

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Rating filter
      if (ratingFilter !== 'ALL' && r.rating !== Number(ratingFilter)) {
        return false;
      }

      // Centre filter
      if (centreFilter !== 'ALL' && r.centreId !== centreFilter && r.centre !== centreFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && r.status !== statusFilter) {
        return false;
      }

      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          r.patient.toLowerCase().includes(q) ||
          r.centre.toLowerCase().includes(q) ||
          r.review.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [reviews, ratingFilter, centreFilter, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy-900 flex items-center gap-2.5">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          Reviews & Ratings
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate-500 mt-0.5">
          Monitor patient experience feedback and manage moderation status
        </p>
      </div>

      {/* Rating Breakdown Dashboard Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Overall Score Card */}
        <div className="bg-white rounded-2xl border border-brand-slate-200 p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-4xl sm:text-5xl font-black text-brand-navy-900">{avgRating}</span>
          <div className="flex items-center gap-1 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <p className="text-xs text-brand-slate-500 font-medium">
            Based on {totalReviews} patient evaluations across all centres
          </p>
        </div>

        {/* Right: Star Breakdown Distribution Bars */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-slate-200 p-5 shadow-sm space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-brand-slate-500 mb-2">
            Rating Distribution
          </h2>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = breakdown[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-12 font-bold text-brand-navy-900">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                </div>

                <div className="flex-1 bg-brand-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="w-16 text-right text-brand-slate-500 text-[11px]">
                  <strong>{count}</strong> ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search patient, review content or centre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white text-brand-slate-700 font-medium"
          >
            <option value="ALL">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 bg-white text-brand-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-slate-700">
            <thead className="bg-brand-slate-50 text-[11px] font-bold uppercase tracking-wider text-brand-slate-500 border-b border-brand-slate-200">
              <tr>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Centre</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Patient Review</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100 font-medium">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-slate-400">
                    <Star className="w-8 h-8 mx-auto mb-2 text-brand-slate-300" />
                    <p className="font-semibold">No reviews matching criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-brand-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-navy-900 whitespace-nowrap">
                      {rev.patient}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-brand-slate-700 max-w-[150px] truncate">
                      {rev.centre}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm text-brand-slate-600">
                      <p className="line-clamp-2 italic">"{rev.review}"</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-brand-slate-500">
                      {rev.date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={rev.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setViewingReview(rev)}
                          className="p-1.5 rounded-lg text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 transition-colors"
                          title="View Review"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleReviewVisibility(rev.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            rev.status === 'Published'
                              ? 'text-brand-slate-400 hover:text-brand-coral-600 hover:bg-brand-coral-50'
                              : 'text-brand-green-600 hover:bg-brand-green-50'
                          }`}
                          title={rev.status === 'Published' ? 'Hide Review' : 'Restore Review'}
                        >
                          {rev.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Review Modal */}
      {viewingReview && (
        <Modal
          isOpen={true}
          onClose={() => setViewingReview(null)}
          title={`Review Details • ${viewingReview.id}`}
          subtitle={`By ${viewingReview.patient} on ${viewingReview.date}`}
          maxWidth="max-w-md"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setViewingReview(null)}
                className="px-4 py-2 text-xs font-bold text-brand-slate-700 bg-brand-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onToggleReviewVisibility(viewingReview.id);
                  setViewingReview({
                    ...viewingReview,
                    status: viewingReview.status === 'Published' ? 'Hidden' : 'Published'
                  });
                }}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl text-white ${
                  viewingReview.status === 'Published' ? 'bg-brand-coral-600' : 'bg-brand-green-600'
                }`}
              >
                {viewingReview.status === 'Published' ? 'Hide from Public' : 'Restore to Public'}
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs text-brand-slate-700">
            <div className="flex items-center justify-between p-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200">
              <div>
                <p className="font-bold text-brand-navy-900">{viewingReview.patient}</p>
                <p className="text-[11px] text-brand-slate-400">{viewingReview.centre}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: viewingReview.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-brand-slate-200 bg-white">
              <p className="italic leading-relaxed text-brand-slate-800">"{viewingReview.review}"</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-brand-slate-500">
              <span>Date: {viewingReview.date}</span>
              <StatusBadge status={viewingReview.status} size="xs" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
