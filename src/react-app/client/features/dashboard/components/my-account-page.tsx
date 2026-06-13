'use client';

import {
  Alert,
  AlertDescription,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  Input,
  Label,
  ModalScaffold,
  PasswordVisibilityToggle,
  Separator,
  Switch,
  icons,
} from '@tanlabs/components';
import { Building2, Mail, UserRound } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import { useClientMyAccount } from '@/features/account/hooks/use-client-my-account';
import { getClientConfig } from '@/config/env';
import type { ClientLang } from '@/shared/i18n';

export function MyAccountPage({
  lang,
  initialUser,
}: {
  lang: ClientLang['myAccount'];
  initialUser: { id?: string } | null;
}) {
  const googleEnabled = getClientConfig().oauth.googleEnabled;
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
    unlinkPasswordVisible,
    setUnlinkPasswordVisible,
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
    setupPasswordVisible,
    setSetupPasswordVisible,
    setupLoading,
    verifyLoading,
    verificationCode,
    setVerificationCode,
    twoFactorError,
    disablePassword,
    setDisablePassword,
    disablePasswordVisible,
    setDisablePasswordVisible,
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{lang.sections.accountTitle}</CardTitle>
          <CardDescription>{lang.sections.accountDescription}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Avatar className="size-16">
                <AvatarImage alt={accountEmail} />
                <AvatarFallback>{accountEmail.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex flex-nowrap items-center gap-3">
                  <Button type="button" variant="default" size="sm" className="whitespace-nowrap">
                    {lang.account.changeImage}
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="whitespace-nowrap">
                    {lang.account.removeImage}
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">{lang.account.imageHint}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-account-info-name">{lang.account.nameLabel}</Label>
                <div className="relative">
                  <UserRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="admin-account-info-name"
                    value={fullName || lang.account.fallbackName}
                    readOnly
                    aria-label={lang.account.nameLabel}
                    placeholder={lang.account.nameLabel}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-account-info-role">{lang.account.roleLabel}</Label>
                <div className="relative">
                  <Building2 className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="admin-account-info-role"
                    value={accountRole}
                    readOnly
                    aria-label={lang.account.roleLabel}
                    placeholder={lang.account.roleLabel}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-account-info-email">{lang.account.emailLabel}</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    id="admin-account-info-email"
                    value={accountEmail}
                    readOnly
                    aria-label={lang.account.emailLabel}
                    placeholder={lang.account.emailLabel}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{lang.sections.securityTitle}</CardTitle>
          <CardDescription>{lang.sections.securityDescription}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{lang.google.title}</p>
              <p className="text-muted-foreground text-sm">
                {linkedGoogleEmail
                  ? lang.google.connected.replace('{email}', linkedGoogleEmail)
                  : lang.google.description}
              </p>
            </div>
            <Switch
              checked={Boolean(linkedGoogleEmail)}
              disabled={!googleEnabled || linkingGoogle}
              onCheckedChange={handleGoogleToggle}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{lang.twoFactor.title}</p>
              <p className="text-muted-foreground text-sm">{lang.twoFactor.description}</p>
            </div>
            <Switch
              checked={twoFactorStatus.enabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  openTwoFactor();
                } else {
                  openDisableTwoFactorModal();
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{lang.password.title}</p>
              <p className="text-muted-foreground text-sm">{lang.password.description}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowChangePasswordModal(true)}
            >
              {lang.password.changeAction}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{lang.sections.controlsTitle}</CardTitle>
          <CardDescription>{lang.sections.controlsDescription}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{lang.controls.supportAccessTitle}</p>
              <p className="text-muted-foreground text-sm">
                {lang.controls.supportAccessDescription}
              </p>
            </div>
            <Switch checked disabled />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{lang.controls.logoutAllDevicesTitle}</p>
              <p className="text-muted-foreground text-sm">
                {lang.controls.logoutAllDevicesDescription}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={loggingOutDevices}
              onClick={() => {
                void logoutAllOtherDevices();
              }}
            >
              {loggingOutDevices ? lang.controls.logoutLoading : lang.controls.logoutAction}
            </Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-(--danger-text)">{lang.controls.deleteAccountTitle}</p>
              <p className="text-muted-foreground text-sm">
                {lang.controls.deleteAccountDescription}
              </p>
            </div>
            <Button type="button" variant="destructive" disabled>
              {lang.controls.deleteAccountAction}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showGoogleUnlinkConfirm ? (
        <ModalScaffold
          closeLabel={lang.google.unlinkModalCancel}
          onClose={() => setShowGoogleUnlinkConfirm(false)}
          panelClassName="max-w-lg"
          title={lang.google.unlinkModalTitle}
          description={lang.google.unlinkModalDescription}
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowGoogleUnlinkConfirm(false)}
              >
                {lang.google.unlinkModalCancel}
              </Button>
              <Button type="button" variant="destructive" onClick={() => void unlinkGoogle()}>
                {linkingGoogle ? lang.google.unlinkModalLoading : lang.google.unlinkModalAction}
              </Button>
            </>
          }
        >
          <div className="space-y-2">
            <Label htmlFor="unlink-password">{lang.google.currentPasswordLabel}</Label>
            <div className="relative">
              <Icon
                icon={icons.lockKeyhole}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden
              />
              <Input
                id="unlink-password"
                type={unlinkPasswordVisible ? 'text' : 'password'}
                value={unlinkPassword}
                onChange={(event) => setUnlinkPassword(event.target.value)}
                placeholder={lang.google.currentPasswordPlaceholder}
                className="pr-10 pl-9"
              />
              <PasswordVisibilityToggle
                visible={unlinkPasswordVisible}
                onShow={() => setUnlinkPasswordVisible(true)}
                onHide={() => setUnlinkPasswordVisible(false)}
                className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
              />
            </div>
          </div>
        </ModalScaffold>
      ) : null}

      {showChangePasswordModal ? (
        <ModalScaffold
          closeLabel={lang.password.modalCancel}
          onClose={() => setShowChangePasswordModal(false)}
          panelClassName="max-w-lg"
          title={lang.password.modalTitle}
          description={lang.password.modalDescription}
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowChangePasswordModal(false)}
              >
                {lang.password.modalCancel}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void changePassword();
                }}
                disabled={changePasswordLoading}
              >
                {changePasswordLoading ? lang.password.modalSubmitting : lang.password.modalSubmit}
              </Button>
            </>
          }
        >
          {changePasswordError ? (
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertDescription>{changePasswordError}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="current-password">{lang.password.currentPasswordLabel}</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder={lang.password.currentPasswordPlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{lang.password.newPasswordLabel}</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder={lang.password.newPasswordPlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{lang.password.confirmPasswordLabel}</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={lang.password.confirmPasswordPlaceholder}
            />
          </div>
        </ModalScaffold>
      ) : null}

      {showTwoFactorModal ? (
        <ModalScaffold
          closeLabel={lang.google.unlinkModalCancel}
          onClose={() => setShowTwoFactorModal(false)}
          closeOnEscape={false}
          closeOnInteractOutside={false}
          panelClassName="max-w-lg"
          title={lang.twoFactor.setupModalTitle}
          description={lang.twoFactor.setupModalDescription}
          footer={
            <>
              <Button type="button" variant="outline" onClick={() => setShowTwoFactorModal(false)}>
                {lang.google.unlinkModalCancel}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  void (showVerificationStep ? verifyTwoFactorSetup() : beginTwoFactorSetup());
                }}
                disabled={setupBusy}
              >
                {showVerificationStep
                  ? verifyLoading
                    ? lang.twoFactor.setupVerifying
                    : lang.twoFactor.setupVerify
                  : setupLoading
                    ? lang.twoFactor.setupGenerating
                    : lang.twoFactor.setupGenerate}
              </Button>
            </>
          }
        >
          {twoFactorError ? (
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertDescription>{twoFactorError}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="setup-password">{lang.google.currentPasswordLabel}</Label>
            <div className="relative">
              <Icon
                icon={icons.lockKeyhole}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden
              />
              <Input
                id="setup-password"
                type={setupPasswordVisible ? 'text' : 'password'}
                value={setupPassword}
                onChange={(event) => setSetupPassword(event.target.value)}
                placeholder={lang.google.currentPasswordPlaceholder}
                className="pr-10 pl-9"
              />
              <PasswordVisibilityToggle
                visible={setupPasswordVisible}
                onShow={() => setSetupPasswordVisible(true)}
                onHide={() => setSetupPasswordVisible(false)}
                className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative inline-flex rounded-2xl bg-white p-4">
                <QRCodeSVG
                  value={qrPreviewUrl}
                  size={180}
                  marginSize={2}
                  bgColor="#ffffff"
                  fgColor="#111827"
                  title={lang.twoFactor.setupModalTitle}
                  className={showVerificationStep ? '' : 'opacity-60 blur-sm'}
                />
                {!showVerificationStep ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/55 px-3 text-center">
                    <p className="text-sm font-semibold text-white">
                      {lang.twoFactor.setupGenerate}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secret">{lang.twoFactor.secretLabel}</Label>
              <Input id="secret" readOnly value={qrSecretValue} disabled={!showVerificationStep} />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void copyAuthUrl();
              }}
              disabled={!showVerificationStep}
            >
              {lang.twoFactor.copyAuthUrl}
            </Button>
          </div>
          {showVerificationStep ? (
            <div className="space-y-2">
              <Label htmlFor="verification-code">{lang.twoFactor.verificationCodeLabel}</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder={lang.twoFactor.verificationCodePlaceholder}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>
          ) : null}
        </ModalScaffold>
      ) : null}

      {showDisableTwoFactorModal ? (
        <ModalScaffold
          closeLabel={lang.twoFactor.disableModalCancel}
          onClose={() => setShowDisableTwoFactorModal(false)}
          panelClassName="max-w-lg"
          title={lang.twoFactor.disableModalTitle}
          description={lang.twoFactor.disableModalDescription}
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDisableTwoFactorModal(false)}
              >
                {lang.twoFactor.disableModalCancel}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  void disableTwoFactor();
                }}
                disabled={disableLoading}
              >
                {disableLoading ? lang.twoFactor.disableLoading : lang.twoFactor.disableModalAction}
              </Button>
            </>
          }
        >
          {disableError ? (
            <Alert variant="destructive" role="alert" aria-live="assertive">
              <AlertDescription>{disableError}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="disable-password">{lang.google.currentPasswordLabel}</Label>
            <div className="relative">
              <Icon
                icon={icons.lockKeyhole}
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden
              />
              <Input
                id="disable-password"
                type={disablePasswordVisible ? 'text' : 'password'}
                value={disablePassword}
                onChange={(event) => setDisablePassword(event.target.value)}
                placeholder={lang.password.currentPasswordPlaceholder}
                className="pr-10 pl-9"
              />
              <PasswordVisibilityToggle
                visible={disablePasswordVisible}
                onShow={() => setDisablePasswordVisible(true)}
                onHide={() => setDisablePasswordVisible(false)}
                className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="disable-code">{lang.twoFactor.disableCodeLabel}</Label>
            <Input
              id="disable-code"
              value={disableCode}
              onChange={(event) => setDisableCode(event.target.value)}
              placeholder={lang.twoFactor.disableCodePlaceholder}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>
        </ModalScaffold>
      ) : null}
    </div>
  );
}
