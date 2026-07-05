import { createBrowserRouter, Navigate } from 'react-router-dom';

import { CLIENT_AUTH_ROUTES, CLIENT_PUBLIC_ROUTES, SESSION_TERMINATED_ROUTE } from '@/shared/routing';

import { ProtectedRoute, PublicRoute } from './route-guards';
import { RootLayout } from './root-layout';
import { LoginPage } from '../routes/login';
import { RegisterPage } from '../routes/register';
import { VerifyEmailPage } from '../routes/verify-email';
import { ForgotPasswordPage } from '../routes/forgot-password';
import { SessionEndedPage } from '../routes/session-ended';
import { DashboardLayout } from '../routes/dashboard/layout';
import { DashboardPage } from '../routes/dashboard/index';
import { MyAccountRedirectRoute, SettingsRoute } from '../routes/dashboard/settings';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: CLIENT_PUBLIC_ROUTES.login,
        element: <PublicRoute />,
        children: [{ index: true, element: <LoginPage /> }],
      },
      {
        path: CLIENT_PUBLIC_ROUTES.register,
        element: <PublicRoute />,
        children: [{ index: true, element: <RegisterPage /> }],
      },
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
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'settings', element: <SettingsRoute /> },
              { path: 'my-account', element: <MyAccountRedirectRoute /> },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to={CLIENT_AUTH_ROUTES.dashboard} replace />,
      },
    ],
  },
]);
