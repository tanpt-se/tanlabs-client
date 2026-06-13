import type { PublicInfoPanelText, ShellBaseText } from '@tanlabs/components';
import { BRAND } from '@tanlabs/config';
import { shellChromeEn } from '@tanlabs/web-common/i18n/shell-base-en';

const shell = {
  ...shellChromeEn,
  title: `${BRAND.shortName} CLIENT`,
  consoleTitle: 'Client Console',
  fallbackUser: 'Client User',
  settings: {
    label: 'Settings',
    title: 'Security and session tools',
    description: 'Manage active sessions and configure two-factor authentication from this area.',
    close: 'Close settings',
  },
  nav: {
    dashboard: 'Dashboard',
    myAccount: 'Account',
    sessions: 'Sessions',
  },
  settingsItems: {
    userInformation: {
      title: 'User information',
      description: 'Review account details and update password.',
    },
    twoFactor: {
      title: 'Two-factor',
      description: 'Manage two-factor authentication settings.',
    },
  },
  testItems: {
    login: {
      title: 'Login',
      description: 'Test email/password sign-in.',
    },
    forgotPassword: {
      title: 'Forgot password',
      description: 'Test recovery request flow.',
    },
    resetPassword: {
      title: 'Reset password',
      description: 'Test password reset completion.',
    },
  },
} satisfies ShellBaseText & {
  settings: {
    label: string;
    title: string;
    description: string;
    close: string;
  };
  nav: {
    dashboard: string;
    myAccount: string;
    sessions: string;
  };
  settingsItems: {
    userInformation: { title: string; description: string };
    twoFactor: { title: string; description: string };
  };
  testItems: {
    login: { title: string; description: string };
    forgotPassword: { title: string; description: string };
    resetPassword: { title: string; description: string };
  };
};

const home = {
  apiTitle: 'API usage',
  apiDescription: 'Main sign-in flow uses these auth endpoints.',
  capabilitiesTitle: 'Capabilities',
  capabilitiesDescription: 'Main behaviors exposed by this login flow.',
  capabilities: ['Access token in memory', 'Refresh cookie strict', '2FA handled as branch'],
  formTitle: 'Sign in',
  formDescription: 'Enter your User Portal credentials to continue.',
  fields: {
    email: 'Email',
    password: 'Password',
  },
  placeholders: {
    email: 'user@example.com',
    password: 'Enter your password',
  },
  submit: 'Sign in',
  forgotPassword: 'Forgot password?',
} satisfies PublicInfoPanelText & {
  formTitle: string;
  formDescription: string;
  fields: { email: string; password: string };
  placeholders: { email: string; password: string };
  submit: string;
  forgotPassword: string;
};

