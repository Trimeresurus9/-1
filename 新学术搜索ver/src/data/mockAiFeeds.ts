import type { TodayBriefData } from '../components/ai-feeds/TodayBriefBanner';
import type { FeedPaperItem } from '../components/ai-feeds/RecommendedPapers';

export type AITrendStage = 'Emerging' | 'Rising' | 'Breakout' | 'Stable' | 'Cooling';
export type TrendRange = '7d' | '30d' | '90d';
export type TrendPaperGroup = 'Foundational' | 'Latest' | 'Highly Relevant';
export type TrendPaperRole = 'Foundational' | 'Incremental' | 'Evaluation' | 'Application';
export type PaperRecommendation = 'Worth a deep read' | 'Worth skimming' | 'Save for later';

export interface AITrendItem {
  id: string;
  title: string;
  stage: AITrendStage;
  summary: string;
  paperCount: number;
  window: string;
  relevanceReason: string;
  keywords: string[];
  followed: boolean;
}

export interface TrendRepresentativePaper {
  id: string;
  title: string;
  authors: string;
  date: string;
  venue: string;
  roleLabel: TrendPaperRole;
  group: TrendPaperGroup;
}

export interface AITrendDetail {
  id: string;
  definition: string;
  explanation: string[];
  paperGrowthSummary: string;
  authorSignalSummary: string;
  heatByRange: Record<TrendRange, number[]>;
  papers: TrendRepresentativePaper[];
}

export interface TrendPaperPreviewDetail {
  id: string;
  aiSummary: string[];
  keyTakeaways: string[];
  whyInTrend: string;
  recommendation: PaperRecommendation;
  saved: boolean;
  queued: boolean;
  openAccess: boolean;
  fullPaperUrl?: string;
  // TODO: Add abstract, citations, and PDF metadata when real paper detail APIs are available.
}

