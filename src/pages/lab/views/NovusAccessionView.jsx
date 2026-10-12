import React, { useState, useMemo } from 'react';
import {
  Pipette,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Barcode,
  Truck,
  Building2,
  Calendar,
  XCircle,
  Filter,
  CheckCheck,
  TestTube2,
  Eye,
  Plus,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function NovusAccessionView({
  samples = [],
  orders = [],
  onCollectSample,
  onReceiveSample,
  onAcceptSample,
  onRejectSample,
  onBatchCollect,
  onBatchReceive,
  onBatchAccept
}) {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('PENDING'); // PENDING | COLLECTED | RECEIVED | IN LAB / PROCESSING | ACCEPTED | REJECTED
  const [barcodeSearch, setBarcodeSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [sampleTypeFilter, setSampleTypeFilter] = useState('ALL');
  const [selectedSampleIds, setSelectedSampleIds] = useState([]);

  // Filter logic
  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      // Tab matching
      if (activeTab === 'PENDING' && sample.sampleStatus !== 'PENDING') return false;
      if (activeTab === 'COLLECTED' && sample.sampleStatus !== 'COLLECTED') return false;
      if (activeTab === 'RECEIVED' && sample.sampleStatus !== 'RECEIVED') return false;
      if (activeTab === 'IN LAB / PROCESSING' && sample.sampleStatus !== 'IN LAB / PROCESSING') return false;
      if (activeTab === 'ACCEPTED' && !['ACCEPTED', 'COMPLETED'].includes(sample.sampleStatus)) return false;
      if (activeTab === 'REJECTED' && sample.sampleStatus !== 'REJECTED') return false;

      // Text search
      if (barcodeSearch.trim()) {
        const query = barcodeSearch.toLowerCase();
        const matchesSampleId = sample.sampleId.toLowerCase().includes(query);
        const matchesOrderId = sample.orderId.toLowerCase().includes(query);
        if (!matchesSampleId && !matchesOrderId) return false;
      }

      if (patientSearch.trim()) {
        const query = patientSearch.toLowerCase();
        const matchesPatient = sample.patientName?.toLowerCase().includes(query);
        if (!matchesPatient) return false;
      }

      if (sampleTypeFilter !== 'ALL' && !sample.sampleType?.toLowerCase().includes(sampleTypeFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [samples, activeTab, barcodeSearch, patientSearch, sampleTypeFilter]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      PENDING: samples.filter((s) => s.sampleStatus === 'PENDING').length,
      COLLECTED: samples.filter((s) => s.sampleStatus === 'COLLECTED').length,
      RECEIVED: samples.filter((s) => s.sampleStatus === 'RECEIVED').length,
      PROCESSING: samples.filter((s) => s.sampleStatus === 'IN LAB / PROCESSING').length,
      ACCEPTED: samples.filter((s) => ['ACCEPTED', 'COMPLETED'].includes(s.sampleStatus)).length,
      REJECTED: samples.filter((s) => s.sampleStatus === 'REJECTED').length
    };
  }, [samples]);

  const handleToggleSelectAll = () => {
    if (selectedSampleIds.length === filteredSamples.length) {
      setSelectedSampleIds([]);
    } else {
      setSelectedSampleIds(filteredSamples.map((s) => s.sampleId));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedSampleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRunBatchAction = () => {
    if (selectedSampleIds.length === 0) return;

    if (activeTab === 'PENDING' && onBatchCollect) {
      onBatchCollect(selectedSampleIds);
      setSelectedSampleIds([]);
    } else if (activeTab === 'COLLECTED' && onBatchReceive) {
      onBatchReceive(selectedSampleIds);
      setSelectedSampleIds([]);
    } else if (activeTab === 'RECEIVED' && onBatchAccept) {
      onBatchAccept(selectedSampleIds);
      setSelectedSampleIds([]);
    } else {
      addToast(`Batch action applied to ${selectedSampleIds.length} samples.`, 'info');
      setSelectedSampleIds([]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
              Pre-Analytical Operations
            </span>
            <span className="text-xs text-slate-500 font-medium">
              MediUnify Accession Desk & Barcode Scanner
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Sample Accession & Vacutainer Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Collect biological specimens, track cold-chain logistics, and verify sample integrity for clinical analyzers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedSampleIds.length > 0 && (
            <button
              onClick={handleRunBatchAction}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-600/20 transition-all active:scale-95 animate-in zoom-in-95"
            >
              <CheckCheck className="w-4 h-4" />
              <span>
                {activeTab === 'PENDING'
                  ? `Collect Selected (${selectedSampleIds.length})`
                  : activeTab === 'COLLECTED'
                  ? `Receive Selected (${selectedSampleIds.length})`
                  : `Accept Selected (${selectedSampleIds.length})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Pipeline Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 text-xs font-bold">
          
          <button
            onClick={() => { setActiveTab('PENDING'); setSelectedSampleIds([]); }}
            className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'PENDING'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Pending Draw</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'PENDING' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {tabCounts.PENDING}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('COLLECTED'); setSelectedSampleIds([]); }}
            className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'COLLECTED'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>In Transit</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'COLLECTED' ? 'bg-white text-teal-800' : 'bg-teal-100 text-teal-800'
              }`}
            >
              {tabCounts.COLLECTED}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('RECEIVED'); setSelectedSampleIds([]); }}
            className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'RECEIVED'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>Received at Lab</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'RECEIVED' ? 'bg-white text-blue-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {tabCounts.RECEIVED}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('IN LAB / PROCESSING'); setSelectedSampleIds([]); }}
            className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'IN LAB / PROCESSING'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <TestTube2 className="w-4 h-4" />
              <span>On Analyzers</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'IN LAB / PROCESSING' ? 'bg-white text-purple-800' : 'bg-purple-100 text-purple-800'
              }`}
            >
              {tabCounts.PROCESSING}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('ACCEPTED'); setSelectedSampleIds([]); }}
            className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'ACCEPTED'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Accepted</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'ACCEPTED' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {tabCounts.ACCEPTED}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('REJECTED'); setSelectedSampleIds([]); }}
            className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
              activeTab === 'REJECTED'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>Rejected</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                activeTab === 'REJECTED' ? 'bg-white text-rose-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {tabCounts.REJECTED}
            </span>
          </button>

        </div>
      </div>

      {/* 3. Barcode Scanner & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Barcode className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Scan or type Barcode / Lab No..."
              value={barcodeSearch}
              onChange={(e) => setBarcodeSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-sans"
            />
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Patient Name..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div>
            <select
              value={sampleTypeFilter}
              onChange={(e) => setSampleTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-700 font-medium"
            >
              <option value="ALL">All Vacutainer Tube Types</option>
              <option value="EDTA">EDTA Whole Blood (Lavender)</option>
              <option value="Serum">Serum SST Gel (Yellow / Gold)</option>
              <option value="Fluoride">Sodium Fluoride Glucose (Grey)</option>
              <option value="Citrate">Sodium Citrate Coagulation (Blue)</option>
              <option value="Urine">Clean Catch Urine Cup</option>
            </select>
          </div>

        </div>
      </div>

      {/* 4. Accession Samples Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-200 select-none">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedSampleIds.length === filteredSamples.length && filteredSamples.length > 0}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                  />
                </th>
                <th className="py-3 px-3.5 min-w-[140px]">Sample & Order #</th>
                <th className="py-3 px-4 min-w-[180px]">Patient Name & Age</th>
                <th className="py-3 px-4 min-w-[200px]">Test Profile & Specimen</th>
                <th className="py-3 px-3.5 min-w-[160px]">Vacutainer Tube</th>
                <th className="py-3 px-3.5 min-w-[150px]">Location / Phlebotomist</th>
                <th className="py-3 px-4 text-right min-w-[150px]">Accession Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Pipette className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-700 text-sm">No samples in "{activeTab}" queue</div>
                    <div className="text-xs text-slate-400 mt-0.5">Check other pipeline tabs or scan a new barcode.</div>
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample) => {
                  const isSelected = selectedSampleIds.includes(sample.sampleId);

                  return (
                    <tr
                      key={sample.sampleId}
                      className={`hover:bg-teal-50/40 transition-colors ${
                        isSelected ? 'bg-teal-50/70' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(sample.sampleId)}
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                        />
                      </td>

                      {/* Sample ID & Order ID */}
                      <td className="py-3.5 px-3.5 font-mono">
                        <div className="font-bold text-slate-900">{sample.sampleId}</div>
                        <div className="text-[11px] text-teal-700 font-semibold mt-0.5">{sample.orderId}</div>
                      </td>

                      {/* Patient */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-[13px]">
                          {sample.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          <span>{sample.patientAge} yrs</span>
                          <span className="mx-1">•</span>
                          <span className={sample.gender === 'Female' ? 'text-pink-600 font-bold' : 'text-blue-600 font-bold'}>
                            {sample.gender}
                          </span>
                        </div>
                      </td>

                      {/* Test Profile & Specimen */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {sample.testOrPackageName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {sample.sampleType}
                        </div>
                      </td>

                      {/* Vacutainer Tube representation */}
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3.5 h-8 rounded-full border border-slate-300 shadow-2xs relative flex flex-col justify-end overflow-hidden"
                            style={{ backgroundColor: sample.colorHex || '#8E24AA' }}
                          >
                            <div className="w-full h-2.5 bg-white/70 absolute top-0"></div>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-[11px]">
                              {sample.vacutainerColor || 'Purple (EDTA)'}
                            </div>
                            <div className="text-[10px] text-slate-500">{sample.sampleType}</div>
                          </div>
                        </div>
                      </td>

                      {/* Location / Phlebotomist */}
                      <td className="py-3.5 px-3.5">
                        <div className="font-medium text-slate-800 text-[11px]">
                          {sample.centerName || 'MediUnify Central Reference Laboratory'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {sample.collectionType || 'Center Visit'}
                        </div>
                      </td>

                      {/* Quick Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {sample.sampleStatus === 'PENDING' && (
                            <button
                              onClick={() => onCollectSample(sample.sampleId)}
                              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs"
                            >
                              Collect
                            </button>
                          )}

                          {sample.sampleStatus === 'COLLECTED' && (
                            <button
                              onClick={() => onReceiveSample(sample.sampleId)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs"
                            >
                              Receive at Lab
                            </button>
                          )}

                          {sample.sampleStatus === 'RECEIVED' && (
                            <button
                              onClick={() => onAcceptSample(sample.sampleId)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
                            >
                              Accept
                            </button>
                          )}

                          {sample.sampleStatus !== 'REJECTED' && sample.sampleStatus !== 'COMPLETED' && (
                            <button
                              onClick={() => onRejectSample(sample)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                              title="Reject Sample (Hemolysis / Clot)"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {sample.sampleStatus === 'REJECTED' && (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              {sample.rejectionReason || 'Sample Hemolyzed'}
                            </span>
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

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong>{filteredSamples.length}</strong> samples in active stage
          </div>
          <div className="font-medium text-slate-700">
            Automated Barcode Accession Mode: Active
          </div>
        </div>

      </div>

    </div>
  );
}
