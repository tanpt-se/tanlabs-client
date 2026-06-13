import { BRAND } from './brand';

export interface AuthMailSubjects {
  passwordResetSubject: string;
  emailOtpSubject: string;
  emailVerificationSubject: string;
  accountSetupSubject: string;
}

export const AUTH_MAIL_SUBJECTS: AuthMailSubjects = {
  passwordResetSubject: `Your ${BRAND.name} password reset link`,
  emailOtpSubject: `Your ${BRAND.name} verification code`,
  emailVerificationSubject: `Verify your ${BRAND.name} email`,
  accountSetupSubject: `Set up your ${BRAND.name} account`,
};
