import React from 'react';

/**
 * Maps tube container string or test code to clinical standard color
 */
export function getTubeColorInfo(tubeStr = '', testCode = '') {
  const str = String(tubeStr || testCode).toLowerCase();

  if (str.includes('purple') || str.includes('lavender') || str.includes('edta') || str.includes('cbc') || str.includes('hba1c')) {
    return {
      name: 'Lavender / EDTA',
      bg: 'bg-purple-500',
      hex: '#9333ea',
      border: 'border-purple-300',
      text: 'text-purple-900',
      ring: 'ring-purple-400',
      short: 'EDTA'
    };
  }

  if (str.includes('grey') || str.includes('gray') || str.includes('fluoride') || str.includes('glu') || str.includes('glucose')) {
    return {
      name: 'Grey / Fluoride',
      bg: 'bg-slate-400',
      hex: '#94a3b8',
      border: 'border-slate-300',
      text: 'text-slate-900',
      ring: 'ring-slate-400',
      short: 'Fluoride'
    };
  }

  if (str.includes('gold') || str.includes('yellow') || str.includes('sst') || str.includes('gel') || str.includes('lip') || str.includes('lft') || str.includes('kft') || str.includes('serum') || str.includes('red')) {
    return {
      name: 'Gold / SST Gel',
      bg: 'bg-amber-400',
      hex: '#f59e0b',
      border: 'border-amber-300',
      text: 'text-amber-900',
      ring: 'ring-amber-400',
      short: 'SST'
    };
  }

  if (str.includes('urine') || str.includes('sterile') || str.includes('urn') || str.includes('cup') || str.includes('container')) {
    return {
      name: 'Sterile Container (Urine)',
      bg: 'bg-teal-500',
      hex: '#0d9488',
      border: 'border-teal-300',
      text: 'text-teal-900',
      ring: 'ring-teal-400',
      short: 'Urine'
    };
  }

  if (str.includes('blue') || str.includes('citrate') || str.includes('pt') || str.includes('coag')) {
    return {
      name: 'Light Blue / Citrate',
      bg: 'bg-sky-500',
      hex: '#0ea5e9',
      border: 'border-sky-300',
      text: 'text-sky-900',
      ring: 'ring-sky-400',
      short: 'Citrate'
    };
  }

  if (str.includes('green') || str.includes('heparin')) {
    return {
      name: 'Green / Heparin',
      bg: 'bg-emerald-500',
      hex: '#10b981',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      ring: 'ring-emerald-400',
      short: 'Heparin'
    };
  }

  return {
    name: tubeStr || 'Standard Specimen Tube',
    bg: 'bg-teal-500',
    hex: '#0d9488',
    border: 'border-teal-300',
    text: 'text-teal-900',
    ring: 'ring-teal-400',
    short: 'Tube'
  };
}

/**
 * Pure Color-Only Indicator (No words, just the color dot with title tooltip)
 */
export default function TubeColorDot({ tube, testCode, size = 'md', className = '' }) {
  const colorInfo = getTubeColorInfo(tube, testCode);

  const sizeClasses = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size] || 'w-4 h-4';

  return (
    <span
      className={`inline-block rounded-full shadow-xs border border-white/80 ring-1 ring-slate-300/60 flex-shrink-0 transition-transform hover:scale-125 ${sizeClasses} ${colorInfo.bg} ${className}`}
      title={colorInfo.name}
      aria-label={colorInfo.name}
    />
  );
}

/**
 * Multiple Color Dots Display for Packages (e.g. 7 Tests -> Lavender, Grey, Gold, Teal dots)
 */
export function TubeColorGroup({ tests = [], tubes = [], size = 'sm' }) {
  const uniqueTubes = [];
  const seenColors = new Set();

  if (tubes && tubes.length > 0) {
    tubes.forEach((t) => {
      const info = getTubeColorInfo(t.tubeIdentifier || t.container || t);
      if (!seenColors.has(info.hex)) {
        seenColors.add(info.hex);
        uniqueTubes.push(info);
      }
    });
  } else if (tests && tests.length > 0) {
    tests.forEach((t) => {
      const info = getTubeColorInfo(t.tubeIdentifier || t.tubeContainer || t.sampleRequired || t.code);
      if (!seenColors.has(info.hex)) {
        seenColors.add(info.hex);
        uniqueTubes.push(info);
      }
    });
  } else {
    // Default complete health screening package standard tubes: Lavender, Grey, Gold, Teal
    uniqueTubes.push(
      getTubeColorInfo('purple'),
      getTubeColorInfo('grey'),
      getTubeColorInfo('gold'),
      getTubeColorInfo('urine')
    );
  }

  const dotSize = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size] || 'w-3 h-3';

  return (
    <div className="flex items-center gap-1.5" title={uniqueTubes.map((t) => t.name).join(' • ')}>
      {uniqueTubes.map((t, idx) => (
        <span
          key={idx}
          className={`inline-block rounded-full shadow-xs border border-white ring-1 ring-slate-200 hover:scale-125 transition-transform ${dotSize} ${t.bg}`}
          title={t.name}
        />
      ))}
    </div>
  );
}