const trendDetails: Record<string, Omit<AITrendDetail, 'id'>> = {
  'trend-1': {
    definition: 'A research direction focused on keeping model reasoning explicitly tied to retrieved evidence during generation.',
    explanation: [
      'Recent papers are moving beyond retrieval as a preprocessing step and treating evidence grounding as part of the reasoning loop itself.',
      'This makes the trend especially relevant for research assistants that need traceable claims, citation support, and lower hallucination risk.',
      'The work spans retrieval planning, verification-aware decoding, and structured evidence attribution.',
    ],
    paperGrowthSummary: 'Paper volume is up sharply this week, with a noticeable cluster of new preprints focusing on grounded long-form reasoning.',
    authorSignalSummary: 'Multiple retrieval and scientific QA labs are converging on similar evaluation setups, which suggests the area is coalescing quickly.',
    heatByRange: {
      '7d': [3, 5, 6, 8, 11, 13, 14],
      '30d': [2, 3, 4, 6, 5, 7, 8, 10, 9, 12],
      '90d': [1, 1, 2, 2, 3, 4, 5, 6, 8, 10],
    },
    papers: [
      { id: 't1-p1', title: 'Grounding Long-Form Scientific Reasoning with Evidence Chains', authors: 'J. Lin et al.', date: '2025-11', venue: 'NeurIPS 2025', roleLabel: 'Foundational', group: 'Foundational' },
      { id: 't1-p2', title: 'Retrieval Plans for Citation-Aware Research Assistants', authors: 'M. Rao et al.', date: '2026-02', venue: 'arXiv', roleLabel: 'Incremental', group: 'Latest' },
      { id: 't1-p3', title: 'Evaluating Traceable Reasoning in Research QA Systems', authors: 'K. Zhou et al.', date: '2026-03', venue: 'ICLR 2026 Workshop', roleLabel: 'Evaluation', group: 'Highly Relevant' },
    ],
  },
  'trend-2': {
    definition: 'A class of agents that jointly interpret text, figures, tables, and document layouts to support research workflows.',
    explanation: [
      'The trend is gaining visibility because literature review workflows increasingly depend on signals outside plain text, especially charts and tables.',
      'Recent systems are integrating multimodal parsing directly into planning loops rather than treating it as a separate preprocessing stage.',
      'That makes these agents more useful for paper review, evidence comparison, and method understanding.',
    ],
    paperGrowthSummary: 'The last month shows accelerating paper output, with more multimodal agent papers appearing in research-tooling venues.',
    authorSignalSummary: 'Document AI groups and agentic workflow teams are both contributing, which broadens the momentum beyond a single niche.',
    heatByRange: {
      '7d': [4, 4, 5, 7, 8, 10, 12],
      '30d': [2, 3, 3, 4, 5, 6, 8, 9, 11, 12],
      '90d': [1, 1, 2, 2, 3, 4, 5, 6, 7, 9],
    },
    papers: [
      { id: 't2-p1', title: 'Multimodal Agents for Research Review and Synthesis', authors: 'A. Chen et al.', date: '2025-10', venue: 'ACL 2025', roleLabel: 'Foundational', group: 'Foundational' },
      { id: 't2-p2', title: 'Figure-and-Table Grounded Planning for Literature Agents', authors: 'L. Park et al.', date: '2026-03', venue: 'arXiv', roleLabel: 'Application', group: 'Latest' },
      { id: 't2-p3', title: 'What Makes Multimodal Research Agents Useful?', authors: 'S. Patel et al.', date: '2026-03', venue: 'CHI 2026', roleLabel: 'Evaluation', group: 'Highly Relevant' },
    ],
  },
  'trend-3': {
    definition: 'An evaluation trend centered on benchmarks and protocols tailored to scientific and research-assistant use cases.',
    explanation: [
      'Generic LLM evaluation is not enough for research workflows that depend on attribution, methodological fidelity, and retrieval robustness.',
      'Recent papers are carving out narrower tasks with clearer grading criteria, especially around faithfulness and reproducibility.',
    ],
    paperGrowthSummary: 'Output is steady rather than explosive, but the volume remains high and evaluation suites are becoming more comprehensive.',
    authorSignalSummary: 'Benchmark builders, scientific QA groups, and infrastructure teams are all publishing into this cluster.',
    heatByRange: {
      '7d': [6, 6, 7, 7, 8, 8, 8],
      '30d': [4, 5, 5, 6, 6, 7, 7, 8, 8, 8],
      '90d': [2, 3, 4, 5, 5, 6, 7, 7, 8, 8],
    },
    papers: [
      { id: 't3-p1', title: 'Benchmarks for Scientific Groundedness in LLMs', authors: 'R. Gupta et al.', date: '2025-08', venue: 'EMNLP 2025', roleLabel: 'Foundational', group: 'Foundational' },
      { id: 't3-p2', title: 'Citation Faithfulness Eval for Research Assistants', authors: 'T. Wu et al.', date: '2026-01', venue: 'arXiv', roleLabel: 'Evaluation', group: 'Latest' },
      { id: 't3-p3', title: 'Task-Specific Evaluation for Paper QA Systems', authors: 'D. Kim et al.', date: '2026-03', venue: 'NAACL 2026', roleLabel: 'Evaluation', group: 'Highly Relevant' },
    ],
  },
  'trend-4': {
    definition: 'A trend applying agentic search-and-optimize loops to inverse design problems in scientific domains.',
    explanation: [
      'The area is early, but several new papers suggest agentic orchestration can reduce the iteration cost of inverse design workflows.',
      'This matters because design loops often need planning across literature, simulation, and candidate selection rather than single-model prediction.',
    ],
    paperGrowthSummary: 'The last week shows a small but noticeable spike from materials and scientific design groups.',
    authorSignalSummary: 'Signals are concentrated in a few labs, which fits the emerging stage but still indicates real movement.',
    heatByRange: {
      '7d': [1, 2, 2, 3, 3, 4, 5],
      '30d': [1, 1, 2, 2, 2, 3, 3, 4, 4, 5],
      '90d': [0, 1, 1, 1, 2, 2, 3, 3, 4, 5],
    },
    papers: [
      { id: 't4-p1', title: 'Agentic Search for Scientific Inverse Design', authors: 'Y. Li et al.', date: '2025-12', venue: 'ICML 2025 Workshop', roleLabel: 'Foundational', group: 'Foundational' },
      { id: 't4-p2', title: 'Planning Design Loops with Literature-Aware Agents', authors: 'E. Davis et al.', date: '2026-03', venue: 'arXiv', roleLabel: 'Application', group: 'Latest' },
      { id: 't4-p3', title: 'Scientific Agent Pipelines for Materials Candidate Selection', authors: 'P. Singh et al.', date: '2026-03', venue: 'Nature Machine Intelligence', roleLabel: 'Application', group: 'Highly Relevant' },
    ],
  },
  'trend-5': {
    definition: 'A line of work on synthesizing large paper collections with long-context and memory-compression techniques.',
    explanation: [
      'This trend matters because review and discovery tasks are increasingly bottlenecked by how much literature a system can hold coherently.',
      'Recent work mixes retrieval, compression, and structured note-taking to keep large evidence sets usable over long sessions.',
    ],
    paperGrowthSummary: 'Paper output continues to rise over the last two weeks, especially around compression-aware review generation.',
    authorSignalSummary: 'Long-context model teams and literature-assistant builders are starting to overlap around this topic.',
    heatByRange: {
      '7d': [3, 4, 4, 5, 7, 8, 9],
      '30d': [2, 2, 3, 4, 4, 5, 6, 7, 8, 9],
      '90d': [1, 1, 2, 3, 3, 4, 5, 6, 7, 8],
    },
    papers: [
      { id: 't5-p1', title: 'Structured Memory for Long Literature Synthesis', authors: 'H. Miller et al.', date: '2025-09', venue: 'ACL 2025', roleLabel: 'Foundational', group: 'Foundational' },
      { id: 't5-p2', title: 'Compression Strategies for Review-Scale Context Windows', authors: 'N. Ito et al.', date: '2026-02', venue: 'arXiv', roleLabel: 'Incremental', group: 'Latest' },
      { id: 't5-p3', title: 'Long-Context Review Agents for Scientific Discovery', authors: 'C. Brown et al.', date: '2026-03', venue: 'KDD 2026', roleLabel: 'Application', group: 'Highly Relevant' },
    ],
  },
  'trend-6': {
    definition: 'A benchmarking trend focused on domain-specific tasks for scientific question answering, planning, and reproducibility.',
    explanation: [
      'Rather than relying on broad leaderboards, recent work narrows evaluation to research tasks with clearer utility signals.',
      'That gives this trend durable value even without breakout-style paper growth.',
    ],
    paperGrowthSummary: 'Growth is moderate, but the number of benchmark-related releases remains consistent.',
    authorSignalSummary: 'Signals are spread across infrastructure and applied research groups, suggesting ongoing institutional interest.',
    heatByRange: {
      '7d': [5, 5, 5, 6, 6, 6, 7],
      '30d': [3, 4, 4, 5, 5, 6, 6, 6, 7, 7],
      '90d': [2, 2, 3, 4, 4, 5, 5, 6, 6, 7],
    },
    papers: [
      { id: 't6-p1', title: 'Task Suites for Scientific Agent Evaluation', authors: 'V. Ross et al.', date: '2025-07', venue: 'EMNLP 2025 Findings', roleLabel: 'Foundational', group: 'Foundational' },
      { id: 't6-p2', title: 'Benchmarking Reproduction Planning Systems', authors: 'I. Lopez et al.', date: '2026-02', venue: 'arXiv', roleLabel: 'Evaluation', group: 'Latest' },
      { id: 't6-p3', title: 'Measuring Research-Workflow Utility Beyond QA', authors: 'B. Zhao et al.', date: '2026-03', venue: 'ICLR 2026', roleLabel: 'Evaluation', group: 'Highly Relevant' },
    ],
  },
  'trend-7': {
    definition: 'A citation-focused generation trend that now increasingly appears as a subproblem within broader groundedness systems.',
    explanation: [
      'The area is cooling as a standalone category because newer papers bundle citation behavior into larger retrieval and verification pipelines.',
      'It is still strategically important where source attribution quality is a product requirement.',
    ],
    paperGrowthSummary: 'Recent paper growth is flattening, with fewer standalone releases than in prior months.',
    authorSignalSummary: 'Labs remain active, but output has shifted toward integration with evidence-grounding stacks.',
    heatByRange: {
      '7d': [4, 4, 3, 3, 3, 2, 2],
      '30d': [6, 6, 5, 5, 4, 4, 4, 3, 3, 2],
      '90d': [8, 8, 7, 6, 5, 5, 4, 4, 3, 2],
    },
    papers: [
      { id: 't7-p1', title: 'Citation-Aware Decoding for Trustworthy Generation', authors: 'Q. Ahmed et al.', date: '2025-06', venue: 'ACL 2025 Findings', roleLabel: 'Foundational', group: 'Foundational' },
      { id: 't7-p2', title: 'Auditing Attribution in Retrieval-Augmented Pipelines', authors: 'F. Green et al.', date: '2026-01', venue: 'arXiv', roleLabel: 'Evaluation', group: 'Latest' },
      { id: 't7-p3', title: 'Source Attribution Quality in Research Assistants', authors: 'M. Taylor et al.', date: '2026-03', venue: 'FAccT 2026', roleLabel: 'Evaluation', group: 'Highly Relevant' },
    ],
  },
  'trend-8': {
    definition: 'A trend linking paper understanding directly to experiment planning, protocol drafting, and executable next-step generation.',
    explanation: [
      'Interest is climbing because teams want systems that move from reading papers to forming actionable experimental plans.',
      'The cluster combines literature understanding, planning, and domain-specific workflow scaffolding.',
      'It is especially relevant to users who work on paper reproduction and experimental design.',
    ],
    paperGrowthSummary: 'The last week shows one of the strongest short-range momentum curves in the feed.',
    authorSignalSummary: 'Signals come from both research-assistant teams and applied labs focused on reproducibility tooling.',
    heatByRange: {
      '7d': [4, 6, 7, 9, 10, 12, 14],
      '30d': [2, 3, 4, 5, 6, 8, 9, 10, 12, 14],
      '90d': [1, 2, 2, 3, 4, 5, 7, 9, 11, 14],
    },
    papers: [
      { id: 't8-p1', title: 'From Papers to Protocols: Planning Experimental Next Steps', authors: 'S. Huang et al.', date: '2025-10', venue: 'ICLR 2025 Workshop', roleLabel: 'Foundational', group: 'Foundational' },
      { id: 't8-p2', title: 'Experiment Copilots for Literature-Driven Planning', authors: 'G. Martin et al.', date: '2026-03', venue: 'arXiv', roleLabel: 'Application', group: 'Latest' },
      { id: 't8-p3', title: 'Paper Reproduction Agents with Structured Planning', authors: 'R. Lee et al.', date: '2026-03', venue: 'CHI 2026', roleLabel: 'Application', group: 'Highly Relevant' },
    ],
  },
};

