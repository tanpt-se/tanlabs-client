import { type Locale, isLocale } from '@tanlabs/platform';

export function LocaleFlagAsset({ locale }: { locale: Locale }) {
  if (locale === 'vi') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 rounded-[3px]" aria-hidden="true">
        <rect width="24" height="24" rx="2" fill="#DA251D" />
        <path
          d="m12 6.4 1.4 4.1h4.3l-3.5 2.5 1.3 4.1L12 14.7 8.5 17.1l1.3-4.1-3.5-2.5h4.3L12 6.4Z"
          fill="#FFDD00"
        />
      </svg>
    );
  }

  if (locale === 'ja') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 rounded-[3px]" aria-hidden="true">
        <rect width="24" height="24" rx="2" fill="#fff" />
        <circle cx="12" cy="12" r="5.2" fill="#BC002D" />
      </svg>
    );
  }

  if (locale === 'ko') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 rounded-[3px]" aria-hidden="true">
        <rect width="24" height="24" rx="2" fill="#fff" />
        <path
          d="M12 7.4a4.6 4.6 0 0 1 4.6 4.6H12a2.3 2.3 0 0 0-2.3 2.3A4.6 4.6 0 0 1 12 7.4Z"
          fill="#C60C30"
        />
        <path
          d="M12 16.6a4.6 4.6 0 0 1-4.6-4.6H12a2.3 2.3 0 0 0 2.3-2.3A4.6 4.6 0 0 1 12 16.6Z"
          fill="#003478"
        />
        <g stroke="#111827" strokeWidth="1.1" strokeLinecap="round">
          <path d="M5.2 7.2h3M5.7 8.6h3M5.2 10h3" />
          <path d="M15.8 14h3M15.3 15.4h3M15.8 16.8h3" />
          <path d="M15.8 7.2h3M15.8 8.6h3M15.8 10h3" />
          <path d="M5.2 14h3M5.2 15.4h3M5.2 16.8h3" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 rounded-[3px]" aria-hidden="true">
      <rect width="24" height="24" rx="2" fill="#fff" />
      <path d="M0 3h24v3H0ZM0 9h24v3H0ZM0 15h24v3H0ZM0 21h24v3H0Z" fill="#B22234" />
      <rect width="10.5" height="10.5" rx="2" fill="#3C3B6E" />
      <g fill="#fff">
        <circle cx="2.3" cy="2.4" r=".45" />
        <circle cx="4.4" cy="2.4" r=".45" />
        <circle cx="6.5" cy="2.4" r=".45" />
        <circle cx="8.6" cy="2.4" r=".45" />
        <circle cx="3.35" cy="4.1" r=".45" />
        <circle cx="5.45" cy="4.1" r=".45" />
        <circle cx="7.55" cy="4.1" r=".45" />
        <circle cx="2.3" cy="5.8" r=".45" />
        <circle cx="4.4" cy="5.8" r=".45" />
        <circle cx="6.5" cy="5.8" r=".45" />
        <circle cx="8.6" cy="5.8" r=".45" />
        <circle cx="3.35" cy="7.5" r=".45" />
        <circle cx="5.45" cy="7.5" r=".45" />
        <circle cx="7.55" cy="7.5" r=".45" />
      </g>
    </svg>
  );
}

export function LocaleFlag({ locale }: { locale?: Locale | string }) {
  return <LocaleFlagAsset locale={isLocale(locale) ? locale : 'en'} />;
}
