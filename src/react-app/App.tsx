import { RouterProvider } from 'react-router-dom';
import { ThemeScript } from '@tanlabs/components';

import { CLIENT_THEME_COOKIE } from '@/auth-config';

import { router } from './app/router';

export function App() {
  return (
    <>
      <ThemeScript themeCookieName={CLIENT_THEME_COOKIE} />
      <RouterProvider router={router} />
    </>
  );
}