const trendPaperPreviewDetails: Record<string, TrendPaperPreviewDetail> = {
  't1-p1': {
    id: 't1-p1',
    aiSummary: [
      'This paper frames evidence-grounded reasoning as a first-class modeling problem rather than a post-hoc verification step.',
      'It proposes explicit evidence chains that connect claims to retrieved passages across multi-step generation.',
      'The work is frequently referenced because it establishes the conceptual baseline for later retrieval-grounded reasoning systems.',
    ],
    keyTakeaways: [
      'Introduces evidence chains as a reasoning scaffold.',
      'Shows gains on traceability and factual grounding.',
      'Sets up many of the design choices reused by later papers.',
    ],
    whyInTrend: 'This paper is in the trend because it provides the conceptual foundation for tying reasoning steps to retrieved evidence, which is the core pattern the trend is now expanding.',
    recommendation: 'Worth a deep read',
    saved: false,
    queued: true,
    openAccess: true,
    fullPaperUrl: '#',
  },
  't1-p2': {
    id: 't1-p2',
    aiSummary: [
      'The paper focuses on retrieval planning policies for citation-aware research assistants.',
      'It shifts attention from raw retrieval quality to when and how a system should gather evidence during generation.',
    ],
    keyTakeaways: [
      'Makes retrieval timing an explicit decision.',
      'Improves citation coverage in longer outputs.',
    ],
    whyInTrend: 'It represents a newer systems-oriented branch of the trend, showing how evidence gathering can be orchestrated during the reasoning process.',
    recommendation: 'Worth skimming',
    saved: false,
    queued: false,
    openAccess: false,
  },
  't1-p3': {
    id: 't1-p3',
    aiSummary: [
      'This evaluation paper measures whether reasoning traces are actually supported by retrieved sources.',
      'It matters because the trend is not only about generating grounded outputs, but also about verifying them reliably.',
    ],
    keyTakeaways: [
      'Provides a targeted evaluation setup.',
      'Separates fluent reasoning from supported reasoning.',
      'Useful if you care about trustworthy assistant behavior.',
    ],
    whyInTrend: 'It anchors the evaluation side of the trend by defining how to measure whether retrieval-grounded reasoning is truly traceable.',
    recommendation: 'Worth a deep read',
    saved: true,
    queued: true,
    openAccess: true,
    fullPaperUrl: '#',
  },
};

