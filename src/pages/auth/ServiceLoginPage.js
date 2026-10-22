import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Info,
  HelpCircle
} from 'lucide-react';
import { SERVICES_CONFIG } from '../../data/servicesConfig';
import DynamicIcon from '../../components/common/DynamicIcon';
import Modal from '../../components/common/Modal';
import FormInput from '../../components/forms/FormInput';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import mediunifyLogo from '../../assets/logo.png';

// Service-specific photographic background assets
import labBg from '../../assets/login-backgrounds/lab-bg.jpg';
import radiologyBg from '../../assets/login-backgrounds/radiology-bg.jpg';
import pharmacyBg from '../../assets/login-backgrounds/pharmacy-bg.jpg';
import equipmentBg from '../../assets/login-backgrounds/equipment-bg.jpg';
import surgeryBg from '../../assets/login-backgrounds/surgery-bg.jpg';
import nursingBg from '../../assets/login-backgrounds/home-nursing-bg.jpg';

const SERVICE_BACKGROUNDS = {
  lab: {
    image: labBg,
    alt: 'Medical Laboratory Equipment & Automated Analyzers',
    overlayGradient: 'from-brand-navy-950/85 via-brand-navy-900/60 to-brand-teal-950/80',
    accentGlow: 'bg-brand-teal-400/20',
  },
  radiology: {
    image: radiologyBg,
    alt: 'Advanced Radiology MRI & Diagnostic Imaging Center',
    overlayGradient: 'from-brand-navy-950/90 via-brand-navy-900/65 to-brand-slate-950/85',
    accentGlow: 'bg-brand-aqua-400/20',
  },
  pharmacy: {
    image: pharmacyBg,
    alt: 'Hospital Pharmacy Dispensary & Medicine Logistics',
    overlayGradient: 'from-brand-navy-950/85 via-brand-slate-900/60 to-brand-green-950/80',
    accentGlow: 'bg-brand-green-400/20',
  },
  'third-party-pharmacy': {
    image: pharmacyBg,
    alt: 'Multiple Pharmacy Stores & Retail Dispensary',
    overlayGradient: 'from-brand-navy-950/85 via-brand-slate-900/60 to-emerald-950/80',
    accentGlow: 'bg-emerald-400/20',
  },
  'multiple-pharmacy': {
    image: pharmacyBg,
    alt: 'Multiple Pharmacy Stores & Retail Dispensary',
    overlayGradient: 'from-brand-navy-950/85 via-brand-slate-900/60 to-emerald-950/80',
    accentGlow: 'bg-emerald-400/20',
  },
  'equipment-rentals': {
    image: equipmentBg,
    alt: 'Hospital Medical Equipment Logistics & Rental Hub',
    overlayGradient: 'from-brand-navy-950/85 via-brand-navy-900/60 to-brand-teal-950/80',
    accentGlow: 'bg-brand-teal-400/20',
  },
  'equipment-rental': {
    image: equipmentBg,
    alt: 'Hospital Medical Equipment Logistics & Rental Hub',
    overlayGradient: 'from-brand-navy-950/85 via-brand-navy-900/60 to-brand-teal-950/80',
    accentGlow: 'bg-brand-teal-400/20',
  },
  surgery: {
    image: surgeryBg,
    alt: 'Sterile Surgical Operating Suite & Surgical Theater',
    overlayGradient: 'from-brand-navy-950/90 via-brand-navy-900/65 to-brand-aqua-950/80',
    accentGlow: 'bg-brand-aqua-400/20',
  },
  'home-nursing': {
    image: nursingBg,
    alt: 'Professional Home Healthcare & Clinical Nursing Care',
    overlayGradient: 'from-brand-navy-950/85 via-brand-navy-900/60 to-brand-teal-950/80',
    accentGlow: 'bg-brand-teal-400/20',
  },
  'home-care': {
    image: nursingBg,
    alt: 'Professional Home Healthcare & Clinical Nursing Care',
    overlayGradient: 'from-brand-navy-950/85 via-brand-navy-900/60 to-brand-teal-950/80',
    accentGlow: 'bg-brand-teal-400/20',
  },
};

