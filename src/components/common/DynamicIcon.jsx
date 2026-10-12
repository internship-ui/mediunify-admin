import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function DynamicIcon({ name, className = "w-5 h-5", fallback = "Activity" }) {
  const IconComponent = LucideIcons[name] || LucideIcons[fallback] || LucideIcons.Activity;
  return <IconComponent className={className} />;
}
