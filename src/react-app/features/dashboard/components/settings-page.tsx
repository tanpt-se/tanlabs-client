'use client';

import type { ReactNode } from 'react';

import { Avatar } from '@astryxdesign/core/Avatar';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { MoreMenu } from '@astryxdesign/core/MoreMenu';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Switch } from '@astryxdesign/core/Switch';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { FormDialog } from '@tanlabs/astryx';
import { SettingsSectionPanel } from '@/ui/settings';
import { QRCodeSVG } from 'qrcode.react';
import { useLocale, useTheme } from '@tanlabs/providers';

import { useClientMyAccount } from '@/features/account/hooks/use-client-my-account';
import { getClientConfig } from '@/shared/config/env';
import { LOCALE_OPTIONS } from '@/shared/i18n/locale-options';
import type { ClientLang } from '@/shared/i18n';

export type SettingsSectionId = 'account' | 'general' | 'billing';

function SettingsRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <HStack gap={4} vAlign="center" hAlign="between" width="100%">
      <VStack gap={1}>
        <Text type="body">{title}</Text>
        <Text type="supporting" color="secondary">
          {description}
        </Text>
      </VStack>
      {action}
    </HStack>
  );
}

function SettingsGroupHeading({ label }: { label: string }) {
  return (
    <Text type="label" color="secondary">
      {label}
    </Text>
  );
}

