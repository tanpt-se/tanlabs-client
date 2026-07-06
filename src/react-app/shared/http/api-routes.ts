export const CLIENT_API_ROUTES = {
  auth: {
    publicConfig: '/auth/public-config',
    login: '/auth/login',
    register: '/auth/register',
    verifyEmail: '/auth/email-verification/verify',
    resendEmailVerification: '/auth/email-verification/resend',
    forgotPassword: '/auth/forgot-password',
  },
  account: {
    me: '/users/me',
  },
  blog: {
    categories: '/blog/categories',
    posts: '/blog/posts',
    post: (slug: string) => `/blog/posts/${slug}`,
  },
} as const;

export { withQuery } from '@tanlabs/contracts';
