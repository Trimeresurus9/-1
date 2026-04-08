import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Switch } from '../ui/switch';
import { useLanguage } from '../../contexts/LanguageContext';
import { isValidEmail } from '../../utils/email';

interface EmailVerificationSectionProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  email: string;
  onEmailChange: (email: string) => void;
  verifiedEmail: string;
  onVerifiedEmailChange: (email: string) => void;
  compact?: boolean;
}

function createVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function EmailVerificationSection({
  enabled,
  onEnabledChange,
  email,
  onEmailChange,
  verifiedEmail,
  onVerifiedEmailChange,
  compact = false,
}: EmailVerificationSectionProps) {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [helperMessage, setHelperMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [emailLocked, setEmailLocked] = useState(false);

  const trimmedEmail = email.trim();
  const isVerified = trimmedEmail.length > 0 && trimmedEmail === verifiedEmail;
  const canSendCode = isValidEmail(trimmedEmail) && countdown === 0;
  const canVerify = code.length === 6 && sentCode.length === 6 && isValidEmail(trimmedEmail);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!enabled) {
      setCode('');
      setCodeError('');
      setHelperMessage('');
      setSentCode('');
      setCountdown(0);
      setEmailLocked(false);
      return;
    }

    if (!trimmedEmail) {
      setEmailError('');
      setCode('');
      setCodeError('');
      setHelperMessage('');
      setSentCode('');
      setCountdown(0);
      setEmailLocked(false);
      if (verifiedEmail) {
        onVerifiedEmailChange('');
      }
      return;
    }

    if (verifiedEmail && trimmedEmail !== verifiedEmail) {
      onVerifiedEmailChange('');
      setCode('');
      setCodeError('');
      setSentCode('');
      setCountdown(0);
      setEmailLocked(false);
      setHelperMessage(t('aiFeeds.manageSetup.emailChanged'));
    }
  }, [enabled, trimmedEmail, verifiedEmail, onVerifiedEmailChange, t]);

  useEffect(() => {
    setEmailLocked(isVerified);
  }, [isVerified]);

  const sendLabel = useMemo(() => {
    if (countdown > 0) {
      return t('aiFeeds.manageSetup.resendIn', { count: String(countdown) });
    }
    return sentCode ? t('aiFeeds.manageSetup.resendCode') : t('aiFeeds.manageSetup.sendCode');
  }, [countdown, sentCode, t]);

  const handleSendCode = () => {
    if (!trimmedEmail) {
      setEmailError(t('aiFeeds.manageSetup.emailRequired'));
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setEmailError(t('aiFeeds.manageSetup.emailInvalid'));
      return;
    }

    const nextCode = createVerificationCode();
    setSentCode(nextCode);
    setCode('');
    setCodeError('');
    setEmailError('');
    setCountdown(60);
    onVerifiedEmailChange('');
    setHelperMessage(t('aiFeeds.manageSetup.codeSent', { email: trimmedEmail, code: nextCode }));
  };

  const handleVerifyCode = () => {
    if (!sentCode) {
      setCodeError(t('aiFeeds.manageSetup.codeSendFirst'));
      return;
    }

    if (code.length !== 6) {
      setCodeError(t('aiFeeds.manageSetup.codeLength'));
      return;
    }

    if (code !== sentCode) {
      setCodeError(t('aiFeeds.manageSetup.codeInvalid'));
      return;
    }

    setCodeError('');
    setEmailError('');
    setHelperMessage('');
    setEmailLocked(true);
    onVerifiedEmailChange(trimmedEmail);
  };

  const handleEditEmail = () => {
    setEmailLocked(false);
    setCode('');
    setSentCode('');
    setCodeError('');
    setEmailError('');
    setHelperMessage('');
    setCountdown(0);
    onVerifiedEmailChange('');
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-background p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Mail className="h-4 w-4" />
            {t('aiFeeds.manageSetup.emailPushTitle')}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isVerified ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t('aiFeeds.manageSetup.emailVerified')}
          </div>
          ) : null}
          <Switch checked={enabled} onCheckedChange={onEnabledChange} />
        </div>
      </div>

      {enabled ? (
        <>
          <div className={`grid gap-4 ${compact ? 'lg:grid-cols-[minmax(0,1fr)_auto]' : 'lg:grid-cols-[minmax(0,1fr)_auto]'}`}>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">{t('aiFeeds.manageSetup.emailLabel')}</div>
              <Input
                type="email"
                value={email}
                disabled={emailLocked}
                onChange={(event) => {
                  onEmailChange(event.target.value);
                  if (emailError) {
                    setEmailError('');
                  }
                }}
                onBlur={() => {
                  if (trimmedEmail && !isValidEmail(trimmedEmail)) {
                    setEmailError(t('aiFeeds.manageSetup.emailInvalid'));
                  }
                }}
                placeholder="name@example.com"
                className={emailError ? 'border-red-300 focus-visible:ring-red-200' : ''}
              />
              {emailError ? <p className="text-xs text-red-500">{emailError}</p> : null}
            </div>

            <div className="space-y-2 lg:pt-7">
              {emailLocked ? (
                <Button type="button" variant="outline" onClick={handleEditEmail} className="w-full lg:w-auto">
                  {t('aiFeeds.manageSetup.editEmail')}
                </Button>
              ) : (
                <Button type="button" variant="outline" disabled={!canSendCode} onClick={handleSendCode} className="w-full lg:w-auto">
                  {sendLabel}
                </Button>
              )}
            </div>
          </div>

          {sentCode && !emailLocked ? (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">{t('aiFeeds.manageSetup.codeLabel')}</div>
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <InputOTP maxLength={6} value={code} onChange={(value) => {
                  setCode(value);
                  if (codeError) {
                    setCodeError('');
                  }
                }}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <Button type="button" disabled={!canVerify || isVerified} onClick={handleVerifyCode} className="w-full xl:w-auto">
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {t('aiFeeds.manageSetup.emailVerified')}
                    </>
                  ) : (
                    t('aiFeeds.manageSetup.verifyAndSaveEmail')
                  )}
                </Button>
              </div>
              {codeError ? <p className="text-xs text-red-500">{codeError}</p> : null}
              {!codeError && helperMessage ? <p className="text-xs text-muted-foreground">{helperMessage}</p> : null}
            </div>
          ) : helperMessage ? (
            <p className="text-xs text-muted-foreground">{helperMessage}</p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
