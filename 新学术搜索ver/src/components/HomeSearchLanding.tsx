import React from 'react';
import {
  ArrowUp,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Database,
  FileSearch,
  Filter,
  FolderKanban,
  Globe,
  Layers3,
  ListFilter,
  MessageSquareText,
  Search,
  ShieldCheck,
  Sparkles,
  TableProperties,
} from 'lucide-react';
import { TextType } from './TextType';

type MarketingLanguage = 'zh' | 'en';
type HomeSearchLandingMode = 'home' | 'search';
type MarketingFeaturePage =
  | 'search'
  | 'scholar-qa'
  | 'library'
  | 'paperclaw'
  | 'idea-discovery'
  | 'ai-feeds'
  | 'ai-survey';

interface HomeSearchLandingProps {
  language: MarketingLanguage;
  mode: HomeSearchLandingMode;
  onStartSearch: (query?: string) => void;
  onContinueToSurvey: () => void;
  onNavigateToMarketingPage: (page: MarketingFeaturePage) => void;
}

const exampleQueries = [
  {
    zh: '找使用 GNN 做分子性质预测、但不使用 QM9 的论文',
    en: 'Find papers on molecular property prediction using GNNs but excluding QM9',
  },
  {
    zh: '查找比较 retrieval-augmented generation 与 fine-tuning 的论文',
    en: 'Search papers comparing retrieval-augmented generation and fine-tuning',
  },
  {
    zh: '找 2023 年后关于多模态推理的数据集与 benchmark 论文',
    en: 'Find post-2023 benchmark papers on multimodal reasoning datasets',
  },
];

const painPoints = [
  {
    zhTitle: '歧义问题',
    enTitle: 'Ambiguous terms',
    zhBody: '同一个词在不同研究语境里可能完全不是一回事。比如 “GEO” 既可能是地理建模，也可能是基因表达数据库。',
    enBody: 'The same term can mean very different things in different research contexts. “GEO” may refer to geospatial modeling, gene expression datasets, or something else.',
  },
  {
    zhTitle: '引文噪音',
    enTitle: 'Citation noise',
    zhBody: '提到一个方法，不代表论文真的用了它。很多结果只是引用、讨论或对比，真正相关的论文反而被淹没。',
    enBody: 'Mentioning a method does not mean the paper actually uses it. Many results only cite, discuss, or compare a method while the truly relevant papers get buried.',
  },
  {
    zhTitle: '逻辑筛选困难',
    enTitle: 'Hard-to-express logic',
    zhBody: '“使用 A，但不使用 B” 这类条件很难靠关键词表达，尤其当你要排除某个数据集、基线方法或实验设置时。',
    enBody: 'Conditions like “uses A but not B” are hard to express with keywords alone, especially when you want to exclude a dataset, baseline, or setup.',
  },
];

const solutionCards = [
  {
    icon: FileSearch,
    zhTitle: '理解研究意图',
    enTitle: 'Understand research intent',
    zhBody: '不仅匹配关键词，还理解任务、方法、数据集和约束条件。',
    enBody: 'Understands tasks, methods, datasets, and constraints instead of only matching keywords.',
  },
  {
    icon: ListFilter,
    zhTitle: '支持复杂检索',
    enTitle: 'Support complex retrieval',
    zhBody: '支持包含、排除、对比和时间范围等复杂条件，更适合文献综述和 related work 调研。',
    enBody: 'Supports include, exclude, compare, and time-based filters for literature reviews and related work discovery.',
  },
  {
    icon: TableProperties,
    zhTitle: '结果可继续分析',
    enTitle: 'Keep analyzing results',
    zhBody: '搜索结果可表格化查看，并继续进入论文对比与文献综述流程。',
    enBody: 'Turn search results into structured comparisons and continue into literature review workflows.',
  },
];

const resultRows = [
  {
    title: 'Molecular Property Prediction with Graph Neural Networks Beyond QM9',
    year: '2024',
    citations: '183',
    match: '94%',
    task: 'Molecular property prediction',
    method: 'GNN',
  },
  {
    title: 'Benchmarking Post-QM9 Molecular Learning Under Realistic Constraints',
    year: '2025',
    citations: '76',
    match: '91%',
    task: 'Dataset generalization',
    method: 'Graph Transformer',
  },
  {
    title: 'Retrieval-Augmented vs Fine-Tuned Reasoning Systems: A Comparative Study',
    year: '2024',
    citations: '142',
    match: '89%',
    task: 'Reasoning comparison',
    method: 'RAG / Fine-tuning',
  },
];

