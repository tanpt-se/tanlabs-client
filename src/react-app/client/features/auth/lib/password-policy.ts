import zxcvbn from 'zxcvbn';

export const BLOCKED_PASSWORDS = new Set([
  'password',
  'password123',
  '12345678',
  '123456789',
  'qwerty123',
  'letmein123',
  'admin1234',
  'welcome123',
]);

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getLocalPart(email: string): string {
  return normalizeEmail(email).split('@')[0] ?? '';
}

export interface PasswordPolicyMessages {
  letterNumber: string;
  blocked: string;
  containsEmail: string;
  containsEmailLocalPart: string;
  tooWeak: string;
}

export function checkPasswordPolicy(
  password: string,
  messages: PasswordPolicyMessages,
  email?: string,
  extraUserInputs: string[] = [],
): string | null {
  const normalizedPassword = password.toLowerCase();

  if (!/[a-z]/i.test(password) || !/\d/.test(password)) {
    return messages.letterNumber;
  }

  if (BLOCKED_PASSWORDS.has(normalizedPassword)) {
    return messages.blocked;
  }

  const normalizedEmail = email ? normalizeEmail(email) : '';
  const localPart = email ? getLocalPart(email) : '';

  if (
    email &&
    (normalizedPassword === normalizedEmail || normalizedPassword.includes(normalizedEmail))
  ) {
    return messages.containsEmail;
  }

  if (email && localPart.length >= 4 && normalizedPassword.includes(localPart)) {
    return messages.containsEmailLocalPart;
  }

  const userInputs = email ? [normalizedEmail, localPart, ...extraUserInputs] : extraUserInputs;
  if (zxcvbn(password, userInputs).score < 2) {
    return messages.tooWeak;
  }

  return null;
}
