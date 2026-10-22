import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Pipette,
  TestTube2,
  FileText,
  CreditCard,
  BarChart3,
  Sliders,
  Plus,
  Bell,
  Activity,
  Boxes,
  FileSpreadsheet,
  ChevronDown,
  UserPlus
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function NovusTopNavbar({
  activeTab,
  onSelectTab,
  pendingAccessionCount = 3,
  onOpenNewOrder,
  onOpenRegisterPatient
}) {
  const { addToast } = useToast();

  const navItems = [
    { id: 'workspace', label: "Today's Orders", icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    {
      id: 'accession',
      label: 'Accession Workbench',
      icon: Pipette,
      badge: pendingAccessionCount > 0 ? pendingAccessionCount : null,
      badgeColor: 'bg-amber-400 text-slate-950'
    },
    { id: 'orders', label: 'Lab Orders', icon: TestTube2 },
    { id: 'packages', label: 'Checkup Packages', icon: Boxes },
    { id: 'tests', label: 'Test Catalogue', icon: FileSpreadsheet },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'bills', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'pricing-tat', label: 'Pricing & TAT', icon: Sliders }
  ];

  // Resolve current active tab for matching
  const currentTab = activeTab === 'dashboard' ? 'workspace' : activeTab;

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white rounded-2xl shadow-md border border-teal-500/20 p-3 sm:p-4 mb-6 backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Brand Title & Center Status */}
        <div className="flex items-center justify-between lg:justify-start gap-3">
          <div
            onClick={() => onSelectTab('workspace')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-sm group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-teal-300 transition-colors">
                  MEDIUNIFY DIAGNOSTICS
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  LIS Hub
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Mysuru Hub • NABL Accredited</span>
              </div>
            </div>
          </div>

          {/* Quick CTA Actions on Mobile */}
          <div className="flex lg:hidden items-center gap-1.5">
            {onOpenNewOrder && (
              <button
                onClick={onOpenNewOrder}
                className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Order</span>
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Navigation Pills (Synchronized with Sidebar) */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions on Desktop */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {onOpenRegisterPatient && (
            <button
              onClick={onOpenRegisterPatient}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-400" />
              <span>Register Patient</span>
            </button>
          )}

          {onOpenNewOrder && (
            <button
              onClick={onOpenNewOrder}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Order</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
