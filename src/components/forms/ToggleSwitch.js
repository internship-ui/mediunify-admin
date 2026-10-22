import React from 'react';

export default function ToggleSwitch({ checked, onChange, label, description, disabled = false }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <div className="relative inline-flex items-center mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-brand-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal-600"></div>
      </div>
      {(label || description) && (
        <div className="space-y-0.5">
          {label && <p className="text-sm font-semibold text-brand-navy-900">{label}</p>}
          {description && <p className="text-xs text-brand-slate-500">{description}</p>}
        </div>
      )}
    </label>
  );
}