const login = {
  apiTitle: 'API usage',
  apiDescription: 'Login flow can branch into refresh and logout handling.',
  capabilitiesTitle: 'Capabilities',
  capabilitiesDescription: 'Main behaviors exposed by this login flow.',
  capabilities: ['Access token in memory', 'Refresh cookie strict', '2FA handled as branch'],
  formTitle: 'Sign in',
  formDescription: 'Enter your User Portal credentials to continue.',
  twoFactorStepTitle: 'Two-factor verification required',
  twoFactorStepDescription:
    'Your email and password are accepted. Complete the verification step to finish signing in.',
  fields: {
    email: 'Email',
    password: 'Password',
    code: '2FA code',
    emailOtpCode: 'Email OTP',
    authenticatorCode: 'Authenticator code',
  },
  placeholders: {
    email: 'user@example.com',
    password: 'Enter your password',
    code: 'Shown only when required by the server',
  },
  submit: 'Sign in',
  verifyAndSignIn: 'Verify and Sign in',
  authenticating: 'Authenticating...',
  rateLimited: 'Try again later',
  orText: 'Or',
  googleSignIn: 'Sign in with Google',
  forgotPassword: 'Forgot password',
  createAccount: 'Create account',
  sessionEndedTitle: 'Session ended',
  sessionEndedDescription:
    'Your session is no longer active. Sign in again to continue where you left off.',
  forcedLogoutTitle: 'Signed out for security',
  forcedLogoutDescription:
    'Your account state changed or your session was revoked. Sign in again to continue.',
  socialAuthFailedTitle: 'Google sign-in failed',
  socialAuthFailedDescription: 'Unable to complete Google sign-in. Try again.',
  socialRegistrationRequiredTitle: 'Google sign-up required',
  socialRegistrationRequiredDescription:
    'This Google account has not been registered yet. Register with Google before signing in.',
  socialEmailUnverifiedTitle: 'Google email is not verified',
  socialEmailUnverifiedDescription:
    'Verify the Google account email address before using it to sign in.',
  socialAccountLockedTitle: 'Account is locked',
  socialAccountLockedDescription:
    'This account has been locked. Contact support if you believe this is a mistake.',
  loginFailed: 'Login failed',
  authErrors: {
    invalidCredentials: 'Email or password is incorrect.',
    twoFactorRequired: 'Two-factor verification is required.',
    twoFactorInvalid: 'The verification code is invalid.',
    twoFactorChallengeInvalid: 'The verification challenge is no longer valid.',
    accountLocked: 'This account is temporarily locked.',
    accountSetupRequired: 'Account setup is required before signing in.',
    emailNotVerified: 'Verify your email before signing in.',
    captchaInvalid: 'Captcha validation failed.',
    rateLimited: 'Too many attempts. Please wait until the timer finishes.',
    reauthRequired: 'Please verify your identity again.',
    tokenExpired: 'Your session expired. Please sign in again.',
    sessionRevoked: 'Your session is no longer active.',
    clientPortalOnly: 'This account can only sign in from the correct portal.',
    validationError: 'The request did not pass validation.',
    generic: 'Request failed.',
  },
  rateLimitModal: {
    eyebrow: 'Security lock',
    title: 'Too many login attempts',
    description:
      'Login is temporarily disabled. Wait until the countdown finishes before trying again.',
    countdownLabel: 'Remaining lock time',
    close: 'Rate limit active',
  },
  validation: {
    emailRequired: 'Email is required.',
    emailInvalid: 'Enter a valid email address.',
    passwordRequired: 'Password is required.',
    twoFactorCodeRequired: 'Two-factor code is required.',
    twoFactorCodeInvalid: 'Enter a valid 6-digit code.',
  },
} satisfies PublicInfoPanelText & {
  formTitle: string;
  formDescription: string;
  twoFactorStepTitle: string;
  twoFactorStepDescription: string;
  fields: {
    email: string;
    password: string;
    code: string;
    emailOtpCode: string;
    authenticatorCode: string;
  };
  placeholders: { email: string; password: string; code: string };
  submit: string;
  verifyAndSignIn: string;
  authenticating: string;
  rateLimited: string;
  orText: string;
  googleSignIn: string;
  forgotPassword: string;
  createAccount: string;
  sessionEndedTitle: string;
  sessionEndedDescription: string;
  forcedLogoutTitle: string;
  forcedLogoutDescription: string;
  socialAuthFailedTitle: string;
  socialAuthFailedDescription: string;
  socialRegistrationRequiredTitle: string;
  socialRegistrationRequiredDescription: string;
  socialEmailUnverifiedTitle: string;
  socialEmailUnverifiedDescription: string;
  socialAccountLockedTitle: string;
  socialAccountLockedDescription: string;
  loginFailed: string;
  authErrors: Record<string, string>;
  rateLimitModal: {
    eyebrow: string;
    title: string;
    description: string;
    countdownLabel: string;
    close: string;
  };
  validation: Record<string, string>;
};

