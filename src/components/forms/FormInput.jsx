import React from 'react';

export default function FormInput({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  rightElement,
  helperText,
  className = '',
  rows
}) {
  const isTextarea = type === 'textarea';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-brand-slate-700">
          {label} {required && <span className="text-brand-coral-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {isTextarea ? (
          <textarea
            id={id}
            rows={rows || 3}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-brand-navy-900 placeholder:text-brand-slate-400 focus:outline-none focus:ring-2 transition-all ${
              Icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-brand-coral-300 focus:border-brand-coral-500 focus:ring-brand-coral-500/20'
                : 'border-brand-slate-200 focus:border-brand-teal-500 focus:ring-brand-teal-500/20'
            } ${disabled ? 'bg-brand-slate-50 text-brand-slate-400 cursor-not-allowed' : ''}`}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-brand-navy-900 placeholder:text-brand-slate-400 focus:outline-none focus:ring-2 transition-all ${
              Icon ? 'pl-10' : ''
            } ${rightElement ? 'pr-11' : ''} ${
              error
                ? 'border-brand-coral-300 focus:border-brand-coral-500 focus:ring-brand-coral-500/20'
                : 'border-brand-slate-200 focus:border-brand-teal-500 focus:ring-brand-teal-500/20'
            } ${disabled ? 'bg-brand-slate-50 text-brand-slate-400 cursor-not-allowed' : ''}`}
          />
        )}

        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{rightElement}</div>
        )}
      </div>

      {error && <p className="text-xs text-brand-coral-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-brand-slate-400">{helperText}</p>}
    </div>
  );
}
