import React, { useState } from 'react';
import { X, Zap, Sparkles } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
  const [selectedPack, setSelectedPack] = useState<'mini' | 'pro'>('pro');

  if (!isOpen) return null;

  const packs = [
    {
      id: 'mini',
      name: 'Mini Pack',
      price: '$5',
      credits: '1000',
      bonus: null,
      icon: <Zap className="w-6 h-6" />,
      color: 'from-gray-600 to-gray-800',
      borderColor: 'border-gray-800',
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      price: '$10',
      credits: '2500',
      bonus: '+25%',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-gray-700 to-gray-900',
      borderColor: 'border-gray-900',
      tag: 'Best Value',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-6 px-6 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center border-2 border-gray-400">
              <svg className="w-7 h-7 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">充值 Credits</h2>
          <p className="text-gray-600 text-sm">
            选择合适的充值套餐，立即获取更多积分
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Packs Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {packs.map((pack) => (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack.id as 'mini' | 'pro')}
                className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                  selectedPack === pack.id
                    ? `${pack.borderColor} shadow-lg`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Tag */}
                {pack.tag && (
                  <div className="absolute -top-2 right-3 px-2 py-0.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs font-semibold rounded-full">
                    {pack.tag}
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${pack.color} text-white mb-3`}>
                  {pack.icon}
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {pack.name}
                </h3>

                {/* Price */}
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {pack.price}
                </div>

                {/* Credits */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {pack.credits}
                  </span>
                  <span className="text-sm text-gray-600">Credits</span>
                </div>

                {/* Bonus */}
                {pack.bonus && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-900 text-xs font-semibold rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>Bonus {pack.bonus}</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Purchase Button */}
          <button
            className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white rounded-lg font-semibold text-base transition-all shadow-lg hover:shadow-xl"
          >
            立即充值 {packs.find(p => p.id === selectedPack)?.price}
          </button>

          {/* Info */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>充值后积分立即到账 • 安全支付由 Stripe 提供</p>
          </div>
        </div>
      </div>
    </>
  );
}
