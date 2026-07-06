import { resolveAuthNoticeByReason } from '@/features/auth/lib/login-validation';
import type { ClientLang } from '@/shared/i18n';

export function resolveLoginNotice(reason: string | undefined, lang: ClientLang['login']) {
  return resolveAuthNoticeByReason(reason, {
    'session-revoked': {
      title: lang.forcedLogoutTitle,
      description: lang.forcedLogoutDescription,
    },
    'session-ended': {
      title: lang.sessionEndedTitle,
      description: lang.sessionEndedDescription,
    },
    'social-auth-failed': {
      title: lang.socialAuthFailedTitle,
      description: lang.socialAuthFailedDescription,
    },
    'social-auth-registration-required': {
      title: lang.socialRegistrationRequiredTitle,
      description: lang.socialRegistrationRequiredDescription,
    },
    'social-auth-email-unverified': {
      title: lang.socialEmailUnverifiedTitle,
      description: lang.socialEmailUnverifiedDescription,
    },
    'social-auth-account-locked': {
      title: lang.socialAccountLockedTitle,
      description: lang.socialAccountLockedDescription,
    },
  });
}
