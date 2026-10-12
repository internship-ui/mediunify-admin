import React from 'react';

export default function StatusBadge({ status, size = 'sm' }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase().trim();

  let styles = 'bg-brand-slate-100 text-brand-slate-700 border-brand-slate-200';
  let dotColor = 'bg-brand-slate-400';

  if (
    normalized === 'active' ||
    normalized === 'completed' ||
    normalized === 'rental completed' ||
    normalized === 'operational' ||
    normalized === 'available' ||
    normalized === 'success' ||
    normalized === 'paid' ||
    normalized === 'payment completed' ||
    normalized === 'payment successful' ||
    normalized === 'payment verified' ||
    normalized === 'confirmed' ||
    normalized === 'vendor confirmed' ||
    normalized === 'verified & released' ||
    normalized === 'verified report' ||
    normalized === 'verified' ||
    normalized === 'admin verified' ||
    normalized === 'report verified' ||
    normalized === 'delivered' ||
    normalized === 'report delivered' ||
    normalized === 'signed & published' ||
    normalized === 'approved & dispensed' ||
    normalized === 'current'
  ) {
    styles = 'bg-brand-green-50 text-brand-green-700 border-brand-green-200';
    dotColor = 'bg-brand-green-500';
  } else if (
    normalized === 'vendor assigned' ||
    normalized === 'nurse assigned' ||
    normalized === 'nurse confirmed' ||
    normalized === 'nurse notified' ||
    normalized === 'assigned' ||
    normalized === 'collector assigned' ||
    normalized === 'phlebotomist assigned' ||
    normalized === 'collector accepted' ||
    normalized === 'collection scheduled'
  ) {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    dotColor = 'bg-emerald-600';
  } else if (
    normalized === 'new' ||
    normalized === 'new request' ||
    normalized === 'new order' ||
    normalized === 'booked'
  ) {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (
    normalized === 'vendor confirmation' ||
    normalized === 'vendor confirmation pending' ||
    normalized === 'nurse contacted' ||
    normalized === 'report ready' ||
    normalized === 'report uploaded' ||
    normalized === 'uploaded'
  ) {
    styles = 'bg-purple-50 text-purple-700 border-purple-200';
    dotColor = 'bg-purple-500';
  } else if (
    normalized === 'accepted' ||
    normalized === 'on the way' ||
    normalized === 'arrived' ||
    normalized === 'patient verified' ||
    normalized === 'payment link sent' ||
    normalized === 'awaiting payment' ||
    normalized === 'payment pending' ||
    normalized === 'ending soon' ||
    normalized === 'preparing' ||
    normalized === 'busy'
  ) {
    styles = 'bg-amber-50 text-amber-800 border-amber-300';
    dotColor = 'bg-amber-500';
  } else if (
    normalized === 'delivery scheduled' ||
    normalized === 'pending' ||
    normalized === 'pending review' ||
    normalized === 'pending verification' ||
    normalized === 'pending collection' ||
    normalized === 'report pending' ||
    normalized === 'scheduled' ||
    normalized === 'drafting review' ||
    normalized === 'awaiting results' ||
    normalized === 'under review' ||
    normalized === 'analyzer queued'
  ) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (
    normalized === 'in progress' ||
    normalized === 'processing' ||
    normalized === 'in transit' ||
    normalized === 'sample collected' ||
    normalized === 'sample received' ||
    normalized === 'sample verified' ||
    normalized === 'collected' ||
    normalized === 'received' ||
    normalized === 'in use' ||
    normalized === 'in session' ||
    normalized === 'treatment ongoing' ||
    normalized === 'packed' ||
    normalized === 'out for delivery' ||
    normalized === 'scan completed'
  ) {
    styles = 'bg-brand-teal-50 text-brand-teal-700 border-brand-teal-200';
    dotColor = 'bg-brand-teal-500 animate-pulse';
  } else if (
    normalized === 'on rent' ||
    normalized === 'active on rent' ||
    normalized === 'rental active' ||
    normalized === 'currently rented'
  ) {
    styles = 'bg-brand-aqua-50 text-brand-aqua-800 border-brand-aqua-200';
    dotColor = 'bg-brand-aqua-500';
  } else if (
    normalized === 'returned'
  ) {
    styles = 'bg-teal-50 text-teal-800 border-teal-200';
    dotColor = 'bg-teal-600';
  } else if (
    normalized === 'low stock' ||
    normalized === 'in sanitization' ||
    normalized === 'recollection required' ||
    normalized === 'recollection' ||
    normalized === 'sample issue'
  ) {
    styles = 'bg-amber-100 text-amber-900 border-amber-400 font-bold';
    dotColor = 'bg-amber-600 animate-bounce';
  } else if (
    normalized === 'critical low' ||
    normalized === 'maintenance' ||
    normalized === 'rejected' ||
    normalized === 'cancelled' ||
    normalized === 'inactive' ||
    normalized === 'offline' ||
    normalized === 'temporarily closed' ||
    normalized === 'unavailable' ||
    normalized === 'overdue' ||
    normalized === 'failed' ||
    normalized === 'refunded'
  ) {
    styles = 'bg-brand-coral-50 text-brand-coral-700 border-brand-coral-200';
    dotColor = 'bg-brand-coral-500';
  }

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-[11px]' 
    : size === 'lg' 
    ? 'px-3.5 py-1.5 text-sm' 
    : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border whitespace-nowrap shrink-0 ${sizeClasses} ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      {status}
    </span>
  );
}
