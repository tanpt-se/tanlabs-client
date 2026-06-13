export const LOCALE_OPTIONS = [
  { value: 'en' as const, label: 'English' },
  { value: 'vi' as const, label: 'Tieng Viet' },
  { value: 'ja' as const, label: 'Japanese' },
  { value: 'ko' as const, label: 'Korean' },
];

export type LocaleOption = (typeof LOCALE_OPTIONS)[number]['value'];

export const LANGUAGE_LABELS: Record<LocaleOption, string> = {
  en: 'Language',
  vi: 'Ngon ngu',
  ja: '言語',
  ko: '언어',
};
