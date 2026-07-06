import type { ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { CLIENT_AUTH_ROUTES, CLIENT_PUBLIC_ROUTES, SESSION_TERMINATED_ROUTE } from '@/shared/routing';

import { ProtectedRoute, PublicRoute } from './route-guards';
import { RootLayout } from './root-layout';
import { VerifyEmailPage } from '../routes/verify-email';
import { ForgotPasswordPage } from '../routes/forgot-password';
import { SessionEndedPage } from '../routes/session-ended';
import { DashboardLayout } from '../routes/dashboard/layout';
import { RouteErrorPage } from '@/ui/loading';
import { MyAccountRedirectRoute, SettingsRedirectRoute } from '../routes/dashboard/settings';

function lazyPage<T extends Record<string, ComponentType>>(loader: () => Promise<T>, exportName: keyof T) {
  return {
    lazy: async () => {
      const module = await loader();
      return { Component: module[exportName] };
    },
  };
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: CLIENT_PUBLIC_ROUTES.verifyEmail,
        element: <PublicRoute />,
        children: [{ index: true, element: <VerifyEmailPage /> }],
      },
      {
        path: CLIENT_PUBLIC_ROUTES.forgotPassword,
        element: <PublicRoute />,
        children: [{ index: true, element: <ForgotPasswordPage /> }],
      },
      {
        path: SESSION_TERMINATED_ROUTE,
        element: <SessionEndedPage />,
      },
      {
        path: '/',
        element: <DashboardLayout />,
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, ...lazyPage(() => import('../routes/dashboard/index'), 'DashboardPage') },
          { path: 'cart', ...lazyPage(() => import('../routes/dashboard/cart'), 'CartRoute') },
          { path: 'blog', ...lazyPage(() => import('../routes/dashboard/blog'), 'BlogRoute') },
          { path: 'blog/:slug', ...lazyPage(() => import('../routes/dashboard/blog-detail'), 'BlogPostDetailRoute') },
          { path: 'about', ...lazyPage(() => import('../routes/dashboard/about'), 'AboutRoute') },
          { path: 'partnership', ...lazyPage(() => import('../routes/dashboard/partnership'), 'PartnershipRoute') },
          {
            element: <PublicRoute />,
            children: [
              { path: 'login', ...lazyPage(() => import('../routes/dashboard/login'), 'LoginRoute') },
              { path: 'register', ...lazyPage(() => import('../routes/dashboard/register'), 'RegisterRoute') },
            ],
          },
          {
            element: <ProtectedRoute />,
            children: [
              { path: 'settings', element: <SettingsRedirectRoute /> },
              { path: 'settings/account', ...lazyPage(() => import('../routes/dashboard/settings'), 'SettingsAccountRoute') },
              { path: 'settings/general', ...lazyPage(() => import('../routes/dashboard/settings'), 'SettingsGeneralRoute') },
              { path: 'settings/billing', ...lazyPage(() => import('../routes/dashboard/settings'), 'SettingsBillingRoute') },
              { path: 'my-account', element: <MyAccountRedirectRoute /> },
            ],
          },
          { path: '*', element: <Navigate to={CLIENT_AUTH_ROUTES.dashboard} replace /> },
        ],
      },
    ],
  },
]);
