import React from 'react';
import { ArrowRight, ChevronDown, Github, Linkedin, Search, Twitter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { HomeFaqSection } from './HomeFaqSection';
import { HomeSearchLanding } from './HomeSearchLanding';
import { LogoLoop } from './LogoLoop';
import { MarketingSeoPage } from './MarketingSeoPage';
import { cn } from './ui/utils';

const navItemClass = cn(
  "group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-2xl border border-transparent bg-white/70 px-4 text-sm font-medium text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300",
  "hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:text-slate-950 hover:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
  "data-[state=open]:-translate-y-0.5 data-[state=open]:border-slate-200 data-[state=open]:bg-white data-[state=open]:text-slate-950 data-[state=open]:shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)]",
);

export type ViewMode = 'list' | 'library' | 'scholar-qa' | 'paper-reproduction' | 'idea-discovery';

type MarketingPageKey =
  | 'home'
  | 'search'
  | 'pricing'
  | 'privacy-policy'
  | 'scholar-qa'
  | 'library'
  | 'paperclaw'
  | 'idea-discovery'
  | 'projects'
  | 'truecite'
  | 'ai-feeds'
  | 'ai-survey'
  | 'blog'
  | 'terms-of-use'
  | 'translation'
  | 'faq';

interface HomePageProps {
  onNavigateToWorkspace: () => void;
  onNavigate?: (view: ViewMode) => void;
  onOpenPricing?: () => void;
  onStartSearch?: (query?: string) => void;
}

interface PageConfig {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  titleTag: string;
  metaDescription: string;
  pills?: string[];
  overview: Array<{ title: string; body: string }>;
  highlights: Array<{ title: string; body: string }>;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

const featureMenuItems: Array<{ key: MarketingPageKey; label: string }> = [
  { key: 'scholar-qa', label: 'Scholar QA' },
  { key: 'library', label: 'Library' },
  { key: 'paperclaw', label: 'PaperClaw' },
  { key: 'idea-discovery', label: 'Idea Discovery' },
  { key: 'projects', label: 'Projects' },
  { key: 'ai-feeds', label: 'AI Feeds' },
  { key: 'ai-survey', label: 'AI Survey' },
];

const resourceMenuItems: Array<{ key: MarketingPageKey; label: string }> = [
  { key: 'blog', label: 'Blog' },
  { key: 'translation', label: 'Translation' },
  { key: 'faq', label: 'FAQ' },
];

const footerSections = {
  pricing: [{ key: 'pricing' as const, label: 'Pricing' }],
};

function HomeCtaBanner({
  isZh,
  onStartSearch,
}: {
  isZh: boolean;
  onStartSearch: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-[linear-gradient(120deg,rgba(209,245,255,0.94),rgba(239,249,255,0.95)_34%,rgba(222,236,255,0.94)_62%,rgba(247,250,255,0.96)_100%)] px-8 py-10 shadow-[0_30px_90px_-60px_rgba(59,130,246,0.22)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%)]" />
      <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            {isZh ? '开始你的 AI 科研之旅。' : 'Start Your AI Research Journey.'}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            {isZh
              ? '从精准检索到结构化综述，把时间留给真正值得读和值得做的研究问题。'
              : 'Move from precise search to structured review workflows and spend time on the research that matters.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onStartSearch}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-slate-950 shadow-[0_16px_40px_-22px_rgba(15,23,42,0.35)] transition hover:scale-[1.02]"
        >
          <span>{isZh ? '免费开始搜索论文' : 'Get Started'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export function HomePage({ onNavigateToWorkspace, onNavigate, onOpenPricing, onStartSearch }: HomePageProps) {
  const [activePage, setActivePage] = React.useState<MarketingPageKey>('home');
  const [language, setLanguage] = React.useState<'zh' | 'en'>('zh');
  const isZh = language === 'zh';
  const isHomePage = activePage === 'home';

  const handleStartSearch = (query?: string) => {
    if (onStartSearch) {
      onStartSearch(query);
      return;
    }

    onNavigate?.('list');
  };

  const renderPage = (page: MarketingPageKey) => {
    if (page === 'home') {
      return (
        <HomeSearchLanding
          language={language}
          mode="home"
          onStartSearch={handleStartSearch}
          onContinueToSurvey={onNavigateToWorkspace}
          onNavigateToMarketingPage={setActivePage}
        />
      );
    }

    if (page === 'search') {
      return (
        <HomeSearchLanding
          language={language}
          mode="search"
          onStartSearch={handleStartSearch}
          onContinueToSurvey={onNavigateToWorkspace}
          onNavigateToMarketingPage={setActivePage}
        />
      );
    }

    if (page === 'faq') {
      return (
        <div className="space-y-8">
          <HomeFaqSection language={language} />
        </div>
      );
    }

    const configMap: Record<Exclude<MarketingPageKey, 'home'>, PageConfig> = {
      search: {
        badge: 'Search',
        title: 'Scholar Search: AI 文献搜索与文献综述工具',
        subtitle: '围绕研究问题、方法、数据集和排除条件组织学术检索，而不是只做关键词匹配。',
        description: '这是 Search 一级菜单对应的 SEO 介绍页，用来承接 AI 文献搜索、文献综述工具、academic search engine 等搜索意图。',
        titleTag: 'Scholar Search - AI文献搜索与文献综述工具 | WisPaper',
        metaDescription: '用 AI 理解研究意图，按研究问题、方法、数据集与排除条件精准搜索论文。支持复杂学术检索、论文对比与文献综述工作流。',
        pills: ['AI文献搜索', '文献综述工具', 'academic search engine'],
        overview: [
          { title: '研究问题导向', body: '先理解你要解决的研究任务，再组织结果，不把复杂需求压扁成几个关键词。' },
          { title: '复杂条件筛选', body: '支持包含、排除、比较和时间限制，更适合系统性的综述工作。' },
          { title: '继续进入工作流', body: '搜索结果不是终点，后续可以继续转成对比、分组和综述结构。' },
        ],
        highlights: [
          { title: '更适合 high-intent 搜索流量', body: '用于承接想找相关论文、做综述、排除方法和数据集的用户。' },
          { title: '解释结果而不是只列链接', body: '把输出讲成任务、方法、约束条件和可比较字段。' },
          { title: '引导到真实产品路径', body: '用户看完介绍页后可以直接进入实际搜索流程。' },
          { title: '支持 comparison intent', body: '也适合承接 Google Scholar alternative / Semantic Scholar alternative 这类搜索需求。' },
        ],
        primaryLabel: '进入 Scholar Search',
        secondaryLabel: '回到首页',
        onPrimaryAction: () => handleStartSearch(),
        onSecondaryAction: () => setActivePage('home'),
      },
      pricing: {
        badge: 'Pricing',
        title: 'WisPaper Pricing: 为不同使用深度设计的定价页面',
        subtitle: '将免费搜索、深度搜索和工作流能力拆开表达，帮助用户理解付费点和使用边界。',
        description: '这是 Pricing 一级菜单对应的 SEO 介绍页，主任务不是立刻售卖，而是让用户明白为什么要从免费检索升级到更复杂的研究工作流。',
        titleTag: 'WisPaper Pricing | Scholar Search Plans',
        metaDescription: '了解 WisPaper Scholar Search 的定价与能力分层，包含免费检索、复杂学术搜索与文献综述工作流入口。',
        pills: ['Quick Search', 'Deep Search', 'Workflow access'],
        overview: [
          { title: '免费入口明确', body: 'Quick Search 适合已知线索、标题和宽泛检索，降低首次尝试门槛。' },
          { title: '付费价值清晰', body: 'Deep Search 强调研究意图理解、复杂筛选和文献综述质量。' },
          { title: '升级路径自然', body: '用户先搜索，再看到为什么复杂任务值得付费，而不是直接遇到硬门槛。' },
        ],
        highlights: [
          { title: '适合首访用户理解产品层级', body: '先理解功能差异，再判断是否需要升级。' },
          { title: '连接搜索与转化', body: 'Pricing 页服务于 Search 主路径，不抢首页注意力。' },
          { title: '为后续实验和埋点留空间', body: '可以继续扩展 plan comparison、CTA 测试和激活路径。' },
          { title: '支持后续弹窗或真实套餐页', body: '当前 CTA 仍可接回实际 pricing modal 或正式结算页。' },
        ],
        primaryLabel: '查看套餐',
        secondaryLabel: '回到首页',
        onPrimaryAction: () => onOpenPricing?.(),
        onSecondaryAction: () => setActivePage('home'),
      },
      'privacy-policy': {
        badge: 'Legal',
        title: 'Privacy Policy',
        subtitle: '说明 WisPaper 如何处理、存储与保护用户数据及研究工作流信息。',
        description: '这是底部 footer 中的隐私政策介绍页入口，便于品牌站点在法律与信息架构层面完整闭环。',
        titleTag: 'Privacy Policy | WisPaper',
        metaDescription: '查看 WisPaper Privacy Policy，了解平台如何处理用户数据、使用日志与研究工作流信息。',
        pills: ['Privacy', 'Data handling', 'Legal'],
        overview: [
          { title: '数据处理说明', body: '说明平台会收集哪些必要信息，以及这些信息如何被用于改进产品体验。' },
          { title: '研究工作流相关数据', body: '解释搜索、问答、综述与项目相关数据的保存和访问边界。' },
          { title: '法律与品牌完整性', body: '为 footer 链接提供真实承接页，而不是占位入口。' },
        ],
        highlights: [
          { title: '支持对外展示与合规说明', body: '为正式上线前的法律内容预留清晰位置。' },
          { title: '适配品牌站结构', body: '与 Terms of Use 一起补齐 footer 所需的基础页面。' },
          { title: '便于后续替换正式内容', body: '当前可先作为营销站内的法律页容器。' },
          { title: '保留回首页路径', body: '用户可随时返回核心产品介绍页。' },
        ],
        primaryLabel: '回到首页',
        secondaryLabel: '进入 Search',
        onPrimaryAction: () => setActivePage('home'),
        onSecondaryAction: () => setActivePage('search'),
      },
      'scholar-qa': {
        badge: 'Feature',
        title: 'Scholar QA: 基于研究语境继续追问你的论文库',
        subtitle: '适合把“找到论文”推进到“围绕论文提问、归纳、验证和追问”的下一步。',
        description: 'Feature 菜单下的 SEO 页面，用来介绍 Scholar QA 作为搜索后的问答能力，而不是与 Scholar Search 抢首页主入口。',
        titleTag: 'Scholar QA | WisPaper Feature',
        metaDescription: '了解 WisPaper Scholar QA：在搜索和论文库基础上继续提问、归纳、追问与验证研究结论。',
        pills: ['Question answering', 'Research follow-up', 'Paper context'],
        overview: [
          { title: '从检索进入问答', body: '先找到相关论文，再对结果发问，比直接泛问更稳定。' },
          { title: '适合 related work 推进', body: '围绕方法差异、实验设置和局限性做后续追问。' },
          { title: '减少上下文切换', body: '不用在多个工具之间复制摘要和引用再提问。' },
        ],
        highlights: [
          { title: '用于搜索后的深挖', body: '把 Scholar QA 定位成 Search 工作流的下一步。' },
          { title: '适合研究讨论场景', body: '当你已经有一组候选论文时，它更有价值。' },
          { title: 'SEO 页面承担解释角色', body: '把问答场景写成用户任务，而不是抽象功能名词。' },
          { title: 'CTA 回真实产品', body: '看完介绍后可直接进入 Scholar QA 页面。' },
        ],
        primaryLabel: '打开 Scholar QA',
        secondaryLabel: '回到首页',
        onPrimaryAction: () => onNavigate?.('scholar-qa'),
        onSecondaryAction: () => setActivePage('home'),
      },
      library: {
        badge: 'Feature',
        title: 'Library: 为检索后的论文管理和筛选提供承接页',
        subtitle: '把搜索结果转成可保存、可分类、可回看的研究资产。',
        description: 'Library 是 Feature 菜单中的功能介绍页，适合承接“文献管理 / 论文收藏 / research library”相关搜索意图。',
        titleTag: 'Library | WisPaper Feature',
        metaDescription: '了解 WisPaper Library：保存、分类和回看搜索结果，把论文管理纳入 Scholar Search 工作流。',
        pills: ['Save papers', 'Research library', 'Collection workflow'],
        overview: [
          { title: '保存真正相关的结果', body: '搜索之后把值得继续看的论文沉淀下来，不再反复重搜。' },
          { title: '支持后续阅读和比较', body: 'Library 是比较、标注和继续分析的稳定入口。' },
          { title: '适合形成个人知识库', body: '对长期课题尤其重要，避免论文资产分散。' },
        ],
        highlights: [
          { title: '适合承接文献管理意图', body: '让用户理解它不是单纯的收藏夹，而是研究工作流一部分。' },
          { title: '与 Search 互补', body: '搜索负责找，Library 负责留。' },
          { title: '支持后续 QA 与 Survey', body: '保存的结果可以继续用于更深层的分析。' },
          { title: 'CTA 可直达产品内库页', body: '介绍页结束后直接进入我的论文库。' },
        ],
        primaryLabel: '打开 Library',
        secondaryLabel: '回到首页',
        onPrimaryAction: () => onNavigate?.('library'),
        onSecondaryAction: () => setActivePage('home'),
      },
      paperclaw: {
        badge: 'Feature',
        title: 'PaperClaw: 为论文复现与实验工作流准备的介绍页',
        subtitle: '连接论文阅读、复现实验和研究执行，让功能入口更像真实实验台。',
        description: '这是 PaperClaw 的 SEO 介绍页，目标是说明它和 Scholar Search 的关系，而不是让它在首页与搜索主路径平级竞争。',
        titleTag: 'PaperClaw | WisPaper Feature',
        metaDescription: '了解 WisPaper PaperClaw：从论文检索延伸到复现、实验执行和研究工程流程。',
        pills: ['Reproduction workflow', 'Experiment support', 'Research execution'],
        overview: [
          { title: '把论文转成可执行任务', body: '不止是看论文，而是继续推进到复现和实验组织。' },
          { title: '适合方法验证阶段', body: '当你已经选定候选论文后，PaperClaw 的价值会更明确。' },
          { title: '与 Search 串联而不是并列', body: '先搜索再复现，路径更自然。' },
        ],
        highlights: [
          { title: '解释复现产品的定位', body: '让用户知道这是研究执行层工具，而不是普通搜索变体。' },
          { title: '适合承接具体方法查询', body: '尤其对工程型用户更有说服力。' },
          { title: '帮助功能线不打散首页', body: '通过 SEO 页解释，而不是在首页平均展示。' },
          { title: 'CTA 回到真实复现工作区', body: '介绍页和实际工具页面分工清楚。' },
        ],
        primaryLabel: '打开 PaperClaw',
        secondaryLabel: '回到首页',
        onPrimaryAction: () => onNavigate?.('paper-reproduction'),
        onSecondaryAction: () => setActivePage('home'),
      },
      'idea-discovery': {
        badge: 'Feature',
        title: 'Idea Discovery: 从检索结果继续挖研究方向',
        subtitle: '当搜索不再只是找论文，而是开始形成研究问题、方法路线和选题机会。',
        description: 'Idea Discovery 的 SEO 页重点是说明它如何承接搜索结果并支持选题探索，而不是在首页和 Search 并列抢主路径。',
        titleTag: 'Idea Discovery | WisPaper Feature',
        metaDescription: '了解 WisPaper Idea Discovery：从学术检索结果中继续发现研究方向、潜在问题和选题机会。',
        pills: ['Research ideas', 'Direction discovery', 'Follow-up workflow'],
        overview: [
          { title: '从结果中看空白', body: '把搜索结果继续组织成方法簇、问题簇和研究空白。' },
          { title: '适合课题探索期', body: '尤其适合博士、研究助理或创新型算法团队。' },
          { title: '与 Survey 形成衔接', body: '搜索找到材料，Idea Discovery 帮你抽出方向。' },
        ],
        highlights: [
          { title: 'SEO 上讲场景，不讲玄学', body: '强调选题、方向判断和研究问题发现。' },
          { title: '解释它在工作流中的位置', body: '不是独立入口，而是 Search 的扩展能力。' },
          { title: '降低首次理解门槛', body: '用户能快速明白为什么需要它。' },
          { title: 'CTA 进入真实功能页', body: '保持介绍页与产品页分层。' },
        ],
        primaryLabel: '打开 Idea Discovery',
        secondaryLabel: '回到首页',
        onPrimaryAction: () => onNavigate?.('idea-discovery'),
        onSecondaryAction: () => setActivePage('home'),
      },
      projects: {
        badge: 'Feature',
        title: 'Projects: 以项目维度组织研究流程的介绍页',
        subtitle: '适合把搜索、筛选、阅读、问答和复现按课题或研究主题进行归档。',
        description: 'Projects 当前作为功能介绍页存在，用于说明它未来如何成为研究任务和多工具协作的容器。',
        titleTag: 'Projects | WisPaper Feature',
        metaDescription: '了解 WisPaper Projects：以研究项目为单位组织 Scholar Search、Library、QA 与复现工作流。',
        pills: ['Project workspace', 'Research organization', 'Workflow container'],
        overview: [
          { title: '以课题组织工作流', body: '比零散收藏和临时搜索更适合长期研究。' },
          { title: '适合协作与跟踪', body: '可以承接方法筛选、资料沉淀和阶段性整理。' },
          { title: '当前先作为 SEO 介绍页', body: '帮助用户理解未来产品线，而不打散首页主路径。' },
        ],
        highlights: [
          { title: '面向复杂研究项目', body: '尤其适合多轮搜索和长周期实验。' },
          { title: '与 Search 是上下游关系', body: '搜索提供材料，Projects 提供组织结构。' },
          { title: '服务品牌级信息架构', body: '把潜在功能提前放在可解释的位置。' },
          { title: '暂不直接跳真实工具', body: '当前重点是作为功能介绍页承接认知。' },
        ],
        primaryLabel: '回到首页',
        secondaryLabel: '进入 Search',
        onPrimaryAction: () => setActivePage('home'),
        onSecondaryAction: () => setActivePage('search'),
      },
      truecite: {
        badge: 'Feature',
        title: 'TrueCite: 强调引用可信度与证据回链的介绍页',
        subtitle: '当用户关心“这条结论到底从哪来”，TrueCite 就是解释引用可靠性的页面。',
        description: 'TrueCite 目前作为功能介绍页存在，帮助说明引用回链、证据溯源和结论验证的定位。',
        titleTag: 'TrueCite | WisPaper Feature',
        metaDescription: '了解 WisPaper TrueCite：围绕引用回链、证据溯源和研究结论验证设计的功能介绍页。',
        pills: ['Citation tracing', 'Evidence chain', 'Research verification'],
        overview: [
          { title: '面向证据敏感场景', body: '对综述、写作和验证性阅读尤其重要。' },
          { title: '让引用不止停在格式层面', body: '更强调结论能否回到具体论文和上下文。' },
          { title: '当前作为 SEO 解释页', body: '先讲清楚价值，再决定具体产品实现。' },
        ],
        highlights: [
          { title: '适合 long-tail SEO', body: '例如 citation verification、evidence tracing 等搜索需求。' },
          { title: '与 Search 天然关联', body: '找到论文之后，下一步是判断证据质量。' },
          { title: '帮助品牌扩展可信度叙事', body: '不让首页一次性承担全部说明。' },
          { title: '保持导航结构完整', body: '恢复旧结构同时让每个入口有清晰角色。' },
        ],
        primaryLabel: '回到首页',
        secondaryLabel: '进入 Search',
        onPrimaryAction: () => setActivePage('home'),
        onSecondaryAction: () => setActivePage('search'),
      },
      'ai-feeds': {
        badge: 'Resources',
        title: 'AI Feeds: 持续发现研究方向与新论文的资源页',
        subtitle: '为已经明确研究方向的用户提供持续跟踪与发现入口。',
        description: 'AI Feeds 放在 Resources 下更合理，因为它承接的是持续输入和趋势跟踪，而不是首页第一次访问的主路径。',
        titleTag: 'AI Feeds | WisPaper Resources',
        metaDescription: '了解 WisPaper AI Feeds：用于持续跟踪论文、趋势和研究方向的资源页面。',
        pills: ['Trend tracking', 'Research feed', 'Continuous discovery'],
        overview: [
          { title: '适合持续关注领域动态', body: '对已有研究方向的用户更有价值。' },
          { title: '不与首次搜索入口冲突', body: '放在 Resources 下更符合信息架构。' },
          { title: '从搜索延伸到长期发现', body: '先找到方向，再持续跟踪。' },
        ],
        highlights: [
          { title: '资源页强调场景延伸', body: '让用户知道它服务于 Search 后的连续研究行为。' },
          { title: '与首页主路径错峰', body: '避免在首页分散第一次访问的注意力。' },
          { title: '适合承接 trends / research feed 意图', body: '也方便后续继续做资源型 SEO 页面。' },
          { title: 'CTA 进入真实 workspace', body: '可以直接跳到现有工作区。' },
        ],
        primaryLabel: '打开 AI Feeds',
        secondaryLabel: '回到首页',
        onPrimaryAction: onNavigateToWorkspace,
        onSecondaryAction: () => setActivePage('home'),
      },
      'ai-survey': {
        badge: 'Resources',
        title: 'AI Survey: 从搜索结果进入结构化综述工作流',
        subtitle: '把分散的搜索结果继续组织成主题分组、方法路线、数据集对比和研究空白。',
        description: 'AI Survey 是资源型工作流页，适合承接 literature review tool、survey workflow、related work organization 等搜索意图。',
        titleTag: 'AI Survey | WisPaper Resources',
        metaDescription: '了解 WisPaper AI Survey：将 Scholar Search 结果继续组织成结构化文献综述与 related work 工作流。',
        pills: ['Survey workflow', 'Literature review', 'Research organization'],
        overview: [
          { title: '搜索之后的自然下一步', body: '不是和 Search 并列，而是 Search 的延长线。' },
          { title: '更适合综述型任务', body: '帮助用户从论文列表推进到结构化理解。' },
          { title: '适合高意图科研用户', body: '尤其适合研究生、博士和实验室成员。' },
        ],
        highlights: [
          { title: '承接首页中最重要的 workflow narrative', body: '让 Search 不只是搜索，而是一个工作流起点。' },
          { title: '资源页承担解释任务', body: '把 Survey 的价值讲成用户任务和结果。' },
          { title: '也适合 comparison 与 use case 内链', body: '方便后续扩展更完整的信息架构。' },
          { title: 'CTA 进入真实 AI Survey 场景', body: '用户看完可以直达工作区。' },
        ],
        primaryLabel: '进入 AI Survey',
        secondaryLabel: '回到首页',
        onPrimaryAction: onNavigateToWorkspace,
        onSecondaryAction: () => setActivePage('home'),
      },
      blog: {
        badge: 'Resources',
        title: 'Blog: 承接研究工作流内容营销与 SEO 长尾的资源页',
        subtitle: '适合发布 use case、comparison、教程、研究方法文章和产品更新。',
        description: 'Blog 的 SEO 页面不是产品功能页，而是说明它在品牌增长和内容承接中的位置。',
        titleTag: 'Blog | WisPaper Resources',
        metaDescription: '了解 WisPaper Blog：用于承接 use case、comparison、research workflow 与内容 SEO 的资源页面。',
        pills: ['Content hub', 'Use cases', 'Comparison pages'],
        overview: [
          { title: '做内容型 SEO 承接', body: '适合 use case、comparison、教程和研究方法文章。' },
          { title: '服务搜索流量分层', body: '有些用户先读内容，再进入产品。' },
          { title: '支持品牌知识库建设', body: '让 Blog 成为资源而不是零散页面集合。' },
        ],
        highlights: [
          { title: '帮助搜索页减压', body: '把不适合放首页的内容放进资源型结构。' },
          { title: '适合长尾流量', body: '例如 Google Scholar alternative、how to do literature review 等。' },
          { title: '支持内容到产品的过渡', body: 'Blog 不只是阅读页，也应该有明确 CTA。' },
          { title: '当前作为 SEO 说明页', body: '可继续演进为完整内容中心。' },
        ],
        primaryLabel: '回到首页',
        secondaryLabel: '进入 Search',
        onPrimaryAction: () => setActivePage('home'),
        onSecondaryAction: () => setActivePage('search'),
      },
      translation: {
        badge: 'Resources',
        title: 'Translation: 面向学术阅读场景的辅助资源页',
        subtitle: '适合解释论文翻译、段落理解和跨语言研究阅读为什么应放在资源层而不是首页主路径。',
        description: 'Translation 当前作为资源型 SEO 介绍页存在，强调它服务的是阅读辅助，而不是 Scholar Search 的第一入口。',
        titleTag: 'Translation | WisPaper Resources',
        metaDescription: '了解 WisPaper Translation：面向学术阅读、论文翻译与跨语言理解的资源型页面。',
        pills: ['Paper translation', 'Reading support', 'Academic comprehension'],
        overview: [
          { title: '服务阅读环节', body: '用户先找到论文，再进入翻译和理解。' },
          { title: '不抢首页主路径', body: '更适合放在 Resources 菜单下。' },
          { title: '适合跨语言研究场景', body: '尤其适合中文用户阅读英文论文。' },
        ],
        highlights: [
          { title: '把辅助能力放在正确位置', body: '避免首页功能线过于分散。' },
          { title: '更容易组织 SEO 语义', body: '学术翻译和论文阅读支持本身就是独立搜索需求。' },
          { title: '和 Search 是前后关系', body: '先找，再读，再理解。' },
          { title: '可后续扩展真实页面', body: '当前先作为清晰的信息架构节点。' },
        ],
        primaryLabel: '回到首页',
        secondaryLabel: '进入 Search',
        onPrimaryAction: () => setActivePage('home'),
        onSecondaryAction: () => setActivePage('search'),
      },
      faq: {
        badge: 'Resources',
        title: 'FAQ: 面向长尾问句与转化阻力的资源页',
        subtitle: '集中回答 Deep Search、Quick Search、Google Scholar alternative 和文献综述相关问题。',
        description: 'FAQ 作为 Resources 下的 SEO 页，更适合承接长尾问句，而不是把所有问答都堆在首页主叙事里。',
        titleTag: 'FAQ | WisPaper Resources',
        metaDescription: '查看 WisPaper FAQ：包括 Deep Search、Quick Search、文献综述、结构化对比与 Google Scholar 差异等常见问题。',
        pills: ['FAQ', 'Long-tail SEO', 'Conversion support'],
        overview: [
          { title: '承接搜索问句', body: '例如 Deep Search 有什么区别、适合综述吗、能排除数据集吗。' },
          { title: '降低首次理解阻力', body: '让 FAQ 成为资源页，而不是首页信息过载来源。' },
          { title: '支持搜索转化', body: '用户在有疑问时仍能继续留在主路径上。' },
        ],
        highlights: [
          { title: '适合做长尾词聚合', body: '把高频问题集中管理，提升页面抓取与可理解性。' },
          { title: '让首页更聚焦', body: 'FAQ 保留，但不再挤占首屏与主叙事。' },
          { title: '适合与 comparison 页互链', body: '后续可以形成更完整的 SEO 内容网。' },
          { title: 'CTA 回到实际产品', body: '回答问题后继续进入 Search 或 Survey。' },
        ],
        primaryLabel: '进入 Search',
        secondaryLabel: '回到首页',
        onPrimaryAction: () => setActivePage('search'),
        onSecondaryAction: () => setActivePage('home'),
      },
      'terms-of-use': {
        badge: 'Legal',
        title: 'Terms of Use',
        subtitle: '说明 WisPaper 平台的使用边界、服务约束与产品访问规则。',
        description: '这是底部 footer 中的使用条款承接页，用于补齐营销站点的法律与信任结构。',
        titleTag: 'Terms of Use | WisPaper',
        metaDescription: '查看 WisPaper Terms of Use，了解平台访问、功能使用与服务边界。',
        pills: ['Terms', 'Usage rules', 'Legal'],
        overview: [
          { title: '平台使用规则', body: '对产品访问、账户行为与功能调用边界做出清晰说明。' },
          { title: '服务范围定义', body: '帮助用户理解哪些能力属于平台支持范围，哪些属于限制条件。' },
          { title: '为正式条款内容预留结构', body: '当前先提供可用页面入口，后续可替换成正式法务文案。' },
        ],
        highlights: [
          { title: '配合 Privacy Policy 使用', body: '一起构成底部 footer 的基础法律信息架构。' },
          { title: '帮助建立产品可信度', body: '让品牌站信息结构更完整。' },
          { title: '适合上线前持续迭代', body: '后续可以替换为正式条款内容而不改布局。' },
          { title: '保持 CTA 路径明确', body: '从法律页仍可回到产品主路径。' },
        ],
        primaryLabel: '回到首页',
        secondaryLabel: '进入 Search',
        onPrimaryAction: () => setActivePage('home'),
        onSecondaryAction: () => setActivePage('search'),
      },
    };

    const config = configMap[page];
    return <MarketingSeoPage {...config} />;
  };

  const isFeaturePage = featureMenuItems.some((item) => item.key === activePage);
  const isResourcePage = resourceMenuItems.some((item) => item.key === activePage);

  return (
    <div
      className={cn(
        "min-h-screen text-slate-950",
        isHomePage
          ? "bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,250,252,0.96))]"
          : "bg-[#f4f7fb]",
      )}
    >
      <header
        className={cn(
          "sticky top-0 z-40 border-b backdrop-blur-xl",
          isHomePage
            ? "border-white/50 bg-white/30"
            : "border-white/70 bg-[#f4f7fb]/85",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <button
            type="button"
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-base font-bold text-white shadow-sm">
              W
            </div>
            <div className="text-left">
              <p className="text-base font-semibold text-slate-950">WisPaper</p>
              <p className="text-xs text-slate-500">{isZh ? '首页' : 'Home'}</p>
            </div>
          </button>

          <nav className="hidden md:flex">
            <div className="relative flex items-center gap-2 rounded-[1.6rem] border border-slate-200/80 bg-white/75 p-1.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

              <button
                type="button"
                onClick={() => setActivePage('search')}
                className={cn(navItemClass, activePage === 'search' && "border-slate-200 bg-white text-slate-950 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)]")}
              >
                Search
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(navItemClass, isFeaturePage && "border-slate-200 bg-white text-slate-950 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)]")}
                  >
                    <span>Feature</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56 rounded-2xl border-slate-200/90 bg-white/95 p-2 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                  {featureMenuItems.map((item) => (
                    <DropdownMenuItem key={item.key} className="cursor-pointer" onSelect={() => setActivePage(item.key)}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(navItemClass, isResourcePage && "border-slate-200 bg-white text-slate-950 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)]")}
                  >
                    <span>Resources</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-52 rounded-2xl border-slate-200/90 bg-white/95 p-2 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                  {resourceMenuItems.map((item) => (
                    <DropdownMenuItem key={item.key} className="cursor-pointer" onSelect={() => setActivePage(item.key)}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                type="button"
                onClick={() => setActivePage('pricing')}
                className={cn(navItemClass, activePage === 'pricing' && "border-slate-200 bg-white text-slate-950 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.45)]")}
              >
                Pricing
              </button>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleStartSearch()}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Search className="h-4 w-4" />
              <span>Workspace</span>
            </button>
            <div className="hidden items-center rounded-2xl border border-slate-200 bg-white p-1 md:inline-flex">
              <button
                type="button"
                onClick={() => setLanguage('zh')}
                className={cn(
                  "rounded-[0.9rem] px-3 py-2 text-sm font-semibold transition",
                  isZh ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950",
                )}
              >
                中
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={cn(
                  "rounded-[0.9rem] px-3 py-2 text-sm font-semibold transition",
                  !isZh ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950",
                )}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 md:inline-flex"
            >
              {isZh ? '登录' : 'Sign In'}
            </button>
          </div>
        </div>
      </header>

      <main className="px-6 pb-16 pt-8">
        <div className="mx-auto max-w-7xl">{renderPage(activePage)}</div>
      </main>

      {isHomePage ? (
        <div className="px-6 pb-10">
          <div className="mx-auto max-w-7xl space-y-8">
            <HomeFaqSection language={language} onViewMore={() => setActivePage('faq')} />
            <LogoLoop language={language} />
            <HomeCtaBanner isZh={isZh} onStartSearch={() => handleStartSearch()} />
          </div>
        </div>
      ) : null}

      <footer
        className={cn(
          "border-t px-6 py-10",
          isHomePage
            ? "border-white/50 bg-white/30"
            : "border-slate-200 bg-white/70",
        )}
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <p className="text-base font-semibold text-slate-950">WisPaper</p>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
              {isZh
                ? '助你一站式完成文献查找、精读分析与知识库搭建，将数天的调研工作量缩减至分钟级。'
                : 'Complete literature discovery, deep reading, analysis, and knowledge-base building in one place, reducing days of research work to minutes.'}
            </p>
            <button
              type="button"
              onClick={() => handleStartSearch()}
              className="mt-5 inline-flex items-center gap-1 font-medium text-slate-950"
            >
              {isZh ? '免费开始搜索论文' : 'Start Searching'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">Feature</p>
              <div className="mt-4 space-y-3 text-sm text-slate-500">
                {[{ key: 'search' as const, label: 'Scholar Search' }, ...featureMenuItems].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActivePage(item.key)}
                    className="block transition hover:text-slate-950"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">Resources</p>
              <div className="mt-4 space-y-3 text-sm text-slate-500">
                {resourceMenuItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActivePage(item.key)}
                    className="block transition hover:text-slate-950"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">Pricing</p>
              <div className="mt-4 space-y-3 text-sm text-slate-500">
                {footerSections.pricing.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActivePage(item.key)}
                    className="block transition hover:text-slate-950"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">Contact</p>
              <div className="mt-4 flex items-center gap-3 text-slate-500">
                {[
                  { label: 'GitHub', icon: Github },
                  { label: 'LinkedIn', icon: Linkedin },
                  { label: 'X', icon: Twitter },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      aria-label={item.label}
                      title={item.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-500 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-slate-200/70 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{isZh ? '© 2026 WisPaper. All rights reserved.' : '© 2026 WisPaper. All rights reserved.'}</p>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => setActivePage('privacy-policy')} className="transition hover:text-slate-950">
              Privacy Policy
            </button>
            <button type="button" onClick={() => setActivePage('terms-of-use')} className="transition hover:text-slate-950">
              Terms of Use
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
