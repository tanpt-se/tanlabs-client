export function DarkBackground() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern id="auth-bg-dark-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1" fill="rgba(255,255,255,0.08)" />
        </pattern>
        <radialGradient id="auth-bg-dark-glow-left" cx="0" cy="0" r="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(96,165,250,0)" />
        </radialGradient>
        <radialGradient id="auth-bg-dark-glow-right" cx="0" cy="0" r="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(248,250,252,0)" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="#09090b" />
      <rect width="1600" height="1000" fill="url(#auth-bg-dark-grid)" />
      <circle cx="220" cy="180" r="320" fill="url(#auth-bg-dark-glow-left)" />
      <circle cx="1360" cy="120" r="240" fill="url(#auth-bg-dark-glow-right)" />
    </svg>
  );
}

export function LightBackground() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern id="auth-bg-light-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1" fill="rgba(24,24,27,0.08)" />
        </pattern>
        <radialGradient id="auth-bg-light-glow-left" cx="0" cy="0" r="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="100%" stopColor="rgba(56,189,248,0)" />
        </radialGradient>
        <radialGradient id="auth-bg-light-glow-right" cx="0" cy="0" r="1">
          <stop offset="0%" stopColor="rgba(24,24,27,0.05)" />
          <stop offset="100%" stopColor="rgba(15,28,43,0)" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="#f8f8f9" />
      <rect width="1600" height="1000" fill="url(#auth-bg-light-grid)" />
      <circle cx="220" cy="160" r="320" fill="url(#auth-bg-light-glow-left)" />
      <circle cx="1360" cy="120" r="240" fill="url(#auth-bg-light-glow-right)" />
    </svg>
  );
}
