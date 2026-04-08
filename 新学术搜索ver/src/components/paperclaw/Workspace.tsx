import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Settings, Coins, Activity, FolderOpen, MessageSquare, Sliders, Zap, Server, ChevronDown } from 'lucide-react';
import { ProcessPanel } from './ProcessPanel';
import { Chatbox } from './Chatbox';
import { Console } from './Console';
import { ExplorerPanel } from './ExplorerPanel';
import { Setup } from './Setup';
import { ResizablePanel, VerticalResizablePanel } from './ResizablePanel';
import { GPUInfoPanel } from './GPUInfoPanel';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message {
  id: string;
  type: 'user' | 'system' | 'warning' | 'dataset-success' | 'question' | 'report-ready' | 'agent-thinking' | 'next-actions' | 'start-experiment-confirm' | 'stop-confirm';
  content: string;
  timestamp: Date;
  isConfigModified?: boolean;  // 标识配置是否被修改
  questionData?: any;
  agentSteps?: any[];
  gpuPowerUsed?: number;  // 已使用的Credits
}

interface WorkspaceProps {
  experimentName?: string;
  experimentStatus?: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  gpuPower?: number;
  onResetToUpload?: () => void;  // 返回上传页面的回调
  onRecharge?: () => void;  // 充值Credits的回调
}

type LeftPanelTab = 'explorer' | 'chatbox' | 'setup';

