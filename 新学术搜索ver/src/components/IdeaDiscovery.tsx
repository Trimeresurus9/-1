import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Lightbulb,
  FileText,
  Rocket,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  X,
  FileUp,
  Upload,
  BookOpen,
  Settings2,
  Target,
  Check,
  AlertCircle,
  Save,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronRight,
  History,
  Trash2,
  Zap,
  Wallet,
} from 'lucide-react';
import { GPUPowerRechargeModal } from './GPUPowerRechargeModal';
import { ExperimentPlanModal } from './ExperimentPlanModal';

// Types
interface CandidateIdea {
  id: string;
  title: string;
  problem: string;
  method: string;
  innovation: string;
  noveltyScore: number;
  feasibilityScore: number;
  references: { title: string; url: string }[];
}

interface HistoryRecord {
  id: string;
  projectName: string;
  topic: string;
  background: string;
  uploadedDocs: { name: string; size: number }[];
  timestamp: number;
  status: 'draft' | 'completed';
  results?: CandidateIdea[];
}

// Mock candidate ideas
const mockIdeas: CandidateIdea[] = [
  {
    id: '1',
    title: 'HalluciGuard: A Retrieval-Augmented Verification Framework for Reducing LLM Hallucinations in Clinical Diagnosis',
    problem: '大语言模型在医疗问诊中产生的幻觉可能导致误诊，现有RAG方法缺乏针对临床场景的事实验证机制，且无法有效区分高风险与低风险幻觉。',
    method: '提出一种分层检索增强验证框架，结合医学知识图谱实时事实核查、置信度分级过滤机制和临床指南对齐模块，在生成阶段主动拦截高风险幻觉输出。',
    innovation: '首次引入"幻觉风险分级"概念，将临床幻觉按严重程度分层处理；设计了医学知识图谱与LLM推理链的双向验证机制。',
    noveltyScore: 85,
    feasibilityScore: 75,
    references: [
      { title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', url: '#' },
      { title: 'Med-HALT: Medical Domain Hallucination Test for LLMs', url: '#' },
      { title: 'Self-RAG: Learning to Retrieve, Generate, and Critique', url: '#' },
    ],
  },
  {
    id: '2',
    title: 'ClinicalCoT: Chain-of-Thought Prompting with Medical Ontology Grounding for Faithful Clinical Reasoning',
    problem: '现有CoT方法在医疗领域缺乏可靠的推理路径约束，容易生成看似合理但事实错误的推理链，且无法与标准医学本体（如SNOMED-CT）对齐。',
    method: '构建基于医学本体的推理路径约束框架，通过将CoT各步骤锚定到SNOMED-CT概念节点，实现推理过程的可溯源性和医学一致性验证。',
    innovation: '将医学本体结构化知识融入CoT生成过程，提出"本体锚定推理"新范式；支持推理路径的自动回溯与修正。',
    noveltyScore: 90,
    feasibilityScore: 80,
    references: [
      { title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models', url: '#' },
      { title: 'Clinical-T5: Large Language Models Built Using MIMIC Clinical Text', url: '#' },
    ],
  },
  {
    id: '3',
    title: 'AdaptMedQA: Dynamic Difficulty Calibration for Robust Medical Question Answering Under Distribution Shift',
    problem: '医疗问答系统在面对不同难度和分布偏移的问题时性能波动大，现有评测基准未能反映真实临床场景的多样性和复杂性。',
    method: '设计动态难度校准机制，根据问题复杂度自适应调整模型推理深度和检索策略，结合课程学习和对比学习增强模型在分布偏移下的鲁棒性。',
    innovation: '首次提出医疗QA的"动态推理深度"概念，让模型根据问题难度自动选择浅层快速回答或深层审慎推理路径。',
    noveltyScore: 80,
    feasibilityScore: 70,
    references: [
      { title: 'Towards Robust Medical Question Answering', url: '#' },
      { title: 'Curriculum Learning for Natural Language Understanding', url: '#' },
      { title: 'MedQA: A Large-scale Open Domain Question Answering Dataset', url: '#' },
    ],
  },
];

// Section definitions for left nav
const sectionDefs = [
  { id: 'core', label: '研究详情', icon: FileText, tag: '必填' },
  { id: 'upload', label: '上传资料', icon: Upload, tag: '选填' },
];

const outputChipOptions = ['论文', '技术报告', '实验验证', '原型系统', '综述'];

const exampleTopics = ['RAG 检索优化', '多模态推理', 'Training-free 方法', '知识图谱增强'];

export function IdeaDiscovery() {
  const [activeSection, setActiveSection] = useState('core');
  const [topic, setTopic] = useState('');
  const [templateFields, setTemplateFields] = useState<Record<string, string>>({
    projectName: '',
    topic: '',
    problemDefinition: '',
    contributionType: '',
    skillBackground: '',
    excludeDirections: '',
    recentPapers: '',
    initialIdeas: '',
    references: '',
    resources: '',
    constraints: '',
    specialRequirements: '',
    customOutput: '',
  });
  const [selectedOutputChips, setSelectedOutputChips] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<File[]>([]);
  const [isDraggingDoc, setIsDraggingDoc] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedIdeaPlan, setSelectedIdeaPlan] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showExample, setShowExample] = useState(false);
  const [showCreditsConfirm, setShowCreditsConfirm] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    core: true,
    upload: false,
    constraints: false,
    output: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // History state
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const historyRef = useRef<HTMLDivElement | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ideaDiscoveryHistory');
      if (saved) {
        setHistoryRecords(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('ideaDiscoveryHistory', JSON.stringify(historyRecords));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [historyRecords]);

  // Auto-save simulation
  useEffect(() => {
    const hasContent = Object.values(templateFields).some(v => v.trim());
    if (!hasContent) return;
    setAutoSaveStatus('saving');
    const timer = setTimeout(() => setAutoSaveStatus('saved'), 800);
    return () => clearTimeout(timer);
  }, [templateFields, selectedOutputChips]);

  // Section completion check
  const isSectionComplete = useCallback((sectionId: string) => {
    switch (sectionId) {
      case 'core':
        return !!(templateFields.topic.trim());
      case 'upload':
        return !!(uploadedDocs.length > 0);
      default:
        return false;
    }
  }, [templateFields, uploadedDocs]);

  const isSectionPartial = useCallback((sectionId: string) => {
    return false;
  }, []);

  // Required fields filled - topic is required
  const coreFieldsFilled = !!(templateFields.topic.trim());
  const canGenerate = coreFieldsFilled && !isGenerating;

  const updateField = (key: string, value: string) => {
    setTemplateFields(prev => ({ ...prev, [key]: value }));
    if (key === 'topic') setTopic(value);
    // Clear error on edit
    if (fieldErrors[key]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    }
  };

  const handleBlur = (key: string) => {
    setTouchedFields(prev => ({ ...prev, [key]: true }));
  };

  const toggleOutputChip = (chip: string) => {
    setSelectedOutputChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    // Auto-expand when navigating via left nav
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
    setTimeout(() => {
      sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const toggleSection = (sectionId: string) => {
    // Core section is always expanded
    if (sectionId === 'core') return;
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    setActiveSection(sectionId);
  };

  const generatePlanForIdea = (idea: CandidateIdea) => {
    return `# 实验计划: ${idea.title}

# 步骤 1: 环境配置

安装 PyTorch 和相关依赖库，配置实验运行环境。

\`\`\`bash
pip install torch torchvision torchaudio
pip install transformers datasets tokenizers
pip install numpy pandas matplotlib tensorboard
\`\`\`

配置 CUDA 环境并验证 GPU 可用性。

# 步骤 2: 问题定义与数据准备

**研究问题**: ${idea.problem}

- 收集相关领域基准数据集
- 数据预处理与清洗
- 划分训练集/验证集/测试集

# 步骤 3: 方法实现

**核心方法**: ${idea.method}

- 实现核心算法模块
- 搭建模型架构
- 配置训练超参数

**训练配置**:
- 批次大小: 32
- 学习: 1e-4 (带 warmup)
- 训练轮次: 50 epochs
- 预计时长: 在 4x V100 GPU 上约 6-8 小时
- 检查点频率: 每 5 个 epoch

# 步骤 4: 创新点验证

**创新点**: ${idea.innovation}

- 设计消融实验验证各模块贡献
- 对比基线方法
- 统计显著性检验

# 步骤 5: 评估与分析

- 在基准测试集上评估模型性能
- 生成可视化结果（表格、图表、热力图）
- 撰写实验报告与结论

**参考文献**:
${idea.references.map((ref, i) => `${i + 1}. ${ref.title}`).join('\n')}`;
  };

  const handleOpenPlanModal = (idea: CandidateIdea) => {
    const plan = generatePlanForIdea(idea);
    setSelectedIdeaPlan(plan);
    setShowPlanModal(true);
  };

  const handleConfirmPlan = (plan: string) => {
    setShowPlanModal(false);
  };

  // Mock credits data
  const mockCreditsBalance = 1280;
  const generateCreditsCost = 150;
  const creditsCostBreakdown = [
    { label: '文献检索与分析', cost: 60 },
    { label: '研究想法生成', cost: 70 },
    { label: '可行性评估', cost: 20 },
  ];

  const handlePreGenerate = () => {
    // Validate required fields first
    const errors: Record<string, string> = {};
    if (!templateFields.topic.trim()) {
      errors.topic = '请填写研究主题';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouchedFields(prev => ({ ...prev, topic: true }));
      scrollToSection('core');
      return;
    }

    // Show credits confirmation modal
    setShowCreditsConfirm(true);
  };

  const handleConfirmGenerate = () => {
    setShowCreditsConfirm(false);
    setTopic(templateFields.topic.trim());
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
      saveToHistory('completed', mockIdeas);
    }, 3000);
  };

  const handleGenerate = () => {
    // Validate required fields
    const errors: Record<string, string> = {};
    if (!templateFields.topic.trim()) {
      errors.topic = '请填写研究主题';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouchedFields(prev => ({ ...prev, topic: true }));
      scrollToSection('core');
      return;
    }
    
    setTopic(templateFields.topic.trim());
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
      // Save to history after successful generation
      saveToHistory('completed', mockIdeas);
    }, 3000);
  };

  // History functions
  const saveToHistory = (status: 'draft' | 'completed', results?: CandidateIdea[]) => {
    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      projectName: templateFields.projectName.trim() || templateFields.topic.trim() || '未命名项目',
      topic: templateFields.topic.trim(),
      background: (templateFields.background || '').trim(),
      uploadedDocs: uploadedDocs.map(doc => ({ name: doc.name, size: doc.size })),
      timestamp: Date.now(),
      status,
      results: results || undefined,
    };
    setHistoryRecords(prev => [newRecord, ...prev]);
  };

  const loadFromHistory = (record: HistoryRecord) => {
    setTemplateFields({
      ...templateFields,
      projectName: record.projectName,
      topic: record.topic,
      background: record.background,
    });
    setTopic(record.topic);
    // Cannot restore actual File objects, just show the names
    setUploadedDocs([]);
    setShowResults(false);
    setShowHistoryPanel(false);
  };

  const deleteHistory = (id: string) => {
    setHistoryRecords(prev => prev.filter(record => record.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
      setHistoryRecords([]);
    }
  };

  const handleSaveDraft = () => {
    if (!templateFields.topic.trim()) {
      alert('请至少填写研究主题后再保存草稿');
      return;
    }
    saveToHistory('draft');
    alert('草稿已保存到历史记录');
  };

  const handleReset = () => {
    setTopic('');
    setTemplateFields({
      projectName: '',
      topic: '',
      problemDefinition: '',
      contributionType: '',
      skillBackground: '',
      excludeDirections: '',
      recentPapers: '',
      initialIdeas: '',
      references: '',
      resources: '',
      constraints: '',
      specialRequirements: '',
      customOutput: '',
    });
    setSelectedOutputChips([]);
    setFieldErrors({});
    setTouchedFields({});
    setShowResults(false);
    setIsGenerating(false);
    setUploadedDocs([]);
    setActiveSection('core');
    setAutoSaveStatus('idle');
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingDoc(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedDocs(prev => [...prev, ...files]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedDocs(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveDoc = (index: number) => {
    setUploadedDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleExampleClick = (example: string) => {
    setTopic(example);
    updateField('topic', example);
  };

  // Field status helper
  const getFieldStatus = (key: string, required: boolean) => {
    if (fieldErrors[key]) return 'error';
    if (templateFields[key].trim()) return 'filled';
    if (touchedFields[key] && required) return 'error';
    return 'empty';
  };

  // Example modal
  const ExampleModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowExample(false)}>
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-gray-900" style={{ fontWeight: 700 }}>填写示例</h3>
          <button onClick={() => setShowExample(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4 text-sm text-gray-700 overflow-y-auto flex-1 pr-1">
          <div>
            <p className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>1. 研究领域 / 子方向</p>
            <pre className="text-gray-600 bg-gray-50 rounded-lg px-3 py-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{`LLM Alignment → RLHF → Reward Hacking / Reward Overoptimization`}</pre>
          </div>
          <div>
            <p className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>2. 自由描述</p>
            <p className="text-[11px] text-gray-400 mb-1">用自己的话说明目前在思考什么问题，或者遇到了什么瓶颈。</p>
            <pre className="text-gray-600 bg-gray-50 rounded-lg px-3 py-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{`我最近一直在想 reward hacking 的问题。现在大家的解条路：一条是让 reward model 更准（ensemble、更大模型、更好的数据），另一条是绕开 reward model 做 direct alignment（DPO、KTO 这些）。但我觉得两条路都有根本性的局限——第一条路本质上是军备竞赛，policy 变强了 reward model 就得跟着变强；第二条路看起来没有 reward model 了，但其实 implicit reward 一样会被 hack，只是不容易观测到。

我隐约觉得应该从 "reward hacking 发生的动态过程" 入手，而不是从 "怎么让 reward 更准" 入手。比如我们能不能在训练过程中检测到 reward hacking 正在发生，然后做某种干预？但我还没想清楚具体怎么做。

另外我最近看到一些 mechanistic interpretability 的工作，在想有没有可能从模型内部表征的角度去理解 reward hacking——比如 policy 在 hack reward 的时候，内部表征会不会有某种可识别的 pattern？这个方向可能比较新，我不确定是不是 tractable。`}</pre>
          </div>
          <div>
            <p className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>3. 希望做出的贡献类型</p>
            <pre className="text-gray-600 bg-gray-50 rounded-lg px-3 py-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{`新方法（提出一个新的训练策略或检测机制），最好有一定的 empirical insight 支撑，不想做纯 benchmark 工作。`}</pre>
          </div>
          <div>
            <p className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>4. 技能背景</p>
            <pre className="text-gray-600 bg-gray-50 rounded-lg px-3 py-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{`比较熟悉 RLHF 的训练 pipeline（用过 TRL 和 OpenRLHF），做过一些 probing/representation analysis 的工作（本科毕业论文是 BERTology 方向的），数学背景一般，不太擅长做很 heavy 的理论证明。`}</pre>
          </div>
          <div>
            <p className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>5. 明确不想做的方向</p>
            <pre className="text-gray-600 bg-gray-50 rounded-lg px-3 py-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{`不想做 "又一个 DPO variant"——这个方向太卷了，而且我怀疑这条路能走多远。也不想做单纯的 scaling reward model 的工作，感觉没什么意思。`}</pre>
          </div>
          <div>
            <p className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>6. 最近关注的论文</p>
            <pre className="text-gray-600 bg-gray-50 rounded-lg px-3 py-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{`- 2406.02900 — Exploratory Preference Optimization（前段时间组会讲了这篇，觉得绕开 explicit reward model 的思路有意思）
- 2402.01306 — A Minimaximalist Approach to Reinforcement Learning from Human Feedback
- 2305.18290 — Direct Preference Optimization（经典，但我觉得 DPO 其实只是把 reward hacking 的问题藏起来了，没有真正解决）`}</pre>
          </div>
        </div>
        <button onClick={() => setShowExample(false)} className="mt-5 w-full py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0" style={{ fontWeight: 500 }}>
          知道了
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex-1 flex flex-col bg-gray-50/80 overflow-y-auto">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1120px] mx-auto px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl text-gray-900 mb-1" style={{ fontWeight: 700 }}>研究构思</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-[640px]">
                  输入研究主题、背景、参考文献与实验约束，系统将结合相关文献生成可行的研究想法
                </p>
                {/* Info Tags */}
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    <Clock className="w-3.5 h-3.5" />
                    预计 3–5 分钟
                  </span>
                  
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    <Upload className="w-3.5 h-3.5" />
                    支持上传论文 PDF 或 arXiv 链接
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                
                
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Left Nav + Right Form */}
        {!showResults && !isGenerating && (
          <div className="max-w-[900px] mx-auto w-full px-8 py-6 space-y-6 pb-24">

            {/* Section 0: 项目名称 */}
            

            {/* Section 1: 研究详情 - Markdown编辑器 */}
            <div
              ref={el => { sectionRefs.current.core = el; }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-gray-900" style={{ fontWeight: 700 }}>研究详情</h2>
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded" style={{ fontWeight: 600 }}>必填</span>
                  <div className="flex-1" />
                  <button
                    onClick={() => setShowExample(!showExample)}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    查看示例
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-[34px]">使用 Markdown 格式描述研究主题、背景、参考文献等信息</p>
              </div>
              <div className="px-6 py-5">

                {/* Title Input */}
                <div className="mb-3">
                  <label className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                      <span className="text-xs" style={{ fontWeight: 700 }}>1</span>
                    </div>
                    <span className="text-xs text-gray-700" style={{ fontWeight: 600 }}>研究标题</span>
                    <span className="text-[10px] text-red-400 ml-0.5">*必填</span>
                  </label>
                  <input
                    type="text"
                    value={templateFields.topic}
                    onChange={e => updateField('topic', e.target.value)}
                    onBlur={() => handleBlur('topic')}
                    placeholder="输入您的研究标题，例如：基于多阶段验证的检索增强生成框架"
                    className="w-full px-3 py-2.5 border border-blue-200 bg-blue-50/30 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                </div>

                {/* 2. 问题定义 */}
                <div className="mt-5">
                  <label className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                      <span className="text-xs" style={{ fontWeight: 700 }}>2</span>
                    </div>
                    <span className="text-xs text-gray-700" style={{ fontWeight: 600 }}>问题定义（用自己的话说明目前在思考什么问题，或者遇到了什么瓶颈）</span>
                    
                    <span className="text-[10px] text-gray-400 ml-0.5">建议填写</span>
                  </label>
                  <textarea
                    value={templateFields.problemDefinition}
                    onChange={e => updateField('problemDefinition', e.target.value)}
                    onBlur={() => handleBlur('problemDefinition')}
                    placeholder="例如：现有 RAG 系统在长文档检索时召回率低，且缺少有效的事实验证机制..."
                    className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none resize-none transition-all bg-white ${
                      getFieldStatus('problemDefinition', false) === 'filled'
                        ? 'border-green-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                    }`}
                    rows={4}
                    style={{ lineHeight: '1.6' }}
                  />
                </div>

                {/* 3. 希望做出的贡献类型 */}
                <div className="mt-5">
                  <label className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                      <span className="text-xs" style={{ fontWeight: 700 }}>3</span>
                    </div>
                    <span className="text-xs text-gray-700" style={{ fontWeight: 600 }}>希望做出的贡献类型</span>
                    <span className="text-[10px] text-gray-400 ml-0.5">选填</span>
                  </label>
                  <textarea
                    value={templateFields.contributionType}
                    onChange={e => updateField('contributionType', e.target.value)}
                    onBlur={() => handleBlur('contributionType')}
                    placeholder="例如：提出新方法/新框架、改进现有基线、构建新数据集、理论分析..."
                    className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none resize-none transition-all bg-white ${
                      getFieldStatus('contributionType', false) === 'filled'
                        ? 'border-green-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                    }`}
                    rows={3}
                    style={{ lineHeight: '1.6' }}
                  />
                </div>

                {/* 4. 技能背景 */}
                <div className="mt-5">
                  <label className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                      <span className="text-xs" style={{ fontWeight: 700 }}>4</span>
                    </div>
                    <span className="text-xs text-gray-700" style={{ fontWeight: 600 }}>技能背景</span>
                    <span className="text-[10px] text-gray-400 ml-0.5">选填</span>
                  </label>
                  <textarea
                    value={templateFields.skillBackground}
                    onChange={e => updateField('skillBackground', e.target.value)}
                    onBlur={() => handleBlur('skillBackground')}
                    placeholder="例如：熟悉Pytorch、Transformer架构；有NLP研究经验；数学背景一般，不擅长做理论证明..."
                    className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none resize-none transition-all bg-white ${
                      getFieldStatus('skillBackground', false) === 'filled'
                        ? 'border-green-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                    }`}
                    rows={3}
                    style={{ lineHeight: '1.6' }}
                  />
                </div>

                {/* 5. 明确不想做的方向 */}
                <div className="mt-5">
                  <label className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                      <span className="text-xs" style={{ fontWeight: 700 }}>5</span>
                    </div>
                    <span className="text-xs text-gray-700" style={{ fontWeight: 600 }}>明确不想做的方向</span>
                    <span className="text-[10px] text-gray-400 ml-0.5">选填</span>
                  </label>
                  <textarea
                    value={templateFields.excludeDirections}
                    onChange={e => updateField('excludeDirections', e.target.value)}
                    onBlur={() => handleBlur('excludeDirections')}
                    placeholder="例如：不考虑纯 prompt engineering 方向、不做 benchmark 类工作..."
                    className={`w-full border rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none resize-none transition-all bg-white ${
                      getFieldStatus('excludeDirections', false) === 'filled'
                        ? 'border-green-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                    }`}
                    rows={3}
                    style={{ lineHeight: '1.6' }}
                  />
                </div>

                {/* 最近关注的论文 */}
                
              </div>
            </div>

            {/* 上传参考资料 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Upload className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-gray-900" style={{ fontWeight: 700 }}>上传参考资料</h2>
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded" style={{ fontWeight: 500 }}>选填</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-[34px]">上传相关或最近关注的论文、文档等参考资料</p>
              </div>
              <div className="px-6 py-5">
                <div
                  onDrop={handleFileDrop}
                  onDragOver={e => e.preventDefault()}
                  onDragEnter={e => { e.preventDefault(); setIsDraggingDoc(true); }}
                  onDragLeave={e => { e.preventDefault(); setIsDraggingDoc(false); }}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    isDraggingDoc
                      ? 'border-blue-400 bg-blue-50/60'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.md"
                    onChange={handleFileUpload}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDraggingDoc ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <FileUp className={`w-6 h-6 ${isDraggingDoc ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        拖放文件到此处，或
                        <span className="text-blue-600 ml-1" style={{ fontWeight: 500 }}>浏览文件</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">支持 PDF、Word、TXT、Markdown 格式</p>
                    </div>
                  </div>
                </div>

                {/* Uploaded files */}
                {uploadedDocs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 group">
                        <div className="w-9 h-9 rounded-lg bg-white border border-green-200 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate" style={{ fontWeight: 500 }}>{doc.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-400">{(doc.size / 1024).toFixed(1)} KB</p>
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600">
                              <CheckCircle2 className="w-3 h-3" /> 上传成功
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); handleRemoveDoc(idx); }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* History Records */}
            {historyRecords.length > 0 && (
              <div ref={historyRef} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                      <History className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>历史记录</h3>
                      <p className="text-[11px] text-gray-400">查看和恢复之前的研究构思</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">共 {historyRecords.length} 条记录</span>
                    <button
                      onClick={clearAllHistory}
                      className="text-xs text-red-600 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded transition-colors"
                    >
                      清空全部
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {historyRecords.map((record) => (
                    <div key={record.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            record.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {record.status === 'completed' ? (
                              <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
                            ) : (
                              <FileText className="w-4.5 h-4.5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm text-gray-900 truncate" style={{ fontWeight: record.status === 'completed' ? 500 : 500 }}>
                              {record.topic}
                            </p>
                            <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${
                              record.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`} style={{ fontWeight: 600 }}>
                              {record.status === 'completed' ? '已完成' : '草稿'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-gray-400">
                            {record.background && (
                              <>
                                <span className="truncate max-w-[300px]">{record.background.substring(0, 50)}...</span>
                                <span>·</span>
                              </>
                            )}
                            <span>{new Date(record.timestamp).toLocaleString('zh-CN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              loadFromHistory(record);
                            }}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                            style={{ fontWeight: 500 }}
                          >
                            加载
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistory(record.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="max-w-[1120px] mx-auto w-full px-8 py-16 flex flex-col items-center justify-center">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-12 py-16 flex flex-col items-center w-full max-w-[640px]">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
              <p className="text-gray-900 mb-2" style={{ fontWeight: 600 }}>正在检索文献并生成研究想法...</p>
              <p className="text-sm text-gray-500">预计需要 3–5 分钟，请耐心等待</p>
              <div className="mt-6 w-full max-w-[320px]">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Ideas Output */}
        {showResults && (
          <div className="max-w-[1120px] mx-auto w-full px-8 py-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg text-gray-900" style={{ fontWeight: 700 }}>候选研究想法</h2>
                <p className="text-sm text-gray-500 mt-0.5">基于「{topic}」检索生成 · 最优方案</p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <RotateCcw className="w-4 h-4" />
                重新构思
              </button>
            </div>

            <div className="space-y-4">
              {mockIdeas.slice(0, 1).map((idea, idx) => (
                <div key={idea.id} className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 hover:border-gray-300 transition-all">
                  {/* Idea Header with Scores */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs" style={{ fontWeight: 700 }}>{idx + 1}</span>
                    </div>
                    <h3 className="text-sm text-gray-900 leading-relaxed flex-1" style={{ fontWeight: 600 }}>{idea.title}</h3>
                    {/* Score Badges */}
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] text-amber-600" style={{ fontWeight: 500 }}>创新性</span>
                        <span className="text-xs text-amber-700" style={{ fontWeight: 700 }}>{idea.noveltyScore}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-100">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] text-green-600" style={{ fontWeight: 500 }}>可行性</span>
                        <span className="text-xs text-green-700" style={{ fontWeight: 700 }}>{idea.feasibilityScore}</span>
                      </div>
                    </div>
                  </div>

                  {/* Structured Fields */}
                  <div className="space-y-3 ml-10">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <p className="text-xs text-gray-500" style={{ fontWeight: 600 }}>研究缺口</p>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{idea.problem}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <p className="text-xs text-gray-500" style={{ fontWeight: 600 }}>研究方法</p>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{idea.method}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <p className="text-xs text-gray-500" style={{ fontWeight: 600 }}>创新点</p>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{idea.innovation}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        <p className="text-xs text-gray-500" style={{ fontWeight: 600 }}>参考文献</p>
                      </div>
                      <div className="space-y-1">
                        {idea.references.map((ref, rIdx) => (
                          <a
                            key={rIdx}
                            href={ref.url}
                            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            {ref.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Action Button - 实��与验��� (只在 showResults 时显示) */}
        {showResults && (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg">
            <div className="max-w-[1120px] mx-auto px-8 py-4 flex items-center justify-center">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-all shadow-md hover:shadow-lg"
                style={{ fontWeight: 600 }}
                onClick={() => handleOpenPlanModal(mockIdeas[0])}
              >
                <Rocket className="w-4 h-4" />
                实现与验证
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer Action Bar */}
      {!showResults && !isGenerating && (
        <div className="border-t border-gray-200 bg-white px-8 py-3 flex-shrink-0">
          <div className="max-w-[1120px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-400">填写越具体，生成结果越准确</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2"
              >
                重置
              </button>
              <button
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <Save className="w-4 h-4" />
                保存草稿
              </button>
              <button
                onClick={handlePreGenerate}
                disabled={true}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-400 text-sm rounded-lg cursor-not-allowed border border-gray-200"
                style={{ fontWeight: 600 }}
              >
                <Sparkles className="w-4 h-4" />
                生成研究想法
              </button>
              <button
                onClick={() => {/* navigate to subscription */}}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow-md"
                style={{ fontWeight: 600 }}
              >
                <Zap className="w-4 h-4" />
                升级会员以使用
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Example Modal */}
      {showExample && <ExampleModal />}

      {/* Recharge Modal */}
      <GPUPowerRechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
      />

      {/* Experiment Plan Modal */}
      <ExperimentPlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        initialPlan={selectedIdeaPlan}
        onConfirm={handleConfirmPlan}
      />

      {/* History Panel */}
      {showHistoryPanel && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setShowHistoryPanel(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col animate-slideIn"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-700" />
                <h2 className="text-gray-900" style={{ fontWeight: 700 }}>历史记录</h2>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded" style={{ fontWeight: 600 }}>
                  {historyRecords.length}
                </span>
              </div>
              <button
                onClick={() => setShowHistoryPanel(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto">
              {historyRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">暂无历史记录</p>
                  <p className="text-gray-400 text-xs mt-1">保存的草稿和生成记录会显示在这里</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {historyRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all overflow-hidden group"
                    >
                      <div className="p-4">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-2">
                          {record.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded" style={{ fontWeight: 600 }}>
                              <CheckCircle2 className="w-3 h-3" />
                              已完成
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded" style={{ fontWeight: 600 }}>
                              <FileText className="w-3 h-3" />
                              草稿
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(record.timestamp).toLocaleString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Topic */}
                        <h3 className="text-sm text-gray-900 mb-1 line-clamp-2" style={{ fontWeight: 600 }}>
                          {record.topic}
                        </h3>

                        {/* Background Preview */}
                        {record.background && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {record.background.substring(0, 100)}...
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadFromHistory(record)}
                            className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                            style={{ fontWeight: 500 }}
                          >
                            加载
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHistory(record.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {historyRecords.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={clearAllHistory}
                  className="w-full px-3 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  清空所有历��记录
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Credits Confirmation Modal */}
      {showCreditsConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreditsConfirm(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-500" />
                  </div>
                  <h3 className="text-gray-900" style={{ fontWeight: 700 }}>确认消耗 Credits</h3>
                </div>
                <button onClick={() => setShowCreditsConfirm(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-4">本次操作将消耗以下 Credits，请确认后继续：</p>

              {/* Cost Breakdown */}
              <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 space-y-2.5">
                {creditsCostBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{item.cost} Credits</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2.5 mt-2.5 flex items-center justify-between">
                  <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>合计</span>
                  <span className="text-blue-600" style={{ fontWeight: 700 }}>{generateCreditsCost} Credits</span>
                </div>
              </div>

              {/* Balance Info */}
              <div className="mt-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">当前余额</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{mockCreditsBalance.toLocaleString()} Credits</span>
                  {mockCreditsBalance >= generateCreditsCost ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>
                      <CheckCircle2 className="w-3 h-3" />
                      余额充足
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>
                      <AlertCircle className="w-3 h-3" />
                      余额不足
                    </span>
                  )}
                </div>
              </div>

              {/* After deduction */}
              <div className="mt-1.5 flex items-center justify-between px-1">
                <span className="text-xs text-gray-400">扣除后余额</span>
                <span className="text-xs text-gray-500">{(mockCreditsBalance - generateCreditsCost).toLocaleString()} Credits</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <button
                onClick={() => setShowCreditsConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                style={{ fontWeight: 500 }}
              >
                取消
              </button>
              <button
                onClick={handleConfirmGenerate}
                disabled={mockCreditsBalance < generateCreditsCost}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white disabled:text-gray-400 text-sm rounded-lg transition-all disabled:cursor-not-allowed"
                style={{ fontWeight: 600 }}
              >
                <Sparkles className="w-4 h-4" />
                确认并生成
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}