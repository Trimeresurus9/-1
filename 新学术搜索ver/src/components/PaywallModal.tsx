import React, { useState } from 'react';
import { X, Check, Star, Zap, Crown } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'plus' | 'pro'>('plus');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Guest',
      subtitle: 'Free',
      price: '$0',
      period: 'mo',
      tag: null,
      tagColor: null,
      icon: null,
      credits: {
        signup: '100 Credits',
        signupNote: '(永久有效)',
        daily: '10 Credits',
        dailyNote: '(每日重置)',
      },
      capacity: {
        deepSearch: '3 次 Deep Search',
        capacityNote: '(利用注册奖励)',
        quickSearch: '每日 10 次快速搜索',
      },
      features: [
        { name: 'Quick Search 模式', enabled: true },
        { name: 'Deep Search 模式', enabled: true },
        { name: 'ScholarQA 模式', enabled: true },
        { name: 'AI Feeds', enabled: true },
        { name: 'AI Survey', enabled: true },
        { name: 'AI Index', enabled: true, limit: '[50K]' },
        { name: '配存', enabled: true, limit: '[1GB]', color: 'text-gray-700' },
      ],
      cta: '当前订阅',
      ctaDisabled: true,
    },
    {
      id: 'plus',
      name: 'Plus',
      subtitle: 'Researcher',
      price: '$5',
      period: 'mo',
      tag: '最受欢迎 (Most Popular)',
      tagColor: 'bg-gray-100 text-gray-900 border-gray-400',
      icon: <Star className="w-4 h-4" />,
      credits: {
        monthly: '2000 Credits',
        daily: '10 Credits',
        dailyNote: '(每日重置)',
      },
      capacity: {
        deepSearch: '200 次 Deep Search',
        aiSurvey: '100 次 AI Survey 生成',
      },
      features: [
        { name: 'Quick Search 模式', enabled: true },
        { name: 'Deep Search 模式', enabled: true },
        { name: 'ScholarQA 模式', enabled: true },
        { name: 'AI Feeds', enabled: true },
        { name: 'AI Survey', enabled: true },
        { name: 'AI Index', enabled: true, limit: '[All]', color: 'text-gray-900' },
        { name: '配存', enabled: true, limit: '[10GB]', color: 'text-gray-700' },
        { name: '额外充值享 8.8折', enabled: true },
      ],
      cta: '获取 Plus 版',
      ctaDisabled: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      subtitle: 'Lab',
      price: '$20',
      period: 'mo',
      tag: '限时特惠 (Limited Offer)',
      tagColor: 'bg-gray-200 text-gray-900 border-gray-500',
      icon: <Crown className="w-4 h-4" />,
      credits: {
        monthly: '10000 Credits',
        daily: '10 Credits',
        dailyNote: '(每日重置)',
      },
      capacity: {
        deepSearch: '1000 次 Deep Search',
        aiSurvey: '500 次 AI Survey 生成',
      },
      features: [
        { name: 'Quick Search 模式', enabled: true },
        { name: 'Deep Search 模式', enabled: true },
        { name: 'ScholarQA 模式', enabled: true },
        { name: 'AI Feeds', enabled: true },
        { name: 'AI Survey', enabled: true },
        { name: 'AI Index', enabled: true, limit: '[All]', color: 'text-gray-900' },
        { name: '配存', enabled: true, limit: '[50GB]', color: 'text-gray-700' },
        { name: '额外充值享 5折', enabled: true, color: 'text-gray-900' },
      ],
      cta: '获取 Pro 版',
      ctaDisabled: false,
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl max-h-[90vh] bg-white rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-6 px-6 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">升级会员计划</h2>
          <p className="text-gray-600">选择适合您的研究需求的计划</p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-8">
            {/* Plans Grid */}
            <div className="grid grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border-2 transition-all ${
                    plan.id === 'plus'
                      ? 'border-gray-900 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Tag */}
                  {plan.tag && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold border ${plan.tagColor} flex items-center gap-1 whitespace-nowrap`}>
                      {plan.icon}
                      <span>{plan.tag}</span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan Name & Price */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {plan.name}
                        <span className="text-base font-normal text-gray-600 ml-2">
                          ({plan.subtitle})
                        </span>
                      </h3>
                      <div className="flex items-baseline justify-center gap-1 mt-3">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600">/ {plan.period}</span>
                      </div>
                    </div>

                    {/* Credits Hero */}
                    <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300">
                      <h4 className="text-xs font-semibold text-gray-700 mb-3">核心权益 (强调积分数量)</h4>
                      <div className="space-y-2 text-sm">
                        {plan.credits.signup && (
                          <div>
                            <span className="font-semibold text-gray-900">注册赠送: {plan.credits.signup}</span>
                            {plan.credits.signupNote && (
                              <span className="text-gray-600 text-xs ml-1">{plan.credits.signupNote}</span>
                            )}
                          </div>
                        )}
                        {plan.credits.monthly && (
                          <div>
                            <span className="font-semibold text-gray-900">每月获得: {plan.credits.monthly}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-900">每日补给: </span>
                          <span className="font-semibold text-gray-900">{plan.credits.daily}</span>
                          {plan.credits.dailyNote && (
                            <span className="text-gray-600 text-xs ml-1">{plan.credits.dailyNote}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
                      <h4 className="text-xs font-semibold text-gray-700 mb-3">核心能力与奖励倍率 (强调实际用途)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-1.5">
                          <Zap className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-gray-900">约能进行 {plan.capacity.deepSearch}</span>
                            {plan.capacity.capacityNote && (
                              <span className="text-gray-600 text-xs ml-1">{plan.capacity.capacityNote}</span>
                            )}
                          </div>
                        </div>
                        {plan.capacity.aiSurvey && (
                          <div className="text-gray-700 text-xs ml-5">
                            或 {plan.capacity.aiSurvey}
                          </div>
                        )}
                        {plan.capacity.quickSearch && (
                          <div className="text-gray-700 text-sm">
                            + {plan.capacity.quickSearch}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-gray-700 mb-3">功能解锁</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            {feature.enabled ? (
                              <Check className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            )}
                            <span className={feature.enabled ? 'text-gray-900' : 'text-gray-400'}>
                              {feature.name}
                              {feature.limit && (
                                <span className={`ml-1 font-semibold ${feature.color || 'text-gray-900'}`}>
                                  {feature.limit}
                                </span>
                              )}
                              {feature.note && (
                                <span className="text-gray-500 text-xs ml-1">
                                  {feature.note}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      disabled={plan.ctaDisabled}
                      className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                        plan.ctaDisabled
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : plan.id === 'plus'
                          ? 'bg-black hover:bg-gray-900 text-white shadow-lg'
                          : 'bg-gray-800 hover:bg-gray-900 text-white'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>所有付费计划支持随时取消 • 安全支付由 Stripe 提供</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
