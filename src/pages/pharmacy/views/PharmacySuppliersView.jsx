import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Power,
  Pill,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function PharmacySuppliersView({
  suppliers = [],
  onOpenAddSupplier,
  onOpenEditSupplier,
  onToggleSupplierStatus
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-brand-teal-700">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-brand-navy-900">Pharmaceutical Supplier Network</h1>
              <p className="text-xs text-brand-slate-500">
                Authorized drug distributors, purchase contacts, and supplied inventory lines
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAddSupplier}
          className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-700 hover:bg-brand-teal-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Supplier</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search supplier name, ID, contact person, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 bg-brand-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 bg-brand-slate-50/50 text-brand-slate-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {(searchQuery || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
              }}
              className="text-xs text-brand-teal-700 font-bold hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-2xl border border-brand-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-brand-slate-50/80 border-b border-brand-slate-200 text-brand-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Supplier Name & ID</th>
                <th className="py-3.5 px-3">Contact Person</th>
                <th className="py-3.5 px-3">Phone & Email</th>
                <th className="py-3.5 px-3">Address</th>
                <th className="py-3.5 px-3">Medicines Supplied</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-slate-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-brand-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-brand-slate-400" />
                    <p className="font-bold text-sm text-brand-navy-900">No suppliers found</p>
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-brand-slate-50/60 transition-colors group">
                    {/* Supplier Name & ID */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-brand-navy-900 text-xs">{supplier.name}</div>
                      <span className="font-mono text-[10px] text-brand-slate-500 font-semibold bg-brand-slate-100 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        {supplier.id}
                      </span>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3 px-3 font-semibold text-brand-navy-900">
                      {supplier.contactPerson}
                    </td>

                    {/* Phone & Email */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-brand-slate-700">
                        <Phone className="w-3 h-3 text-brand-teal-700" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-brand-slate-500 text-[10px] mt-0.5">
                        <Mail className="w-3 h-3 text-brand-slate-400" />
                        <span>{supplier.email}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-3 text-brand-slate-600 text-[11px] max-w-[200px] line-clamp-2" title={supplier.address}>
                      {supplier.address}
                    </td>

                    {/* Medicines Supplied */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(supplier.medicinesSupplied || []).map((med, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-brand-teal-50 text-brand-teal-800 text-[10px] font-medium border border-brand-teal-100"
                          >
                            {med}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={supplier.status} size="xs" />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenEditSupplier(supplier)}
                          title="Edit Supplier"
                          className="p-1.5 text-brand-slate-500 hover:text-brand-navy-900 hover:bg-brand-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleSupplierStatus(supplier.id)}
                          title={supplier.status === 'Active' ? 'Deactivate Supplier' : 'Activate Supplier'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            supplier.status === 'Active'
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
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
    </div>
  );
}
