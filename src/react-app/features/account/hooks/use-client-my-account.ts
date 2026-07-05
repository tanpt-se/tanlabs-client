'use client';

import { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useToast } from '@tanlabs/astryx';
import { ApiError } from '@tanlabs/contracts';

import {
  beginTwoFactorSetupRequest,
  changePasswordRequest,
  disableTwoFactorRequest,
  fetchMyAccountHydration,
  logoutAllDevicesRequest,
  startGoogleLinkRequest,
  unlinkGoogleRequest,
  verifyTwoFactorSetupRequest,
} from '@/features/account/requests/my-account.requests';
import { clearSession, getUser } from '@/shared/auth';
import type { ClientLang } from '@/shared/i18n';
import { SESSION_TERMINATED_ROUTE } from '@/shared/routing';

type TwoFactorState = {
  enabled: boolean;
  verified: boolean;
  method: 'totp' | null;
};

export function useClientMyAccount({
  lang,
  initialUser,
}: {
  lang: ClientLang['myAccount'];
  initialUser: { id?: string } | null;
}) {
  const navigate = useNavigate();
  const user = initialUser ?? getUser();
  const { pushToast } = useToast();
  const userProfile = getUser();

  const [linkingGoogle, setLinkingGoogle] = useState(false);
  const [linkedGoogleEmail, setLinkedGoogleEmail] = useState<string | null>(null);
  const [showGoogleUnlinkConfirm, setShowGoogleUnlinkConfirm] = useState(false);
  const [unlinkPassword, setUnlinkPassword] = useState('');
  const [unlinkPasswordVisible, setUnlinkPasswordVisible] = useState(false);

  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorState>({
    enabled: false,
    verified: false,
    method: null,
  });
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [showDisableTwoFactorModal, setShowDisableTwoFactorModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [loggingOutDevices, setLoggingOutDevices] = useState(false);

  const [setupPassword, setSetupPassword] = useState('');
  const [setupPasswordVisible, setSetupPasswordVisible] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [setupSecret, setSetupSecret] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [recentAuthToken, setRecentAuthToken] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');

  const [disablePassword, setDisablePassword] = useState('');
  const [disablePasswordVisible, setDisablePasswordVisible] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [disableLoading, setDisableLoading] = useState(false);
  const [disableError, setDisableError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');

  const accountEmail = userProfile?.email ?? `${user?.id ?? 'user'}@example.com`;
  const fullName = useMemo(() => {
    const display = accountEmail.split('@')[0] || lang.account.fallbackName;
    return display
      .split(/[._\s-]+/)
      .filter(Boolean)
      .join(' ');
  }, [accountEmail, lang.account.fallbackName]);
  const accountRole = userProfile?.role ? userProfile.role.toUpperCase() : 'USER';

  const showVerificationStep = Boolean(setupSecret && recentAuthToken);
  const qrPreviewUrl =
    showVerificationStep && otpauthUrl
      ? otpauthUrl
      : 'otpauth://totp/AuthLab?secret=MASKEDMASKEDMASKED&issuer=AuthLab';
  const qrSecretValue = showVerificationStep ? setupSecret : '•••• •••• •••• ••••';
  const setupBusy = setupLoading || verifyLoading;

  useEffect(() => {
    void (async () => {
      try {
        const [{ identities }, { twoFactor }] = await fetchMyAccountHydration();

        const googleIdentity = identities.find((identity) => identity.provider === 'google');
        setLinkedGoogleEmail(googleIdentity?.providerEmail ?? null);
        setTwoFactorStatus(twoFactor);
      } catch {
        // Keep defaults when background hydration fails.
      }
    })();
  }, []);

  const logoutAllOtherDevices = async () => {
    if (loggingOutDevices) return;
    setLoggingOutDevices(true);
    try {
      await logoutAllDevicesRequest();
      pushToast({ title: lang.controls.logoutSuccess, tone: 'success' });
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.code === 'AUTH_TOKEN_EXPIRED' || error.code === 'AUTH_SESSION_REVOKED')
      ) {
        clearSession();
        navigate(SESSION_TERMINATED_ROUTE, { replace: true });
        return;
      }
      pushToast({
        title:
          error instanceof ApiError && error.message ? error.message : lang.controls.logoutError,
        tone: 'danger',
      });
    } finally {
      setLoggingOutDevices(false);
    }
  };

  const startGoogleLink = async () => {
    if (linkingGoogle) return;
    setLinkingGoogle(true);
    try {
      const result = await startGoogleLinkRequest();
      window.location.assign(result.url);
    } catch (error) {
      pushToast({
        title: error instanceof ApiError && error.message ? error.message : lang.google.linkError,
        tone: 'danger',
      });
    } finally {
      setLinkingGoogle(false);
    }
  };

  const unlinkGoogle = async () => {
    if (!unlinkPassword.trim()) {
      pushToast({ title: lang.google.currentPasswordRequired, tone: 'danger' });
      return;
    }
    setLinkingGoogle(true);
    try {
      await unlinkGoogleRequest(unlinkPassword);
      setLinkedGoogleEmail(null);
      setShowGoogleUnlinkConfirm(false);
      setUnlinkPassword('');
      pushToast({ title: lang.google.unlinkSuccess, tone: 'success' });
    } catch (error) {
      pushToast({
        title: error instanceof ApiError && error.message ? error.message : lang.google.unlinkError,
        tone: 'danger',
      });
    } finally {
      setLinkingGoogle(false);
    }
  };

  const beginTwoFactorSetup = async () => {
    setTwoFactorError('');
    if (!setupPassword.trim()) {
      setTwoFactorError(lang.google.currentPasswordRequired);
      return;
    }
    setSetupLoading(true);
    try {
      const result = await beginTwoFactorSetupRequest(setupPassword);
      setTwoFactorStatus(result.twoFactor);
      setSetupSecret(result.totpSetup.secret);
      setOtpauthUrl(result.totpSetup.otpauthUrl);
      setRecentAuthToken(result.recentAuthToken);
      pushToast({ title: lang.twoFactor.setupSuccess, tone: 'success' });
    } catch (error) {
      setTwoFactorError(error instanceof ApiError ? error.message : lang.twoFactor.setupError);
    } finally {
      setSetupLoading(false);
    }
  };

  const verifyTwoFactorSetup = async () => {
    setTwoFactorError('');
    if (!verificationCode.trim()) {
      setTwoFactorError(lang.twoFactor.verificationCodeRequired);
      return;
    }
    setVerifyLoading(true);
    try {
      const result = await verifyTwoFactorSetupRequest(verificationCode, recentAuthToken);
      setTwoFactorStatus(result.twoFactor);
      setShowTwoFactorModal(false);
      setSetupPassword('');
      setSetupSecret('');
      setOtpauthUrl('');
      setRecentAuthToken('');
      setVerificationCode('');
      pushToast({ title: lang.twoFactor.verifySuccess, tone: 'success' });
    } catch (error) {
      setTwoFactorError(error instanceof ApiError ? error.message : lang.twoFactor.verifyError);
    } finally {
      setVerifyLoading(false);
    }
  };

  const openDisableTwoFactorModal = () => {
    setDisableError('');
    setDisablePassword('');
    setDisableCode('');
    setDisablePasswordVisible(false);
    setShowDisableTwoFactorModal(true);
  };

  const disableTwoFactor = async () => {
    setDisableError('');
    if (!disablePassword.trim()) {
      setDisableError(lang.google.currentPasswordRequired);
      return;
    }
    if (!/^\d{6}$/.test(disableCode.trim())) {
      setDisableError(lang.twoFactor.disableCodeInvalid);
      return;
    }
    setDisableLoading(true);
    try {
      const result = await disableTwoFactorRequest(disablePassword, disableCode.trim());
      setTwoFactorStatus(result.twoFactor);
      setShowDisableTwoFactorModal(false);
      pushToast({ title: lang.twoFactor.disableSuccess, tone: 'success' });
    } catch (error) {
      setDisableError(error instanceof ApiError ? error.message : lang.twoFactor.disableError);
    } finally {
      setDisableLoading(false);
    }
  };

  const changePassword = async () => {
    setChangePasswordError('');
    if (!currentPassword.trim()) {
      setChangePasswordError(lang.password.currentPasswordRequired);
      return;
    }
    if (newPassword.length < 10) {
      setChangePasswordError(lang.password.newPasswordLength);
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError(lang.password.confirmPasswordMismatch);
      return;
    }
    setChangePasswordLoading(true);
    try {
      await changePasswordRequest(currentPassword, newPassword);
      setShowChangePasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      pushToast({ title: lang.password.modalSuccess, tone: 'success' });
    } catch (error) {
      setChangePasswordError(error instanceof ApiError ? error.message : lang.password.modalError);
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return {
    accountEmail,
    accountRole,
    fullName,
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
    setupSecret,
    otpauthUrl,
    recentAuthToken,
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
    startGoogleLink,
    unlinkGoogle,
    beginTwoFactorSetup,
    verifyTwoFactorSetup,
    openDisableTwoFactorModal,
    disableTwoFactor,
    changePassword,
    handleGoogleToggle: (checked: boolean) => {
      if (checked) {
        void startGoogleLink();
        return;
      }
      setShowGoogleUnlinkConfirm(true);
    },
    openTwoFactor: () => setShowTwoFactorModal(true),
    copyAuthUrl: async () => {
      try {
        if (otpauthUrl) {
          await navigator.clipboard.writeText(otpauthUrl);
          pushToast({ title: lang.twoFactor.copyAuthUrlSuccess, tone: 'success' });
        }
      } catch {
        pushToast({ title: lang.twoFactor.copyAuthUrlError, tone: 'danger' });
      }
    },
  };
}
