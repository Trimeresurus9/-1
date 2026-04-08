import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Clock, Cpu, Database, DollarSign, FlaskConical, Upload, FileUp, ClipboardCheck, Play, FileBarChart, FileText, FileEdit, X, AlertTriangle, Coins, Zap, History, ArrowRight, CheckCircle2, Loader2, XCircle, PauseCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AgentThinkingCard } from './AgentThinkingCard';
import { Workspace } from './paperclaw/Workspace';
import { GPUPowerRechargeModal } from './GPUPowerRechargeModal';

// PaperClaw - Paper Reproduction Module
// 定义消息类型
type MessageType = 'user' | 'system' | 'task-progress' | 'task-complete' | 'warning' | 'dataset-success' | 'question' | 'report-ready' | 'agent-thinking';

interface AgentStep {
  id: string;
  title: string;
  description: string;
  actions: Array<{
    icon: string;
    text: string;
  }>;
  summary?: string;
}

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  taskName?: string;
  progress?: number;
  details?: string;
  data?: any;
  questionData?: {
    title: string;
    description: string;
    options: Array<{
      id: string;
      label: string;
      description: string;
      recommended?: boolean;
    }>;
  };
  agentSteps?: AgentStep[];
}

export function PaperReproduction() {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [userInstructions, setUserInstructions] = useState('');
  const [projectName, setProjectName] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planConfirmed, setPlanConfirmed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTask, setCurrentTask] = useState<Message | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);
  const [datasetUploaded, setDatasetUploaded] = useState(false);
  const [showDatasetWarning, setShowDatasetWarning] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editedPlan, setEditedPlan] = useState('');
  const [originalPlan, setOriginalPlan] = useState('');
  const [isPlanModified, setIsPlanModified] = useState(false);
  const [estimatedCredits, setEstimatedCredits] = useState(10000);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  // 动态生成任务列表，根据当前语言
  const TASKS = useMemo(() => [
    { name: t('task.envSetup'), duration: 5000, details: t('task.envSetupDetail') },
    { name: t('task.dataPreprocess'), duration: 6000, details: t('task.dataPreprocessDetail') },
    { name: t('task.modelTraining'), duration: 8000, details: t('task.modelTrainingDetail') },
    { name: t('task.modelEvaluation'), duration: 4000, details: t('task.modelEvaluationDetail') },
  ], [t]);

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentTask]);

  // 任务执行逻辑
  useEffect(() => {
    if (!hasStarted || !datasetUploaded) return;

    const timer = setTimeout(() => {
      startNextTask();
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasStarted, datasetUploaded, currentTaskIndex]);

  const startNextTask = () => {
    const nextIndex = currentTaskIndex + 1;
    
    if (nextIndex >= TASKS.length) {
      // 所有任务完成
      setCurrentTask(null);
      return;
    }

    const task = TASKS[nextIndex];
    
    // 为每个任务生成agent思考步骤
    const getAgentStepsForTask = (taskIndex: number): AgentStep[] => {
      const taskSteps = [
        // 环境配置
        [
          {
            id: 'env-1',
            title: '分析依赖需求',
            description: 'Analyzing the paper requirements to identify all necessary dependencies including PyTorch, transformers, and supporting libraries.',
            actions: [
              { icon: 'terminal', text: '扫描论文中提到的所有Python库和框架' },
              { icon: 'terminal', text: '检查CUDA版本兼容性要求' },
              { icon: 'terminal', text: '验证系统环境是否满足GPU计算需求' }
            ],
            summary: '已识别所有必需的依赖项：PyTorch 2.0.1, transformers, datasets, 以及CUDA 11.8环境。'
          },
          {
            id: 'env-2',
            title: '配置Python环境',
            description: 'Setting up the Python virtual environment and installing all required packages with correct versions.',
            actions: [
              { icon: 'terminal', text: '创建独立的Python 3.10虚拟环境' },
              { icon: 'terminal', text: '安装PyTorch及CUDA工具包' },
              { icon: 'terminal', text: '安装transformers、datasets、tokenizers库' },
              { icon: 'terminal', text: '验证所有包的版本兼容性' }
            ],
            summary: '环境配置完成，所有依赖已成功安装。GPU设备已就绪，检测到1x NVIDIA V100 (32GB)。'
          },
          {
            id: 'env-3',
            title: '验证环境配置',
            description: 'Running verification tests to ensure all components are properly installed and GPU is accessible.',
            actions: [
              { icon: 'terminal', text: '测试PyTorch GPU加速功能' },
              { icon: 'terminal', text: '验证CUDA内核正常运行' },
              { icon: 'terminal', text: '检查内存资源分配' }
            ],
            summary: 'GPU测试通过，CUDA版本11.8，计算能力7.0。环境配置完成，可以开始数据预处理。'
          }
        ],
        // 数据预处理
        [
          {
            id: 'data-1',
            title: '加载WMT 2014数据集',
            description: 'Loading the WMT 2014 English-German translation dataset and verifying data integrity.',
            actions: [
              { icon: 'terminal', text: '从存储位置读取数据集文件' },
              { icon: 'terminal', text: '验证数据集完整性和格式' },
              { icon: 'terminal', text: '统计训练集、验证集、测试集样本数量' }
            ],
            summary: '数据集加载成功：训练集4.5M句对，验证集3,000句对，测试集3,003句对。'
          },
          {
            id: 'data-2',
            title: '应用BPE分词',
            description: 'Applying Byte Pair Encoding (BPE) tokenization with 37,000 merge operations to create vocabulary.',
            actions: [
              { icon: 'terminal', text: '训练BPE分词器，设置37,000次合并操作' },
              { icon: 'terminal', text: '生成源语言和目标语言词汇表' },
              { icon: 'terminal', text: '对所有句对应用分词处理' },
              { icon: 'terminal', text: '添加特殊token：<pad>, <sos>, <eos>, <unk>' }
            ],
            summary: 'BPE分词完成。词汇表大小：37,000个token。平均句子长度：源语言23.4 tokens，目标语言25.1 tokens。'
          },
          {
            id: 'data-3',
            title: '创建数据加载器',
            description: 'Creating efficient data loaders with batching and padding for training pipeline.',
            actions: [
              { icon: 'terminal', text: '设置批次大小：25,000 tokens per batch' },
              { icon: 'terminal', text: '实现动态padding和attention mask' },
              { icon: 'terminal', text: '配置多进程数据加载（4 workers）' }
            ],
            summary: '数据加载器配置完成。批次大小优化为25K tokens，支持动态padding，数据预处理管道已就绪。'
          }
        ],
        // 模
        [
          {
            id: 'train-1',
            title: '初始化Transformer模型',
            description: 'Initializing the transformer model with the architecture specified in the paper.',
            actions: [
              { icon: 'terminal', text: '创建6层编码6层解码器结构' },
              { icon: 'terminal', text: '配置8个并行注意力头，模型维度512' },
              { icon: 'terminal', text: '设置前馈网络维度2048，dropout 0.1' },
              { icon: 'terminal', text: '使用Xavier均匀初始化所有权重' }
            ],
            summary: 'Transformer模型已初始化。总参数量：65M。模型结构验证通过，与论文规格一致。'
          },
          {
            id: 'train-2',
            title: '配置训练循环',
            description: 'Setting up the training loop with Adam optimizer and custom learning rate schedule.',
            actions: [
              { icon: 'terminal', text: '初始化Adam优化器 (β₁=0.9, β₂=0.98, ε=10⁻⁹)' },
              { icon: 'terminal', text: '配置学习率预热策略（4,000步预热）' },
              { icon: 'terminal', text: '设置标签平滑（smoothing=0.1）' },
              { icon: 'terminal', text: '配置梯度裁剪和混合精度训练' }
            ],
            summary: '训练配置完成。目标训练步数：100,000步。预计训练时长：约12小时（8x V100）。'
          },
          {
            id: 'train-3',
            title: '执行模型训练',
            description: 'Running the training loop and monitoring loss, perplexity, and validation metrics.',
            actions: [
              { icon: 'terminal', text: '开始训练循环，批次处理中...' },
              { icon: 'terminal', text: '每100步记录训练损失和困惑度' },
              { icon: 'terminal', text: '每1,000步在验证集上评估BLEU分数' },
              { icon: 'terminal', text: '保存最佳模型检查点' }
            ],
            summary: '训练进行中... 当前步数：45,320/100,000，训练损失：1.234，验证BLEU：23.8。GPU利用率：94%。'
          }
        ],
        // 模型评估
        [
          {
            id: 'eval-1',
            title: '加载最佳模型',
            description: 'Loading the best checkpoint based on validation performance for final evaluation.',
            actions: [
              { icon: 'terminal', text: '识别验证集上BLEU最高的检查点' },
              { icon: 'terminal', text: '加载模型权重和配置' },
              { icon: 'terminal', text: '验证模型架构完整性' }
            ],
            summary: '已加载步数87,500的检查点（验证BLEU: 27.1）。模型加载成功，准备测试集评估。'
          },
          {
            id: 'eval-2',
            title: '测试集推理',
            description: 'Running inference on the test set using beam search decoding.',
            actions: [
              { icon: 'terminal', text: '配置束搜索解码（beam size=4, α=0.6）' },
              { icon: 'terminal', text: '对3,003个测试样本进行推理' },
              { icon: 'terminal', text: '生成翻译结果并保存' },
              { icon: 'terminal', text: '测量推理速度和延迟' }
            ],
            summary: '推理完成。平均推理时间：0.12秒/句。所有3,003个测试样本已生成翻译结果。'
          },
          {
            id: 'eval-3',
            title: '计算评估指标',
            description: 'Calculating BLEU score and other metrics to assess model performance.',
            actions: [
              { icon: 'terminal', text: '计算corpus-level BLEU分数' },
              { icon: 'terminal', text: '分析不同句子长度的翻译质量' },
              { icon: 'terminal', text: '生成注意力可视化图表' },
              { icon: 'terminal', text: '对比论文报告的基准指标' }
            ],
            summary: '评估完！最终BLEU分数：27.8（论文基准：27.3，+1.8%）。模型复现成功，性能达到预期。'
          }
        ]
      ];
      
      return taskSteps[taskIndex] || [];
    };

    const newTask: Message = {
      id: `task-${nextIndex}-${Date.now()}`,
      type: 'agent-thinking',
      content: `正在执行：${task.name}。AI将通过以下步骤完成此任务...`,
      timestamp: new Date(),
      taskName: task.name,
      agentSteps: getAgentStepsForTask(nextIndex),
    };

    // 立即添加agent思考卡片到消息流
    setMessages(prev => [...prev, newTask]);
    setCurrentTask(newTask);
    setCurrentTaskIndex(nextIndex);

    // 模拟任务进度（仅用于内部状态）
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        
        // 任务完成，添加完成消息
        setTimeout(() => {
          const completeMessage: Message = {
            id: `complete-${nextIndex}-${Date.now()}`,
            type: 'task-complete',
            content: `${task.name}已完成`,
            timestamp: new Date(),
            taskName: task.name,
          };
          
          setMessages(prev => [...prev, completeMessage]);
          setCurrentTask(null);
          
          // 如果是最后一个任务，添加报告卡片
          if (nextIndex === TASKS.length - 1) {
            setTimeout(() => {
              const reportMessage: Message = {
                id: `report-${Date.now()}`,
                type: 'report-ready',
                content: t('report.title'),
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, reportMessage]);
            }, 1000);
          } else {
            // 开始下一个任务
            setTimeout(() => {
              setCurrentTaskIndex(nextIndex);
            }, 500);
          }
        }, 500);
      } else {
        setCurrentTask(prev => prev ? { ...prev, progress } : null);
      }
    }, task.duration / 20);
  };

  const handleFileUpload = (file: File) => {
    const allowedExtensions = ['.pdf', '.xlsx', '.xls', '.csv', '.doc', '.docx', '.txt', '.md', '.py', '.ipynb', '.json', '.yaml', '.yml', '.zip', '.tar', '.gz'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setUploadedFile(file);
    } else {
      alert('不支持该文件格式，请上传 PDF、Excel、Word、CSV、文本、代码或压缩包文件');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleGeneratePlan = () => {
    const plan = `# 步骤 1: 环境配置

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

使用 Xavier 均匀初始transformer权重。配置模型架构：
- **层数**: 6个编码器层6个解码器层
- **注意力头**: 8个并注意力头
- **模型维度**: 512
- **前馈网络维度**: 2048
- **Dropout**: 0.1

使用 Adam 优化器(β₁=0.9, β₂=0.98, ε=10⁻⁹)和自定义学习率调度（4,000步预热）启动训练循环。

**训练配置**:
- 批次大小: 每批25,000个token
- 训练步数: 100,000次迭代
- 预计时长: 在8块V100 GPU上约12小时
- 检查点频率: 每1,000步

在练过程中监控交叉熵损失、困惑度和验证集上的BLEU分数。

# 步骤 4: 评估

使用束搜索码(束大小=4，长度惩罚α=0.6)在WMT 2014英德测试集上评估训练好的模型。

计算BLEU分数并与基线transformer模型进行比较。

**目标指标**: 测试集BLEU ≥ 27.3

# 步骤 5: 分析与可视化

生成注意力热图以可视化多头注意力模式。分析不同句子长度的翻译质量，并对常见失败案例进行错误分析。

${userInstructions ? `\n# 用户补充说明\n\n${userInstructions}` : ''}`;

    setEditedPlan(plan);
    setOriginalPlan(plan);
    setShowPlanModal(true);
  };

  const handleConfirmPlan = () => {
    setShowPlanModal(false);
    setHasStarted(true);
    
    // 添加初始用户消息
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: '已上传论文并确认实验计划，开始复现。',
      timestamp: new Date(),
    };
    
    setMessages([userMessage]);
    
    // 添加数据集警告消息
    setTimeout(() => {
      const warningMessage: Message = {
        id: `warning-${Date.now()}`,
        type: 'warning',
        content: '缺少训练数据集',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, warningMessage]);
    }, 1000);
  };

  const handleUploadDataset = () => {
    // 移除警告消息，添加上传成功消息
    setMessages(prev => {
      const filtered = prev.filter(msg => msg.type !== 'warning');
      const successMessage: Message = {
        id: `dataset-success-${Date.now()}`,
        type: 'dataset-success',
        content: '数据集上传成功',
        timestamp: new Date(),
      };
      return [...filtered, successMessage];
    });
    
    setDatasetUploaded(true);
    setShowDatasetWarning(false);
    
    // 添加一个问题卡片（在数据集上传后触发）
    setTimeout(() => {
      const questionMessage: Message = {
        id: `question-${Date.now()}`,
        type: 'question',
        content: t('question.batchSizeTitle'),
        timestamp: new Date(),
        questionData: {
          title: t('question.batchSizeTitle'),
          description: t('question.batchSizeDesc'),
          options: [
            {
              id: 'original',
              label: t('question.batchSize.original'),
              description: t('question.batchSize.originalDesc'),
              recommended: false,
            },
            {
              id: 'medium',
              label: t('question.batchSize.medium'),
              description: t('question.batchSize.mediumDesc'),
              recommended: true,
            },
            {
              id: 'small',
              label: t('question.batchSize.small'),
              description: t('question.batchSize.smallDesc'),
              recommended: false,
            },
            {
              id: 'auto',
              label: t('question.batchSize.auto'),
              description: t('question.batchSize.autoDesc'),
              recommended: false,
            },
          ],
        },
      };
      setMessages(prev => [...prev, questionMessage]);
    }, 1500);
  };

  const handleQuestionResponse = (questionId: string, optionId: string) => {
    // 移除问题卡片
    setMessages(prev => prev.filter(msg => msg.id !== questionId));
    
    // 添加用户回复消息
    const responseMessage: Message = {
      id: `response-${Date.now()}`,
      type: 'user',
      content: `已选择: ${optionId}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, responseMessage]);
  };

  // 重置到上传页面
  const handleResetToUpload = () => {
    setHasStarted(false);
    setPlanConfirmed(false);
    setDatasetUploaded(false);
    setShowDatasetWarning(false);
    setMessages([]);
    setCurrentTask(null);
    setCurrentTaskIndex(-1);
    setUploadedFile(null);
    setUserInstructions('');
    setProjectName('');
    setEditedPlan('');
    setOriginalPlan('');
    setIsPlanModified(false);
    setIsEditingPlan(false);
  };

  const terminalLogs = [
    '$ pip install torch torchvision torchaudio',
    'Collecting torch',
    '  Downloading torch-2.0.1-cp310-cp310-linux_x86_64.whl (619.9 MB)',
    '     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 619.9/619.9 MB 5.2 MB/s eta 0:00:00',
    'Successfully installed torch-2.0.1',
    '',
    '$ python setup.py',
    'Initializing environment...',
    'Downloading pretrained weights...',
    '  model.safetensors: 100%|████████████| 548M/548M [00:12<00:00, 45.2MB/s]',
    'Loading configuration from config.json',
    'Model initialized successfully',
    '',
    '$ python train.py --config transformer_config.yaml',
    'Starting training process...',
    'Epoch 1/100: Loss=2.456, Accuracy=0.234',
    'Waiting for dataset...',
  ];

  // 如果未开始，显示上传和输入界面
  if (!hasStarted) {
    return (
      <>
        <div className="flex-1 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-3xl">
            {/* Credits Card */}
            <div className="hidden bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-lg border border-gray-800 px-6 py-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-white/80 font-semibold">账户余额</p>
                </div>
                <button
                  onClick={() => setShowRechargeModal(true)}
                  className="px-5 py-2 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  充值
                </button>
              </div>
              <div className="flex items-stretch gap-4">
                {/* Credits Balance */}
                <div className="flex-1 bg-white/[0.06] rounded-lg px-4 py-3 border border-white/10">
                  <p className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1">Credits 余额</p>
                  <p className="text-xl font-bold text-white">1,250 <span className="text-sm font-semibold text-white/60">Credits</span></p>
                  <p className="text-[11px] text-white/40 mt-1">用于 Agent 调用结算</p>
                </div>
                {/* GPU Cost Balance (USD) */}
                <div className="flex-1 bg-white/[0.06] rounded-lg px-4 py-3 border border-white/10">
                  <p className="text-[11px] text-white/50 font-medium uppercase tracking-wider mb-1">GPU 费用余额</p>
                  <p className="text-xl font-bold text-emerald-400">$25.00 <span className="text-sm font-semibold text-emerald-400/60">USD</span></p>
                  <p className="text-[11px] text-white/40 mt-1">用于 GPU 算力结算</p>
                </div>
              </div>
              <p className="text-[11px] text-white/30 mt-3 leading-relaxed">
                💡 Agent 使用消耗以 Credits 结算，GPU 算力为单独美元结算。任务完成后剩余美元将换算为 Credits。请预留充足 Credits 和 GPU 费用。
              </p>
            </div>

            {/* Workflow Progress Indicator */}
            <div className="bg-white rounded-xl border border-gray-100 px-8 py-6 mb-6">
              <div className="flex items-center justify-between">
                {/* Step 1 - Active */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center mb-3">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center">{t('workflow.step1')}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">{t('workflow.step1.desc')}</p>
                </div>

                {/* Connector 1 */}
                <div className="flex-1 h-px bg-gray-200 mx-4 mt-[-40px]"></div>

                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-11 h-11 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-3 border border-gray-200">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-400 text-center" style={{ fontWeight: 500 }}>{t('workflow.step2')}</p>
                  <p className="text-xs text-gray-400 text-center mt-1">{t('workflow.step2.desc')}</p>
                </div>

                {/* Connector 2 */}
                <div className="flex-1 h-px bg-gray-200 mx-4 mt-[-40px]"></div>

                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-11 h-11 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-3 border border-gray-200">
                    <Play className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-400 text-center" style={{ fontWeight: 500 }}>{t('workflow.step3')}</p>
                  <p className="text-xs text-gray-400 text-center mt-1">{t('workflow.step3.desc')}</p>
                </div>

                {/* Connector 3 */}
                <div className="flex-1 h-px bg-gray-200 mx-4 mt-[-40px]"></div>

                {/* Step 4 */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-11 h-11 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-3 border border-gray-200">
                    <FileBarChart className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-400 text-center" style={{ fontWeight: 500 }}>{t('workflow.step4')}</p>
                  <p className="text-xs text-gray-400 text-center mt-1">{t('workflow.step4.desc')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">{t('nav.paperReproduction')}</h1>
                <p className="text-sm text-gray-600">
                  上传研究论文PDF并提供复现说明，AI将为您生成详细的实验计划
                </p>
              </div>

              {/* Project Name Input Area */}
              <div className="px-8 py-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  1. 输入项目名称
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  为您的复现项目设置一个易于识别的名称，不填写则自动使用论文标题
                </p>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="例如：Transformer复现实验 - WMT14数据集"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  maxLength={100}
                />
              </div>

              {/* Upload Area */}
              <div className="px-8 py-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  2. 上传论文或其他资料文件
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-all ${
                    isDragging
                      ? 'border-blue-400 bg-blue-50'
                      : uploadedFile
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.txt,.md,.py,.ipynb,.json,.yaml,.yml,.zip,.tar,.gz"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />
                  
                  {uploadedFile ? (
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-7 h-7 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        更换文件
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Upload className="w-7 h-7 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        拖拽文件到此处，或{' '}
                        <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-700 cursor-pointer">
                          浏览文件
                        </label>
                      </p>
                      <p className="text-xs text-gray-500">支持 PDF、Excel、Word、CSV、代码、压缩包等格式，最大 50MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Markdown Input Area */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  
                  3. 补充说明（可选）
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  请描述您的复现求、特殊配置或实验重点，支持Markdown格式
                </p>
                <textarea
                  value={userInstructions}
                  onChange={(e) => setUserInstructions(e.target.value)}
                  placeholder="例如：
- 使用Qwen-8B模型进行实验
- 重点关注检索效率
- 使用GRPO算法进行训练"
                  className="w-full h-40 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none font-mono"
                  spellCheck={false}
                />
              </div>

              {/* Footer Actions */}
              <div className="px-8 py-6 bg-white border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => window.history.back()}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  取消
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGeneratePlan}
                    disabled={!uploadedFile}
                    className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FileEdit className="w-4 h-4" />
                    生成实验计划
                  </button>
                  <button
                    onClick={() => {/* navigate to subscription */}}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    升级会员以使用
                  </button>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            

            {/* History Projects */}
            <div className="mt-6 bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                    <History className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>历史项目</h3>
                    <p className="text-[11px] text-gray-400">查看和恢复之前的复现任务</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">共 5 个项目</span>
              </div>
              <div className="divide-y divide-gray-100">
                {/* Running project */}
                <div className="px-6 py-4 hover:bg-blue-50/40 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Loader2 className="w-4.5 h-4.5 text-blue-600 animate-spin" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 600 }}>ViT: An Image is Worth 16x16 Words</p>
                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700" style={{ fontWeight: 600 }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          运行中
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span>步骤 3/4 · 模型训练中</span>
                        <span>·</span>
                        <span>已运行 2h 15min</span>
                        <span>·</span>
                        <span>GPU: V100 ×2</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: '68%' }} />
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </div>
                </div>

                {/* Completed project */}
                <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 500 }}>Attention Is All You Need</p>
                        <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                          已完成
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span>BLEU 27.8 · 超过基准 +1.8%</span>
                        <span>·</span>
                        <span>耗时 3h 42min</span>
                        <span>·</span>
                        <span>2026-03-08</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                  </div>
                </div>

                {/* Completed project 2 */}
                <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 500 }}>BERT: Pre-training of Deep Bidirectional Transformers</p>
                        <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                          已完成
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span>F1 92.4 · 复现成功</span>
                        <span>·</span>
                        <span>耗时 5h 18min</span>
                        <span>·</span>
                        <span>2026-03-05</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                  </div>
                </div>

                {/* Paused project */}
                <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                        <PauseCircle className="w-4.5 h-4.5 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 500 }}>ResNet: Deep Residual Learning</p>
                        <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700" style={{ fontWeight: 600 }}>
                          已暂停
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span>步骤 2/4 · 等待数据集上传</span>
                        <span>·</span>
                        <span>2026-03-02</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                  </div>
                </div>

                {/* Failed project */}
                <div className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                        <XCircle className="w-4.5 h-4.5 text-red-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 500 }}>GPT-3: Language Models are Few-Shot Learners</p>
                        <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-600" style={{ fontWeight: 600 }}>
                          失败
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span>OOM: GPU显存不足</span>
                        <span>·</span>
                        <span>2026-02-28</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Confirmation Modal */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">实验计划确认</h2>
                  <p className="text-sm text-gray-500 mt-1">请仔细审阅以下实验计划，确认无误后即可开始执行。</p>
                </div>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Scrollable Plan */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  {isEditingPlan ? (
                    <textarea
                      value={editedPlan}
                      onChange={(e) => {
                        const newPlan = e.target.value;
                        setEditedPlan(newPlan);
                        setIsPlanModified(newPlan !== originalPlan);
                        // 动态计算credits (基础10000 + 每100字符增加500)
                        const baseCredits = 10000;
                        const extraCredits = Math.floor(newPlan.length / 100) * 500;
                        setEstimatedCredits(baseCredits + extraCredits);
                      }}
                      className="w-full min-h-[400px] px-4 py-3 text-sm text-gray-800 font-mono leading-relaxed border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-white"
                      spellCheck={false}
                    />
                  ) : (
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                      {editedPlan}
                    </pre>
                  )}
                </div>
              </div>

              {/* Modal Footer - Credits & Actions */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Coins className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">消耗参考:</span>
                        <span className="text-xs text-gray-500">RTX 5090 / 32 GB</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-sm text-gray-900" style={{ fontWeight: 700 }}>约20,000</span>
                        <span className="text-sm text-gray-600">Credits / 小时</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">当前余额: 45,230 Credits</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  {isEditingPlan ? (
                    <>
                      <button
                        onClick={() => {
                          setEditedPlan(originalPlan);
                          setIsPlanModified(false);
                          setEstimatedCredits(10000);
                          setIsEditingPlan(false);
                        }}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        取消编辑
                      </button>
                      <button
                        onClick={() => setIsEditingPlan(false)}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        保存修改
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditingPlan(true)}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <FileEdit className="w-4 h-4" />
                        修改配置
                      </button>
                      <button
                        onClick={() => {
                          handleConfirmPlan();
                        }}
                        className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Coins className="w-4 h-4" />
                        确认计划
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credits Recharge Modal */}
        <GPUPowerRechargeModal
          isOpen={showRechargeModal}
          onClose={() => setShowRechargeModal(false)}
        />
      </>
    );
  }

  // 确认后显示工作台界面
  return (
    <>
      <Workspace 
        experimentName="Attention Is All You Need" 
        experimentStatus="running" 
        gpuPower={1250}
        onResetToUpload={handleResetToUpload}
        onRecharge={() => setShowRechargeModal(true)}
      />
      
      {/* Credits Recharge Modal */}
      <GPUPowerRechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
      />
    </>
  );
}