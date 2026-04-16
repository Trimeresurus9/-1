import React, { useState } from 'react';
import { X, Copy, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const { t } = useLanguage();
  const [inviteCode, setInviteCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [inviteCodeError, setInviteCodeError] = useState('');

  if (!isOpen) return null;

  const inviteLink = 'https://inains.art/invitation/QKH4ZUI2SQc4K';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-5 px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('invite.modalTitle')}</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            {t('invite.modalSubtitle')}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-900">{t('invite.value.title')}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center text-violet-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium leading-6 text-gray-900">{t('invite.value.equivalent')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center text-violet-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium leading-6 text-gray-900">{t('invite.value.deepSearch')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center text-violet-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium leading-6 text-gray-900">{t('invite.value.agent')}</p>
              </div>
            </div>
          </div>

          {/* Share Link Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('invite.shareLink')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <Copy className="w-4 h-4" />
                {copySuccess ? t('invite.copied') : t('invite.copy')}
              </button>
            </div>
          </div>

          {/* Invite Code Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className={`flex-1 px-4 py-2.5 bg-white border text-gray-900 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                  inviteCodeError ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
                }`}
              />
              <button
                onClick={handleRedeemInviteCode}
                className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <Send className="w-4 h-4" />
                {t('invite.redeem')}
              </button>
            </div>
            {inviteCodeError ? <p className="mt-2 text-xs text-red-500">{inviteCodeError}</p> : null}
          </div>

          {/* Invitation History */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">{t('invite.history')}</h3>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-center gap-10 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-0.5">0</div>
                  <div className="text-xs text-gray-600">{t('credits')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-0.5">0</div>
                  <div className="text-xs text-gray-600">{t('invite.referrals')}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
