import React, { useState } from 'react';
import { X, Copy, Send, Sparkles, Share2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const { t } = useLanguage();
  const [inviteCode, setInviteCode] = useState('');
  const [copiedTarget, setCopiedTarget] = useState<'link' | 'code' | null>(null);
  const [inviteCodeError, setInviteCodeError] = useState('');

  if (!isOpen) return null;

  const inviteLink = 'https://inains.art/invitation/QKH4ZUI2SQc4K';
  const personalInviteCode = 'QKH4ZUI2SQc4K';

  const handleCopy = (target: 'link' | 'code') => {
    const content = target === 'link' ? inviteLink : personalInviteCode;
    navigator.clipboard.writeText(content);
    setCopiedTarget(target);
    setTimeout(() => setCopiedTarget(null), 2000);
  };

  const handleRedeemInviteCode = () => {
    const nextInviteCode = inviteCode.trim();
    if (!nextInviteCode) {
      setInviteCodeError(t('invite.codeRequired'));
      return;
    }

    // Handle invitation code redeem logic
    console.log('Redeeming invitation code:', nextInviteCode);
    setInviteCode('');
    setInviteCodeError('');
    alert(t('invite.redeemedSuccess'));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 transition-colors hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="px-7 pb-6 pt-8 text-center">
          <h2 className="mb-3 text-[30px] font-semibold tracking-[-0.03em] text-gray-950">{t('invite.modalTitle')}</h2>
          <p className="mx-auto max-w-md text-[15px] leading-7 text-gray-600">
            {t('invite.modalSubtitle')}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-5 px-7 pb-7">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 px-5 py-4">
            <div className="mb-3">
              <h3 className="text-[13px] font-semibold tracking-[0.01em] text-gray-900">{t('invite.value.title')}</h3>
            </div>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center text-violet-500">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <p className="text-[15px] font-medium leading-6 text-gray-900">{t('invite.value.equivalent')}</p>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center text-violet-500">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <p className="text-[15px] font-medium leading-6 text-gray-900">{t('invite.value.deepSearch')}</p>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center text-violet-500">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <p className="text-[15px] font-medium leading-6 text-gray-900">{t('invite.value.agent')}</p>
              </div>
            </div>
          </div>

          {/* Share Code Section */}
          <div>
            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
              {t('invite.shareYourCode')}
            </label>
            <div className="flex gap-2">
              <div className="flex min-h-[56px] flex-1 items-center justify-between rounded-2xl border border-gray-300 bg-white px-5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <div className="min-w-0">
                  <div className="text-[24px] font-semibold tracking-[-0.03em] text-gray-950">{personalInviteCode}</div>
                </div>
                <button
                  onClick={() => handleCopy('code')}
                  className="ml-4 shrink-0 text-sm font-semibold text-cyan-500 transition-colors hover:text-cyan-600"
                >
                  {copiedTarget === 'code' ? t('invite.copied') : t('invite.copy')}
                </button>
              </div>
              <button
                onClick={() => handleCopy('link')}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gray-300 bg-white text-gray-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:bg-gray-50 hover:text-gray-900"
                aria-label={t('invite.copyLink')}
                title={t('invite.copyLink')}
              >
                {copiedTarget === 'link' ? <Copy className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Invite Code Section */}
          <div>
            <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
              {t('invite.enterCode')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value);
                  if (e.target.value.trim()) {
                    setInviteCodeError('');
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleRedeemInviteCode()}
                placeholder={t('invite.enterCodePlaceholder')}
                className={`min-h-[56px] flex-1 rounded-2xl border bg-white px-5 py-3 text-[16px] font-medium text-gray-900 placeholder:text-[15px] placeholder:font-normal placeholder:text-gray-400 shadow-[0_1px_2px_rgba(15,23,42,0.03)] focus:border-transparent focus:outline-none focus:ring-2 ${
                  inviteCodeError ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
                }`}
              />
              <button
                onClick={handleRedeemInviteCode}
                className="flex min-h-[56px] min-w-[152px] items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-gray-900"
              >
                <Send className="w-4 h-4" />
                {t('invite.redeem')}
              </button>
            </div>
            {inviteCodeError ? <p className="mt-2 text-xs leading-5 text-red-500">{inviteCodeError}</p> : null}
          </div>

          {/* Invitation History */}
          <div className="pt-2">
            <div className="mb-2.5 flex items-center justify-between">
              <h3 className="text-[13px] font-medium text-gray-700">{t('invite.history')}</h3>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 px-5 py-4">
              <div className="flex items-center justify-center gap-12">
                <div className="text-center">
                  <div className="mb-1 text-[28px] font-semibold tracking-[-0.03em] text-gray-950">0</div>
                  <div className="text-[12px] text-gray-600">{t('credits')}</div>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="mb-1 text-[28px] font-semibold tracking-[-0.03em] text-gray-950">0</div>
                  <div className="text-[12px] text-gray-600">{t('invite.referrals')}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