export const aiFeedsTodayBrief: TodayBriefData = {
  label: 'Today Brief',
  summary:
    'Interest is picking up around multimodal agents, evaluation pipelines, and retrieval-grounded reasoning. Several newly surfaced papers overlap with your recent work areas.',
};

export const aiFeedsAllTrends: AITrendItem[] = [
  {
    id: 'trend-1',
    title: 'Retrieval-Grounded Reasoning',
    stage: 'Rising',
    summary: 'Research is converging on retrieval pipelines that keep reasoning traces source-grounded during long-form generation.',
    paperCount: 18,
    window: 'Last 7 days',
    relevanceReason: 'Because you follow RAG Systems and Scientific Agents.',
    keywords: ['RAG', 'Reasoning', 'Groundedness', 'Scientific QA'],
    followed: true,
  },
  {
    id: 'trend-2',
    title: 'Multimodal Research Agents',
    stage: 'Breakout',
    summary: 'More systems are combining text, figures, tables, and PDFs into agent loops for review and synthesis workflows.',
    paperCount: 24,
    window: 'Last 30 days',
    relevanceReason: 'Because you work on multimodal reading workflows.',
    keywords: ['Agents', 'Multimodal', 'Document AI', 'Review'],
    followed: false,
  },
  {
    id: 'trend-3',
    title: 'Evaluation for Scientific LLMs',
    stage: 'Stable',
    summary: 'Benchmarks for research-domain assistants are becoming more task-specific, reproducible, and citation-sensitive.',
    paperCount: 12,
    window: 'Last 30 days',
    relevanceReason: 'Because you follow evaluation and paper QA topics.',
    keywords: ['Evaluation', 'Benchmarks', 'Citations', 'Scientific QA'],
    followed: true,
  },
  {
    id: 'trend-4',
    title: 'Inverse Design with Scientific Agents',
    stage: 'Emerging',
    summary: 'Agentic loops are being applied to inverse design tasks where search, simulation, and proposal generation are tightly coupled.',
    paperCount: 9,
    window: 'Last 7 days',
    relevanceReason: 'Because you follow Materials and Inverse Design.',
    keywords: ['Inverse Design', 'Agents', 'Materials', 'Optimization'],
    followed: false,
  },
  {
    id: 'trend-5',
    title: 'Long-Context Literature Synthesis',
    stage: 'Rising',
    summary: 'New work focuses on combining retrieval and compression strategies to synthesize very large collections of papers coherently.',
    paperCount: 15,
    window: 'Last 14 days',
    relevanceReason: 'Because you read across large paper collections.',
    keywords: ['Long Context', 'Synthesis', 'Review', 'Compression'],
    followed: false,
  },
  {
    id: 'trend-6',
    title: 'Domain-Specific Research Benchmarks',
    stage: 'Stable',
    summary: 'Teams are shipping narrower but deeper benchmark sets for scientific QA, planning, and reproducibility.',
    paperCount: 11,
    window: 'Last 30 days',
    relevanceReason: 'Because benchmark design overlaps with your evaluation work.',
    keywords: ['Benchmarks', 'Scientific QA', 'Reproducibility', 'Tasks'],
    followed: false,
  },
  {
    id: 'trend-7',
    title: 'Citation-Aware Generation',
    stage: 'Cooling',
    summary: 'The area remains important, but new contributions are shifting toward integrated groundedness pipelines rather than standalone citation models.',
    paperCount: 7,
    window: 'Last 30 days',
    relevanceReason: 'Because you care about source attribution quality.',
    keywords: ['Citations', 'Groundedness', 'Generation', 'Trust'],
    followed: false,
  },
  {
    id: 'trend-8',
    title: 'Interactive Paper-to-Experiment Planning',
    stage: 'Breakout',
    summary: 'A visible cluster of papers is connecting literature understanding with experiment planning and execution scaffolds.',
    paperCount: 20,
    window: 'Last 7 days',
    relevanceReason: 'Because you work on paper reproduction and planning.',
    keywords: ['Experiment Planning', 'Reproduction', 'Agents', 'Papers'],
    followed: true,
  },
];

