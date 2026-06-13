export interface PublicAuthScreenConfig {
  title: string;
  description: string;
}

export interface PublicAuthScreenHeadlines {
  formTitle: string;
  formDescription: string;
}

export function buildRegisterPublicAuthScreen(
  lang: PublicAuthScreenHeadlines,
): PublicAuthScreenConfig {
  return { title: lang.formTitle, description: lang.formDescription };
}

export function buildForgotPasswordPublicAuthScreen(
  lang: PublicAuthScreenHeadlines,
): PublicAuthScreenConfig {
  return { title: lang.formTitle, description: lang.formDescription };
}

export function buildVerifyEmailPublicAuthScreen(
  lang: PublicAuthScreenHeadlines,
): PublicAuthScreenConfig {
  return { title: lang.formTitle, description: lang.formDescription };
}

export function buildResetPasswordPublicAuthScreen(
  lang: PublicAuthScreenHeadlines,
): PublicAuthScreenConfig {
  return { title: lang.formTitle, description: lang.formDescription };
}

export function buildAccountSetupPublicAuthScreen(
  lang: PublicAuthScreenHeadlines,
): PublicAuthScreenConfig {
  return { title: lang.formTitle, description: lang.formDescription };
}
