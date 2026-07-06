export const LOCALE_OPTIONS = [
  { value: 'en' as const, label: 'English' },
  { value: 'vi' as const, label: 'Tieng Viet' },
];

export type LocaleOption = (typeof LOCALE_OPTIONS)[number]['value'];

export const LANGUAGE_LABELS: Record<LocaleOption, string> = {
  en: 'Language',
  vi: 'Ngon ngu',
};
