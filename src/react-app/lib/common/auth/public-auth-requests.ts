import type { LoginResponse } from '@tanlabs/contracts';

export interface LoginRequestInput {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorMethod?: 'totp' | 'email_otp';
  twoFactorChallengeId?: string;
}

interface SuccessResponse {
  success: true;
}

export interface ForgotPasswordRequestInput {
  email: string;
}

export interface ResetPasswordRequestInput {
  token: string;
  newPassword: string;
}

export interface RegisterRequestInput {
  email: string;
  displayName: string;
  password: string;
  captchaToken: string;
}

export interface VerifyEmailRequestInput {
  challengeId: string;
  verificationContextToken: string;
  code: string;
}

export interface ResendEmailVerificationRequestInput {
  verificationContextToken: string;
}

export interface AccountSetupRequestInput {
  token: string;
  newPassword: string;
}

export interface VerificationChallengeResponse {
  success: true;
  email: string;
  challengeId: string;
  verificationContextToken: string;
  expiresIn: number;
  resendAvailableIn: number;
}

export type PublicAuthPost = <TResponse>(path: string, body: unknown) => Promise<TResponse>;

export interface PublicAuthApiPaths {
  login: string;
  forgotPassword: string;
  resetPassword: string;
  register: string;
  verifyEmail: string;
  resendEmailVerification: string;
  accountSetup: string;
}

export interface PublicAuthRequests {
  loginRequest: (body: LoginRequestInput) => Promise<LoginResponse>;
  forgotPasswordRequest: (body: ForgotPasswordRequestInput) => Promise<SuccessResponse>;
  resetPasswordRequest: (body: ResetPasswordRequestInput) => Promise<SuccessResponse>;
  registerRequest: (body: RegisterRequestInput) => Promise<VerificationChallengeResponse>;
  verifyEmailRequest: (body: VerifyEmailRequestInput) => Promise<SuccessResponse>;
  resendEmailVerificationRequest: (
    body: ResendEmailVerificationRequestInput,
  ) => Promise<VerificationChallengeResponse>;
  accountSetupRequest: (body: AccountSetupRequestInput) => Promise<VerificationChallengeResponse>;
}

export function createPublicAuthRequests(options: {
  post: PublicAuthPost;
  paths: PublicAuthApiPaths;
}): PublicAuthRequests {
  const { post, paths } = options;

  return {
    loginRequest: (body) => post<LoginResponse>(paths.login, body),
    forgotPasswordRequest: (body) => post<SuccessResponse>(paths.forgotPassword, body),
    resetPasswordRequest: (body) => post<SuccessResponse>(paths.resetPassword, body),
    registerRequest: (body) => post<VerificationChallengeResponse>(paths.register, body),
    verifyEmailRequest: (body) => post<SuccessResponse>(paths.verifyEmail, body),
    resendEmailVerificationRequest: (body) =>
      post<VerificationChallengeResponse>(paths.resendEmailVerification, body),
    accountSetupRequest: (body) => post<VerificationChallengeResponse>(paths.accountSetup, body),
  };
}