export function Workspace({ 
  experimentName = "Attention Is All You Need",
  experimentStatus = 'running',
  gpuPower = 1250,
  onResetToUpload,
  onRecharge
}: WorkspaceProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<LeftPanelTab>('setup');  // 初始进入setup页面
  const [experimentStarted, setExperimentStarted] = useState(false);  // 防止重复启动
  const [setupConfirmed, setSetupConfirmed] = useState(false);  // 跟踪配置是否已确认
  const [gpuPanelExpanded, setGpuPanelExpanded] = useState(false); // GPU 信息面板展开状态
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '欢迎使用 PaperClaw 实验工作台！我将帮助你复现论文实验。',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'agent-thinking',
      content: '正在分析论文并制定实验方案...',
      timestamp: new Date(),
      agentSteps: [
        {
          id: 'step-1',
          title: '解析论文结构',
          description: '正在提取论文的关键信息，包括模型架构、训练参数和数据集要求。',
          actions: [
            { icon: 'file', text: '读取论文 PDF: Attention Is All You Need' },
            { icon: 'cpu', text: '解析模型架构: Transformer (6层编码器 + 6层解码器)' },
            { icon: 'database', text: '识别数据集需求: WMT 2014 English-German' }
          ],
          summary: '✅ 成功解析论文，识别出 Transformer 架构和训练要求。'
        },
        {
          id: 'step-2',
          title: '生成实验计划',
          description: '基于论文内容，生成可执行的实验方案。',
          actions: [
            { icon: 'terminal', text: '配置训练环境: PyTorch 2.0 + CUDA 11.8' },
            { icon: 'cpu', text: '估算资源需求: 4x V100 GPU, 约 3.2 小时' }
          ],
          summary: '✅ 实验计划已生成，等待用户确认。'
        }
      ]
    },
    {
      id: '3',
      type: 'warning',
      content: '论文指定了WMT 2014英德数据集，但尚未提供数据集。',
      timestamp: new Date()
    }
  ]);
  
  const [logs, setLogs] = useState([
    { id: '1', timestamp: new Date(), level: 'info' as const, message: '初始化实验环境...' },
    { id: '2', timestamp: new Date(), level: 'success' as const, message: '成功加载论文: Attention Is All You Need.pdf' },
    { id: '3', timestamp: new Date(), level: 'info' as const, message: '解析实验计划中...' },
    { id: '4', timestamp: new Date(), level: 'warning' as const, message: '等待数据集上传...' },
  ]);

  // 自动启动实验：切换到chatbox时自动开始
  useEffect(() => {
    if (activeTab === 'chatbox' && !experimentStarted) {
      // 延迟1秒后自动显示系统启动消息
      const timer = setTimeout(() => {
        const startMessage: Message = {
          id: `auto-start-${Date.now()}`,
          type: 'system',
          content: '✅ 实验已自动启动，正在初始化环境...',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, startMessage]);
        setExperimentStarted(true);
        
        // 0.5秒后开始执行实验任务
        setTimeout(() => {
          startExperimentTasks();
        }, 500);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, experimentStarted]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleUploadDataset = () => {
    console.log('Upload dataset triggered');
    
    // 移除警告消息
    setMessages(prev => prev.filter(msg => msg.type !== 'warning'));
    
    // 添加数据集上传成功消息
    const successMessage: Message = {
      id: `dataset-success-${Date.now()}`,
      type: 'dataset-success',
      content: '数据集上传成功！WMT 2014 English-German 数据集已准备就绪。',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, successMessage]);
    
    // 1.5秒后触发问题卡片
    setTimeout(() => {
      const questionMessage: Message = {
        id: `question-${Date.now()}`,
        type: 'question',
        content: '请选择批次大小配置',
        timestamp: new Date(),
        questionData: {
          title: '选择批次大小（Batch Size）',
          description: '批次大小会影响训练速度和内存占用。请根据您的GPU配置选择合适的批次大小。',
          options: [
            {
              id: 'original',
              label: '原论文配置 (25,000 tokens)',
              description: '按照论文原始配置，需要8块V100 GPU，训练时间约12小时',
              recommended: false,
            },
            {
              id: 'medium',
              label: '中等配置 (12,000 tokens)',
              description: '适合4块GPU环境，训练时间约18小时，推荐选择',
              recommended: true,
            },
            {
              id: 'small',
              label: '小型配置 (4,000 tokens)',
              description: '适合单GPU环境，训练时间约36小时',
              recommended: false,
            },
            {
              id: 'auto',
              label: '自动检测',
              description: 'AI将根据可用GPU资源自动选择最优配置',
              recommended: false,
            },
          ],
        },
      };
      setMessages(prev => [...prev, questionMessage]);
    }, 1500);
  };

  const handleQuestionResponse = (messageId: string, optionId: string) => {
    console.log('Question response:', messageId, optionId);
    
    // 如果是确认开始实验（包括初始确认和修改后确认）
    if ((messageId === 'start-confirm' || messageId === 'start-confirm-modified') && optionId === 'start') {
      // 移除start-experiment-confirm卡片
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // 添加系统确认消息
      const confirmMessage: Message = {
        id: `confirm-start-${Date.now()}`,
        type: 'system',
        content: '✅ 实验已启动，正在初始化环境...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmMessage]);
      
      // 0.5秒后开始执行实验任务
      setTimeout(() => {
        startExperimentTasks();
      }, 500);
      return;
    }
    
    // 移除问题卡片
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    // 添加用户选择消息
    const optionLabels: Record<string, string> = {
      original: '原论文配置 (25,000 tokens)',
      medium: '中等配置 (12,000 tokens)',
      small: '小型配置 (4,000 tokens)',
      auto: '自动检测'
    };
    
    const responseMessage: Message = {
      id: `response-${Date.now()}`,
      type: 'user',
      content: `已选择批次大小: ${optionLabels[optionId] || optionId}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, responseMessage]);
    
    // 检查用户是否选择了非推荐选项（非 'medium'）
    const isModified = optionId !== 'medium';
    
    // 0.8秒后显示新的确认卡片（带修改标识）
    setTimeout(() => {
      const newConfirmMessage: Message = {
        id: 'start-confirm-modified',
        type: 'start-experiment-confirm',
        content: isModified ? '确认实验计划' : '实验方案已准备就绪',
        timestamp: new Date(),
        isConfigModified: isModified
      };
      setMessages(prev => [...prev, newConfirmMessage]);
    }, 800);
  };
  
  const startExperimentTasks = () => {
    // 添加开始执行的Agent思考卡片
    const taskMessage: Message = {
      id: `task-${Date.now()}`,
      type: 'agent-thinking',
      content: '开始执行实验任务...',
      timestamp: new Date(),
      agentSteps: [
        {
          id: 'exec-1',
          title: '配置训练环境',
          description: '正在安装依赖库并配置CUDA环境...',
          actions: [
            { icon: 'terminal', text: '安装 PyTorch 2.0.1 + CUDA 11.8' },
            { icon: 'terminal', text: '安装 transformers, datasets, tokenizers' },
            { icon: 'terminal', text: '验证GPU可用性: 4x V100 (32GB)' }
          ],
          summary: '✅ 环境配置完成，GPU已就绪。'
        },
        {
          id: 'exec-2',
          title: '数据预处理',
          description: '正在加载数据集并应用BPE分词...',
          actions: [
            { icon: 'database', text: '加载 WMT 2014 数据集 (4.5M 句对)' },
            { icon: 'terminal', text: '应用BPE分词 (37,000 merge ops)' },
            { icon: 'terminal', text: '创建数据加载器 (batch size: 12,000 tokens)' }
          ],
          summary: '✅ 数据预处理完成，准备开始训练。'
        },
        {
          id: 'exec-3',
          title: '模型训练中',
          description: '正在训练Transformer模型...',
          actions: [
            { icon: 'cpu', text: '初始化6层编码器+6层解码器 (65M参数)' },
            { icon: 'terminal', text: 'Step 1000/100000 - Loss: 4.234, BLEU: 8.2' },
            { icon: 'terminal', text: 'Step 5000/100000 - Loss: 2.156, BLEU: 18.5' },
            { icon: 'terminal', text: '训练进行中... GPU利用率: 94%' }
          ],
          summary: '🔄 训练进行中，预计还需2.5小时...'
        }
      ]
    };
    setMessages(prev => [...prev, taskMessage]);
    
    // 模拟训练完成后显示报告
    setTimeout(() => {
      const reportMessage: Message = {
        id: `report-${Date.now()}`,
        type: 'report-ready',
        content: '实验报告已生成',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, reportMessage]);
      
      // 2秒后显示后续操作引导
      setTimeout(() => {
        const nextActionsMessage: Message = {
          id: `next-actions-${Date.now()}`,
          type: 'next-actions',
          content: '选择下一步行动',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, nextActionsMessage]);
      }, 2000);
    }, 8000);
  };

  const handleStopExperiment = () => {
    console.log('Stop experiment button clicked - showing confirmation card');
    
    // 切换到chatbox标签页（如果不在）
    if (activeTab !== 'chatbox') {
      setActiveTab('chatbox');
    }
    
    // 添加停止确认卡片消息
    const stopConfirmMessage: Message = {
      id: `stop-confirm-${Date.now()}`,
      type: 'stop-confirm',
      content: '确认停止实验？',
      timestamp: new Date(),
      gpuPowerUsed: 320  // 模拟已使用的Credits
    };
    setMessages(prev => [...prev, stopConfirmMessage]);
  };
  
  const handleStopConfirmed = (messageId: string) => {
    console.log('Stop confirmed');
    
    // 移除确认卡片
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    // 添加停止成功消息
    const stopMessage: Message = {
      id: `stopped-${Date.now()}`,
      type: 'system',
      content: '⚠️ 实验已手动停止，已消耗 320 Credits。',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, stopMessage]);
    
    // 添加日志
    setLogs(prev => [...prev, {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      level: 'error',
      message: '实验被用户手动停止'
    }]);
    
    // 延迟0.5秒后返回上传页面
    setTimeout(() => {
      if (onResetToUpload) {
        onResetToUpload();
      }
    }, 500);
  };
  
  const handleStopCancelled = (messageId: string) => {
    console.log('Stop cancelled');
    
    // 移除确认卡片
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    // 添加取消消息
    const cancelMessage: Message = {
      id: `cancel-stop-${Date.now()}`,
      type: 'system',
      content: '已取消停止操作，实验继续运行。',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, cancelMessage]);
  };

  // 在Setup页面确认配置后切换到chatbox并启动实验
  const handleConfirmSetupAndStart = () => {
    console.log('Setup confirmed, starting experiment...');
    
    // 添加配置确认日志
    setLogs(prev => [...prev, {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      level: 'success',
      message: '✅ 实验配置已确认'
    }]);
    
    // 先标记为已确认，Setup会立即切换到运行状态界面
    setSetupConfirmed(true);
    
    // 延迟2秒后自动切换到chatbox标签页，让用户先看到运行状态
    setTimeout(() => {
      setActiveTab('chatbox');
    }, 2000);
  };
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'running':
        return {
          color: 'text-green-700 bg-green-50',
          dotColor: 'bg-green-500',
          label: '运行中',
          icon: Play
        };
      case 'paused':
        return {
          color: 'text-yellow-700 bg-yellow-50',
          dotColor: 'bg-yellow-500',
          label: '已暂停',
          icon: Pause
        };
      case 'completed':
        return {
          color: 'text-blue-700 bg-blue-50',
          dotColor: 'bg-blue-500',
          label: '已完成',
          icon: Activity
        };
      case 'failed':
        return {
          color: 'text-red-700 bg-red-50',
          dotColor: 'bg-red-500',
          label: '失败',
          icon: Square
        };
      default:
        return {
          color: 'text-gray-700 bg-gray-50',
          dotColor: 'bg-gray-500',
          label: '空闲',
          icon: Square
        };
    }
  };

  const statusConfig = getStatusConfig(experimentStatus);
  const StatusIcon = statusConfig.icon;

  // Determine if agent is controlling GPU (running experiment tasks)
  const isAgentControlling = experimentStarted && experimentStatus === 'running';

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Bar - Experiment Info */}
      <div className="h-14 border-b border-gray-100 bg-white flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-semibold text-gray-900">{experimentName}</h1>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full ${statusConfig.color}`}>
            <span className={`w-1.5 h-1.5 ${statusConfig.dotColor} rounded-full ${experimentStatus === 'running' ? 'animate-pulse' : ''}`}></span>
            {statusConfig.label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* GPU Panel Toggle */}
          <button
            onClick={() => setGpuPanelExpanded(!gpuPanelExpanded)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-sm ${
              gpuPanelExpanded
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
            style={{ fontWeight: 500 }}
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden md:inline">GPU</span>
            <span className={`w-1.5 h-1.5 rounded-full ${experimentStatus === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            <ChevronDown className={`w-3 h-3 transition-transform ${gpuPanelExpanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Credits Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer" onClick={onRecharge}>
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">{gpuPower.toLocaleString()}</span>
            <span className="text-xs text-gray-600">Credits</span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            {experimentStatus === 'running' && (
              <>
                <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="暂停">
                  <Pause className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleStopExperiment()}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                  title="停止"
                >
                  <Square className="w-4 h-4" />
                </button>
              </>
            )}
            {experimentStatus === 'paused' && (
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="继续">
                <Play className="w-4 h-4" />
              </button>
            )}
            {(experimentStatus === 'completed' || experimentStatus === 'failed') && (
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="重新运行">
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            
          </div>
        </div>
      </div>

      {/* GPU Info Panel - Collapsible */}
      <GPUInfoPanel
        isExpanded={gpuPanelExpanded}
        onToggle={() => setGpuPanelExpanded(false)}
        isAgentControlling={isAgentControlling}
        gpuStatus={experimentStatus === 'running' ? 'running' : 'stopped'}
      />

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanel
          defaultLeftWidth={50}
          minLeftWidth={40}
          maxLeftWidth={65}
          left={
            <div className="h-full flex flex-col">
              {/* Tab Bar */}
              <div className="flex border-b border-gray-100 bg-white">
                <button
                  onClick={() => setActiveTab('explorer')}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors border-b-2 ${
                    activeTab === 'explorer'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                  style={{ fontWeight: activeTab === 'explorer' ? 500 : 400 }}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Explorer</span>
                </button>
                <button
                  onClick={() => {
                    if (setupConfirmed) {
                      setActiveTab('chatbox');
                    }
                  }}
                  disabled={!setupConfirmed}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors border-b-2 ${
                    activeTab === 'chatbox'
                      ? 'border-blue-500 text-blue-600'
                      : !setupConfirmed
                      ? 'border-transparent text-gray-300 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                  style={{ fontWeight: activeTab === 'chatbox' ? 500 : 400 }}
                  title={!setupConfirmed ? '请先在Setup中确认配置' : ''}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ChatBox</span>
                </button>
                <button
                  onClick={() => setActiveTab('setup')}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors border-b-2 ${
                    activeTab === 'setup'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                  style={{ fontWeight: activeTab === 'setup' ? 500 : 400 }}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'explorer' && <ExplorerPanel />}
                {activeTab === 'chatbox' && (
                  <Chatbox
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onUploadDataset={handleUploadDataset}
                    onQuestionResponse={handleQuestionResponse}
                    onStopConfirmed={handleStopConfirmed}
                    onStopCancelled={handleStopCancelled}
                  />
                )}
                {activeTab === 'setup' && <Setup onConfirmAndStart={handleConfirmSetupAndStart} isConfirmed={setupConfirmed} experimentStatus={experimentStatus} />}
              </div>
            </div>
          }
          right={
            <VerticalResizablePanel
              defaultTopHeight={30}
              minTopHeight={20}
              maxTopHeight={50}
              top={<ProcessPanel />}
              bottom={<Console logs={logs} />}
            />
          }
        />
      </div>
    </div>
  );
}