export default function ServiceLoginPage({ serviceId, onBackToServices, onLoginSuccess }) {
  const { login } = useAuth();
  const { addToast } = useToast();

  const service = SERVICES_CONFIG.find((s) => s.id === serviceId) || SERVICES_CONFIG[0];
  const currentBg = SERVICE_BACKGROUNDS[serviceId] || SERVICE_BACKGROUNDS[service?.id] || SERVICE_BACKGROUNDS.lab;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter your administrator email and password', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(service.id, email, password);
      setIsLoading(false);
      addToast(`Welcome to ${service.fullName} Portal`, 'success');
      if (onLoginSuccess) onLoginSuccess(service.id);
    }, 450);
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      addToast('Please enter your registered email address', 'warning');
      return;
    }
    setIsForgotPasswordOpen(false);
    addToast(`Password recovery link sent to ${resetEmail}`, 'success');
    setResetEmail('');
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-brand-teal-100 selection:text-brand-teal-900 overflow-x-hidden bg-brand-navy-950">
      {/* Animated Photographic Background Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Thematic Background Image with smooth Ken Burns pan/zoom animation */}
        <img
          key={currentBg.image}
          src={currentBg.image}
          alt={currentBg.alt}
          className="w-full h-full object-cover object-center animate-ken-burns transform-gpu filter brightness-[0.88] contrast-[1.05]"
        />

        {/* Themed medical gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${currentBg.overlayGradient}`} />

        {/* Cinematic vignette and depth overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.1)_0%,_rgba(3,11,23,0.75)_100%)]" />

        {/* Soft floating ambient glowing lights */}
        <div className={`absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full ${currentBg.accentGlow} blur-3xl animate-float-gentle`} />
        <div className="absolute bottom-1/4 -right-20 w-[450px] h-[450px] rounded-full bg-brand-aqua-400/15 blur-3xl animate-pulse-glow" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <button
          onClick={onBackToServices}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-brand-slate-700 hover:text-brand-navy-950 bg-white/90 hover:bg-white rounded-xl border border-white/60 shadow-md backdrop-blur-md transition-all hover:shadow-lg active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </button>

        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/60 shadow-md">
          <img src={mediunifyLogo} alt="MediUnify" className="h-6 w-auto object-contain" />
          <span className="text-xs font-extrabold flex items-center gap-1">
            <span>
              <span className="text-[#001E60]">Medi</span>
              <span className="text-[#029894]">Unify</span>
            </span>
            <span className="text-brand-slate-600 font-bold">Gateway</span>
          </span>
        </div>
      </header>

      {/* Centered Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-white/80 shadow-2xl shadow-brand-navy-950/40 overflow-hidden animate-slide-up backdrop-blur-sm">
          {/* Service Banner */}
          <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-brand-slate-50/80 to-white border-b border-brand-slate-100 relative">
            <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl border ${service.iconContainerClass || service.badgeColor} flex items-center justify-center shadow-sm`}>
              <DynamicIcon name={service.iconName} className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 border border-brand-slate-200 bg-brand-slate-100 text-brand-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal-600" />
              {service.name} Administration
            </div>

            <h2 className="text-2xl font-black text-brand-navy-900 tracking-tight">
              Sign In to {service.name}
            </h2>
            <p className="text-xs sm:text-sm text-brand-slate-500 mt-1 max-w-xs mx-auto">
              Sign in to manage your {service.name.toLowerCase()} operations, bookings & reports.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <FormInput
              label="Admin Email / Username"
              id="email"
              type="email"
              placeholder="e.g. admin@mediunify.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <FormInput
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-brand-slate-400 hover:text-brand-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-brand-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-brand-slate-300 text-brand-teal-600 focus:ring-brand-teal-500 w-4 h-4"
                />
                <span>Remember this device</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsForgotPasswordOpen(true);
                }}
                className="font-bold text-brand-teal-700 hover:text-brand-teal-800 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 active:scale-[0.99] shadow-md hover:shadow-lg shadow-brand-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to {service.name} Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 px-4 text-center text-xs text-white/85 font-medium drop-shadow-md flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-brand-teal-400 animate-pulse" />
        <span>MediUnify Intelligent Health Platform • {service.fullName} Admin Access</span>
      </footer>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        title="Reset Administrative Password"
        subtitle={`Password recovery for ${service.fullName}`}
        maxWidth="max-w-md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-brand-slate-600 hover:bg-brand-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleResetPasswordSubmit}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-teal-600 hover:bg-brand-teal-700 rounded-xl shadow-xs"
            >
              Send Reset Instructions
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-brand-teal-50 border border-brand-teal-100 rounded-xl text-xs text-brand-teal-900">
            <Info className="w-4 h-4 text-brand-teal-600 flex-shrink-0 mt-0.5" />
            <p>
              Enter the administrator email associated with your {service.name} facility. A password reset link will be dispatched immediately.
            </p>
          </div>
          <FormInput
            label="Administrator Email Address"
            id="resetEmail"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="admin@mediunify.com"
            icon={Mail}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
