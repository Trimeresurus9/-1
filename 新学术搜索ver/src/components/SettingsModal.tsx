import React, { useState } from 'react';
import { X, User, CreditCard, Settings, ChevronRight, Crown, FileText } from 'lucide-react';
import { isValidEmail } from '../utils/email';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'basic' | 'membership' | 'payment' | 'account';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('membership');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Left Sidebar */}
        <div className="w-56 bg-gray-50 border-r border-gray-200 p-5 flex flex-col">
          {/* User Profile */}
          <div className="flex flex-col items-center mb-6 pb-5 border-b border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mb-2.5">
              <span className="text-white font-bold text-lg">张</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">张涛</p>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 flex-1">
            <button
              onClick={() => setActiveTab('basic')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'basic'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Basic Information</span>
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'membership'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Membership</span>
            </button>

            <button
              onClick={() => setActiveTab('payment')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'payment'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'account'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Account Settings</span>
            </button>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">My Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-md p-1 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'basic' && <BasicInformation />}
            {activeTab === 'membership' && <MembershipPayment />}
            {activeTab === 'payment' && <PaymentTab />}
            {activeTab === 'account' && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Basic Information Tab
function BasicInformation() {
  const [name, setName] = useState('张伟');
  const [email, setEmail] = useState('zhangwei@example.com');
  const [organization, setOrganization] = useState('清华大学');
  const [researchField, setResearchField] = useState('人工智能、机器学习');
  const [emailError, setEmailError] = useState('');

  const handleSave = () => {
    if (!isValidEmail(email)) {
      setEmailError('请输入有效的邮箱地址');
      return;
    }

    setEmailError('');
    console.log('Saving profile', { name, email: email.trim(), organization, researchField });
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h3>
        
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">电子邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                const nextEmail = event.target.value;
                setEmail(nextEmail);
                if (!nextEmail.trim() || isValidEmail(nextEmail)) {
                  setEmailError('');
                }
              }}
              onBlur={() => {
                if (email.trim() && !isValidEmail(email)) {
                  setEmailError('请输入有效的邮箱地址');
                }
              }}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent ${
                emailError ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {emailError ? <p className="mt-2 text-xs text-red-500">{emailError}</p> : null}
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">机构</label>
            <input
              type="text"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
              placeholder="输入您的机构名称"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Research Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">研究领域</label>
            <input
              type="text"
              value={researchField}
              onChange={(event) => setResearchField(event.target.value)}
              placeholder="输入您的研究领域"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              保存更改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Membership & Payment Tab
function MembershipPayment() {
  const [showUsage, setShowUsage] = React.useState(false);

  if (showUsage) {
    return (
      <div className="p-6">
        <div className="max-w-2xl">
          {/* Back Button */}
          <button 
            onClick={() => setShowUsage(false)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>返回</span>
          </button>

          <h3 className="text-sm font-medium text-gray-500 mb-4">Usage（额度消耗情况）</h3>
          
          {/* Usage Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-blue-700 font-medium">本月已使用</span>
              <span className="text-xs text-blue-600">2024年3月</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold text-blue-900">1,250</span>
              <span className="text-sm text-blue-700">Credits</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62.5%' }}></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-blue-700">剩余 750 Credits</span>
              <span className="text-xs text-blue-600">总额度 2,000</span>
            </div>
          </div>

          {/* Usage Records */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-900">消耗记录</h4>
            </div>
            
            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {/* Usage Record Item */}
              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">论文翻译</span>
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Scholar Search</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      "Attention Is All You Need" - 全文翻译
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2024-03-12 14:32</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-red-600">-120</p>
                    <p className="text-xs text-gray-500">Credits</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">AI问答</span>
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Scholar QA</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      关于Transformer架构的详细解释
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2024-03-12 11:15</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-red-600">-45</p>
                    <p className="text-xs text-gray-500">Credits</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">论文复现</span>
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">PaperClaw</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      ResNet模型复现 - 实验配置生成
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2024-03-11 16:48</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-red-600">-200</p>
                    <p className="text-xs text-gray-500">Credits</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">文献检索</span>
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Scholar Search</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      搜索"深度学习在医学图像中的应用"相关论文
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2024-03-11 10:22</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-red-600">-30</p>
                    <p className="text-xs text-gray-500">Credits</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">充值</span>
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">Recharge</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      充值订单 #CR202403110001
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2024-03-11 09:00</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-green-600">+1,000</p>
                    <p className="text-xs text-gray-500">Credits</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">AI问答</span>
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Scholar QA</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      多轮对话 - 关于GAN网络原理
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2024-03-10 15:30</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-red-600">-85</p>
                    <p className="text-xs text-gray-500">Credits</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">论文翻译</span>
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Scholar Search</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      "BERT: Pre-training of Deep Bidirectional Transformers" 
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2024-03-10 11:45</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-red-600">-95</p>
                    <p className="text-xs text-gray-500">Credits</p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-900">想法发现</span>
                      <span className="px-1.5 py-0.5 bg-teal-100 text-teal-700 text-xs rounded">Idea Discovery</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      分析研究领域趋势和研究空白
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2024-03-09 14:20</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-red-600">-150</p>
                    <p className="text-xs text-gray-500">Credits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Load More */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button className="w-full text-xs text-gray-600 hover:text-gray-900 font-medium transition-colors">
                加载更多记录
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-xl">
        <h3 className="text-sm font-medium text-gray-500 mb-4">My Subscriptions</h3>
        
        {/* Current Plan */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Pro - Monthly</p>
            </div>
            <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors">
              Upgrade to Yearly
            </button>
          </div>
        </div>

        {/* Usage */}
        <button 
          onClick={() => setShowUsage(true)}
          className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
        >
          <span className="text-sm font-medium text-gray-900">Usage（额度消耗情况）</span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </button>
      </div>
    </div>
  );
}

// Payment Tab
function PaymentTab() {
  const [visibleCount, setVisibleCount] = useState(4);

  const orderHistory = [
    { id: '1', date: '2026年3月10日', type: 'Pro 月度', amount: '¥68.00', status: 'paid' as const },
    { id: '2', date: '2026年2月10日', type: 'Pro 月度', amount: '¥68.00', status: 'paid' as const },
    { id: '3', date: '2026年1月15日', type: 'Credits 充值', amount: '¥30.00', status: 'paid' as const },
    { id: '4', date: '2025年12月10日', type: 'Pro 月度', amount: '¥68.00', status: 'paid' as const },
    { id: '5', date: '2025年11月10日', type: 'Pro 月度', amount: '¥68.00', status: 'paid' as const },
    { id: '6', date: '2025年10月20日', type: 'Credits 充值', amount: '¥50.00', status: 'paid' as const },
  ];

  const visibleOrders = orderHistory.slice(0, visibleCount);
  const hasMore = visibleCount < orderHistory.length;

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        {/* Invoice Button */}
        <button className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-left">
              <span className="text-sm text-gray-900">发票管理</span>
              <p className="text-xs text-gray-500 mt-0.5">查看和下载发票</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        {/* Order History */}
        <div>
          <div className="mb-4">
            <h3 className="text-gray-900">订单历史</h3>
            <p className="text-sm text-gray-500 mt-0.5">管理账单信息和查看收据</p>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
              <span className="text-xs text-gray-500">日期</span>
              <span className="text-xs text-gray-500">类型</span>
              <span className="text-xs text-gray-500 w-20 text-right">金额</span>
            </div>

            {/* Table Rows */}
            {visibleOrders.map((order, index) => (
              <div
                key={order.id}
                className={`grid grid-cols-[1fr_1fr_auto] gap-4 items-center px-4 py-3 transition-colors hover:bg-gray-50 ${
                  index !== visibleOrders.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-sm text-gray-900">{order.date}</span>
                <span className="text-sm text-gray-900">{order.type}</span>
                <span className="w-20 text-right text-sm text-gray-900">{order.amount || '—'}</span>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              加载更多
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Account Settings Tab
function AccountSettings() {
  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">账户设置</h3>
        
        <div className="space-y-6">
          {/* Change Password */}
          <div className="pb-6 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">修改密码</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="pb-6 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">语言偏好</h4>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent">
              <option value="zh">简体中文</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Notification Settings */}
          <div className="pb-6 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">通知设置</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700">接收产品更新通知</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700">接收账单提醒</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-sm text-gray-700">接收营销邮件</span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h4 className="text-sm font-semibold text-red-600 mb-4">危险操作</h4>
            <button className="px-5 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200">
              删除账户
            </button>
            <p className="text-xs text-gray-500 mt-2">删除账户后，所有数据将被永久清除且无法恢复</p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
              保存更改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
