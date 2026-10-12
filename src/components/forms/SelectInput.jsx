import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function SelectInput({
  label,
  id,
  options = [],
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select option',
  className = ''
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-brand-slate-700">
          {label} {required && <span className="text-brand-coral-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-brand-navy-900 focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-brand-coral-300 focus:border-brand-coral-500 focus:ring-brand-coral-500/20'
              : 'border-brand-slate-200 focus:border-brand-teal-500 focus:ring-brand-teal-500/20'
          } ${disabled ? 'bg-brand-slate-50 text-brand-slate-400 cursor-not-allowed' : ''}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-brand-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && <p className="text-xs text-brand-coral-600 font-medium">{error}</p>}
    </div>
  );
}