const register = {
  apiTitle: 'API usage',
  apiDescription: 'Public signup creates a basic user, then requires email verification.',
  capabilitiesTitle: 'Capabilities',
  capabilitiesDescription: 'Main behaviors exposed by this registration flow.',
  capabilities: ['Basic role only', 'Email verification required', 'Captcha protected'],
  formTitle: 'Create account',
  formDescription: 'Create your User Portal account, then verify your email address.',
  fields: {
    email: 'Email',
    displayName: 'Full name',
    password: 'Password',
    confirmPassword: 'Confirm password',
  },
  placeholders: {
    email: 'user@example.com',
    displayName: 'Jane Doe',
    password: 'Choose a strong password',
    confirmPassword: 'Repeat your password',
  },
  submit: 'Create account',
  submitting: 'Creating account...',
  orText: 'Or',
  googleSignUp: 'Sign up with Google',
  backToLogin: 'Back to login',
  socialAuthFailedTitle: 'Google sign-up failed',
  socialAuthFailedDescription: 'Unable to complete Google sign-up. Try again.',
  socialEmailUnverifiedTitle: 'Google email is not verified',
  socialEmailUnverifiedDescription:
    'Verify the Google account email address before using it to register.',
  socialEmailInUseTitle: 'Email already in use',
  socialEmailInUseDescription:
    'This email has already been used in the system. Use another email or sign in normally.',
  socialAccountLockedTitle: 'Account is locked',
  socialAccountLockedDescription:
    'This account has been locked. Contact support if you believe this is a mistake.',
  authErrors: {
    captchaInvalid: 'Captcha validation failed. Please try again.',
    duplicateEmail: 'An account already exists for this email.',
    validationError: 'The request did not pass validation.',
    generic: 'Unable to create the account.',
  },
  validation: {
    emailRequired: 'Email is required.',
    emailInvalid: 'Enter a valid email address.',
    displayNameRequired: 'Full name is required.',
    passwordLength: 'Password must be between 10 and 128 characters.',
    passwordLetterNumber: 'Password must contain at least one letter and one number.',
    passwordBlocked: 'Choose a password that is not a blocked common password.',
    passwordContainsEmail: 'Password must not contain your email address.',
    passwordContainsEmailLocalPart: 'Password must not contain the email username.',
    passwordTooWeak: 'Password is too weak. Choose a stronger password.',
    confirmPasswordRequired: 'Please confirm the password.',
    confirmPasswordMismatch: 'Confirmation password does not match.',
    captchaRequired: 'Captcha verification is required.',
  },
} satisfies PublicInfoPanelText & {
  formTitle: string;
  formDescription: string;
  fields: Record<string, string>;
  placeholders: Record<string, string>;
  submit: string;
  submitting: string;
  orText: string;
  googleSignUp: string;
  backToLogin: string;
  socialAuthFailedTitle: string;
  socialAuthFailedDescription: string;
  socialEmailUnverifiedTitle: string;
  socialEmailUnverifiedDescription: string;
  socialEmailInUseTitle: string;
  socialEmailInUseDescription: string;
  socialAccountLockedTitle: string;
  socialAccountLockedDescription: string;
  authErrors: Record<string, string>;
  validation: Record<string, string>;
};

const forgotPassword = {
  apiTitle: 'API usage',
  apiDescription: 'Recovery request stays on one generic endpoint.',
  capabilitiesTitle: 'Capabilities',
  capabilitiesDescription: 'Main behaviors exposed by this recovery flow.',
  capabilities: ['Generic response', 'No account leakage'],
  formTitle: 'Forgot password',
  formDescription: 'Enter your User Portal email to receive a reset link.',
  emailLabel: 'Email',
  emailPlaceholder: 'user@example.com',
  successTitle: 'Reset link sent',
  successDescription:
    'If the account exists, a password reset email will arrive shortly. Check your inbox and spam folder.',
  submit: 'Send reset link',
  submitting: 'Sending reset link...',
  backToLogin: 'Back to login',
  authErrors: {
    rateLimited: 'Too many recovery requests. Please wait before trying again.',
    deliveryFailed: 'Unable to send the reset email right now. Please try again shortly.',
    validationError: 'The request did not pass validation.',
    generic: 'Unable to submit the recovery request.',
  },
  validation: {
    emailRequired: 'Email is required.',
    emailInvalid: 'Enter a valid email address.',
  },
} satisfies PublicInfoPanelText & {
  formTitle: string;
  formDescription: string;
  emailLabel: string;
  emailPlaceholder: string;
  successTitle: string;
  successDescription: string;
  submit: string;
  submitting: string;
  backToLogin: string;
  authErrors: Record<string, string>;
  validation: Record<string, string>;
};

const verifyEmail = {
  apiTitle: 'API usage',
  apiDescription: 'Email verification uses a short-lived 6-digit code with resend controls.',
  capabilitiesTitle: 'Capabilities',
  capabilitiesDescription: 'Main behaviors exposed by this verification flow.',
  capabilities: ['6-digit OTP', 'Resend cooldown', 'Single-use verification'],
  formTitle: 'Verify email',
  formDescription:
    'Enter the 6-digit code sent to your email to activate your User Portal account.',
  emailLabel: 'Email',
  codeLabel: 'Verification code',
  codePlaceholder: '123456',
  submit: 'Verify email',
  submitting: 'Verifying...',
  resend: 'Resend code',
  resending: 'Resending...',
  resendCountdown: 'Resend available in {seconds}s',
  successTitle: 'Email verified',
  successDescription: 'Your email has been verified. You can sign in now.',
  authErrors: {
    invalidCode: 'The verification code is invalid.',
    expiredCode: 'The verification code has expired.',
    validationError: 'The request did not pass validation.',
    generic: 'Unable to verify the email.',
  },
  validation: {
    codeRequired: 'Verification code is required.',
    codeInvalid: 'Verification code must be a valid 6-digit code.',
  },
} satisfies PublicInfoPanelText & {
  formTitle: string;
  formDescription: string;
  emailLabel: string;
  codeLabel: string;
  codePlaceholder: string;
  submit: string;
  submitting: string;
  resend: string;
  resending: string;
  resendCountdown: string;
  successTitle: string;
  successDescription: string;
  authErrors: Record<string, string>;
  validation: Record<string, string>;
};

