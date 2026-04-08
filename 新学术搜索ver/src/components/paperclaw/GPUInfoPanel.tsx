import React, { useState, useEffect } from 'react';
import { Cpu, Copy, Check, Wifi, WifiOff, Clock, Shield, ChevronDown, ChevronUp, Terminal, ExternalLink, Lock, Server } from 'lucide-react';

interface GPUInfoPanelProps {
  isAgentControlling?: boolean; // Agent 是否正在控制中
  gpuStatus?: 'running' | 'stopped' | 'starting' | 'stopping';
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function GPUInfoPanel({
  isAgentControlling = false,
  gpuStatus = 'running',
  isExpanded = false,
  onToggle,
}: GPUInfoPanelProps) {
  const [copiedSSH, setCopiedSSH] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [countdown, setCountdown] = useState(15 * 24 * 3600); // 15 days in seconds

  // Countdown timer
  useEffect(() => {
    if (gpuStatus !== 'running') return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [gpuStatus]);

  const sshCommand = 'ssh root@gpu-hub-35a7c.instance.wisacademia.com -p 22018';
  const sshPassword = 'wP8k$Tz2@xR4nLq!';
  const ipAddress = '203.156.72.114';
  const gpuModel = 'NVIDIA A100 80GB';
  const cudaVersion = 'CUDA 12.1';

  const formatCountdown = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}天 ${hours}小时`;
    if (hours > 0) return `${hours}小时 ${mins}分钟`;
    return `${mins}分钟`;
  };

  const handleCopySSH = async () => {
    try {
      await navigator.clipboard.writeText(sshCommand);
      setCopiedSSH(true);
      setTimeout(() => setCopiedSSH(false), 2000);
    } catch {
      setCopiedSSH(true);
      setTimeout(() => setCopiedSSH(false), 2000);
    }
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(sshPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    } catch {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  const statusConfig = {
    running: { label: '运行中', dotColor: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50' },
    stopped: { label: '已停止', dotColor: 'bg-gray-400', textColor: 'text-gray-600', bgColor: 'bg-gray-100' },
    starting: { label: '启动中', dotColor: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50' },
    stopping: { label: '停止中', dotColor: 'bg-red-400', textColor: 'text-red-700', bgColor: 'bg-red-50' },
  };

  const status = statusConfig[gpuStatus];

  if (!isExpanded) return null;

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6 py-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Server className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>GPU 实例控制台</h3>
              <p className="text-[11px] text-gray-400">由 GPU Hub 提供算力支持</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full ${status.bgColor} ${status.textColor}`} style={{ fontWeight: 500 }}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor} ${gpuStatus === 'running' || gpuStatus === 'starting' ? 'animate-pulse' : ''}`} />
              {status.label}
            </span>

            {/* Agent Lock Badge */}
            {isAgentControlling && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full" style={{ fontWeight: 500 }}>
                <Lock className="w-3 h-3" />
                Agent 控制中
              </span>
            )}

            <button
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          {/* GPU Model */}
          <div className="bg-white rounded-lg border border-gray-200 px-3 py-2.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>GPU 型号</p>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-500" />
              <p className="text-xs text-gray-900" style={{ fontWeight: 600 }}>{gpuModel}</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">{cudaVersion}</p>
          </div>

          {/* IP Address */}
          <div className="bg-white rounded-lg border border-gray-200 px-3 py-2.5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>IP 地址</p>
            <div className="flex items-center gap-1.5">
              {gpuStatus === 'running' ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-gray-400" />
              )}
              <p className="text-xs text-gray-900 font-mono" style={{ fontWeight: 600 }}>
                {gpuStatus === 'running' ? ipAddress : '—'}
              </p>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Port: 22018</p>
          </div>

          {/* SSH Connection - spans 2 columns */}
          <div className={`col-span-2 rounded-lg border px-3 py-2.5 transition-all ${
            isAgentControlling
              ? 'bg-gray-50 border-gray-200 opacity-60'
              : 'bg-gray-900 border-gray-700'
          }`}>
            {isAgentControlling && (
              <div className="flex items-center gap-1.5 mb-1.5">
                <Lock className="w-3 h-3 text-blue-500" />
                <p className="text-[10px] text-blue-600" style={{ fontWeight: 500 }}>Agent 正在控制，SSH 暂时锁定</p>
              </div>
            )}
            <div className={isAgentControlling ? 'pointer-events-none' : ''}>
              {/* SSH Command */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Terminal className="w-3 h-3 text-gray-400" />
                  <span className={`text-[10px] ${isAgentControlling ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontWeight: 500 }}>SSH</span>
                </div>
                <code className={`flex-1 text-[11px] font-mono px-2 py-1 rounded ${
                  isAgentControlling ? 'bg-gray-100 text-gray-500' : 'bg-black/30 text-green-400'
                } truncate`}>
                  {sshCommand}
                </code>
                <button
                  onClick={handleCopySSH}
                  disabled={isAgentControlling || gpuStatus !== 'running'}
                  className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded transition-colors flex-shrink-0 ${
                    isAgentControlling || gpuStatus !== 'running'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : copiedSSH
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {copiedSSH ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedSSH ? '已复制' : '复制'}
                </button>
              </div>
              {/* Password */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Shield className="w-3 h-3 text-gray-400" />
                  <span className={`text-[10px] ${isAgentControlling ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontWeight: 500 }}>密码</span>
                </div>
                <code className={`flex-1 text-[11px] font-mono px-2 py-1 rounded ${
                  isAgentControlling ? 'bg-gray-100 text-gray-500' : 'bg-black/30 text-amber-400'
                } truncate`}>
                  {isAgentControlling ? '••••••••••••••••' : sshPassword}
                </code>
                <button
                  onClick={handleCopyPassword}
                  disabled={isAgentControlling || gpuStatus !== 'running'}
                  className={`flex items-center gap-1 px-2 py-1 text-[11px] rounded transition-colors flex-shrink-0 ${
                    isAgentControlling || gpuStatus !== 'running'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : copiedPassword
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {copiedPassword ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedPassword ? '已复制' : '复制'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        
      </div>
    </div>
  );
}