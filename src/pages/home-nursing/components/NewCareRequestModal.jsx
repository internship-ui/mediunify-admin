import React, { useState } from 'react';
import { Plus, HeartHandshake, Calendar, Clock, MapPin, Phone, User, Stethoscope } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import FormInput from '../../../components/forms/FormInput';
import SelectInput from '../../../components/forms/SelectInput';
import { NURSING_SERVICES_CATALOG } from '../../../data/homeNursingData';

export default function NewCareRequestModal({ isOpen, onClose, onSaveRequest }) {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Female',
    phone: '',
    address: '',
    emergencyContact: '',
    serviceName: 'Wound Dressing',
    carePlanType: '7-Day Care Plan',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '10:00 AM',
    visitDuration: '45 Mins / Day',
    location: 'Mysore (Jayalakshmipuram)',
    patientRequirement: '',
    additionalNotes: '',
    medicalInstructions: '',
    attachedDischargeSummary: 'Hospital_Discharge_Summary.pdf'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.phone) return;

    const matchedService = NURSING_SERVICES_CATALOG.find((s) => s.name === formData.serviceName);
    const dailyRate = matchedService?.baseRate || 499;
    const days = formData.carePlanType.includes('30-Day') ? 30 : formData.carePlanType.includes('14-Day') ? 14 : formData.carePlanType.includes('7-Day') ? 7 : formData.carePlanType.includes('3-Day') ? 3 : 1;
    const discount = days >= 7 ? 5 : 0;
    const subtotal = dailyRate * days;
    const discountAmount = Math.round((subtotal * discount) / 100);
    const totalAmount = subtotal - discountAmount;

    const newReq = {
      ...formData,
      id: `HN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      patientId: `MED-PAT-2026-${Math.floor(4000 + Math.random() * 999)}`,
      age: Number(formData.age) || 60,
      serviceCategory: matchedService?.category || 'Clinical Nursing',
      assignedStaff: 'Unassigned',
      staffId: null,
      status: 'New',
      createdDate: new Date().toISOString().split('T')[0],
      pricingEstimate: {
        dailyRate,
        durationDays: days,
        subtotal,
        discountPercent: discount,
        discountAmount,
        totalAmount,
        advancePaymentStatus: 'Zero Advance Required (Pay After Service)'
      },
      careCoordinatorNotes: 'Care Team Will Call You to verify procedure and nurse allocation.',
      serviceSpecificData: {
        note: formData.patientRequirement || 'Standard care requested'
      },
      uploadedDocuments: formData.attachedDischargeSummary ? [formData.attachedDischargeSummary] : [],
      timeline: [
        { step: 'Request Submitted', time: `${new Date().toISOString().split('T')[0]} 10:00 AM`, done: true, details: 'Care team will call you' },
        { step: 'Under Review', time: '', done: false },
        { step: 'Accepted', time: '', done: false },
        { step: 'Staff Assigned', time: '', done: false },
        { step: 'Scheduled', time: '', done: false },
        { step: 'Visit Started', time: '', done: false },
        { step: 'In Progress', time: '', done: false },
        { step: 'Completed', time: '', done: false }
      ]
    };

    onSaveRequest(newReq);
    onClose();
  };

  const serviceOptions = NURSING_SERVICES_CATALOG.map((s) => s.name);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Home Nursing Care Visit"
      subtitle="Register a new care request for one of the 11 patient-side nursing services"
      maxWidth="max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="new-care-request-form"
            className="px-5 py-2 text-xs font-bold text-white bg-brand-green-600 hover:bg-brand-green-700 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Care Request</span>
          </button>
        </div>
      }
    >
      <form id="new-care-request-form" onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm text-brand-navy-900 max-h-[70vh] overflow-y-auto pr-1">
        {/* Selected Service Dropdown & Care Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-brand-green-50 border border-brand-green-200">
          <SelectInput
            label="Selected Nursing Service"
            id="serviceName"
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            options={serviceOptions}
          />
          <SelectInput
            label="Care Plan Duration & Discount"
            id="carePlanType"
            value={formData.carePlanType}
            onChange={(e) => setFormData({ ...formData, carePlanType: e.target.value })}
            options={[
              'Single Visit (On-Demand)',
              '3-Day Care Plan',
              '7-Day Care Plan (5% Bulk Discount)',
              '14-Day Care Plan (5% Bulk Discount)',
              '30-Day Monthly Care Plan (10% Discount)'
            ]}
          />
        </div>

        {/* Patient Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <FormInput
              label="Patient Full Name"
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="e.g. Rameshwar Murthy"
              required
            />
          </div>
          <div>
            <FormInput
              label="Age"
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="e.g. 68"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectInput
            label="Gender"
            id="gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            options={['Female', 'Male', 'Other']}
          />
          <FormInput
            label="Mobile Phone"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98450 12345"
            icon={Phone}
            required
          />
          <FormInput
            label="Emergency Contact"
            id="emergencyContact"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            placeholder="Name & Contact"
          />
        </div>

        {/* Address & Locality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Service Address"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="#142, 4th Main, Gokulam 3rd Stage"
            required
          />
          <SelectInput
            label="Locality / Hub"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            options={[
              'Mysore (Gokulam)',
              'Mysore (Jayalakshmipuram)',
              'Mysore (Kuvempunagar)',
              'Mysore (Vijayanagar)',
              'Mysore (Saraswathipuram)',
              'Mysore (VV Mohalla)',
              'Mysore (Yadavagiri)',
              'Mysore (Hebbal)',
              'Mysore (Ramakrishnanagar)',
              'Mysore (Siddhartha Layout)'
            ]}
          />
        </div>

        {/* Schedule & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormInput
            label="Preferred Visit Date"
            id="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
            required
          />
          <FormInput
            label="Preferred Time Slot"
            id="preferredTime"
            value={formData.preferredTime}
            onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
            placeholder="e.g. 10:00 AM"
            required
          />
          <FormInput
            label="Visit Duration"
            id="visitDuration"
            value={formData.visitDuration}
            onChange={(e) => setFormData({ ...formData, visitDuration: e.target.value })}
            placeholder="e.g. 45 Mins / 12h"
          />
        </div>

        {/* Clinical Requirements */}
        <div>
          <label className="block text-xs font-bold text-brand-navy-900 mb-1">
            Patient Requirement & Specific Notes
          </label>
          <textarea
            rows="2"
            value={formData.patientRequirement}
            onChange={(e) => setFormData({ ...formData, patientRequirement: e.target.value })}
            placeholder="Describe clinical care required, doctor prescription details, wound status, or special nursing instructions..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-brand-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20 text-brand-navy-900"
          />
        </div>
      </form>
    </Modal>
  );
}
