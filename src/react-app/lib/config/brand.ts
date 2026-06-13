export interface BrandConfig {
  name: string;
  shortName: string;
  webTitle: string;
  adminTitle: string;
  placeholderDomain: string;
  totpIssuer: string;
  heroEyebrow: string;
}

export const BRAND: BrandConfig = {
  name: 'TanLabs',
  shortName: 'TanLabs',
  webTitle: 'User Portal',
  adminTitle: 'Admin Portal',
  placeholderDomain: 'tanlabs.local',
  totpIssuer: 'TanLabs',
  heroEyebrow: 'TanLabs',
};

export const AUTH_MAIL_BODIES = {
  passwordResetIntro: `We received a request to reset your ${BRAND.name} password.`,
  accountSetupIntro: `An ${BRAND.name} account was created for you.`,
} as const;

export const adminPlaceholderEmail = (): string => 'admin@example.com';
export const userPlaceholderEmail = (): string => `user@${BRAND.placeholderDomain}`;
