import React, { useState, useEffect } from 'react';
import { Settings, Cpu, HardDrive, Zap, DollarSign, Clock, AlertCircle, CheckCircle2, Info, Loader2, Square, Timer, Activity, RotateCcw, Lock, FileText, FileEdit, X } from 'lucide-react';

interface SetupProps {
  onConfirmAndStart?: () => void;  // 确认配置并开始实验的回调
  isConfirmed?: boolean;  // 是否已确认（从Workspace传入）
  experimentStatus?: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
}

// GPU config lookup for running state
const gpuConfigMap: Record<string, { name: string; vram: string; cost: number; framework: string }> = {
  'rtx4090-pytorch': { name: 'RTX 4090', vram: '24 GB', cost: 80, framework: 'PyTorch 2.0' },
  'v100-4x-pytorch': { name: '4x NVIDIA V100', vram: '128 GB', cost: 120, framework: 'PyTorch 2.0' },
  'a100-2x-pytorch': { name: '2x NVIDIA A100', vram: '160 GB', cost: 160, framework: 'PyTorch 2.0' },
  'v100-8x-tensorflow': { name: '8x NVIDIA V100', vram: '256 GB', cost: 240, framework: 'TensorFlow 2.12' },
  't4-pytorch': { name: 'NVIDIA T4', vram: '16 GB', cost: 30, framework: 'PyTorch 2.0' },
};

const experimentPhases = [
  { id: 0, label: '环境初始化', detail: '正在配置GPU资源和安装依赖库...', progress: 15 },
  { id: 1, label: '数据预处理', detail: '加载数据集并进行分词、批处理...', progress: 35 },
  { id: 2, label: '模型训练', detail: '执行训练循环，监控损失和验证指标...', progress: 70 },
  { id: 3, label: '评估与报告', detail: '在测试集上推理并计算BLEU分数...', progress: 95 },
];

