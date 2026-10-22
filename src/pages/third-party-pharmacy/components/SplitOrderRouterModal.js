import React, { useState } from 'react';
import {
  GitFork,
  Package,
  Store,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  RefreshCw
} from 'lucide-react';
import Modal from '../../../components/common/Modal';

// Sample multi-medicine orders for testing split order workflow
const SAMPLE_PRESCRIPTION_ORDERS = [
  {
    id: 'DEMO-ORD-901',
    patientName: 'Ananya Deshmukh',
    patientPhone: '+91 98450 78912',
    deliveryAddress: '#412, Panchamukhi Nilaya, Jayalakshmipuram, Mysore - 570012',
    area: 'Jayalakshmipuram',
    pincode: '570012',
    items: [
      { name: 'Metformin 500mg', qty: 60, price: 180, inStock: true, hubStock: 450 },
      { name: 'Telmisartan 40mg', qty: 30, price: 210, inStock: true, hubStock: 280 },
      { name: 'Atorvastatin 10mg', qty: 30, price: 195, inStock: true, hubStock: 120 },
      { name: 'Pantoprazole 40mg', qty: 15, price: 120, inStock: true, hubStock: 90 },
      { name: 'Human Insulin Glargine 100IU/ml Cartridge', qty: 2, price: 1250, inStock: false, reason: 'Cold chain out of stock in Hub', hubStock: 0 }
    ]
  },
  {
    id: 'DEMO-ORD-902',
    patientName: 'Karthik Somayaji',
    patientPhone: '+91 98450 89123',
    deliveryAddress: '#88, 12th Cross, Vontikoppal, Mysore - 570002',
    area: 'Vontikoppal',
    pincode: '570002',
    items: [
      { name: 'Azithromycin 500mg', qty: 6, price: 140, inStock: true, hubStock: 310 },
      { name: 'Paracetamol 650mg', qty: 20, price: 40, inStock: true, hubStock: 1200 },
      { name: 'Montelukast + Levocetirizine', qty: 10, price: 150, inStock: true, hubStock: 400 },
      { name: 'Budesonide 0.5mg Respules', qty: 10, price: 420, inStock: false, reason: 'Specialty pediatric inhalant stock depleted', hubStock: 0 },
      { name: 'Amoxicillin + Clavulanic Acid 625mg', qty: 10, price: 240, inStock: true, hubStock: 65 }
    ]
  }
];

