import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Barcode,
  Download,
  FileSpreadsheet,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  Building2,
  Eye,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function NovusPatientsView({
  orders = [],
  onOpenOrderDetails,
  onOpenNewOrder,
  onOpenBarcodeLabel,
  onOpenRegisterPatient
}) {
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [ageGroupFilter, setAgeGroupFilter] = useState('ALL');

  // Derive unique patients list
  const patientsList = useMemo(() => {
    const map = new Map();

    orders.forEach((order, idx) => {
      const pid = order.patient?.patientId || `PT-${1001 + idx}`;
      if (!map.has(pid)) {
        map.set(pid, {
          id: pid,
          patientId: pid,
          name: order.patient?.name || `Patient ${idx + 1}`,
          age: order.patient?.age || 35,
          gender: order.patient?.gender || 'Female',
          phone: order.patient?.phone || '+91 98450 12345',
          email: order.patient?.email || 'patient@mediunify.com',
          regNo: order.patient?.patientId?.replace('PT-', '261000') || `261000${21 - idx}`,
          labNo: order.orderId?.replace('LAB-', '139') || `139${15 - idx}`,
          venue: 'MEDIUNIFY DIAGNOSTIC LABS',
          referredBy: order.patient?.referredBy || 'Dr. Priyadarshini (FAME)',
          refCenter: order.patient?.refCenter || 'Farookh Medical College & RI (FAME)',
          lastOrderDate: order.createdAt || '01-10-2026',
          lastTest: order.testOrPackage?.name || 'Comprehensive Health Checkup',
          orderRef: order
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patientsList.filter((p) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesPhone = String(p.phone).includes(query);
        const matchesReg = String(p.regNo).toLowerCase().includes(query);
        const matchesLab = String(p.labNo).toLowerCase().includes(query);
        const matchesEmail = p.email.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesReg && !matchesLab && !matchesEmail) return false;
      }
      if (genderFilter !== 'ALL' && p.gender !== genderFilter) {
        return false;
      }
      if (ageGroupFilter === 'PEDIATRIC' && p.age >= 18) return false;
      if (ageGroupFilter === 'SENIOR' && p.age < 60) return false;
      if (ageGroupFilter === 'ADULT' && (p.age < 18 || p.age >= 60)) return false;
      return true;
    });
  }, [patientsList, searchQuery, genderFilter, ageGroupFilter]);

  const handleExportCSV = () => {
    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Phone', 'Email', 'Reg No', 'Lab No', 'Venue', 'Ref Center'];
    const rows = filteredPatients.map((p) => [
      p.patientId,
      `"${p.name}"`,
      p.age,
      p.gender,
      p.phone,
      p.email,
      p.regNo,
      p.labNo,
      `"${p.venue}"`,
      `"${p.refCenter}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MediUnify_Patients_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Patients roster exported to CSV', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header & Actions Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
              Master Registry
            </span>
            <span className="text-xs text-slate-500 font-medium">
              MediUnify LIS Central Database
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Registered Patients & Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage demographics, issue thermal vacutainer barcodes, and book investigation orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200/60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {onOpenNewOrder && (
            <button
              onClick={onOpenNewOrder}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>New Order</span>
            </button>
          )}

          {onOpenRegisterPatient && (
            <button
              onClick={onOpenRegisterPatient}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-600/20 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Demographic Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{patientsList.length}</div>
          <div className="text-[11px] text-teal-600 font-bold mt-1">Unique MRNs registered</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Female Patients</div>
          <div className="text-2xl font-black text-pink-600 mt-1">
            {patientsList.filter((p) => p.gender === 'Female').length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Obstetrics & general lab cases</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Male Patients</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {patientsList.filter((p) => p.gender === 'Male').length}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Cardio-metabolic profiles</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Senior Citizens (60+)</div>
          <div className="text-2xl font-black text-purple-600 mt-1">
            {patientsList.filter((p) => p.age >= 60).length}
          </div>
          <div className="text-[11px] text-purple-700 font-bold mt-1">Priority phlebotomy queue</div>
        </div>

      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Patient Name, Mobile (+91), Reg No (261000xx), Lab No, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
          {/* Gender Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            {['ALL', 'Female', 'Male'].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  genderFilter === g
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g === 'ALL' ? 'All Genders' : g}
              </button>
            ))}
          </div>

          {/* Age Group Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
            {[
              { id: 'ALL', label: 'All Ages' },
              { id: 'SENIOR', label: 'Senior (60+)' },
              { id: 'ADULT', label: 'Adults (18-59)' },
              { id: 'PEDIATRIC', label: 'Pediatric (<18)' }
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => setAgeGroupFilter(a.id)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  ageGroupFilter === a.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Patients Registry Modern Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-200 select-none">
                <th className="py-3 px-4 min-w-[220px]">Patient Profile & Name</th>
                <th className="py-3 px-3.5 min-w-[140px]">Registration / Lab #</th>
                <th className="py-3 px-3.5 min-w-[150px]">Contact Phone & Email</th>
                <th className="py-3 px-3.5 min-w-[160px]">Referring Doctor / Venue</th>
                <th className="py-3 px-3.5 min-w-[180px]">Latest Investigation</th>
                <th className="py-3 px-4 text-right min-w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-700 text-sm">No patients match the search</div>
                    <div className="text-xs text-slate-400 mt-0.5">Try clearing filters or register a new patient.</div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  return (
                    <tr key={patient.id} className="hover:bg-teal-50/40 transition-colors">
                      
                      {/* Name + Age/Gender */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                              patient.gender === 'Female'
                                ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {patient.name.replace(/^(Mrs\.|Mr\.|Dr\.|Ms\.)\s*/, '').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div
                              onClick={() => patient.orderRef && onOpenOrderDetails(patient.orderRef)}
                              className="font-bold text-slate-900 hover:text-teal-600 cursor-pointer text-[13px]"
                            >
                              {patient.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold">{patient.age} yrs</span>
                              <span>•</span>
                              <span className={patient.gender === 'Female' ? 'text-pink-600 font-bold' : 'text-blue-600 font-bold'}>
                                {patient.gender}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Reg No / Lab No */}
                      <td className="py-3.5 px-3.5 font-mono text-slate-800">
                        <div className="font-bold text-slate-900">{patient.regNo}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Lab #{patient.labNo}</div>
                      </td>

                      {/* Contact Phone & Email */}
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[130px]">{patient.email}</span>
                        </div>
                      </td>

                      {/* Referring Doctor & Venue */}
                      <td className="py-3.5 px-3.5">
                        <div className="font-semibold text-slate-800 text-[11px]">
                          {patient.referredBy}
                        </div>
                        <div className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block mt-0.5">
                          {patient.venue}
                        </div>
                      </td>

                      {/* Latest Investigation */}
                      <td className="py-3.5 px-3.5">
                        <div className="font-semibold text-slate-800 leading-snug">
                          {patient.lastTest}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Ordered on {patient.lastOrderDate}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenBarcodeLabel(patient)}
                            className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs transition-colors border border-teal-200 flex items-center gap-1 shadow-2xs"
                            title="Generate Vacutainer Barcode Label"
                          >
                            <Barcode className="w-3.5 h-3.5 text-teal-700" />
                            <span>Barcode</span>
                          </button>

                          {patient.orderRef && (
                            <button
                              onClick={() => onOpenOrderDetails(patient.orderRef)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors shadow-2xs"
                              title="View Order Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong>{filteredPatients.length}</strong> of <strong>{patientsList.length}</strong> registered patients
          </div>
          <div className="font-medium text-slate-700">
            NABL ISO:15189 Patient Privacy Compliant
          </div>
        </div>

      </div>

    </div>
  );
}
