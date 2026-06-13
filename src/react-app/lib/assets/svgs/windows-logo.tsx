export function WindowsLogo({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M2 4.94 10.5 3.8v8.03H2V4.94Zm9.45-1.27L22 2v9.83h-10.55V3.67ZM2 12.85h8.5v8.11L2 19.78v-6.93Zm9.45 0H22V22l-10.55-1.49v-7.66Z" />
    </svg>
  );
}
