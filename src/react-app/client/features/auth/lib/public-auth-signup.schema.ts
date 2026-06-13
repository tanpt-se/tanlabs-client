import { z } from 'zod';

import { checkPasswordPolicy } from './password-policy';

export function createRegisterSchema(
  lang: {
    validation: {
      emailRequired: string;
      emailInvalid: string;
      displayNameRequired: string;
      passwordLength: string;
      confirmPasswordRequired: string;
      captchaRequired: string;
      passwordLetterNumber: string;
      passwordBlocked: string;
      passwordContainsEmail: string;
      passwordContainsEmailLocalPart: string;
      passwordTooWeak: string;
      confirmPasswordMismatch: string;
    };
  },
  options: { requiresCaptcha?: boolean } = {},
) {
  const captchaSchema = options.requiresCaptcha
    ? z.string().min(1, lang.validation.captchaRequired)
    : z.string().optional().default('');

  return z
    .object({
      email: z
        .string()
        .trim()
        .min(1, lang.validation.emailRequired)
        .email(lang.validation.emailInvalid),
      displayName: z.string().trim().min(1, lang.validation.displayNameRequired),
      password: z
        .string()
        .min(10, lang.validation.passwordLength)
        .max(128, lang.validation.passwordLength),
      confirmPassword: z.string().min(1, lang.validation.confirmPasswordRequired),
      captchaToken: captchaSchema,
    })
    .superRefine((value, ctx) => {
      const policyError = checkPasswordPolicy(
        value.password,
        {
          letterNumber: lang.validation.passwordLetterNumber,
          blocked: lang.validation.passwordBlocked,
          containsEmail: lang.validation.passwordContainsEmail,
          containsEmailLocalPart: lang.validation.passwordContainsEmailLocalPart,
          tooWeak: lang.validation.passwordTooWeak,
        },
        value.email,
        [value.displayName],
      );
      if (policyError) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: policyError });
      }
      if (value.password !== value.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: lang.validation.confirmPasswordMismatch,
        });
      }
    });
}

export function createVerifyEmailSchema(lang: {
  validation: { codeRequired: string; codeInvalid: string };
}) {
  return z.object({
    code: z
      .string()
      .trim()
      .min(1, lang.validation.codeRequired)
      .length(6, lang.validation.codeInvalid)
      .regex(/^\d{6}$/, lang.validation.codeInvalid),
  });
}

export function createAccountSetupSchema(lang: {
  validation: {
    tokenRequired: string;
    newPasswordLength: string;
    confirmPasswordRequired: string;
    newPasswordLetterNumber: string;
    newPasswordBlocked: string;
    newPasswordTooWeak: string;
    confirmPasswordMismatch: string;
  };
}) {
  return z
    .object({
      token: z.string().trim().min(1, lang.validation.tokenRequired),
      newPassword: z
        .string()
        .min(10, lang.validation.newPasswordLength)
        .max(128, lang.validation.newPasswordLength),
      confirmPassword: z.string().min(1, lang.validation.confirmPasswordRequired),
    })
    .superRefine((value, ctx) => {
      const policyError = checkPasswordPolicy(value.newPassword, {
        letterNumber: lang.validation.newPasswordLetterNumber,
        blocked: lang.validation.newPasswordBlocked,
        containsEmail: '',
        containsEmailLocalPart: '',
        tooWeak: lang.validation.newPasswordTooWeak,
      });
      if (policyError) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['newPassword'], message: policyError });
      }
      if (value.newPassword !== value.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: lang.validation.confirmPasswordMismatch,
        });
      }
    });
}
