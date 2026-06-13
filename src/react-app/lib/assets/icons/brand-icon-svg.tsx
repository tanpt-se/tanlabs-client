import { BRAND } from '@tanlabs/config';

export function BrandIconSvg({
  app,
  size = 32,
}: {
  app: 'web' | 'admin' | 'mobile';
  size?: number;
}) {
  const accent = app === 'admin' ? '#f97316' : '#171717';
  const label = BRAND.shortName.slice(0, 2);

  return (
    <svg
      viewBox="0 0 128 128"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="128" height="128" rx="36" fill="#111827" />
      <rect x="20" y="20" width="88" height="88" rx="28" fill={accent} />
      <path
        d="M42 48C42 43.5817 45.5817 40 50 40H78C82.4183 40 86 43.5817 86 48V56C86 60.4183 82.4183 64 78 64H61L48 78V64H50C45.5817 64 42 60.4183 42 56V48Z"
        fill="#111827"
      />
      <text
        x="64"
        y="96"
        textAnchor="middle"
        fontSize="20"
        fontWeight="700"
        fill="white"
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}
