import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Clock
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { RADIOLOGY_CENTERS } from '../../../data/radiologyData';
import { useLockBodyScroll } from '../../../hooks/useLockBodyScroll';

export default function RadiologyAddEditMachineModal({
  isOpen,
  onClose,
  machine,
  onSaveMachine,
  allCenters = RADIOLOGY_CENTERS
}) {
  const { addToast } = useToast();
  useLockBodyScroll(isOpen, onClose);

  const [formData, setFormData] = useState({
    name: '',
    modality: 'MRI',
    centerId: allCenters[0]?.id || 'CTR-MYS-01',
    centerName: allCenters[0]?.name || 'MediUnify Advanced Imaging & Reference Hub',
    room: '',
    availableServices: ['MRI Brain (Plain & Contrast)', 'MRI Lumbar Spine'],
    operatingHours: '07:00 AM - 10:00 PM',
    status: 'Available', // 'Available' | 'In Use' | 'Maintenance' | 'Inactive'
    maintenanceStatus: 'Operational',
    technologist: 'Arjun Rao (Senior Tech)',
    cryoTemp: '18.2°C (Optimal)',
    uptime: '99.5%'
  });

  useEffect(() => {
    if (machine) {
      setFormData({ ...machine });
    } else {
      setFormData({
        name: '',
        modality: 'MRI',
        centerId: allCenters[0]?.id || 'CTR-MYS-01',
        centerName: allCenters[0]?.name || 'MediUnify Advanced Imaging & Reference Hub',
        room: 'Shielded Suite 1',
        availableServices: ['MRI Brain (Plain & Contrast)', 'MRI Lumbar Spine'],
        operatingHours: '07:00 AM - 10:00 PM',
        status: 'Available',
        maintenanceStatus: 'Operational',
        technologist: 'Arjun Rao (Senior Tech)',
        cryoTemp: '18.2°C (Optimal)',
        uptime: '99.5%'
      });
    }
  }, [machine, isOpen, allCenters]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.room) {
      addToast('Please provide Machine Name and Suite Room.', 'warning');
      return;
    }

    onSaveMachine({
      ...formData,
      id: machine?.id || `MCH-${Date.now().toString().slice(-4)}`
    });

    addToast(`Machine ${formData.name} saved successfully.`, 'success');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-brand-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in-50 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-slate-100 bg-brand-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-teal-50 text-brand-teal-700 rounded-lg border border-brand-teal-200">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-brand-navy-900">
                {machine ? 'Edit Machine & Modality Specification' : 'Register New Imaging Machine / Gantry'}
              </h3>
              <p className="text-xs text-brand-slate-500">Configure machine hardware, assigned room suite and operational state</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-brand-slate-400 hover:text-brand-slate-700 rounded-lg hover:bg-brand-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Machine Name / Hardware Model:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Siemens MAGNETOM Vida 3T (BioMatrix Gantry A)"
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Modality Type:</label>
              <select
                value={formData.modality}
                onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
              >
                <option value="MRI">MRI</option>
                <option value="CT Scan">CT Scan</option>
                <option value="X-Ray">X-Ray</option>
                <option value="Ultrasound">Ultrasound</option>
                <option value="Mammography">Mammography</option>
                <option value="DEXA">DEXA / BMD</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Suite / Room Location:</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g. Shielded Suite 1 (Gantry A)"
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Allocated Center:</label>
            <select
              value={formData.centerName}
              onChange={(e) => {
                const targetCenter = allCenters.find((c) => c.name === e.target.value);
                setFormData({
                  ...formData,
                  centerName: e.target.value,
                  centerId: targetCenter ? targetCenter.id : formData.centerId
                });
              }}
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
            >
              {allCenters.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Current Machine Status:</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-bold"
              >
                <option value="Available">Available (Ready for Scans)</option>
                <option value="In Use">In Use (Active Patient Scanning)</option>
                <option value="Maintenance">Maintenance / Service Period</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-brand-slate-700 block mb-1">Duty Technologist:</label>
              <input
                type="text"
                value={formData.technologist}
                onChange={(e) => setFormData({ ...formData, technologist: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-brand-slate-700 block mb-1">Maintenance & Sensor State Remarks:</label>
            <input
              type="text"
              value={formData.maintenanceStatus}
              onChange={(e) => setFormData({ ...formData, maintenanceStatus: e.target.value })}
              placeholder="e.g. Operational / Scheduled Calibration"
              className="w-full p-2.5 rounded-xl border border-brand-slate-200 text-xs font-medium"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-brand-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-brand-slate-600 font-semibold rounded-xl border border-brand-slate-200 hover:bg-brand-slate-100 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-teal-600 hover:bg-brand-teal-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {machine ? 'Update Machine Parameters' : 'Register Machine'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
