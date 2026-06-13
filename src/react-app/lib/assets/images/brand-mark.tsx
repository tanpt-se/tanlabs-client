import { BRAND } from '@tanlabs/config';

export function BrandMark({
  app,
  className,
  compact = false,
}: {
  app: 'web' | 'admin';
  className?: string;
  compact?: boolean;
}) {
  const accent = app === 'admin' ? '#f97316' : '#0f766e';
  const label = app === 'admin' ? BRAND.adminTitle : BRAND.webTitle;

  return (
    <span className={className}>
      <svg
        aria-hidden="true"
        viewBox="0 0 112 112"
        className="h-12 w-12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="8" y="8" width="96" height="96" rx="28" fill="#111827" />
        <path
          d="M32 37.5C32 30.5964 37.5964 25 44.5 25H67.5C74.4036 25 80 30.5964 80 37.5V48.75C80 55.6536 74.4036 61.25 67.5 61.25H53.25L38.5 77V61.25H44.5C37.5964 61.25 32 55.6536 32 48.75V37.5Z"
          fill={accent}
        />
        <path
          d="M44 42H68M44 50H60"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {compact ? null : (
        <span className="ml-3 inline-flex flex-col align-middle">
          <span className="text-[0.65rem] font-semibold tracking-[0.28em] text-(--text-muted) uppercase">
            {BRAND.shortName}
          </span>
          <span className="text-sm font-semibold text-(--text-strong)">{label}</span>
        </span>
      )}
    </span>
  );
}