export function Setup({ onConfirmAndStart, isConfirmed = false, experimentStatus = 'idle' }: SetupProps) {
  const [selectedGpu, setSelectedGpu] = useState('rtx4090-pytorch');
  const [batchSize, setBatchSize] = useState('medium');
  const [maxSteps, setMaxSteps] = useState('100000');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [planContent, setPlanContent] = useState(`# 步骤 1: 环境配置

安装 PyTorch 和标准 NLP 依赖库，包括 transformers、tokenizers 和 datasets。

\`\`\`bash
pip install torch torchvision torchaudio
pip install transformers datasets tokenizers
pip install numpy pandas matplotlib tensorboard
\`\`\`

配置 CUDA 环境并验证 GPU 可用性。

# 步骤 2: 数据预处理

下载并清理 WMT 2014 英德翻译数据集：
- 训练语料：450万句对
- 验证集：3,000句对
- 测试集：3,003句对

应用字节对编码(BPE)分词，使用37,000次合并操作创建词汇表。

# 步骤 3: 模型训练

使用 Xavier 均匀初始化 transformer 权重。配置模型架构：
- **层数**: 6个编码器层 + 6个解码器层
- **注意力头**: 8个并行注意力头
- **模型维度**: 512
- **前馈网络维度**: 2048
- **Dropout**: 0.1

使用 Adam 优化器(β₁=0.9, β₂=0.98, ε=10⁻⁹)和自定义学习率调度（4,000步预热）启动训练循环。

**训练配置**:
- 批次大小: 每批25,000个token
- 训练步数: 100,000次迭代
- 预计时长: 在8块V100 GPU上约12小时
- 检查点频率: 每1,000步

# 步骤 4: 评估

使用束搜索解码(束大小=4，长度惩罚α=0.6)在WMT 2014英德测试集上评估。

**目标指标**: 测试集BLEU ≥ 27.3

# 步骤 5: 分析与可视化

生成注意力热图以可视化多头注意力模式。分析不同句子长度的翻译质量。`);
  const [savedPlanContent, setSavedPlanContent] = useState('');

  const isRunning = isConfirmed && (experimentStatus === 'running' || experimentStatus === 'idle');

  const gpuOptions = [
    { id: 'v100-4x', name: '4x NVIDIA V100', memory: '128 GB', cost: 120, recommended: true, description: '适合中大型实验' },
    { id: 'v100-8x', name: '8x NVIDIA V100', memory: '256 GB', cost: 240, recommended: false, description: '论文原始配置' },
    { id: 'a100-2x', name: '2x NVIDIA A100', memory: '160 GB', cost: 160, recommended: false, description: '最新架构，速度更快' },
    { id: 't4-1x', name: '1x NVIDIA T4', memory: '16 GB', cost: 30, recommended: false, description: '低成本选项' },
  ];

  const batchSizeOptions = [
    { id: 'original', label: '25,000 tokens', cost: 0, time: '12h', description: '论文原始配置' },
    { id: 'medium', label: '12,000 tokens', cost: 0, time: '18h', description: '推荐配置' },
    { id: 'small', label: '4,000 tokens', cost: 0, time: '36h', description: '小型GPU适用' },
  ];

  const estimateTime = () => {
    const baseTime = parseInt(batchSizeOptions.find(opt => opt.id === batchSize)?.time || '18h');
    return `约 ${baseTime} 小时`;
  };

  const estimateCost = () => {
    const gpu = gpuOptions.find(opt => opt.id === selectedGpu);
    const timeHours = parseInt(batchSizeOptions.find(opt => opt.id === batchSize)?.time || '18');
    return gpu ? Math.round(gpu.cost * timeHours) : 0;
  };

  // Elapsed timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Phase progression simulation
  useEffect(() => {
    if (!isRunning) return;
    const phaseTimers = [8, 20, 45, 70]; // seconds to advance to next phase
    const timeout = setTimeout(() => {
      if (currentPhase < experimentPhases.length - 1) {
        setCurrentPhase(prev => prev + 1);
      }
    }, (phaseTimers[currentPhase] || 30) * 1000);
    return () => clearTimeout(timeout);
  }, [isRunning, currentPhase]);

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const handleConfirm = () => {
    setElapsedSeconds(0);
    setCurrentPhase(0);
    onConfirmAndStart?.();
  };

  const handleStop = () => {
    // Stop is handled by parent via experimentStatus prop
  };

  const activeGpu = gpuConfigMap[selectedGpu] || gpuConfigMap['rtx4090-pytorch'];
  const creditsPerHour = activeGpu.cost;
  const creditsConsumed = Math.round((elapsedSeconds / 3600) * creditsPerHour * 100) / 100;
  const phase = experimentPhases[currentPhase];
  // Simulate GPU utilization oscillating
  const gpuUtil = isRunning ? Math.min(99, 72 + Math.round(Math.sin(elapsedSeconds * 0.3) * 15)) : 0;
  const gpuTemp = isRunning ? Math.min(89, 58 + Math.round(Math.sin(elapsedSeconds * 0.15) * 12)) : 0;
  const vramUsed = isRunning ? Math.min(95, 45 + Math.round(Math.sin(elapsedSeconds * 0.08) * 20)) : 0;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isRunning ? 'bg-green-50 border border-green-100' : 'bg-blue-50 border border-blue-100'}`}>
            {isRunning ? <Activity className="w-5 h-5 text-green-500" /> : <Settings className="w-5 h-5 text-blue-500" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">
                {isRunning ? '实验运行中' : '实验配置'}
              </h2>
              {isRunning && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Running
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {isRunning ? '配置已锁定，实验正在执行' : '配置GPU资源和训练参数'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6 max-w-3xl">

          {isRunning ? (
            <>
              {/* ====== RUNNING STATE ====== */}

              {/* Live Status Banner */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{phase.label}</p>
                    <p className="text-xs text-gray-500">{phase.detail}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">阶段</p>
                    <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{currentPhase + 1} / {experimentPhases.length}</p>
                  </div>
                </div>
                {/* Phase progress bar */}
                <div className="w-full bg-green-100 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
                {/* Phase dots */}
                <div className="flex items-center justify-between mt-2">
                  {experimentPhases.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full transition-colors ${
                        idx < currentPhase ? 'bg-green-500' : idx === currentPhase ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                      }`} />
                      <span className={`text-[10px] ${idx <= currentPhase ? 'text-green-700' : 'text-gray-400'}`} style={{ fontWeight: idx === currentPhase ? 600 : 400 }}>
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Timer className="w-3.5 h-3.5 text-blue-500" />
                    <p className="text-[11px] text-gray-500" style={{ fontWeight: 500 }}>已运行时间</p>
                  </div>
                  <p className="text-xl text-gray-900 tabular-nums" style={{ fontWeight: 700 }}>{formatElapsed(elapsedSeconds)}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2">
                    <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                    <p className="text-[11px] text-gray-500" style={{ fontWeight: 500 }}>已消耗</p>
                  </div>
                  <p className="text-xl text-orange-600 tabular-nums" style={{ fontWeight: 700 }}>{creditsConsumed.toFixed(2)} <span className="text-sm text-orange-400">Credits</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Zap className="w-3.5 h-3.5 text-purple-500" />
                    <p className="text-[11px] text-gray-500" style={{ fontWeight: 500 }}>费率</p>
                  </div>
                  <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>{creditsPerHour} <span className="text-sm text-gray-400">Credits/h</span></p>
                </div>
              </div>

              {/* GPU Monitoring */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>GPU 实时监控</h3>
                </div>
                <div className="space-y-3 p-4 bg-gray-900 rounded-xl">
                  {/* GPU Utilization */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-gray-400">GPU 利用率</span>
                      <span className="text-[11px] text-green-400 tabular-nums" style={{ fontWeight: 600 }}>{gpuUtil}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${gpuUtil}%` }} />
                    </div>
                  </div>
                  {/* VRAM Usage */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-gray-400">显存占用</span>
                      <span className="text-[11px] text-blue-400 tabular-nums" style={{ fontWeight: 600 }}>{vramUsed}% · {Math.round(parseInt(activeGpu.vram) * vramUsed / 100)} / {activeGpu.vram}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${vramUsed > 85 ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'}`} style={{ width: `${vramUsed}%` }} />
                    </div>
                  </div>
                  {/* Temperature */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-gray-400">GPU 温度</span>
                      <span className={`text-[11px] tabular-nums ${gpuTemp > 80 ? 'text-orange-400' : 'text-emerald-400'}`} style={{ fontWeight: 600 }}>{gpuTemp}°C</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${gpuTemp > 80 ? 'bg-gradient-to-r from-orange-400 to-red-400' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`} style={{ width: `${gpuTemp}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Locked Configuration Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm text-gray-400" style={{ fontWeight: 600 }}>已锁定配置</h3>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-80">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Cpu className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{activeGpu.name}</p>
                      <p className="text-[11px] text-gray-400">{activeGpu.framework} · {activeGpu.vram} VRAM</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Batch Size</p>
                      <p className="text-xs text-gray-700" style={{ fontWeight: 500 }}>12,000 tokens</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Max Steps</p>
                      <p className="text-xs text-gray-700" style={{ fontWeight: 500 }}>100,000</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">预计总耗时</p>
                      <p className="text-xs text-gray-700" style={{ fontWeight: 500 }}>{estimateTime()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Warning */}
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-orange-800" style={{ fontWeight: 600 }}>费用持续产生中</p>
                  <p className="text-[11px] text-orange-600 mt-0.5">
                    当前费率 {creditsPerHour} Credits/h，预计总消耗 {estimateCost().toLocaleString()} Credits。如需停止实验已消耗的 Credits 将不予退还。
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* ====== CONFIGURATION STATE (original) ====== */}
              
              {/* GPU Selection */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-900">GPU 和镜像配置</h3>
                </div>
                
                <div className="space-y-3">
                  {/* Option 1: RTX 4090 + PyTorch */}
                  <button
                    onClick={() => setSelectedGpu('rtx4090-pytorch')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedGpu === 'rtx4090-pytorch'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">RTX 4090 + PyTorch 2.0</p>
                        <p className="text-xs text-gray-500 mt-0.5">24GB VRAM · 包含 Transformers、Tokenizers 等常用库</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                        推荐
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-gray-600">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>24 GB VRAM</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-medium">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>80 Credits/h</span>
                      </div>
                    </div>
                  </button>

                  {/* Option 2: V100 4x + PyTorch */}
                  <button
                    onClick={() => setSelectedGpu('v100-4x-pytorch')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedGpu === 'v100-4x-pytorch'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">4x NVIDIA V100 + PyTorch 2.0</p>
                        <p className="text-xs text-gray-500 mt-0.5">128GB VRAM · 适合大规模并行训练</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-gray-600">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>128 GB VRAM</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-medium">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>120 Credits/h</span>
                      </div>
                    </div>
                  </button>

                  {/* Option 3: A100 2x + PyTorch */}
                  <button
                    onClick={() => setSelectedGpu('a100-2x-pytorch')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedGpu === 'a100-2x-pytorch'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">2x NVIDIA A100 + PyTorch 2.0</p>
                        <p className="text-xs text-gray-500 mt-0.5">160GB VRAM · 最新架构，训练速度更快</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-gray-600">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>160 GB VRAM</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-medium">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>160 Credits/h</span>
                      </div>
                    </div>
                  </button>

                  {/* Option 4: V100 8x + TensorFlow */}
                  <button
                    onClick={() => setSelectedGpu('v100-8x-tensorflow')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedGpu === 'v100-8x-tensorflow'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">8x NVIDIA V100 + TensorFlow 2.12</p>
                        <p className="text-xs text-gray-500 mt-0.5">256GB VRAM · 论文原始配置，适用于 TensorFlow 框架</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-gray-600">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>256 GB VRAM</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-medium">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>240 Credits/h</span>
                      </div>
                    </div>
                  </button>

                  {/* Option 5: T4 + PyTorch */}
                  <button
                    onClick={() => setSelectedGpu('t4-pytorch')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedGpu === 't4-pytorch'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">NVIDIA T4 + PyTorch 2.0</p>
                        <p className="text-xs text-gray-500 mt-0.5">16GB VRAM · 低成本选项，适合小规模实验</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-1 text-gray-600">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>16 GB VRAM</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-medium">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>30 Credits/h</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Batch Size */}
              

              {/* Training Steps */}
              

              {/* Advanced Options */}
              

              {/* Estimation Summary */}
              <div className="mt-6 p-5 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>预估信息</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">预计时间</p>
                    <p className="text-lg text-gray-900" style={{ fontWeight: 700 }}>{estimateTime()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">预计消耗</p>
                    <p className="text-lg text-orange-600" style={{ fontWeight: 700 }}>{estimateCost().toLocaleString()} Credits</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>GPU运行中会持续扣除Credits，请确保余额充足。实际消耗可能因网络状况和数据集大小而有所不同</span>
                </p>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        {isRunning ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>实验运行中 · {formatElapsed(elapsedSeconds)}</span>
            </div>
            <button
              onClick={() => { setSavedPlanContent(planContent); setIsEditingPlan(false); setShowPlanModal(true); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium flex items-center gap-2 border border-gray-200 rounded-lg hover:bg-white"
            >
              <FileText className="w-4 h-4" />
              查看实验计划
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              重置为默认
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => { setSavedPlanContent(planContent); setIsEditingPlan(false); setShowPlanModal(true); }}
                className="px-5 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                查看实验计划
              </button>
              <button
                className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                onClick={handleConfirm}
              >
                <CheckCircle2 className="w-4 h-4" />
                确认并开始实验
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Plan View/Edit Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-lg text-gray-900" style={{ fontWeight: 600 }}>实验计划</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isRunning ? '实验运行中，计划仅供查看' : '查看或修改当前实验计划'}
                </p>
              </div>
              <button
                onClick={() => { setPlanContent(savedPlanContent); setShowPlanModal(false); }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                {isEditingPlan ? (
                  <textarea
                    value={planContent}
                    onChange={(e) => setPlanContent(e.target.value)}
                    className="w-full min-h-[400px] px-4 py-3 text-sm text-gray-800 font-mono leading-relaxed border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-white"
                    spellCheck={false}
                  />
                ) : (
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                    {planContent}
                  </pre>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
              {isRunning ? (
                <button
                  onClick={() => { setPlanContent(savedPlanContent); setShowPlanModal(false); }}
                  className="px-5 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}
                >
                  关闭
                </button>
              ) : isEditingPlan ? (
                <>
                  <button
                    onClick={() => { setPlanContent(savedPlanContent); setIsEditingPlan(false); }}
                    className="px-5 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}
                  >
                    取消编辑
                  </button>
                  <button
                    onClick={() => { setSavedPlanContent(planContent); setIsEditingPlan(false); }}
                    className="px-5 py-2.5 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors" style={{ fontWeight: 500 }}
                  >
                    保存修改
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditingPlan(true)}
                    className="px-5 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2" style={{ fontWeight: 500 }}
                  >
                    <FileEdit className="w-4 h-4" />
                    修改计划
                  </button>
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="px-5 py-2.5 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors" style={{ fontWeight: 500 }}
                  >
                    确认
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}