const audiences = [
  {
    short: 'DL',
    zhStage: '计算机科学副教授',
    enStage: 'Associate Professor of Computer Science',
    zhTitle: 'Dr. Li',
    enTitle: 'Dr. Li',
    zhBody: '终于不用在海量水文中浪费时间了。这个 AI 学术搜索工具能先理解研究意图，再过滤掉大部分无关论文，做 related work 和文献综述时效率高很多。',
    enBody: 'I no longer waste time digging through noisy results. This AI academic search tool understands research intent first and filters out irrelevant papers, which makes related-work mapping and literature reviews much faster.',
    zhMeta: '聚焦 AI 学术搜索、related work 与文献综述',
    enMeta: 'Uses WisPaper for AI academic search, related work, and literature reviews',
  },
  {
    short: 'SJ',
    zhStage: '神经科学博士生',
    enStage: 'PhD Student in Neuroscience',
    zhTitle: 'Sarah J.',
    enTitle: 'Sarah J.',
    zhBody: '写综述的时候特别有帮助。作为文献综述工具，它不仅能帮我找到关键论文，还会把主题脉络和优先精读的文章梳理出来，省掉很多前期调研时间。',
    enBody: 'It is incredibly helpful for review writing. As a literature review tool, it not only finds key papers but also helps me map themes and decide what deserves deep reading first.',
    zhMeta: '主要用于文献综述工具与主题梳理',
    enMeta: 'Uses WisPaper as a literature review tool for topic mapping',
  },
  {
    short: 'MT',
    zhStage: '独立研究员',
    enStage: 'Independent Researcher',
    zhTitle: 'Mark T.',
    enTitle: 'Mark T.',
    zhBody: '以前我主要依赖 Google Scholar，现在更常用 WisPaper。它更像一个真正的 Google Scholar alternative，检索更聚焦，试用门槛也低，日常探索非常顺手。',
    enBody: 'I used to rely mostly on Google Scholar, but now I use WisPaper more often. It feels like a real Google Scholar alternative with more focused retrieval and a much lower barrier to getting started.',
    zhMeta: '偏好 Google Scholar alternative 与高频探索',
    enMeta: 'Uses WisPaper as a Google Scholar alternative for daily exploration',
  },
  {
    short: 'ZW',
    zhStage: '研究助理',
    enStage: 'Research Assistant',
    zhTitle: 'Zoe W.',
    enTitle: 'Zoe W.',
    zhBody: '我最喜欢的是把检索、精读和知识库沉淀串在一起。以前要在学术搜索、文献管理和笔记工具之间反复切换，现在一条工作流就能完成。',
    enBody: 'What I like most is how search, deep reading, and knowledge-base building are connected in one workflow. I no longer need to jump between academic search, reference management, and note-taking tools.',
    zhMeta: '主要用于学术搜索、文献管理与资料沉淀',
    enMeta: 'Uses WisPaper for academic search, reference management, and evidence capture',
  },
  {
    short: 'CH',
    zhStage: '实验室负责人',
    enStage: 'Lab Lead',
    zhTitle: 'Chen H.',
    enTitle: 'Chen H.',
    zhBody: '团队做新方向预研时，WisPaper 能很快帮我们识别研究空白、整理核心论文，并把后续讨论沉淀成可复用的知识库，对选题判断和科研路径设计帮助很大。',
    enBody: 'When my team explores a new direction, WisPaper helps us identify research gaps, organize core papers, and turn later discussion into a reusable knowledge base, which is valuable for topic selection and research-path planning.',
    zhMeta: '用于研究缺口识别、选题判断与科研路径设计',
    enMeta: 'Uses WisPaper for research-gap discovery and topic planning',
  },
];