export function getAITrendDetail(trendId: string): AITrendDetail | null {
  const detail = trendDetails[trendId];
  if (!detail) {
    return null;
  }

  return {
    id: trendId,
    ...detail,
  };
}

export function getTrendPaperPreviewDetail(paperId: string): TrendPaperPreviewDetail | null {
  return trendPaperPreviewDetails[paperId] ?? null;
}

export const aiFeedsRecommendedPapers: FeedPaperItem[] = [
  {
    id: 't1-p1',
    title: 'Grounding Long-Form Scientific Reasoning with Evidence Chains',
    summary: 'Introduces an evidence-chain formulation that keeps multi-step reasoning anchored to retrieved support, improving traceability for research assistants.',
    source: 'NeurIPS 2025',
    venue: 'NeurIPS 2025',
    date: '2025-11',
    authors: 'J. Lin et al.',
    roleLabel: 'Foundational',
    badges: ['Groundedness', 'RAG'],
    relevanceReason: 'Relevant because retrieval-grounded reasoning is one of the strongest signals in your current trend feed.',
    saved: false,
    likeCount: 18,
  },
  {
    id: 't2-p3',
    title: 'What Makes Multimodal Research Agents Useful?',
    summary: 'Studies which multimodal capabilities actually improve research workflows, with emphasis on figures, tables, and evidence comparison tasks.',
    source: 'CHI 2026',
    venue: 'CHI 2026',
    date: '2026-03',
    authors: 'S. Patel et al.',
    roleLabel: 'Evaluation',
    badges: ['Multimodal', 'Evaluation'],
    relevanceReason: 'Relevant because multimodal research agents are breaking out and this paper explains the practical value behind that trend.',
    saved: true,
    likeCount: 27,
    liked: true,
  },
  {
    id: 't3-p3',
    title: 'Task-Specific Evaluation for Paper QA Systems',
    summary: 'Proposes a narrower evaluation protocol for paper QA that measures attribution quality, answer grounding, and benchmark sensitivity.',
    source: 'NAACL 2026',
    venue: 'NAACL 2026',
    date: '2026-03',
    authors: 'D. Kim et al.',
    roleLabel: 'Evaluation',
    badges: ['Paper QA', 'Benchmark'],
    relevanceReason: 'Relevant because your focus areas include paper QA and evaluation-heavy workflows.',
    saved: false,
    likeCount: 14,
  },
  {
    id: 't5-p3',
    title: 'Long-Context Review Agents for Scientific Discovery',
    summary: 'Combines retrieval, compression, and structured memory to support literature synthesis over large paper sets without losing coherence.',
    source: 'KDD 2026',
    venue: 'KDD 2026',
    date: '2026-03',
    authors: 'C. Brown et al.',
    roleLabel: 'Application',
    badges: ['Long Context', 'Review'],
    relevanceReason: 'Relevant because long-context synthesis is rising and directly impacts review-heavy research work.',
    saved: false,
    likeCount: 21,
  },
  {
    id: 't6-p2',
    title: 'Benchmarking Reproduction Planning Systems',
    summary: 'Benchmarks systems that turn papers into actionable reproduction plans, emphasizing fidelity, completeness, and execution readiness.',
    source: 'arXiv',
    venue: 'arXiv',
    date: '2026-02',
    authors: 'I. Lopez et al.',
    roleLabel: 'Evaluation',
    badges: ['Reproducibility', 'Benchmark'],
    relevanceReason: 'Relevant because reproduction planning overlaps with the trend cluster around experiment-oriented research assistants.',
    saved: true,
    likeCount: 33,
  },
  {
    id: 't8-p2',
    title: 'Experiment Copilots for Literature-Driven Planning',
    summary: 'Shows how literature understanding can feed directly into draft experiment plans, reducing the gap between reading and execution.',
    source: 'arXiv',
    venue: 'arXiv',
    date: '2026-03',
    authors: 'G. Martin et al.',
    roleLabel: 'Application',
    badges: ['Experiment Planning', 'Agents'],
    relevanceReason: 'Relevant because paper-to-experiment planning is one of the most active breakout directions in the current feed.',
    saved: false,
    likeCount: 24,
  },
];

