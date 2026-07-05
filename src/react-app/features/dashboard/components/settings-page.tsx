'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { Avatar } from '@astryxdesign/core/Avatar';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { HStack, VStack } from '@astryxdesign/core/Stack';
import { Switch } from '@astryxdesign/core/Switch';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { FormDialog } from '@tanlabs/astryx';
import { SettingsLayout, SettingsSectionPanel } from '@/ui/settings';
import { QRCodeSVG } from 'qrcode.react';

import { useClientMyAccount } from '@/features/account/hooks/use-client-my-account';
import { getClientConfig } from '@/shared/config/env';
import type { ClientLang } from '@/shared/i18n';

type SettingsPanelId = 'account' | 'security' | 'controls';

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

export function SettingsPage({
  lang,
  initialUser,
}: {
  lang: ClientLang['myAccount'];
  initialUser: { id?: string } | null;
}) {
  const googleEnabled = getClientConfig().oauth.googleEnabled;
  const [activeSection, setActiveSection] = useState<SettingsPanelId>('account');
  const sections = useMemo(
    () => [
      { id: 'account' as const, label: lang.sections.accountTitle },
      { id: 'security' as const, label: lang.sections.securityTitle },
      { id: 'controls' as const, label: lang.sections.controlsTitle },
    ],
    [lang.sections.accountTitle, lang.sections.controlsTitle, lang.sections.securityTitle],
  );

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
      <SettingsLayout
        sections={sections}
        activeSection={activeSection}
        onSectionChange={(sectionId) => setActiveSection(sectionId as SettingsPanelId)}
      >
        {activeSection === 'account' ? (
          <SettingsSectionPanel
            title={lang.sections.accountTitle}
            description={lang.sections.accountDescription}
          >
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
          </SettingsSectionPanel>
        ) : null}

        {activeSection === 'security' ? (
          <SettingsSectionPanel
            title={lang.sections.securityTitle}
            description={lang.sections.securityDescription}
          >
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
          </SettingsSectionPanel>
        ) : null}

        {activeSection === 'controls' ? (
          <SettingsSectionPanel
            title={lang.sections.controlsTitle}
            description={lang.sections.controlsDescription}
          >
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
              title={lang.controls.logoutAllDevicesTitle}
              description={lang.controls.logoutAllDevicesDescription}
              action={
                <Button
                  label={
                    loggingOutDevices ? lang.controls.logoutLoading : lang.controls.logoutAction
                  }
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
                <Button
                  label={lang.controls.deleteAccountAction}
                  variant="destructive"
                  isDisabled
                />
              }
            />
          </SettingsSectionPanel>
        ) : null}
      </SettingsLayout>

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
