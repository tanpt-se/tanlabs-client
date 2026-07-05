'use client';

import type { FormEvent } from 'react';

import { CubeIcon } from '@heroicons/react/24/outline';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon } from '@astryxdesign/core/Icon';
import { Link } from '@astryxdesign/core/Link';
import { VStack } from '@astryxdesign/core/Layout';
import { Text, Heading } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';

import { AppleIcon, GoogleIcon } from './icons';
import { loginCardContentStyle, loginCardPageStyle } from './styles';

type TwoFactorMethod = 'email_otp' | 'totp';

export interface LoginCardCopy {
  title: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  twoFactorStepTitle: string;
  twoFactorStepDescription: string;
  otpEmailLabel: string;
  otpAuthenticatorLabel: string;
  otpPlaceholder: string;
  submitDefault: string;
  submitRateLimited: string;
  submitTwoFactor: string;
  submitLoading: string;
  orText: string;
  googleSignIn: string;
  forgotPassword?: string;
  createAccount?: string;
}

export interface LoginCardNotice {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function LoginCard(props: {
  copy: LoginCardCopy;
  createAccountHref?: string;
  email: string;
  error?: string;
  forgotPasswordHref?: string;
  googleAuthEnabled: boolean;
  isRateLimited?: boolean;
  loading: boolean;
  notice?: LoginCardNotice;
  onEmailChange: (value: string) => void;
  onGoogleSignIn: () => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTwoFactorCodeChange: (value: string) => void;
  password: string;
  pendingTwoFactorMethod?: TwoFactorMethod;
  twoFactorCode: string;
}) {
  const {
    copy,
    createAccountHref,
    email,
    error,
    forgotPasswordHref,
    googleAuthEnabled,
    isRateLimited = false,
    loading,
    notice,
    onEmailChange,
    onGoogleSignIn,
    onPasswordChange,
    onSubmit,
    onTwoFactorCodeChange,
    password,
    pendingTwoFactorMethod,
    twoFactorCode,
  } = props;

  const pendingTwoFactor = Boolean(pendingTwoFactorMethod);
  const submitLabel = loading
    ? copy.submitLoading
    : isRateLimited
      ? copy.submitRateLimited
      : pendingTwoFactor
        ? copy.submitTwoFactor
        : copy.submitDefault;
  const cardTitle = pendingTwoFactor ? copy.twoFactorStepTitle : copy.title;
  const cardSubtitle = pendingTwoFactor ? copy.twoFactorStepDescription : copy.subtitle;
  const showForgotLink = Boolean(error && forgotPasswordHref && copy.forgotPassword);

  return (
    <Center axis="both" width="100%" style={loginCardPageStyle}>
      <VStack gap={4} hAlign="center" style={loginCardContentStyle}>
        <VStack gap={2} hAlign="center">
          <Icon icon={CubeIcon} size="lg" />
          <Text type="body" weight="bold" size="lg">
            Product Inc.
          </Text>
        </VStack>

        <Card padding={8} width="100%">
          <form onSubmit={onSubmit}>
            <VStack gap={4} hAlign="stretch">
              <VStack gap={1} hAlign="center">
                <Heading level={2}>{cardTitle}</Heading>
                <Text type="body" color="secondary" size="sm">
                  {cardSubtitle}
                </Text>
              </VStack>

              {notice ? (
                <Banner status="info" title={notice.title} description={notice.description} />
              ) : null}

              {!pendingTwoFactor ? (
                <VStack gap={2}>
                  <TextInput
                    label={copy.emailLabel}
                    isLabelHidden
                    type="email"
                    placeholder={copy.emailPlaceholder}
                    value={email}
                    onChange={onEmailChange}
                    size="lg"
                    isDisabled={loading || isRateLimited}
                  />
                  <VStack gap={1}>
                    <TextInput
                      label={copy.passwordLabel}
                      isLabelHidden
                      placeholder={copy.passwordPlaceholder}
                      type="password"
                      value={password}
                      onChange={onPasswordChange}
                      size="lg"
                      isDisabled={loading || isRateLimited}
                      status={
                        error
                          ? {
                              type: 'error',
                              message: error,
                            }
                          : undefined
                      }
                    />
                    {showForgotLink ? (
                      <VStack hAlign="end">
                        <Link
                          href={forgotPasswordHref}
                          size="sm"
                          color="secondary"
                          type="supporting"
                        >
                          {copy.forgotPassword}
                        </Link>
                      </VStack>
                    ) : null}
                  </VStack>
                </VStack>
              ) : (
                <TextInput
                  label={
                    pendingTwoFactorMethod === 'email_otp'
                      ? copy.otpEmailLabel
                      : copy.otpAuthenticatorLabel
                  }
                  isLabelHidden
                  type="text"
                  placeholder={copy.otpPlaceholder}
                  value={twoFactorCode}
                  onChange={onTwoFactorCodeChange}
                  size="lg"
                  isDisabled={loading || isRateLimited}
                  status={
                    error
                      ? {
                          type: 'error',
                          message: error,
                        }
                      : undefined
                  }
                />
              )}

              <Button
                label={submitLabel}
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                isDisabled={isRateLimited}
              />

              {googleAuthEnabled && !pendingTwoFactor ? (
                <>
                  <Divider label={copy.orText} />
                  <VStack gap={3} hAlign="stretch">
                    <Button
                      label="Login with Apple"
                      type="button"
                      variant="secondary"
                      icon={<AppleIcon />}
                      size="lg"
                      isDisabled={loading || isRateLimited}
                    />
                    <Button
                      label={copy.googleSignIn}
                      type="button"
                      variant="secondary"
                      icon={<GoogleIcon />}
                      size="lg"
                      isDisabled={loading || isRateLimited}
                      onClick={onGoogleSignIn}
                    />
                  </VStack>
                </>
              ) : null}

              {createAccountHref && copy.createAccount ? (
                <VStack hAlign="center">
                  <Text type="supporting" color="secondary">
                    Don&apos;t have an account?{' '}
                    <Link href={createAccountHref} type="supporting">
                      {copy.createAccount}
                    </Link>
                  </Text>
                </VStack>
              ) : null}
            </VStack>
          </form>
        </Card>

        <VStack hAlign="center" width="100%">
          <Text type="supporting" color="secondary" justify="center">
            By clicking continue, you agree to our{' '}
            <Link href="#" type="supporting">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" type="supporting">
              Privacy Policy
            </Link>
            .
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}