const accountSetup = {
  apiTitle: 'API usage',
  apiDescription: 'Account setup sets the first password, then continues to email verification.',
  capabilitiesTitle: 'Capabilities',
  capabilitiesDescription: 'Main behaviors exposed by this first-password flow.',
  capabilities: ['Secure setup link', 'Password policy enforced', 'Email verification next'],
  formTitle: 'Set your password',
  formDescription: 'Choose the first password for your invited User Portal account.',
  successTitle: 'Password saved',
  successDescription: 'Continue with email verification to finish activation.',
  fields: {
    token: 'Setup token',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
  },
  placeholders: {
    token: 'Token from the email link',
    newPassword: 'Choose a strong password',
    confirmPassword: 'Repeat the new password',
  },
  submit: 'Save password',
  submitting: 'Saving password...',
  backToLogin: 'Back to login',
  authErrors: {
    tokenExpired: 'This setup link has expired. Request a new invitation.',
    invalidResetToken: 'This setup link is invalid or has already been used.',
    validationError: 'The request did not pass validation.',
    generic: 'Unable to complete account setup.',
  },
  validation: {
    tokenRequired: 'Setup token is required.',
    newPasswordRequired: 'New password is required.',
    newPasswordLength: 'Password must be between 10 and 128 characters.',
    newPasswordLetterNumber: 'Password must contain at least one letter and one number.',
    newPasswordBlocked: 'Choose a password that is not a blocked common password.',
    newPasswordTooWeak: 'Password is too weak. Choose a stronger password.',
    confirmPasswordRequired: 'Please confirm your new password.',
    confirmPasswordMismatch: 'Confirmation password does not match.',
  },
} satisfies PublicInfoPanelText & {
  formTitle: string;
  formDescription: string;
  successTitle: string;
  successDescription: string;
  fields: Record<string, string>;
  placeholders: Record<string, string>;
  submit: string;
  submitting: string;
  backToLogin: string;
  authErrors: Record<string, string>;
  validation: Record<string, string>;
};

const resetPassword = {
  apiTitle: 'API usage',
  apiDescription: 'Password reset completion uses one token-backed endpoint.',
  capabilitiesTitle: 'Capabilities',
  capabilitiesDescription: 'Main behaviors exposed by this reset flow.',
  capabilities: ['Token required', 'Ready to continue'],
  formTitle: 'Reset password',
  formDescription: 'Create a new password to regain access to User Portal.',
  successTitle: 'Password updated',
  successDescription: 'Your password has been reset. Sign in with the new password.',
  fields: {
    token: 'Reset token',
    newPassword: 'New password',
    confirmPassword: 'Confirm password',
  },
  placeholders: {
    token: 'Paste token from email',
    newPassword: 'Choose a strong password',
    confirmPassword: 'Repeat the new password',
  },
  submit: 'Update password',
  submitting: 'Updating password...',
  backToLogin: 'Back to login',
  authErrors: {
    tokenExpired: 'This reset link has expired. Request a new one.',
    validationError: 'The request did not pass validation.',
    invalidResetToken: 'This reset link is invalid or has already been used.',
    generic: 'Unable to reset the password.',
  },
  validation: {
    tokenRequired: 'Reset token is required.',
    newPasswordRequired: 'New password is required.',
    newPasswordLength: 'Password must be between 10 and 128 characters.',
    confirmPasswordRequired: 'Confirm your new password.',
    confirmPasswordMismatch: 'Confirmation password does not match.',
  },
} satisfies PublicInfoPanelText & {
  formTitle: string;
  formDescription: string;
  successTitle: string;
  successDescription: string;
  fields: { token: string; newPassword: string; confirmPassword: string };
  placeholders: { token: string; newPassword: string; confirmPassword: string };
  submit: string;
  submitting: string;
  backToLogin: string;
  authErrors: Record<string, string>;
  validation: Record<string, string>;
};

