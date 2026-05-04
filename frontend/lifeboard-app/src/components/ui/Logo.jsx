function Logo({ size = 'md' }) {
  const sizes = {
    sm: { box: 48, total: 180 },
    md: { box: 72, total: 240 },
    lg: { box: 96, total: 320 }
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center">
      <svg
        width={s.box}
        height={s.box}
        viewBox="0 0 88 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa"/>
            <stop offset="100%" stopColor="#3b82f6"/>
          </linearGradient>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6"/>
            <stop offset="100%" stopColor="#06b6d4"/>
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Glow top */}
        <ellipse cx="44" cy="10" rx="36" ry="10" fill="url(#glowGrad)" opacity="0.6"/>

        {/* Icon background */}
        <rect x="0" y="0" width="88" height="88" rx="20" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5"/>

        {/* Grid lines */}
        <line x1="20" y1="20" x2="20" y2="58" stroke="#3b82f6" strokeWidth="0.8" opacity="0.3"/>
        <line x1="44" y1="20" x2="44" y2="58" stroke="#3b82f6" strokeWidth="0.8" opacity="0.3"/>
        <line x1="68" y1="20" x2="68" y2="58" stroke="#3b82f6" strokeWidth="0.8" opacity="0.3"/>
        <line x1="12" y1="36" x2="76" y2="36" stroke="#3b82f6" strokeWidth="0.8" opacity="0.3"/>
        <line x1="12" y1="52" x2="76" y2="52" stroke="#3b82f6" strokeWidth="0.8" opacity="0.3"/>

        {/* Bars */}
        <rect x="16" y="46" width="10" height="12" rx="2" fill="url(#accentGrad)" opacity="0.6"/>
        <rect x="32" y="34" width="10" height="24" rx="2" fill="url(#iconGrad)"/>
        <rect x="48" y="38" width="10" height="20" rx="2" fill="url(#accentGrad)" opacity="0.8"/>
        <rect x="64" y="28" width="10" height="30" rx="2" fill="url(#iconGrad)"/>

        {/* Trend line */}
        <polyline points="21,46 37,32 53,36 69,26" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="21" cy="46" r="2" fill="#93c5fd"/>
        <circle cx="37" cy="32" r="2" fill="#93c5fd"/>
        <circle cx="53" cy="36" r="2" fill="#93c5fd"/>
        <circle cx="69" cy="26" r="2.5" fill="#60a5fa"/>

        {/* Light reflection */}
        <rect x="0" y="0" width="88" height="18" rx="20" fill="white" opacity="0.05"/>
        <rect x="10" y="2" width="50" height="6" rx="3" fill="white" opacity="0.08"/>
      </svg>
    </div>
  );
}

export default Logo;