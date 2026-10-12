import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
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

export default function ServiceLoginPage({ serviceId, onBackToServices, onLoginSuccess }) {
  const { login } = useAuth();
  const { addToast } = useToast();

  const service = SERVICES_CONFIG.find((s) => s.id === serviceId) || SERVICES_CONFIG[0];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Prefill demo credentials by default for effortless reviewing
  useEffect(() => {
    if (service) {
      setEmail(service.demoCredentials.email);
      setPassword(service.demoCredentials.password);
    }
  }, [service]);

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

  const handleFillDemo = () => {
    setEmail(service.demoCredentials.email);
    setPassword(service.demoCredentials.password);
    addToast(`Demo credentials applied for ${service.name}`, 'info');
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
    <div className="min-h-screen bg-brand-slate-50 flex flex-col justify-between selection:bg-brand-teal-100 selection:text-brand-teal-900">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <button
          onClick={onBackToServices}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-brand-slate-600 hover:text-brand-navy-900 bg-white hover:bg-brand-slate-100 rounded-xl border border-brand-slate-200 shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Services</span>
        </button>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-brand-slate-200/80 shadow-xs">
          <img src="/logo.png" alt="MediUnify" className="h-6 w-auto object-contain" />
          <span className="text-xs font-extrabold text-brand-navy-900">Admin Gateway</span>
        </div>
      </header>

      {/* Login Card Surface */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-brand-slate-200/80 shadow-elevated overflow-hidden animate-slide-up">
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

            {/* Quick Demo Helper Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-brand-slate-50 border border-brand-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand-teal-600" />
                <span className="text-xs font-semibold text-brand-slate-600">Quick Demo Access</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-xs font-bold text-brand-teal-700 hover:underline"
              >
                Auto-fill credentials
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-brand-slate-400">
        MediUnify Intelligent Health Platform • Frontend Prototype
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
