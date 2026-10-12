import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  SlidersHorizontal,
  KeyRound,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { SERVICES_CONFIG } from '../../data/servicesConfig';
import DynamicIcon from '../../components/common/DynamicIcon';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ServiceSelectionPage({ onSelectService, onQuickLogin }) {
  const { login } = useAuth();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'slider'
  const [activeSlide, setActiveSlide] = useState(0);

  const handleQuickDemo = (e, service) => {
    e.stopPropagation();
    login(service.id, service.demoCredentials.email, service.demoCredentials.password);
    addToast(`Quick logged in to ${service.fullName}`, 'success');
    if (onQuickLogin) onQuickLogin(service.id);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SERVICES_CONFIG.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SERVICES_CONFIG.length) % SERVICES_CONFIG.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-slate-50 via-white to-brand-slate-50 text-brand-navy-900 flex flex-col justify-between selection:bg-brand-teal-100 selection:text-brand-teal-900 relative">
      {/* Background Subtle Gradient Blobs using only user brand palette */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-teal-100/60 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-brand-aqua-100/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-brand-green-100/40 rounded-full blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-brand-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-xl border border-brand-slate-200/80 shadow-xs">
            <img
              src="/logo.png"
              alt="MediUnify Logo"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-brand-navy-900 tracking-tight">MediUnify</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200">
                Admin Portal
              </span>
            </div>
            <p className="text-[11px] text-brand-slate-500 font-medium">Unified Healthcare Operations Suite</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="hidden sm:flex items-center bg-brand-slate-100 p-1 rounded-xl border border-brand-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brand-teal-600 text-white shadow-xs font-bold'
                  : 'text-brand-slate-600 hover:text-brand-navy-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'slider'
                  ? 'bg-brand-teal-600 text-white shadow-xs font-bold'
                  : 'text-brand-slate-600 hover:text-brand-navy-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Slider View
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-green-50 border border-brand-green-200 text-xs text-brand-green-800 font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-brand-green-500 animate-pulse" />
            <span>{SERVICES_CONFIG.length} Healthcare Verticals Online</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Service Cards */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal-50 border border-brand-teal-200 text-brand-teal-800 text-xs font-bold tracking-wide uppercase shadow-xs">
            <Zap className="w-3.5 h-3.5 text-brand-teal-600" />
            Enterprise Healthcare Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-brand-navy-950 tracking-tight leading-tight">
            MediUnify Admin Portal
          </h1>

          <p className="text-sm sm:text-base text-brand-slate-600 font-medium">
            Select a service to continue to its dedicated administration workspace.
          </p>
        </div>

        {/* View Mode: GRID */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {SERVICES_CONFIG.map((service) => (
              <div
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className="group relative bg-white hover:bg-brand-slate-50/60 rounded-2xl border border-brand-slate-200/90 hover:border-brand-teal-400/50 p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-teal-900/10 cursor-pointer overflow-hidden shadow-subtle"
              >
                {/* Accent Top Border Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.accentGradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                />

                <div>
                  {/* Service Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3.5 rounded-xl border ${service.iconContainerClass || service.badgeColor} shadow-sm group-hover:scale-110 transition-all duration-300`}
                    >
                      <DynamicIcon name={service.iconName} className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200">
                      Service {SERVICES_CONFIG.indexOf(service) + 1} of {SERVICES_CONFIG.length}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold text-brand-navy-900 tracking-tight mb-2 group-hover:text-brand-teal-700 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-slate-600 leading-relaxed min-h-[48px]">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Status & Login Button */}
                <div className="mt-6 pt-5 border-t border-brand-slate-200/80 space-y-4">
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-brand-slate-500 font-medium">Platform Status</span>
                    <span className="font-bold text-brand-green-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-green-500 animate-pulse" /> Active
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectService(service.id);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-md shadow-brand-teal-600/20 transition-all group-hover:shadow-brand-teal-600/30"
                    >
                      <span>Login</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={(e) => handleQuickDemo(e, service)}
                      title="Direct 1-Click Demo Login"
                      className="px-3 py-2.5 text-xs font-bold text-brand-slate-700 hover:text-brand-navy-900 bg-brand-slate-100 hover:bg-brand-slate-200 rounded-xl border border-brand-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-brand-teal-600" />
                      <span className="hidden xl:inline">Demo</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode: SLIDER / CAROUSEL */}
        {viewMode === 'slider' && (
          <div className="relative max-w-2xl mx-auto w-full">
            {(() => {
              const service = SERVICES_CONFIG[activeSlide];
              return (
                <div className="relative bg-white rounded-3xl border border-brand-slate-200/90 p-8 sm:p-10 shadow-elevated overflow-hidden animate-fade-in">
                  <div
                    className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${service.accentGradient}`}
                  />

                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl border ${service.iconContainerClass || service.badgeColor} shadow-sm`}>
                      <DynamicIcon name={service.iconName} className="w-10 h-10" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-teal-50 text-brand-teal-800 border border-brand-teal-200">
                      Service {activeSlide + 1} of {SERVICES_CONFIG.length}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-brand-navy-950 tracking-tight mb-2">
                    {service.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-brand-teal-700 mb-4">{service.subtitle}</p>

                  <p className="text-sm sm:text-base text-brand-slate-600 leading-relaxed mb-8">
                    {service.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectService(service.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-lg shadow-brand-teal-600/20 transition-all"
                    >
                      <span>Sign In to {service.name} Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleQuickDemo(e, service)}
                      className="px-4 py-3 text-sm font-bold text-brand-navy-900 bg-brand-slate-100 hover:bg-brand-slate-200 rounded-xl border border-brand-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Zap className="w-4 h-4 text-brand-teal-600" />
                      <span>1-Click Demo</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Slider Navigation Controls */}
            <div className="flex items-center justify-between mt-6 px-4">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-full bg-white hover:bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200 shadow-xs transition-colors"
                aria-label="Previous Service"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {SERVICES_CONFIG.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === idx ? 'w-8 bg-brand-teal-600' : 'w-2 bg-brand-slate-300 hover:bg-brand-slate-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2.5 rounded-full bg-white hover:bg-brand-slate-100 text-brand-slate-700 border border-brand-slate-200 shadow-xs transition-colors"
                aria-label="Next Service"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-brand-slate-200/80 text-center text-xs text-brand-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-teal-600" />
          <span>Enterprise Grade Security • HIPAA & NABH Compliance Architecture</span>
        </div>
        <p className="font-medium text-brand-slate-600">
          All your healthcare. One intelligent platform.
        </p>
      </footer>
    </div>
  );
}