export default function SplitOrderRouterModal({
  isOpen,
  onClose,
  onRouteSplitOrder
}) {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const activeOrder = SAMPLE_PRESCRIPTION_ORDERS[selectedDemoIndex];

  const inStockItems = activeOrder.items.filter((i) => i.inStock);
  const unavailableItems = activeOrder.items.filter((i) => !i.inStock);

  const hubSubtotal = inStockItems.reduce((acc, i) => acc + i.price, 0);
  const externalSubtotal = unavailableItems.reduce((acc, i) => acc + i.price, 0);

  const handleExecuteSplit = () => {
    const parentOrderId = `ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newExternalOrder = {
      orderId: `EXT-ORD-${Math.floor(880 + Math.random() * 110)}`,
      parentOrderId: parentOrderId,
      hubSubOrderId: `HUB-${parentOrderId}`,
      patientName: activeOrder.patientName,
      patientPhone: activeOrder.patientPhone,
      patientPhoneMasked: `${activeOrder.patientPhone.slice(0, 8)} •••••`,
      patientDeliveryAddress: activeOrder.deliveryAddress,
      patientArea: activeOrder.area,
      patientPincode: activeOrder.pincode,
      orderStatus: 'Pending Assignment',
      createdAt: 'Just now (13 Oct 2026)',
      expectedDelivery: 'Within 2 hours',
      priority: 'Standard',
      totalOrderMedicinesCount: activeOrder.items.length,
      hubFulfilledMedicines: inStockItems.map((item, idx) => ({
        medicineId: `MED-HUB-${idx + 1}`,
        name: item.name,
        quantity: item.qty,
        strength: 'Standard',
        dosageForm: 'Tablets / Injections',
        price: item.price,
        batchNumber: `BAT26-${100 + idx}`
      })),
      unavailableMedicines: unavailableItems.map((item, idx) => ({
        medicineId: `UNAV-${idx + 1}`,
        name: item.name,
        quantity: item.qty,
        strength: 'Prescribed Strength',
        dosageForm: 'Formulation',
        price: item.price,
        reasonUnavailable: item.reason
      })),
      assignedPartnerPharmacy: null,
      orderAmount: externalSubtotal,
      paymentStatus: 'Prepaid (Online)',
      paymentDetails: {
        totalOrderValue: externalSubtotal,
        partnerPayout: Math.round(externalSubtotal * 0.88),
        commissionAmount: Math.round(externalSubtotal * 0.12),
        settlementStatus: 'Pending Settlement'
      },
      timeline: [
        {
          status: 'Split Order Created',
          timestamp: 'Just now',
          notes: `Original order ${parentOrderId} split. ${inStockItems.length} items to Central Hub, ${unavailableItems.length} items redirected to Third-Party Pharmacy queue.`
        },
        {
          status: 'Pending Assignment',
          timestamp: 'Just now',
          notes: 'Awaiting admin routing to verified partner pharmacy.'
        }
      ]
    };

    onRouteSplitOrder(newExternalOrder);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Split Order Router & Medicine Stock Check"
      subtitle="Evaluates Central Pharmacy stock, isolates unavailable medicines, and creates linked third-party dispatch"
      maxWidth="max-w-3xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecuteSplit}
            className="px-5 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <GitFork className="w-4 h-4" />
            <span>Execute Split & Route Unavailable Items</span>
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Scenario Selection Buttons */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-brand-slate-700 uppercase tracking-wider">
            Select Patient Order Scenario:
          </span>
          <div className="flex gap-2">
            {SAMPLE_PRESCRIPTION_ORDERS.map((sample, idx) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => setSelectedDemoIndex(idx)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  selectedDemoIndex === idx
                    ? 'bg-brand-teal-600 text-white border-brand-teal-600 shadow-xs'
                    : 'bg-white text-brand-slate-600 border-brand-slate-200 hover:bg-brand-slate-50'
                }`}
              >
                Sample Order #{idx + 1} ({sample.patientName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Patient Header Banner */}
        <div className="p-3.5 rounded-2xl bg-brand-slate-50 border border-brand-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-brand-navy-950 text-sm">{activeOrder.patientName}</span>
              <span className="text-brand-slate-500 font-mono text-[11px]">{activeOrder.patientPhone}</span>
            </div>
            <p className="text-brand-slate-600 text-[11px] mt-0.5">{activeOrder.deliveryAddress}</p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-brand-slate-200 text-right">
            <span className="text-[10px] text-brand-slate-400 block font-bold uppercase">Total Order Value</span>
            <span className="font-mono font-bold text-brand-navy-950 text-sm">
              ₹{(hubSubtotal + externalSubtotal).toLocaleString()}
            </span>
          </div>
        </div>

        {/* The Split Concept Visual Banner */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-brand-teal-50 to-emerald-50 border border-brand-teal-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-brand-teal-900 font-semibold">
            <GitFork className="w-4 h-4 text-brand-teal-700" />
            <span>
              Order Contains <strong>{activeOrder.items.length} Medicines</strong>. Central Hub holds{' '}
              <strong className="text-emerald-700">{inStockItems.length} in stock</strong>, while{' '}
              <strong className="text-amber-700">{unavailableItems.length} are unavailable</strong>.
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-brand-teal-800 uppercase px-2 py-0.5 rounded bg-white border border-brand-teal-200">
            Split Mode Active
          </span>
        </div>

        {/* Two Split Columns: Available vs Unavailable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Part 1: Central Pharmacy Hub (In Stock) */}
          <div className="p-4 rounded-2xl bg-white border border-brand-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-brand-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Part A: Central Pharmacy Hub</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {inStockItems.length} In-Stock Items
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {inStockItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-brand-navy-900 block">{item.name}</span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      ✓ In Stock (Central Hub: {item.hubStock} units)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-brand-navy-900">Qty: {item.qty}</span>
                    <span className="text-[11px] text-brand-slate-500 font-mono block">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-brand-slate-100 flex justify-between text-xs">
              <span className="text-brand-slate-500">Hub Subtotal:</span>
              <span className="font-mono font-bold text-emerald-800">₹{hubSubtotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Part 2: Third-Party Pharmacy (Unavailable Items) */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <Store className="w-4 h-4 text-amber-600" />
                <span>Part B: Third-Party Pharmacy</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {unavailableItems.length} Unavailable Items
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {unavailableItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-brand-navy-900 block">{item.name}</span>
                    <span className="text-[10px] text-amber-800 font-semibold block">
                      ⚠ Out of stock in Central Hub ({item.reason})
                    </span>
                    <span className="text-[10px] text-brand-teal-700 font-medium">
                      → Will redirect to nearby external partner pharmacy
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-amber-950">Qty: {item.qty}</span>
                    <span className="text-[11px] text-amber-900 font-mono block">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-brand-slate-100 flex justify-between text-xs">
              <span className="text-brand-slate-500">External Subtotal:</span>
              <span className="font-mono font-bold text-amber-900">₹{externalSubtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Business Rule Guarantee Banner */}
        <div className="p-3 rounded-xl bg-brand-slate-100/80 border border-brand-slate-200 text-[11px] text-brand-slate-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-teal-600 shrink-0" />
          <span>
            <strong>MediUnify Integrity Rule:</strong> Both sub-orders remain linked to the parent order.
            The patient receives a consolidated invoice and coordinated delivery tracking.
          </span>
        </div>
      </div>
    </Modal>
  );
}
