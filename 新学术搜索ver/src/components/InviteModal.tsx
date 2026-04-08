import React, { useState } from 'react';
import { X, Copy, Send, HandHeart, ChevronRight } from 'lucide-react';
import { isValidEmail } from '../utils/email';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  if (!isOpen) return null;

  const inviteLink = 'https://inains.art/invitation/QKH4ZUI2SQc4K';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSendEmail = () => {
    const nextEmail = email.trim();
    if (!nextEmail) {
      setEmailError('Please enter an email address');
      return;
    }

    if (!isValidEmail(nextEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Handle email sending logic
    console.log('Sending invitation to:', nextEmail);
    setEmail('');
    setEmailError('');
    alert('Invitation sent!');
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
        <div className="text-center pt-8 pb-6 px-6">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-2 border-gray-400">
              <HandHeart className="w-7 h-7 text-gray-900" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invite to get credits</h2>
          <p className="text-gray-600 text-sm">
            Share your invitation link with friends, get 500 credits each
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Share Link Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share your invitation link
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
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Email Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email your invitation
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  const nextEmail = e.target.value;
                  setEmail(nextEmail);
                  if (!nextEmail.trim() || isValidEmail(nextEmail)) {
                    setEmailError('');
                  }
                }}
                onBlur={() => {
                  if (email.trim() && !isValidEmail(email)) {
                    setEmailError('Please enter a valid email address');
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
                placeholder="Enter email address"
                className={`flex-1 px-4 py-2.5 bg-white border text-gray-900 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                  emailError ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-gray-500'
                }`}
              />
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
            {emailError ? <p className="mt-2 text-xs text-red-500">{emailError}</p> : null}
          </div>

          {/* Invitation History */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Invitation History</h3>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-6">
              <div className="flex items-center justify-center gap-12 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                  <div className="text-xs text-gray-600">Credits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
                  <div className="text-xs text-gray-600">Referrals</div>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white bg-opacity-60 rounded-full flex items-center justify-center border-2 border-gray-400">
                  <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="text-sm text-gray-900 hover:text-black font-medium transition-colors">
                  Redeem
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-900 hover:text-black font-medium transition-colors">
                  <span>Invitation history</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
