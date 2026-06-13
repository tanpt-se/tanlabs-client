import { z } from 'zod';

export function createForgotPasswordSchema(lang: {
  validation: { emailRequired: string; emailInvalid: string };
}) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, lang.validation.emailRequired)
      .email(lang.validation.emailInvalid),
  });
}

export function createResetPasswordSchema(lang: {
  validation: {
    tokenRequired: string;
    newPasswordRequired: string;
    newPasswordLength: string;
    confirmPasswordRequired: string;
    confirmPasswordMismatch: string;
  };
}) {
  return z
    .object({
      token: z.string().trim().min(1, lang.validation.tokenRequired),
      newPassword: z
        .string()
        .min(1, lang.validation.newPasswordRequired)
        .min(10, lang.validation.newPasswordLength)
        .max(128, lang.validation.newPasswordLength),
      confirmPassword: z.string().min(1, lang.validation.confirmPasswordRequired),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
      path: ['confirmPassword'],
      message: lang.validation.confirmPasswordMismatch,
    });
}
