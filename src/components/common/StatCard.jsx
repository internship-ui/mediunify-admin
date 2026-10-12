import React from 'react';
import DynamicIcon from './DynamicIcon';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  iconName = 'Activity',
  trend = '+12% from yesterday',
  trendPositive = true,
  colorScheme = 'teal'
}) {
  const getColors = () => {
    switch (colorScheme) {
      case 'navy':
        return {
          iconBg: 'bg-brand-navy-100 text-brand-navy-800 border-brand-navy-200',
          hoverBorder: 'hover:border-brand-navy-300'
        };
      case 'green':
        return {
          iconBg: 'bg-brand-green-50 text-brand-green-700 border-brand-green-200',
          hoverBorder: 'hover:border-brand-green-300'
        };
      case 'coral':
        return {
          iconBg: 'bg-brand-coral-50 text-brand-coral-700 border-brand-coral-200',
          hoverBorder: 'hover:border-brand-coral-300'
        };
      case 'slate':
        return {
          iconBg: 'bg-brand-slate-100 text-brand-slate-800 border-brand-slate-200',
          hoverBorder: 'hover:border-brand-slate-300'
        };
      default:
        return {
          iconBg: 'bg-brand-teal-50 text-brand-teal-700 border-brand-teal-200',
          hoverBorder: 'hover:border-brand-teal-300'
        };
    }
  };

  const scheme = getColors();

  return (
    <div
      className={`bg-white rounded-2xl border border-brand-slate-200/80 p-5 shadow-sm transition-all duration-200 ${scheme.hoverBorder} hover:shadow-card`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-slate-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy-900 tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl border ${scheme.iconBg}`}>
          <DynamicIcon name={iconName} className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-brand-slate-100">
        <span className="text-brand-slate-500">{subtitle}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              trendPositive ? 'text-brand-green-600' : 'text-brand-coral-600'
            }`}
          >
            {trendPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
