import { Outlet } from 'react-router-dom';

import { getClientLocale, getClientTheme } from '@/shared/i18n/client-locale';

import { AppProviders } from './providers';

export function RootLayout() {
  const locale = getClientLocale();
  const theme = getClientTheme();

  return (
    <AppProviders locale={locale} theme={theme}>
      <Outlet />
    </AppProviders>
  );
}
