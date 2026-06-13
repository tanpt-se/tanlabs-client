export const CLIENT_API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verifyEmail: '/auth/email-verification/verify',
    resendEmailVerification: '/auth/email-verification/resend',
    forgotPassword: '/auth/forgot-password',
  },
  account: {
    me: '/users/me',
  },
} as const;

export { withQuery } from '@tanlabs/contracts';
