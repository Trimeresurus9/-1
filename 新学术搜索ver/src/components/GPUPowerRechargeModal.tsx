import React, { useState } from 'react';
import { X, Zap, Sparkles, Cpu, Rocket, DollarSign, Clock, AlertTriangle } from 'lucide-react';

interface GPUPowerRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GPUPowerRechargeModal({ isOpen, onClose }: GPUPowerRechargeModalProps) {
  const [selectedPack, setSelectedPack] = useState<'starter' | 'pro' | 'ultra' | 'enterprise'>('pro');

  if (!isOpen) return null;

  const packs = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$5',
      priceNum: 5,
      gpuHours: '4',
      gpuSpec: 'NVIDIA T4 · 16GB',
      unitPrice: '1.25',
      savings: null,
      icon: <Zap className="w-5 h-5" />,
      color: 'from-gray-700 to-gray-800',
      tag: null,
      description: '适合快速验证和小规模实验',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$20',
      priceNum: 20,
      gpuHours: '20',
      gpuSpec: 'NVIDIA A10G · 24GB',
      unitPrice: '1.00',
      savings: '20%',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-emerald-600 to-emerald-700',
      tag: 'Most Popular',
      description: '推荐给大多数论文复现任务',
    },
    {
      id: 'ultra',
      name: 'Ultra',
      price: '$50',
      priceNum: 50,
      gpuHours: '60',
      gpuSpec: 'NVIDIA A100 · 40GB',
      unitPrice: '0.83',
      savings: '34%',
      icon: <Cpu className="w-5 h-5" />,
      color: 'from-gray-800 to-black',
      tag: 'Best Value',
      description: '大规模训练和多实验并行',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$120',
      priceNum: 120,
      gpuHours: '160',
      gpuSpec: 'NVIDIA A100 · 80GB',
      unitPrice: '0.75',
      savings: '40%',
      icon: <Rocket className="w-5 h-5" />,
      color: 'from-gray-900 to-black',
      tag: null,
      description: '企业级高性能计算需求',
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-xl shadow-2xl z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-6 px-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">购买 GPU 算力</h2>
          <p className="text-gray-600 text-sm">
            选择合适的算力包，以美元结算 GPU 调用费用
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] text-amber-700 font-medium">GPU 算力单独美元结算，与 Credits 分开计费</span>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {packs.map(pack => (
            <button
              key={pack.id}
              onClick={() => setSelectedPack(pack.id)}
              className={`relative p-5 rounded-xl border-2 transition-all text-left hover:shadow-lg ${
                selectedPack === pack.id
                  ? 'border-emerald-500 bg-emerald-50/60 shadow-md ring-1 ring-emerald-200'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {pack.tag && (
                <div className={`absolute -top-2.5 right-3 px-3 py-1 bg-gradient-to-r ${pack.color} text-white text-[10px] font-bold rounded-full shadow-lg uppercase tracking-wide`}>
                  {pack.tag}
                </div>
              )}

              {/* Pack Name & GPU Spec */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`p-2 rounded-lg ${
                  selectedPack === pack.id ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  {pack.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{pack.name}</h3>
                  <p className="text-[11px] text-gray-500">{pack.gpuSpec}</p>
                </div>
              </div>

              {/* Price in USD */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold text-gray-900">{pack.price}</span>
                <span className="text-xs text-gray-500 font-medium">USD</span>
              </div>

              {/* GPU Hours */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-sm text-gray-700 font-semibold">{pack.gpuHours}</span>
                <span className="text-xs text-gray-500">GPU 小时</span>
                {pack.savings && (
                  <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    省 {pack.savings}
                  </span>
                )}
              </div>

              {/* Unit Price */}
              <p className="text-[11px] text-gray-400 mb-2">
                ≈ ${pack.unitPrice}/GPU·hr
              </p>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed">
                {pack.description}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Pack Info */}
        <div className="px-8 pb-6">
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">已选算力包</p>
                <p className="text-lg font-bold text-gray-900">
                  {packs.find(p => p.id === selectedPack)?.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {packs.find(p => p.id === selectedPack)?.gpuSpec}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">GPU 时长</p>
                <div className="flex items-baseline gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="text-xl font-bold text-gray-900">
                    {packs.find(p => p.id === selectedPack)?.gpuHours} <span className="text-sm font-medium text-gray-500">小时</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-lg font-semibold text-base transition-all shadow-lg hover:shadow-xl"
          >
            立即支付 {packs.find(p => p.id === selectedPack)?.price} USD
          </button>

          {/* Info */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>付款后 GPU 额度立即生效 · 安全支付由 Stripe 提供</p>
          </div>

          {/* Tips */}
          <div className="mt-5 p-4 bg-blue-50/70 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-700 font-medium mb-2">💡 计费说明</p>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li>• <strong>Agent 使用</strong>消耗以 <strong>Credits</strong> 结算（如对话、方案生成等）</li>
              <li>• <strong>GPU 算力</strong>为单独 <strong>美元</strong> 结算（如模型训练、实验执行等）</li>
              <li>• 任务完成后，剩余 GPU 美元余额将按汇率换算为 Credits</li>
              <li>• 请确保账户中预留充足的 Credits 和 GPU 费用再启动实验</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}