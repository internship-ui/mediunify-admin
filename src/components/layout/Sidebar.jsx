import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sliders,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DynamicIcon from '../common/DynamicIcon';
import { useToast } from '../../context/ToastContext';

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  onNavigateToServices
}) {
  const { currentService, activeModule, setActiveModule, logout } = useAuth();
  const { addToast } = useToast();

  if (!currentService) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white text-brand-slate-700 border-r border-brand-slate-200 flex flex-col transition-all duration-300 shadow-xs ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-brand-slate-100 flex items-center justify-between bg-brand-slate-50/60">
          <div
            onClick={onNavigateToServices}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="MediUnify Logo"
              className="h-9 w-auto object-contain rounded-lg bg-white p-1 shadow-xs border border-brand-slate-200/80 group-hover:scale-105 transition-transform"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-base tracking-tight text-brand-slate-900 flex items-center gap-1.5">
                  MediUnify
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200">
                    Admin
                  </span>
                </span>
                <p className="text-[11px] text-brand-slate-500 truncate">Operations Platform</p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-brand-slate-400 hover:text-brand-slate-700 hover:bg-brand-slate-100 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Service Badge Box */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-brand-slate-50 border border-brand-slate-200/90 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border shadow-xs ${currentService.badgeColor}`}>
              <DynamicIcon name={currentService.iconName} className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-brand-slate-900 truncate">{currentService.fullName}</p>
                <p className="text-[10px] text-brand-teal-700 font-semibold">Dedicated Workspace</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Modules Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!isCollapsed && (
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-brand-slate-400">
              {currentService.name} Modules
            </p>
          )}

          {currentService.modules.map((mod) => {
            const isActive = activeModule === mod.id;
            const activeBgClass = 'bg-brand-teal-600 text-white shadow-md shadow-brand-teal-600/20';

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? activeBgClass
                    : 'text-brand-slate-600 hover:bg-brand-slate-100 hover:text-brand-slate-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? mod.name : ''}
              >
                <DynamicIcon
                  name={mod.iconName}
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-brand-slate-400 group-hover:text-brand-teal-600'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{mod.name}</span>}
              </button>
            );
          })}
        </div>

        {/* Bottom Utility Actions */}
        <div className="p-3 border-t border-brand-slate-200/80 space-y-1 bg-brand-slate-50/70">
          <button
            onClick={() => {
              if (onNavigateToServices) onNavigateToServices();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 hover:text-brand-teal-700 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Switch Service Hub"
          >
            <Layers className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
            {!isCollapsed && <span>Switch Service Hub</span>}
          </button>

          <button
            onClick={() => {
              logout();
              addToast('Logged out of Admin Portal', 'info');
              if (onNavigateToServices) onNavigateToServices();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-brand-coral-600 hover:bg-brand-coral-50 hover:text-brand-coral-700 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Logout"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
