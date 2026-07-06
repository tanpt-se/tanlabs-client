import { type Locale, isLocale } from '@/lib/platform';

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