export const enClientLang = {
  shell,
  home,
  login,
  register,
  forgotPassword,
  verifyEmail,
  accountSetup,
  resetPassword,
  dashboard: {
    breadcrumb: 'Overview',
    stats: {
      unreadNotification: 'Unread Notification',
      activeSession: 'Active Session',
      totalSessions: 'Total Sessions',
      currentSessions: 'Current Sessions',
    },
    title: 'Session Governance Overview',
    description:
      'Review active client sessions, monitor current access footprint, and jump straight into session controls.',
    openSessions: 'Open Sessions',
    openSettings: 'Open Settings',
  },
  myAccount: {
    title: 'Account',
    description: 'Review your account workspace and jump into account-level actions.',
    sections: {
      accountTitle: 'Account information',
      accountDescription: 'Review the current account profile summary.',
      securityTitle: 'Account Security',
      securityDescription: 'Manage security settings for this account.',
      controlsTitle: 'Account Controls',
      controlsDescription: 'Support access (read-only)',
    },
    account: {
      changeImage: 'Change Image',
      removeImage: 'Remove Image',
      imageHint: 'We support PNGs, JPEGs and GIFs under 2MB',
      fallbackName: 'Client User',
      nameLabel: 'Name',
      roleLabel: 'Role',
      emailLabel: 'Email',
    },
    google: {
      title: 'Link Google account',
      description: 'Connect your Google account for easier sign-in and recovery.',
      connected: 'Connected with {email}',
      linkError: 'Unable to link Google account.',
      unlinkSuccess: 'Google account unlinked successfully.',
      unlinkError: 'Unable to unlink Google account.',
      unlinkModalTitle: 'Unlink Google account?',
      unlinkModalDescription:
        'You will no longer be able to use Google sign-in for this account until you link it again.',
      unlinkModalAction: 'Unlink account',
      unlinkModalLoading: 'Unlinking...',
      unlinkModalCancel: 'Cancel',
      currentPasswordLabel: 'Current password',
      currentPasswordPlaceholder: 'Enter your current password',
      currentPasswordRequired: 'Current password is required.',
    },
    twoFactor: {
      title: '2-Step Verifications',
      description: 'Add an additional layer of security to your account during login.',
      setupModalTitle: '2-Step Verification settings',
      setupModalDescription:
        'Scan this QR code in your authenticator app, or copy the secret below.',
      disableModalTitle: 'Disable 2-Step Verification?',
      disableModalDescription:
        'Enter your current password and TOTP code to disable 2-Step Verification.',
      disableModalAction: 'Disable',
      disableLoading: 'Disabling...',
      disableModalCancel: 'Cancel',
      setupGenerate: 'Generate TOTP secret',
      setupGenerating: 'Generating...',
      setupVerify: 'Verify 2FA',
      setupVerifying: 'Verifying...',
      setupSuccess: 'TOTP secret generated.',
      verifySuccess: '2-Step Verification enabled.',
      disableSuccess: '2-Step Verification disabled.',
      setupError: 'Unable to generate TOTP secret.',
      verifyError: 'Unable to verify 2FA setup.',
      disableError: 'Unable to disable 2FA.',
      verificationCodeLabel: 'Verification code',
      verificationCodePlaceholder: '123456',
      verificationCodeRequired: 'Verification code is required.',
      disableCodeLabel: 'Current TOTP code',
      disableCodePlaceholder: 'Required before disablement',
      disableCodeInvalid: 'Current TOTP code must be a valid 6-digit code.',
      secretLabel: 'Secret',
      copyAuthUrl: 'Copy auth URL',
      copyAuthUrlSuccess: 'Authentication URL copied.',
      copyAuthUrlError: 'Could not copy the authentication URL.',
      alreadyEnabled: 'Two-factor is already enabled for this account.',
    },
    password: {
      title: 'Password',
      description: 'Confirm your current password, then choose a stronger replacement.',
      changeAction: 'Change password',
      modalTitle: 'Change password',
      modalDescription: 'Confirm your current password, then choose a stronger replacement.',
      modalCancel: 'Cancel',
      modalSubmit: 'Save password',
      modalSubmitting: 'Saving...',
      modalSuccess: 'Password updated successfully.',
      modalError: 'Unable to update password.',
      currentPasswordLabel: 'Current password',
      currentPasswordPlaceholder: 'Enter current password',
      newPasswordLabel: 'New password',
      newPasswordPlaceholder: 'Choose a strong password',
      confirmPasswordLabel: 'Confirm new password',
      confirmPasswordPlaceholder: 'Repeat the new password',
      currentPasswordRequired: 'Current password is required.',
      newPasswordLength: 'New password must be at least 10 characters.',
      confirmPasswordMismatch: 'Confirmation password does not match.',
    },
    controls: {
      supportAccessTitle: 'Support access',
      supportAccessDescription:
        'You have granted us to access to your account for support purposes.',
      logoutAllDevicesTitle: 'Log out of all devices',
      logoutAllDevicesDescription:
        'Log out of all other active sessions on other devices besides this one.',
      logoutAction: 'Log out',
      logoutLoading: 'Logging out...',
      logoutSuccess: 'Logged out all other active devices.',
      logoutError: 'Unable to log out devices.',
      deleteAccountTitle: 'Delete my account',
      deleteAccountDescription:
        'Permanently delete the account and remove access from all workspaces.',
      deleteAccountAction: 'Delete Account',
    },
  },
  sessions: {
    apiTitle: 'API usage',
    apiDescription: 'Session review and revoke both map directly to auth session endpoints.',
    capabilitiesTitle: 'Capabilities',
    capabilitiesDescription: 'Main behaviors exposed by this session management flow.',
    capabilities: ['Current session visibility', 'Per-session revoke', 'Expiry tracking'],
    table: {
      device: 'Device',
      deviceType: 'Type',
      sessionId: 'Session ID',
      lastActivity: 'Last activity',
      expiresAt: 'Expires at',
      status: 'Status',
      actions: 'Actions',
      empty: 'No sessions found.',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      pageSize: 'Rows',
    },
    detailLabels: {
      lastActivity: 'Last activity',
      expiresAt: 'Expires at',
    },
    revoke: 'Revoke session',
    revokeOthers: 'Revoke all other sessions',
    revokingOthers: 'Revoking…',
    revokeOthersHint: 'Sign out all other active sessions to secure your account.',
    items: {
      current: {
        device: 'Chrome on macOS',
        lastActivity: 'Moments ago',
        expiresAt: '2026-03-28 18:00 UTC+7',
        status: 'current',
      },
      mobile: {
        device: 'Safari on iPhone',
        lastActivity: '22 minutes ago',
        expiresAt: '2026-03-28 17:42 UTC+7',
        status: 'active',
      },
      old: {
        device: 'Edge on Windows',
        lastActivity: 'Yesterday',
        expiresAt: 'Revoked by user',
        status: 'revoked',
      },
    },
  },
  twoFactor: {
    apiTitle: 'API usage',
    apiDescription: '2FA management spans status, setup, verify, and disable actions.',
    capabilitiesTitle: 'Capabilities',
    capabilitiesDescription: 'Main behaviors exposed by this two-factor flow.',
    capabilities: ['Protected route', 'Cookie-aware request', 'Strong proof required'],
    currentStateTitle: 'Current state',
    currentStateDescription: 'Review the current two-factor status before making changes.',
    currentState: {
      enabled: 'Enabled',
      verified: 'Verified',
      method: 'Method',
      recentAuth: 'Recent auth',
      enabledValue: 'true',
      verifiedValue: 'true',
      methodValue: 'totp',
      recentAuthValue: 'Required before setup',
    },
    setupTitle: 'Setup and verify',
    setupDescription: 'Generate setup data, then verify with a TOTP code.',
    setupFields: {
      currentPassword: 'Current password',
      recentAuthToken: 'Recent auth token',
      verificationCode: 'Verification code',
    },
    setupPlaceholders: {
      currentPassword: 'Enter current password',
      recentAuthToken: 'Returned by setup response',
      verificationCode: '123456',
    },
    setupActions: {
      generateSecret: 'Generate TOTP secret',
      generatingSecret: 'Generating...',
      verifying: 'Verifying...',
      disabling: 'Disabling...',
    },
    setupHelp: {
      alreadyEnabled: 'Two-factor is already enabled for this account.',
      notEnabled: 'Two-factor authentication is not enabled for this account.',
      generated: 'TOTP secret generated. Verify with the current authenticator code.',
      verified: 'Two-factor authentication is now enabled.',
      disabled: 'Two-factor authentication has been disabled.',
      secretLabel: 'Secret',
      copyOtpauth: 'Copy auth URL',
      copyOtpauthSuccess: 'Authentication URL copied.',
      copyOtpauthError: 'Could not copy the authentication URL.',
    },
    authErrors: {
      invalidCredentials: 'Current password is incorrect.',
      twoFactorRequired: 'Two-factor verification is required.',
      twoFactorInvalid: 'The verification code is invalid.',
      twoFactorChallengeInvalid: 'The verification challenge is no longer valid.',
      accountLocked: 'This account is temporarily locked.',
      accountSetupRequired: 'Complete account setup before changing password.',
      emailNotVerified: 'Verify your email before changing password.',
      captchaInvalid: 'Captcha validation failed.',
      rateLimited: 'Too many attempts. Please wait until the timer finishes.',
      reauthRequired: 'Please verify your identity again.',
      tokenExpired: 'Your session expired. Please sign in again.',
      sessionRevoked: 'Your session is no longer active.',
      validationError: 'The request did not pass validation.',
      generic: 'Request failed.',
    },
    validation: {
      setupPasswordRequired: 'Current password is required to generate a TOTP secret.',
      verificationCodeRequired: 'Verification code is required.',
      verificationCodeInvalid: 'Verification code must be a valid 6-digit code.',
      disablePasswordRequired: 'Current password is required to disable 2FA.',
      disableCodeRequired: 'Current TOTP code is required.',
      disableCodeInvalid: 'Current TOTP code must be a valid 6-digit code.',
      disableNotEnabled: 'Two-factor authentication is not enabled.',
    },
    verify: 'Verify 2FA',
    reviewSessions: 'Review sessions',
    disableTitle: 'Disable 2FA',
    disableDescription: 'Disabling requires password confirmation and a valid current TOTP code.',
    disableFields: {
      currentPassword: 'Current password',
      currentTotpCode: 'Current TOTP code',
    },
    disablePlaceholders: {
      currentPassword: 'Confirm ownership',
      currentTotpCode: 'Required before disablement',
    },
    disable: 'Disable 2FA',
    backToLogin: 'Back to login',
  },
  userInformation: {
    apiTitle: 'API usage',
    apiDescription: 'Account profile and password update actions stay in account endpoints.',
    capabilitiesTitle: 'Capabilities',
    capabilitiesDescription: 'Main behaviors exposed by this account settings flow.',
    capabilities: ['Account overview', 'Password update entry point'],
    accountTitle: 'Account information',
    accountDescription: 'Review the current account profile summary.',
    accountFields: {
      email: 'Email',
      plan: 'Plan',
      role: 'Role',
      twoFactor: 'Two-factor',
    },
    passwordTitle: 'Password',
    passwordDescription: 'Password updates will live in this settings area.',
    passwordHint: 'Use the modal to update the current account password.',
    changePassword: 'Change password',
    sessionsTitle: 'Sessions',
    sessionsDescription: 'Review and revoke active sessions directly from account security.',
    sessionsDetail: 'View detail',
    layout: {
      changeImage: 'Change Image',
      removeImage: 'Remove Image',
      imageHint: 'We support PNGs, JPEGs and GIFs under 2MB',
      name: 'Name',
      defaultUserName: 'User',
      notAvailable: 'N/A',
      roleDepartment: 'Role',
      firstName: 'First Name',
      lastName: 'Last Name',
      accountSecurityTitle: 'Account Security',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      changeEmail: 'Change email',
      googleLinkTitle: 'Link Google account',
      googleLinkDescription: 'Connect your Google account for easier sign-in and recovery.',
      googleLinkConnected: 'Connected with {email}',
      googleUnlinkSuccess: 'Google account unlinked successfully.',
      googleUnlinkError: 'Unable to unlink Google account.',
      googleUnlinkConfirmTitle: 'Unlink Google account?',
      googleUnlinkConfirmDescription:
        'You will no longer be able to use Google sign-in for this account until you link it again.',
      googleUnlinkConfirmAction: 'Unlink account',
      googleUnlinkSubmitting: 'Unlinking...',
      googleUnlinkCancel: 'Cancel',
      googleUnlinkPasswordLabel: 'Current password',
      googleUnlinkPasswordPlaceholder: 'Enter your current password',
      googleUnlinkPasswordRequired: 'Current password is required to unlink Google account.',
      twoStepTitle: '2-Step Verifications',
      twoStepDescription: 'Add an additional layer of security to your account during login.',
      twoStepModalTitle: '2-Step Verification settings',
      twoStepModalDescription:
        'Scan this QR code in your authenticator app, or copy the secret below.',
      twoStepDisableConfirmTitle: 'Disable 2-Step Verification?',
      twoStepDisableConfirmDescription:
        'You are about to disable 2-Step Verification. Continue to the settings modal to confirm with your current password and TOTP code.',
      twoStepDisableConfirmAction: 'Disable',
      twoStepDisableConfirmCancel: 'Cancel',
      supportAccessTitle: 'Account Controls',
      supportAccessReadOnlyDescription: 'Support access (read-only)',
      supportAccessLabel: 'Support access',
      supportAccessDescription:
        'You have granted us to access to your account for support purposes until {until}.',
      logoutAllDevicesTitle: 'Log out of all devices',
      logoutAllDevicesDescription:
        'Log out of all other active sessions on other devices besides this one.',
      logoutAllDevicesSuccess: 'Logged out all other active devices.',
      logoutAllDevicesError: 'Unable to log out other devices.',
      logoutAction: 'Log out',
      logoutActionLoading: 'Logging out…',
      deleteAccountTitle: 'Delete my account',
      deleteAccountDescription:
        'Permanently delete the account and remove access from all workspaces.',
      deleteAccountAction: 'Delete Account',
    },
    linkedAccounts: {
      title: 'Linked accounts',
      description: 'Connect Google to speed up sign-in and account recovery.',
      googleHint: 'Link a Google account to this profile.',
      googleLinked: 'Google account linked',
      linkGoogle: 'Link Google account',
      linking: 'Linking...',
      linkSuccess: 'Google account linked successfully.',
      alreadyLinked: 'This Google account is already linked to your profile.',
      identityTaken: 'This Google account is already linked to another account.',
      linkError: 'Unable to link Google account.',
    },
    passwordModal: {
      title: 'Change password',
      description: 'Confirm your current password, then choose a stronger replacement.',
      close: 'Close change password modal',
      policyHint:
        'Password must be 10-128 characters, include letters and numbers, and avoid email-derived values.',
      strength: {
        label: 'Strength',
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong',
      },
      fields: {
        currentPassword: 'Current password',
        newPassword: 'New password',
        confirmPassword: 'Confirm new password',
      },
      placeholders: {
        currentPassword: 'Enter current password',
        newPassword: 'Choose a strong password',
        confirmPassword: 'Repeat the new password',
      },
      cancel: 'Cancel',
      submit: 'Save password',
      submitting: 'Saving...',
      submitSuccess: 'Password updated successfully.',
      submitError: 'Unable to update password.',
      validation: {
        currentPasswordRequired: 'Current password is required.',
        newPasswordLength: 'Password must be between 10 and 128 characters.',
        newPasswordLetterNumber: 'Password must contain at least one letter and one number.',
        newPasswordBlocked: 'Choose a password that is not a blocked common password.',
        newPasswordContainsEmail: 'Password must not contain your email address.',
        newPasswordContainsEmailLocalPart: 'Password must not contain the email username.',
        newPasswordTooWeak: 'Password is too weak. Choose a stronger password.',
        newPasswordMatchesCurrent: 'New password must be different from the current password.',
        confirmPasswordRequired: 'Please confirm the new password.',
        confirmPasswordMismatch: 'Confirmation password does not match.',
      },
    },
    authErrors: {
      invalidCredentials: 'Current password is incorrect.',
      twoFactorRequired: 'Two-factor verification is required.',
      twoFactorInvalid: 'The verification code is invalid.',
      twoFactorChallengeInvalid: 'The verification challenge is no longer valid.',
      accountLocked: 'This account is temporarily locked.',
      rateLimited: 'Too many attempts. Please wait until the timer finishes.',
      reauthRequired: 'Please verify your identity again.',
      tokenExpired: 'Your session expired. Please sign in again.',
      sessionRevoked: 'Your session is no longer active.',
      validationError: 'The request did not pass validation.',
      generic: 'Request failed.',
    },
  },
  notFound: {
    title: 'Page not found',
    description: 'The client route you requested does not exist or may have been moved.',
    primaryAction: 'Back to home',
    secondaryAction: 'Go to login',
  },
  error: {
    title: 'Something went wrong',
    description: 'The client app hit an unexpected error while rendering this screen.',
    retry: 'Try again',
    goHome: 'Back to home',
  },
} as const;