const featureOverviewCards = [
  {
    key: 'search' as const,
    icon: Search,
    zhTitle: 'Scholar Search',
    enTitle: 'Scholar Search',
    zhBody: '支持自然语言提问与全文检索的 AI 学术搜索，帮助你快速锁定高质量论文与相关研究。',
    enBody: 'An AI academic search engine with natural-language and full-text retrieval to surface high-quality papers fast.',
    accent: 'bg-cyan-100 text-cyan-700',
    border: 'border-cyan-200/70',
  },
  {
    key: 'library' as const,
    icon: BookOpen,
    zhTitle: 'Library',
    enTitle: 'Library',
    zhBody: '搭建可云端同步的研究知识库，自动识别 Meta 信息，持续沉淀你的学术数字资产。',
    enBody: 'Build a synced research library with automatic metadata extraction and preserve your academic knowledge base.',
    accent: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-200/70',
  },
  {
    key: 'idea-discovery' as const,
    icon: Sparkles,
    zhTitle: 'Idea Discovery',
    enTitle: 'Idea Discovery',
    zhBody: '通过 Agent 多轮提问逐步明确研究方向，再结合搜索与 PDF 解析能力，帮助你发现研究缺口和科研灵感。',
    enBody: 'Use a multi-turn agent to clarify research direction, then combine search and PDF analysis to uncover gaps and generate research ideas.',
    accent: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-200/70',
  },
  {
    key: 'paperclaw' as const,
    icon: FolderKanban,
    zhTitle: 'PaperClaw',
    enTitle: 'PaperClaw',
    zhBody: '面向论文复现与实验验证的 AI 助手，帮助你快速搭建实验路径、验证假设，并推进二次创新。',
    enBody: 'An AI assistant for paper reproduction and experiment validation that helps you build workflows faster, test hypotheses, and move toward follow-on innovation.',
    accent: 'bg-cyan-50 text-cyan-800',
    border: 'border-cyan-200/70',
  },
  {
    key: 'ai-survey' as const,
    icon: Database,
    zhTitle: 'AI Survey',
    enTitle: 'AI Survey',
    zhBody: '自动生成即时综述与知识导图，帮你在不下载全文的情况下快速看清知识脉络。',
    enBody: 'Generate instant surveys and knowledge maps so you can understand the structure of search results without downloading full papers.',
    accent: 'bg-teal-100 text-teal-700',
    border: 'border-teal-200/70',
  },
  {
    key: 'ai-feeds' as const,
    icon: ShieldCheck,
    zhTitle: 'AI Feeds',
    enTitle: 'AI Feeds',
    zhBody: '持续追踪你所在方向的新论文、趋势与值得关注的研究信号，让信息输入从一次性搜索变成长期研究订阅。',
    enBody: 'Continuously track new papers, trends, and research signals in your area so discovery becomes an ongoing feed instead of a one-off search.',
    accent: 'bg-slate-100 text-slate-700',
    border: 'border-slate-200/80',
  },
  {
    key: 'scholar-qa' as const,
    icon: MessageSquareText,
    zhTitle: 'Scholar QA',
    enTitle: 'Scholar QA',
    zhBody: '基于文献库做可溯源的学术问答，把复杂调研从冗长查阅缩短到分钟级。',
    enBody: 'Run traceable academic QA on top of your paper library and cut complex research lookup from hours to minutes.',
    accent: 'bg-sky-100 text-sky-700',
    border: 'border-sky-200/70',
  },
  {
    key: 'search' as const,
    icon: Compass,
    zhTitle: '探索更多',
    enTitle: 'Explore More',
    zhBody: '继续探索实时追新、沉浸式阅读、翻译与更多学术工具工作流入口。',
    enBody: 'Explore more academic workflows including research feeds, immersive reading, translation, and beyond.',
    accent: 'bg-white/80 text-slate-700',
    border: 'border-slate-200/80',
    isExplore: true,
  },
];

const heroStats = [
  {
    zhValue: '95%',
    enValue: '95%',
    zhLabel: '文献查找准确率',
    enLabel: 'paper retrieval accuracy',
  },
  {
    zhValue: '3.6亿+',
    enValue: '360M+',
    zhLabel: '学术文献与研究报告',
    enLabel: 'research papers and reports',
  },
  {
    zhValue: '50万+',
    enValue: '500K+',
    zhLabel: '每日文献增量更新',
    enLabel: 'new records updated daily',
  },
  {
    zhValue: '32个',
    enValue: '32',
    zhLabel: '一级学科深度覆盖',
    enLabel: 'top-level disciplines deeply covered',
  },
];

