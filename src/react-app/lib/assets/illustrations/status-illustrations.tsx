import type { ReactNode } from 'react';

function StatusFrame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true" className={className}>
      <rect x="16" y="20" width="288" height="140" rx="16" className="fill-current opacity-10" />
      <rect x="28" y="32" width="264" height="116" rx="12" className="fill-current opacity-5" />
      {children}
    </svg>
  );
}

export function StatusNotFoundIllustration({ className = 'h-36 w-auto' }: { className?: string }) {
  return (
    <StatusFrame className={className}>
      <circle cx="104" cy="92" r="22" className="fill-current opacity-20" />
      <circle cx="214" cy="78" r="18" className="fill-current opacity-25" />
      <path
        d="M150 72h32a12 12 0 0 1 12 12v28a12 12 0 0 1-12 12h-32a12 12 0 0 1-12-12V84a12 12 0 0 1 12-12Z"
        className="fill-current opacity-35"
      />
      <path d="M162 86h8v24h-8zM162 114h8v8h-8z" className="fill-current opacity-90" />
      <path
        d="M70 128h180"
        className="stroke-current opacity-25"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </StatusFrame>
  );
}

export function StatusErrorIllustration({ className = 'h-36 w-auto' }: { className?: string }) {
  return (
    <StatusFrame className={className}>
      <path d="M96 128 136 60l40 68Z" className="fill-current opacity-25" />
      <path d="M144 88h8v20h-8zM144 112h8v8h-8z" className="fill-current opacity-90" />
      <rect x="186" y="66" width="38" height="38" rx="8" className="fill-current opacity-20" />
      <path
        d="m196 76 18 18m0-18-18 18"
        className="stroke-current opacity-90"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M82 136h156"
        className="stroke-current opacity-25"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </StatusFrame>
  );
}

export function StatusSessionIllustration({ className = 'h-36 w-auto' }: { className?: string }) {
  return (
    <StatusFrame className={className}>
      <rect x="98" y="58" width="124" height="74" rx="12" className="fill-current opacity-20" />
      <path
        d="M136 88h48"
        className="stroke-current opacity-85"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M112 100h96"
        className="stroke-current opacity-25"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="m208 80 20 20m0-20-20 20"
        className="stroke-current opacity-90"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M88 140h144"
        className="stroke-current opacity-25"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </StatusFrame>
  );
}