export function SettingsPage({
  section,
  lang,
  shell,
  initialUser,
  onLogout,
}: {
  section: SettingsSectionId;
  lang: ClientLang['myAccount'];
  shell: ClientLang['shell'];
  initialUser: { id?: string } | null;
  onLogout: () => void | Promise<void>;
}) {
  const googleEnabled = getClientConfig().oauth.googleEnabled;
  const { locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const currentLocaleLabel =
    LOCALE_OPTIONS.find((option) => option.value === locale)?.label ?? LOCALE_OPTIONS[0].label;
  const currentThemeLabel = shell.themeOptions[theme] ?? shell.themeOptions.system;

  const {
    accountEmail,
    fullName,
    accountRole,
    linkedGoogleEmail,
    linkingGoogle,
    showGoogleUnlinkConfirm,
    setShowGoogleUnlinkConfirm,
    unlinkPassword,
    setUnlinkPassword,
    twoFactorStatus,
    showTwoFactorModal,
    setShowTwoFactorModal,
    showDisableTwoFactorModal,
    setShowDisableTwoFactorModal,
    showChangePasswordModal,
    setShowChangePasswordModal,
    loggingOutDevices,
    setupPassword,
    setSetupPassword,
    setupLoading,
    verifyLoading,
    verificationCode,
    setVerificationCode,
    twoFactorError,
    disablePassword,
    setDisablePassword,
    disableCode,
    setDisableCode,
    disableLoading,
    disableError,
    changePasswordLoading,
    changePasswordError,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showVerificationStep,
    qrPreviewUrl,
    qrSecretValue,
    setupBusy,
    logoutAllOtherDevices,
    unlinkGoogle,
    beginTwoFactorSetup,
    verifyTwoFactorSetup,
    openDisableTwoFactorModal,
    disableTwoFactor,
    changePassword,
    handleGoogleToggle,
    openTwoFactor,
    copyAuthUrl,
  } = useClientMyAccount({ lang, initialUser });

  return (
    <>
      {section === 'account' ? (
        <SettingsSectionPanel>
          <HStack gap={4} vAlign="start">
            <Avatar name={accountEmail} size="large" alt={accountEmail} />
            <VStack gap={2}>
              <HStack gap={2}>
                <Button label={lang.account.changeImage} variant="primary" size="sm" />
                <Button label={lang.account.removeImage} variant="secondary" size="sm" />
              </HStack>
              <Text type="supporting" color="secondary">
                {lang.account.imageHint}
              </Text>
            </VStack>
          </HStack>
          <TextInput
            label={lang.account.nameLabel}
            value={fullName || lang.account.fallbackName}
            onChange={() => undefined}
            isDisabled
          />
          <TextInput
            label={lang.account.roleLabel}
            value={accountRole}
            onChange={() => undefined}
            isDisabled
          />
          <TextInput
            label={lang.account.emailLabel}
            type="email"
            value={accountEmail}
            onChange={() => undefined}
            isDisabled
          />

          <SettingsGroupHeading label={lang.sections.securityTitle} />
          <Switch
            label={lang.google.title}
            description={
              linkedGoogleEmail
                ? lang.google.connected.replace('{email}', linkedGoogleEmail)
                : lang.google.description
            }
            value={Boolean(linkedGoogleEmail)}
            isDisabled={!googleEnabled || linkingGoogle}
            onChange={handleGoogleToggle}
            labelSpacing="spread"
            labelPosition="start"
            width="100%"
          />
          <Switch
            label={lang.twoFactor.title}
            description={lang.twoFactor.description}
            value={twoFactorStatus.enabled}
            onChange={(checked) => {
              if (checked) {
                openTwoFactor();
                return;
              }
              openDisableTwoFactorModal();
            }}
            labelSpacing="spread"
            labelPosition="start"
            width="100%"
          />
          <SettingsRow
            title={lang.password.title}
            description={lang.password.description}
            action={
              <Button
                label={lang.password.changeAction}
                variant="secondary"
                onClick={() => setShowChangePasswordModal(true)}
              />
            }
          />

          <SettingsGroupHeading label={lang.sections.controlsTitle} />
          <SettingsRow
            title={lang.controls.logoutAllDevicesTitle}
            description={lang.controls.logoutAllDevicesDescription}
            action={
              <Button
                label={loggingOutDevices ? lang.controls.logoutLoading : lang.controls.logoutAction}
                variant="secondary"
                isDisabled={loggingOutDevices}
                isLoading={loggingOutDevices}
                clickAction={() => logoutAllOtherDevices()}
              />
            }
          />
          <SettingsRow
            title={lang.controls.deleteAccountTitle}
            description={lang.controls.deleteAccountDescription}
            action={
              <Button label={lang.controls.deleteAccountAction} variant="destructive" isDisabled />
            }
          />
        </SettingsSectionPanel>
      ) : null}

      {section === 'general' ? (
        <SettingsSectionPanel>
          <SettingsRow
            title={lang.preferences.languageTitle}
            description={lang.preferences.languageDescription}
            action={
              <MoreMenu
                size="sm"
                label={currentLocaleLabel}
                items={LOCALE_OPTIONS.map((option) => ({
                  label: option.label,
                  onClick: () => setLocale(option.value),
                }))}
              />
            }
          />
          <SettingsRow
            title={lang.preferences.themeTitle}
            description={lang.preferences.themeDescription}
            action={
              <MoreMenu
                size="sm"
                label={currentThemeLabel}
                items={[
                  { label: shell.themeOptions.light, onClick: () => setTheme('light') },
                  { label: shell.themeOptions.dark, onClick: () => setTheme('dark') },
                  { label: shell.themeOptions.system, onClick: () => setTheme('system') },
                ]}
              />
            }
          />
          <Switch
            label={lang.controls.supportAccessTitle}
            description={lang.controls.supportAccessDescription}
            value={false}
            isDisabled
            labelSpacing="spread"
            labelPosition="start"
            width="100%"
          />
          <SettingsRow
            title={lang.preferences.logoutTitle}
            description={lang.preferences.logoutDescription}
            action={
              <Button label={shell.logout} variant="secondary" clickAction={() => void onLogout()} />
            }
          />
        </SettingsSectionPanel>
      ) : null}

      {section === 'billing' ? (
        <SettingsSectionPanel>
          <EmptyState
            title={lang.billing.emptyTitle}
            description={lang.billing.emptyDescription}
          />
        </SettingsSectionPanel>
      ) : null}

      <FormDialog
        isOpen={showGoogleUnlinkConfirm}
        onOpenChange={setShowGoogleUnlinkConfirm}
        title={lang.google.unlinkModalTitle}
        subtitle={lang.google.unlinkModalDescription}
        footer={
          <HStack gap={2} hAlign="end">
            <Button
              label={lang.google.unlinkModalCancel}
              variant="secondary"
              onClick={() => setShowGoogleUnlinkConfirm(false)}
            />
            <Button
              label={
                linkingGoogle ? lang.google.unlinkModalLoading : lang.google.unlinkModalAction
              }
              variant="destructive"
              isLoading={linkingGoogle}
              clickAction={() => unlinkGoogle()}
            />
          </HStack>
        }
      >
        <TextInput
          label={lang.google.currentPasswordLabel}
          type="password"
          value={unlinkPassword}
          onChange={setUnlinkPassword}
          placeholder={lang.google.currentPasswordPlaceholder}
        />
      </FormDialog>

      <FormDialog
        isOpen={showChangePasswordModal}
        onOpenChange={setShowChangePasswordModal}
        title={lang.password.modalTitle}
        subtitle={lang.password.modalDescription}
        footer={
          <HStack gap={2} hAlign="end">
            <Button
              label={lang.password.modalCancel}
              variant="secondary"
              onClick={() => setShowChangePasswordModal(false)}
            />
            <Button
              label={
                changePasswordLoading ? lang.password.modalSubmitting : lang.password.modalSubmit
              }
              variant="primary"
              isLoading={changePasswordLoading}
              clickAction={() => changePassword()}
            />
          </HStack>
        }
      >
        <VStack gap={3}>
          {changePasswordError ? <Banner status="error" title={changePasswordError} /> : null}
          <TextInput
            label={lang.password.currentPasswordLabel}
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder={lang.password.currentPasswordPlaceholder}
          />
          <TextInput
            label={lang.password.newPasswordLabel}
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder={lang.password.newPasswordPlaceholder}
          />
          <TextInput
            label={lang.password.confirmPasswordLabel}
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder={lang.password.confirmPasswordPlaceholder}
          />
        </VStack>
      </FormDialog>

      <FormDialog
        isOpen={showTwoFactorModal}
        onOpenChange={setShowTwoFactorModal}
        dismissible={false}
        title={lang.twoFactor.setupModalTitle}
        subtitle={lang.twoFactor.setupModalDescription}
        footer={
          <HStack gap={2} hAlign="end">
            <Button
              label={lang.google.unlinkModalCancel}
              variant="secondary"
              onClick={() => setShowTwoFactorModal(false)}
            />
            <Button
              label={
                showVerificationStep
                  ? verifyLoading
                    ? lang.twoFactor.setupVerifying
                    : lang.twoFactor.setupVerify
                  : setupLoading
                    ? lang.twoFactor.setupGenerating
                    : lang.twoFactor.setupGenerate
              }
              variant="primary"
              isDisabled={setupBusy}
              isLoading={setupBusy}
              clickAction={() =>
                showVerificationStep ? verifyTwoFactorSetup() : beginTwoFactorSetup()
              }
            />
          </HStack>
        }
      >
        <VStack gap={4}>
          {twoFactorError ? <Banner status="error" title={twoFactorError} /> : null}
          <TextInput
            label={lang.google.currentPasswordLabel}
            type="password"
            value={setupPassword}
            onChange={setSetupPassword}
            placeholder={lang.google.currentPasswordPlaceholder}
          />
          <VStack gap={3} hAlign="center">
            <div
              style={{
                position: 'relative',
                display: 'inline-flex',
                borderRadius: 16,
                padding: 16,
                background: '#fff',
              }}
            >
              <QRCodeSVG
                value={qrPreviewUrl}
                size={180}
                marginSize={2}
                bgColor="#ffffff"
                fgColor="#111827"
                title={lang.twoFactor.setupModalTitle}
                style={{
                  opacity: showVerificationStep ? 1 : 0.6,
                  filter: showVerificationStep ? undefined : 'blur(4px)',
                }}
              />
              {!showVerificationStep ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 16,
                    background: 'rgba(0,0,0,0.55)',
                    padding: '0 12px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
                    {lang.twoFactor.setupGenerate}
                  </span>
                </div>
              ) : null}
            </div>
            <TextInput
              label={lang.twoFactor.secretLabel}
              value={qrSecretValue}
              onChange={() => undefined}
              isDisabled={!showVerificationStep}
            />
            <Button
              label={lang.twoFactor.copyAuthUrl}
              variant="secondary"
              isDisabled={!showVerificationStep}
              onClick={() => void copyAuthUrl()}
            />
          </VStack>
          {showVerificationStep ? (
            <TextInput
              label={lang.twoFactor.verificationCodeLabel}
              value={verificationCode}
              onChange={setVerificationCode}
              placeholder={lang.twoFactor.verificationCodePlaceholder}
            />
          ) : null}
        </VStack>
      </FormDialog>

      <FormDialog
        isOpen={showDisableTwoFactorModal}
        onOpenChange={setShowDisableTwoFactorModal}
        title={lang.twoFactor.disableModalTitle}
        subtitle={lang.twoFactor.disableModalDescription}
        footer={
          <HStack gap={2} hAlign="end">
            <Button
              label={lang.twoFactor.disableModalCancel}
              variant="secondary"
              onClick={() => setShowDisableTwoFactorModal(false)}
            />
            <Button
              label={
                disableLoading ? lang.twoFactor.disableLoading : lang.twoFactor.disableModalAction
              }
              variant="destructive"
              isLoading={disableLoading}
              clickAction={() => disableTwoFactor()}
            />
          </HStack>
        }
      >
        <VStack gap={3}>
          {disableError ? <Banner status="error" title={disableError} /> : null}
          <TextInput
            label={lang.google.currentPasswordLabel}
            type="password"
            value={disablePassword}
            onChange={setDisablePassword}
            placeholder={lang.password.currentPasswordPlaceholder}
          />
          <TextInput
            label={lang.twoFactor.disableCodeLabel}
            value={disableCode}
            onChange={setDisableCode}
            placeholder={lang.twoFactor.disableCodePlaceholder}
          />
        </VStack>
      </FormDialog>
    </>
  );
}