const comparisonRows = [
  { zhLabel: '是否理解研究意图', enLabel: 'Understands research intent', zhLeft: '支持', enLeft: 'Yes', zhRight: '弱', enRight: 'Limited' },
  { zhLabel: '是否支持排除条件', enLabel: 'Supports exclusion filters', zhLeft: '支持', enLeft: 'Yes', zhRight: '通常依赖关键词绕法', enRight: 'Usually requires keyword hacks' },
  { zhLabel: '是否适合文献综述', enLabel: 'Built for literature reviews', zhLeft: '强', enLeft: 'Strong', zhRight: '中', enRight: 'Moderate' },
  { zhLabel: '是否支持结果结构化对比', enLabel: 'Structured result comparison', zhLeft: '支持', enLeft: 'Yes', zhRight: '弱', enRight: 'Limited' },
  { zhLabel: '是否支持继续进入 Survey 工作流', enLabel: 'Continues into survey workflow', zhLeft: '支持', enLeft: 'Yes', zhRight: '不支持', enRight: 'No' },
];

export function HomeSearchLanding({
  language,
  mode,
  onStartSearch,
  onContinueToSurvey,
  onNavigateToMarketingPage,
}: HomeSearchLandingProps) {
  const [landingSearchQuery, setLandingSearchQuery] = React.useState('');
  const isZh = language === 'zh';
  const isSearchMode = mode === 'search';
  const homeTitle = 'WisPaper: Your AI Academic Search Engine';
  const homeDescription = 'Complete literature discovery, deep reading, analysis, and knowledge-base building in one AI workspace, reducing days of research to minutes.';

  const handleLandingSearch = React.useCallback(() => {
    if (landingSearchQuery.trim()) {
      onStartSearch(landingSearchQuery.trim());
    }
  }, [landingSearchQuery, onStartSearch]);

  React.useEffect(() => {
    document.title = isSearchMode
      ? isZh
        ? 'Scholar Search - AI文献搜索与文献综述工具 | WisPaper'
        : 'Scholar Search - AI Literature Search & Review Tool | WisPaper'
      : homeTitle;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      'content',
      isSearchMode
        ? isZh
          ? '用 AI 理解研究意图，按研究问题、方法、数据集与排除条件精准搜索论文。支持复杂学术检索、论文对比与文献综述工作流。'
          : 'Search research papers by intent, methods, datasets, and exclusion criteria. Built for literature reviews, paper comparison, and complex academic search.'
        : homeDescription,
    );

    const syncMeta = (selector: string, attr: 'content') => {
      const element = document.querySelector(selector);
      if (element instanceof HTMLMetaElement) {
        element.setAttribute(attr, isSearchMode
          ? isZh
            ? '用 AI 理解研究意图，按研究问题、方法、数据集与排除条件精准搜索论文。支持复杂学术检索、论文对比与文献综述工作流。'
            : 'Search research papers by intent, methods, datasets, and exclusion criteria. Built for literature reviews, paper comparison, and complex academic search.'
          : homeDescription);
      }
    };

    if (!isSearchMode) {
      syncMeta('meta[property="og:title"]', 'content');
      syncMeta('meta[name="twitter:title"]', 'content');

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle instanceof HTMLMetaElement) ogTitle.setAttribute('content', homeTitle);
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle instanceof HTMLMetaElement) twitterTitle.setAttribute('content', homeTitle);
    }

    syncMeta('meta[property="og:description"]', 'content');
    syncMeta('meta[name="twitter:description"]', 'content');
  }, [homeDescription, homeTitle, isSearchMode, isZh]);

  return (
    <div className="space-y-16 pb-8 text-slate-900">
      {!isSearchMode ? (
      <section
        id="scholar-search-hero"
        className="relative px-6 py-8 md:px-10 md:py-10"
      >
        <div className="relative fade-up-enter">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
              <Sparkles className="h-4 w-4" />
              <span>{isZh ? '面向学术界的全链路科研加速器' : 'The world-leading end-to-end research accelerator'}</span>
            </div>

            <h1 className="mx-auto min-h-[5.5rem] max-w-4xl text-4xl font-black tracking-tight leading-[1.05] text-slate-950 md:min-h-[8.5rem] md:text-6xl">
              {isZh ? (
                <span className="flex flex-col items-center leading-[1.05]">
                  <span>WisPaper:</span>
                  <TextType
                    text="你的AI 学术搜索引擎"
                    typingSpeed={48}
                    startDelay={220}
                    className="mt-1 block"
                  />
                </span>
              ) : (
                <span className="flex flex-col items-center leading-[1.05]">
                  <span>WisPaper:</span>
                  <TextType
                    text="Your AI Academic Search Engine"
                    typingSpeed={48}
                    startDelay={220}
                    className="mt-1 block"
                  />
                </span>
              )}
            </h1>
            <p className="mx-auto mt-4 min-h-[4rem] max-w-3xl text-xl leading-8 text-slate-700 md:min-h-[5rem]">
              {isZh
                ? '助你一站式完成文献查找、精读分析与知识库搭建，将数天的调研工作量缩减至分钟级。'
                : 'Complete literature discovery, deep reading, analysis, and knowledge-base building in one AI workspace, reducing days of research to minutes.'}
            </p>
            <div className="mx-auto mt-6 w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
              <div className="flex items-center gap-2">
                <input
                  value={landingSearchQuery}
                  onChange={(e) => setLandingSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleLandingSearch();
                    }
                  }}
                  placeholder={isZh ? '例如：找最近3年研究 AI4Science 的论文…' : 'e.g., Find me papers that study AI4Science in recent 3 years...'}
                  className="h-9 w-full border-0 px-3 text-sm focus:outline-none"
                />
                <button
                  onClick={handleLandingSearch}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-800"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-5xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/90 bg-slate-950 shadow-[0_32px_120px_-70px_rgba(15,23,42,0.85)]">
                <div className="aspect-video bg-slate-950">
                  <video
                    className="h-full w-full object-cover"
                    src="/media/homepage-showcase.mp4"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    {isZh ? '您的浏览器暂不支持视频播放。' : 'Your browser does not support video playback.'}
                  </video>
                </div>
                <div className="absolute left-5 top-5 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400/90" />
                  <span className="h-3 w-3 rounded-full bg-amber-300/90" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
                </div>
              </div>

              <div className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-cyan-100/80 bg-white/72 px-4 py-7 shadow-[0_24px_80px_-56px_rgba(59,130,246,0.28)] backdrop-blur-xl md:px-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_30%)]" />
                <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {heroStats.map((item) => (
                    <article
                      key={item.zhLabel}
                      className="rounded-[1.35rem] border border-white/70 bg-white/58 px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                    >
                      <p className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                        {isZh ? item.zhValue : item.enValue}
                      </p>
                      <p className="mt-3 text-sm font-medium text-slate-600 md:text-base">
                        {isZh ? item.zhLabel : item.enLabel}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-[88rem]">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="min-h-[4rem] text-3xl font-bold tracking-tight text-slate-950 md:min-h-[5rem] md:text-4xl">
                {isZh ? '不止搜索，更是一整套科研工作流' : 'More than search, a complete research workflow'}
              </h2>
              <p className="mt-4 min-h-[3.5rem] text-base leading-7 text-slate-600 md:min-h-[3.75rem]">
                {isZh
                  ? 'WisPaper提供多种工具和Agents，助您轻松识别研究缺口，优选科研路径。'
                  : 'WisPaper offers a range of tools and agents to help you identify research gaps and choose stronger research paths with less effort.'}
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featureOverviewCards.map((card) => {
                const Icon = card.icon;

                return (
                  <button
                    key={card.zhTitle}
                    type="button"
                    onClick={() => onNavigateToMarketingPage(card.key)}
                    className={`group relative rounded-[1.75rem] border bg-white/78 px-5 py-5 text-left shadow-[0_18px_50px_-42px_rgba(15,23,42,0.28)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_24px_60px_-42px_rgba(15,23,42,0.34)] ${card.border} ${card.isExplore ? 'overflow-hidden' : ''}`}
                  >
                    {card.isExplore ? (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.08),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.08),_transparent_34%)]" />
                    ) : null}

                    <div className="relative flex min-h-[142px] flex-col">
                      <div className="min-h-[3rem]">
                      <div className="flex items-center gap-3">
                        <div className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${card.accent} shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <h3 className="text-[0.98rem] font-semibold leading-tight tracking-tight text-slate-950 md:text-[1.02rem]">
                          {isZh ? card.zhTitle : card.enTitle}
                        </h3>
                      </div>
                      </div>

                      <p className="mt-3 min-h-[5.25rem] max-w-[28ch] text-[0.9rem] leading-7 text-slate-600">
                        {isZh ? card.zhBody : card.enBody}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="px-6 py-4 md:px-10 md:py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="min-h-[3.5rem] text-4xl font-bold text-blue-600 md:min-h-[4rem]">
              {isZh ? '用更聪明的方式开始学术搜索' : 'Start your academic search more intelligently'}
            </h1>
            <p className="mx-auto mt-3 min-h-[3.5rem] max-w-2xl text-base leading-7 text-slate-600">
              {isZh
                ? '围绕研究问题、方法与数据集直接描述你的需求，然后开始搜索。'
                : 'Describe your research question, method, or dataset directly and start searching.'}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-[#d9d9de] bg-[#f2f2f4] p-4 shadow-[0_8px_20px_-18px_rgba(15,23,42,0.55)] md:p-5">
            <div className="relative rounded-[1.5rem] border border-[#d8d8dc] bg-[#efeff1] px-5 py-4">
              <textarea
                value={landingSearchQuery}
                onChange={(e) => setLandingSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleLandingSearch();
                  }
                }}
                placeholder=""
                rows={1}
                className="w-full resize-none bg-transparent text-base leading-7 text-slate-700 focus:outline-none"
              />
              {!landingSearchQuery ? (
                <div className="pointer-events-none absolute inset-x-5 top-1/2 -translate-y-1/2">
                  <div className="h-6 w-2/3 animate-pulse rounded-md bg-slate-300/65" />
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#d3d3d8] bg-[#ececef] p-1.5 pl-4 pr-3"
                >
                  <Search className="h-5 w-5 text-slate-500" />
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#d0d0d4] bg-[#e5e5e9] px-4 py-2 shadow-[0_2px_8px_-6px_rgba(15,23,42,0.45)]">
                    <Globe className="h-5 w-5" />
                    <span className="h-4 w-20 animate-pulse rounded bg-slate-400/60" />
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleLandingSearch}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#16a5e8] text-white transition hover:bg-[#0f98d8]"
                >
                  <ArrowUp className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="rounded-[2rem] bg-white px-4 py-8 md:px-6">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {painPoints.map((item, index) => {
            const visuals = [
              {
                icon: Filter,
                shell: 'bg-[#ead6ff]',
                blob: 'bg-[#e2ccff]',
                rotate: '-rotate-6',
              },
              {
                icon: Search,
                shell: 'bg-[#d7deff]',
                blob: 'bg-[#cfd7ff]',
                rotate: 'rotate-6',
              },
              {
                icon: Compass,
                shell: 'bg-[#cfe8ff]',
                blob: 'bg-[#c6e0fb]',
                rotate: '-rotate-3',
              },
            ][index];

            const Icon = visuals.icon;

            return (
              <article key={item.enTitle} className="flex flex-col items-center text-center">
                <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
                  <div className={`absolute h-24 w-24 rounded-[1.75rem] ${visuals.blob} ${visuals.rotate}`} />
                  <div className={`relative flex h-24 w-24 items-center justify-center rounded-full ${visuals.shell} shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]`}>
                    <Icon className="h-11 w-11 text-slate-950" strokeWidth={1.7} />
                  </div>
                </div>
                <h3 className="max-w-[14ch] text-2xl font-bold tracking-tight text-slate-950">
                  {isZh ? item.zhTitle : item.enTitle}
                </h3>
                <p className="mt-4 max-w-[19ch] text-lg leading-[1.55] text-slate-700 md:max-w-[20ch]">
                  {isZh ? item.zhBody : item.enBody}
                </p>
              </article>
            );
          })}
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">How It Works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {isZh
              ? 'Scholar Search 如何帮助你更快找到真正相关的论文'
              : 'How Scholar Search helps you find truly relevant papers faster'}
          </h2>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {solutionCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.enTitle} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <div className="inline-flex rounded-2xl bg-white p-3 text-cyan-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{isZh ? card.zhTitle : card.enTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{isZh ? card.zhBody : card.enBody}</p>
              </article>
            );
          })}
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-cyan-200 bg-[linear-gradient(180deg,_rgba(236,254,255,1),_rgba(255,255,255,1))] p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-600 p-3 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Deep Search</h2>
              <p className="text-sm text-cyan-800">
                {isZh ? '适合理解研究意图与复杂条件' : 'Built for research intent and complex filters'}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {(isZh
              ? ['AI 理解研究意图与上下文', '适合文献综述与高质量筛选', '适合复杂条件和歧义词场景']
              : ['Understands research intent and context', 'Best for literature reviews and high-quality filtering', 'Ideal for ambiguous terms and complex queries']
            ).map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-cyan-600 p-1 text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Quick Search</h2>
              <p className="text-sm text-slate-500">
                {isZh ? '适合已知线索与宽泛检索' : 'Best for known leads and broad retrieval'}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {(isZh
              ? ['免费、不限次', '毫秒级响应', '适合已知标题、作者、宽泛检索']
              : ['Free and unlimited', 'Fast keyword-based retrieval', 'Best for known titles, authors, and broad search']
            ).map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-slate-900 p-1 text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-[0_40px_120px_-80px_rgba(15,23,42,0.95)] md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Results Preview</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              {isZh ? '搜索之后，不止是结果列表' : 'Search results that go beyond a list of links'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              {isZh
                ? '从搜索结果中抽取论文核心信息，快速比较方法、任务、数据集与实验设置。首页必须让用户直接看到“搜索之后能得到什么”。'
                : 'Extract key paper information from search results and compare methods, tasks, datasets, and setups faster.'}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-2">
            {(isZh
              ? ['可自定义抽取列', '适合快速比较论文', '可继续进入 Survey']
              : ['Custom extractable columns', 'Built for fast comparison', 'Continue into survey workflow']
            ).map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-sm text-slate-200">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/6">
            <div className="grid grid-cols-[1.8fr_0.7fr_0.9fr_0.8fr_1fr_1fr] border-b border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              <span>Title</span>
              <span>Year</span>
              <span>Citations</span>
              <span>Match</span>
              <span>{isZh ? 'Problem' : 'Problem'}</span>
              <span>{isZh ? 'Method' : 'Method'}</span>
            </div>
            {resultRows.map((row) => (
              <div key={row.title} className="grid grid-cols-[1.8fr_0.7fr_0.9fr_0.8fr_1fr_1fr] gap-4 border-t border-white/10 px-4 py-4 text-sm text-slate-200">
                <span className="font-medium text-white">{row.title}</span>
                <span>{row.year}</span>
                <span>{row.citations}</span>
                <span className="font-semibold text-cyan-300">{row.match}</span>
                <span>{row.task}</span>
                <span>{row.method}</span>
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-200">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{isZh ? '字段抽取' : 'Field extraction'}</p>
                <p className="text-sm text-slate-400">
                  {isZh ? '面向综述与论文对比的结构化字段' : 'Custom columns for review-ready comparison'}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                'Problem: molecular property prediction',
                'Task: dataset-aware ranking',
                'Method: GNN / Graph Transformer',
                'Constraint: exclude QM9',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/6 px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section id="resources-section" className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Workflow</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {isZh ? '从一次搜索，发展成系统性的文献综述' : 'Turn one search into a structured literature review'}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {isZh
                ? '搜索结果可以继续组织成主题分组、方法路线、数据集对比和研究空白，帮助你更快形成领域全景。'
                : 'Organize search results into themes, method clusters, dataset comparisons, and research gaps to build a structured view of the field.'}
            </p>
            <button
              type="button"
              onClick={onContinueToSurvey}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <span>{isZh ? '进入 AI Survey' : 'Continue to AI Survey'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                zhTitle: '主题聚类',
                enTitle: 'Theme clusters',
                zhBody: '按主题聚合结果，快速识别研究主线与分支。',
                enBody: 'Group results by theme to identify major lines of work and branches faster.',
                icon: Layers3,
              },
              {
                zhTitle: '方法图谱',
                enTitle: 'Method map',
                zhBody: '比较方法路线、实验设置和数据集覆盖。',
                enBody: 'Compare methods, setups, and dataset coverage in one place.',
                icon: TableProperties,
              },
              {
                zhTitle: '研究空白',
                enTitle: 'Research gaps',
                zhBody: '从筛选结果中提炼研究空白与未覆盖问题。',
                enBody: 'Derive open questions and uncovered problems from shortlisted results.',
                icon: FileSearch,
              },
              {
                zhTitle: '综述工作流',
                enTitle: 'Review workflow',
                zhBody: '让搜索自然衔接到综述与对比分析。',
                enBody: 'Move naturally from search into review and comparison workflows.',
                icon: Database,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.enTitle} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="inline-flex rounded-2xl bg-white p-3 text-cyan-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-slate-950">{isZh ? item.zhTitle : item.enTitle}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{isZh ? item.zhBody : item.enBody}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      ) : null}

      {!isSearchMode ? (
      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-white/22 px-0 py-8 backdrop-blur-xl">

          <div className="px-6 pb-6 text-center">
            <h2 className="min-h-[4rem] text-3xl font-bold tracking-tight text-slate-950 md:min-h-[5rem] md:text-4xl">
              {isZh ? '全球科研人员都在用 WisPaper' : 'Researchers around the world use WisPaper'}
            </h2>
            <p className="mx-auto mt-4 min-h-[3.5rem] max-w-3xl text-base leading-7 text-slate-600 md:min-h-[3.75rem]">
              {isZh
                ? '围绕文献查找、精读分析、综述写作与知识库沉淀，WisPaper 正在成为越来越多科研用户的日常工作台。'
                : 'Across literature search, deep reading, review writing, and knowledge-base building, WisPaper is becoming a daily workspace for more researchers.'}
            </p>
          </div>

          <div className="logo-loop-row audience-fade-mask">
            <div className="audience-loop-track">
              {[...audiences, ...audiences].map((item, index) => (
                <article
                  key={`${item.short}-${index}`}
                  className="flex min-h-[21rem] w-[21rem] min-w-[21rem] flex-col rounded-[2rem] border border-slate-200/80 bg-white/92 p-7 text-left shadow-[0_20px_60px_-44px_rgba(15,23,42,0.34)]"
                >
                  <h3 className="min-h-[4rem] text-[1.25rem] font-semibold leading-8 tracking-tight text-slate-950">
                    {isZh ? item.zhTitle : item.enTitle}
                  </h3>

                  <p className="mt-4 min-h-[8rem] text-[0.98rem] leading-8 text-slate-700">
                    {isZh ? item.zhBody : item.enBody}
                  </p>

                  <div className="mt-auto flex items-center gap-4 pt-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(103,232,249,0.45),_rgba(255,255,255,1)_68%)] text-xs font-bold tracking-[0.16em] text-slate-700">
                      {item.short}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{isZh ? item.zhStage : item.enStage}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section id="comparison" className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Comparison</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {isZh ? 'Scholar Search 与传统学术搜索有什么不同？' : 'How is Scholar Search different from traditional academic search?'}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            {isZh
              ? 'Google Scholar 更适合宽泛检索和已知论文定位；Scholar Search 更适合复杂筛选、文献综述与研究问题导向的搜索。'
              : 'Google Scholar is effective for broad retrieval and known-paper lookup, while Scholar Search is built for complex filtering, literature reviews, and research-intent-driven search.'}
          </p>
        </div>
        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-slate-200">
          <div className="grid grid-cols-[1.3fr_0.8fr_0.9fr] border-b border-slate-200 bg-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
            <span>{isZh ? '对比维度' : 'Dimension'}</span>
            <span>Scholar Search</span>
            <span>{isZh ? '传统搜索' : 'Traditional search'}</span>
          </div>
          {comparisonRows.map((row) => (
            <div key={row.enLabel} className="grid grid-cols-[1.3fr_0.8fr_0.9fr] gap-4 border-t border-slate-200 px-5 py-4 text-sm text-slate-700">
              <span className="font-medium text-slate-900">{isZh ? row.zhLabel : row.enLabel}</span>
              <span>{isZh ? row.zhLeft : row.enLeft}</span>
              <span>{isZh ? row.zhRight : row.enRight}</span>
            </div>
          ))}
        </div>
      </section>
      ) : null}

      {isSearchMode ? (
      <section className="surface-glow relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,_rgba(15,23,42,1),_rgba(15,23,42,0.92)_55%,_rgba(8,47,73,0.95))] px-6 py-10 text-white shadow-[0_40px_140px_-90px_rgba(15,23,42,1)] md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_30%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Bottom CTA</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">
              {isZh ? '现在开始一次更聪明的学术搜索' : 'Start a smarter academic search today'}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {isZh ? '把时间留给真正值得读的论文。' : 'Spend more time on the papers worth reading.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStartSearch()}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            <span>{isZh ? '免费开始搜索论文' : 'Start Searching'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
      ) : null}
    </div>
  );
}