export const aiFeedsLatestPapers: FeedPaperItem[] = [
  {
    id: 'latest-paper-1',
    title: 'Real-Time Paper Indexing for Research Discovery Agents',
    summary: 'Presents a lightweight indexing pipeline that surfaces newly uploaded papers within minutes and ranks them for discovery-oriented research assistants.',
    source: 'arXiv',
    venue: 'arXiv',
    date: '2026-03',
    authors: 'M. Ortega et al.',
    roleLabel: 'Application',
    badges: ['Indexing', 'Discovery'],
    relevanceReason: 'Recent ingestion and freshness ranking make this a strong fit for the latest-first tab.',
    saved: false,
    likeCount: 11,
  },
  {
    id: 'latest-paper-2',
    title: 'Fast Update Loops for Scholarly Recommendation Systems',
    summary: 'Studies how recommendation systems can update paper rankings incrementally as new metadata, citations, and reader interactions arrive.',
    source: 'WWW 2026',
    venue: 'WWW 2026',
    date: '2026-03',
    authors: 'R. Jensen et al.',
    roleLabel: 'Application',
    badges: ['Recommenders', 'Freshness'],
    relevanceReason: 'It focuses on keeping recommendation feeds responsive to newly arriving signals.',
    saved: false,
    likeCount: 9,
  },
  {
    id: 'latest-paper-3',
    title: 'Streaming Literature Alerts with Topic Drift Awareness',
    summary: 'Introduces a streaming alerting model that accounts for short-term topic drift while preserving relevance for active research agendas.',
    source: 'KDD 2026',
    venue: 'KDD 2026',
    date: '2026-03',
    authors: 'S. Rivera et al.',
    roleLabel: 'Evaluation',
    badges: ['Alerts', 'Topic Drift'],
    relevanceReason: 'Newly surfaced work on freshness-aware alerts fits the latest scan mode.',
    saved: false,
    likeCount: 13,
  },
  {
    id: 'latest-paper-4',
    title: 'Paper Watchlists for Emerging AI Research Threads',
    summary: 'Explores watchlist generation for emerging topics, combining source monitoring with weak supervision from researcher behavior.',
    source: 'NAACL 2026',
    venue: 'NAACL 2026',
    date: '2026-03',
    authors: 'L. Novak et al.',
    roleLabel: 'Application',
    badges: ['Watchlists', 'Emerging Topics'],
    relevanceReason: 'The paper is newly surfaced and tuned for monitoring fast-moving research threads.',
    saved: false,
    likeCount: 8,
  },
  {
    id: 'latest-paper-5',
    title: 'Adaptive Ranking for Newly Uploaded Scientific Papers',
    summary: 'Proposes an adaptive ranking method that balances freshness, venue quality, and user-specific intent when a paper first enters the feed.',
    source: 'SIGIR 2026',
    venue: 'SIGIR 2026',
    date: '2026-03',
    authors: 'T. Wallace et al.',
    roleLabel: 'Foundational',
    badges: ['Ranking', 'Freshness'],
    relevanceReason: 'It directly targets the latest-stage ranking problem for scholarly feeds.',
    saved: false,
    likeCount: 16,
  },
];

export const aiFeedsFocusTags: string[] = [
  'RAG Systems',
  'Scientific Agents',
  'Paper QA',
  'Evaluation',
  'Multimodal Reading',
];
