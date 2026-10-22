import React from 'react';

/**
 * Branded MediUnify Text Component
 * Accurately matches the official MediUnify logo color scheme:
 * - "Medi": Clinical Deep Navy Blue (#0A2540)
 * - "Unify": Healthcare Vibrant Teal (#00A896)
 */
export default function BrandLogoText({ className = '', suffix = '' }) {
  return (
    <span className={`inline-flex items-baseline tracking-tight ${className}`}>
      <span className="text-[#001E60]">Medi</span>
      <span className="text-[#029894]">Unify</span>
      {suffix && <span className="ml-1 text-current">{suffix}</span>}
    </span>
  );
}
