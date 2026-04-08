import { aiFeedsAllTrends, aiFeedsRecommendedPapers, type AITrendItem } from '../../data/mockAiFeeds';
import type { FeedPaperItem } from './RecommendedPapers';
import type { FeedPreferenceState } from './PersonalizationPanel';

export interface FeedSubject {
  id: string;
  label: string;
  description: string;
  seedTags: string[];
}

export interface FeedFilterSummary {
  subject: string | null;
  interests: string[];
  sources: string[];
}

export interface FeedSourceItem {
  id: string;
  label: string;
  subtitle: string;
  type: 'preprint' | 'journal';
  categories: string[];
  cover: string;
  coverLabel: string;
}

export interface FeedSourceCategory {
  id: string;
  label: string;
}

export const feedSourceCategories: FeedSourceCategory[] = [
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'earth-sciences', label: 'Earth Sciences' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'information-science', label: 'Information Science' },
  { id: 'life-sciences', label: 'Life Sciences' },
  { id: 'materials-science', label: 'Materials Science' },
  { id: 'mathematics', label: 'Mathematics' },
  { id: 'medical-sciences', label: 'Medical Sciences' },
  { id: 'physics', label: 'Physics' },
  { id: 'psychology', label: 'Psychology' },
];

export const feedSourceCatalog: FeedSourceItem[] = [
  {
    id: 'arxiv',
    label: 'arXiv',
    subtitle: 'Latest preprints across fast-moving directions',
    type: 'preprint',
    categories: ['information-science', 'engineering', 'mathematics', 'physics', 'life-sciences', 'materials-science', 'chemistry'],
    cover: 'linear-gradient(160deg, #0f172a, #334155)',
    coverLabel: 'arXiv',
  },
  {
    id: 'nature-machine-intelligence',
    label: 'Nature Machine Intelligence',
    subtitle: 'High-signal journal work in AI and scientific ML',
    type: 'journal',
    categories: ['information-science', 'life-sciences', 'medical-sciences'],
    cover: 'linear-gradient(160deg, #1d4ed8, #60a5fa)',
    coverLabel: 'NMI',
  },
  {
    id: 'neurips-2025',
    label: 'NeurIPS 2025',
    subtitle: 'Top conference papers in machine learning',
    type: 'journal',
    categories: ['information-science', 'mathematics'],
    cover: 'linear-gradient(160deg, #4c1d95, #8b5cf6)',
    coverLabel: 'NIPS',
  },
  {
    id: 'chi-2026',
    label: 'CHI 2026',
    subtitle: 'Human-centered AI and interaction research',
    type: 'journal',
    categories: ['information-science', 'psychology'],
    cover: 'linear-gradient(160deg, #0f766e, #34d399)',
    coverLabel: 'CHI',
  },
  {
    id: 'naacl-2026',
    label: 'NAACL 2026',
    subtitle: 'NLP and language agent research',
    type: 'journal',
    categories: ['information-science'],
    cover: 'linear-gradient(160deg, #9a3412, #fb923c)',
    coverLabel: 'NAACL',
  },
  {
    id: 'kdd-2026',
    label: 'KDD 2026',
    subtitle: 'Applied ML, discovery systems, and data mining',
    type: 'journal',
    categories: ['information-science', 'mathematics'],
    cover: 'linear-gradient(160deg, #7f1d1d, #f87171)',
    coverLabel: 'KDD',
  },
  {
    id: 'iclr-2026',
    label: 'ICLR 2026',
    subtitle: 'Representation learning, foundation models, and optimization',
    type: 'journal',
    categories: ['information-science', 'mathematics'],
    cover: 'linear-gradient(160deg, #1e3a8a, #38bdf8)',
    coverLabel: 'ICLR',
  },
  {
    id: 'cvpr-2026',
    label: 'CVPR 2026',
    subtitle: 'Computer vision, multimodal perception, and visual reasoning',
    type: 'journal',
    categories: ['information-science', 'engineering', 'physics'],
    cover: 'linear-gradient(160deg, #0f172a, #6366f1)',
    coverLabel: 'CVPR',
  },
  {
    id: 'acl-2026',
    label: 'ACL 2026',
    subtitle: 'Core NLP, language models, and alignment research',
    type: 'journal',
    categories: ['information-science'],
    cover: 'linear-gradient(160deg, #7c2d12, #f59e0b)',
    coverLabel: 'ACL',
  },
  {
    id: 'icml-2026',
    label: 'ICML 2026',
    subtitle: 'General machine learning methods and large-scale training',
    type: 'journal',
    categories: ['information-science', 'mathematics'],
    cover: 'linear-gradient(160deg, #14532d, #4ade80)',
    coverLabel: 'ICML',
  },
  {
    id: 'aaai-2026',
    label: 'AAAI 2026',
    subtitle: 'Broad AI research across reasoning, planning, and systems',
    type: 'journal',
    categories: ['information-science', 'engineering'],
    cover: 'linear-gradient(160deg, #581c87, #c084fc)',
    coverLabel: 'AAAI',
  },
  {
    id: 'jama-ai',
    label: 'JAMA AI',
    subtitle: 'Clinical AI applications, evaluation, and medical deployment',
    type: 'journal',
    categories: ['medical-sciences', 'life-sciences'],
    cover: 'linear-gradient(160deg, #7f1d1d, #fb7185)',
    coverLabel: 'JAMA',
  },
  {
    id: 'cell-systems',
    label: 'Cell Systems',
    subtitle: 'Computational biology, systems modeling, and scientific discovery',
    type: 'journal',
    categories: ['life-sciences', 'mathematics', 'medical-sciences'],
    cover: 'linear-gradient(160deg, #134e4a, #2dd4bf)',
    coverLabel: 'CELL',
  },
  {
    id: 'science-robotics',
    label: 'Science Robotics',
    subtitle: 'Embodied systems, robotics benchmarks, and real-world autonomy',
    type: 'journal',
    categories: ['engineering', 'physics', 'information-science'],
    cover: 'linear-gradient(160deg, #111827, #94a3b8)',
    coverLabel: 'ROBO',
  },
];

export const aiFeedSubjects: FeedSubject[] = [
  {
    id: 'computer-science',
    label: 'Computer Science',
    description: 'Agents, multimodal systems, retrieval, evaluation, and research tooling.',
    seedTags: ['Scientific Agents', 'RAG Systems', 'Multimodal', 'Evaluation'],
  },
  {
    id: 'materials-science',
    label: 'Materials Science',
    description: 'Materials discovery, inverse design, and experiment planning.',
    seedTags: ['Materials', 'Inverse Design', 'Experiment Planning'],
  },
  {
    id: 'life-sciences',
    label: 'Life Sciences',
    description: 'Bioinformatics, scientific discovery workflows, and evidence-grounded analysis.',
    seedTags: ['Paper QA', 'Evaluation', 'Scientific Agents'],
  },
  {
    id: 'medicine',
    label: 'Medicine',
    description: 'Medical imaging, clinical evidence, and trustworthy retrieval workflows.',
    seedTags: ['Medical imaging', 'Multimodal', 'RAG Systems'],
  },
  {
    id: 'physics',
    label: 'Physics',
    description: 'Simulation-heavy literature tracking, inverse problems, and benchmarking.',
    seedTags: ['Inverse Design', 'Benchmark', 'Reproducibility'],
  },
  {
    id: 'interdisciplinary-ai',
    label: 'Interdisciplinary AI',
    description: 'Applied AI methods spanning domains, with focus on fast-moving crossovers.',
    seedTags: ['Scientific Agents', 'Multimodal', 'Experiment Planning'],
  },
];

export function getSourceTypeLabel(type: FeedSourceItem['type']) {
  return type === 'preprint' ? 'Preprint' : 'Journal / Venue';
}

export type ResearchProfileGroupKey = 'topics';

export interface ResearchProfileItem {
  id: string;
  label: string;
  group: ResearchProfileGroupKey;
  confidence: number;
  selected: boolean;
  canonicalTopic?: string;
}

export interface ResearchProfileGroup {
  key: ResearchProfileGroupKey;
  items: ResearchProfileItem[];
}

const knownInterestMatchers: Array<{ tag: string; patterns: RegExp[] }> = [
  { tag: 'Materials', patterns: [/materials?/i, /材料/] },
  { tag: 'Inverse Design', patterns: [/inverse design/i, /反向设计/] },
  { tag: 'Multimodal', patterns: [/multimodal/i, /多模态/] },
  { tag: 'Benchmark', patterns: [/benchmark/i, /评测|基准/] },
  { tag: 'RAG Systems', patterns: [/\brag\b/i, /retrieval/i, /检索/] },
  { tag: 'Scientific Agents', patterns: [/agents?/i, /智能体/] },
  { tag: 'Paper QA', patterns: [/paper qa/i, /literature qa/i, /论文问答/] },
  { tag: 'Evaluation', patterns: [/evaluation/i, /评估|评价/] },
  { tag: 'Experiment Planning', patterns: [/experiment/i, /planning/i, /实验规划|实验设计/] },
  { tag: 'Reproducibility', patterns: [/reproduc/i, /复现/] },
];

const groupedMatchers: Array<{
  label: string;
  group: ResearchProfileGroupKey;
  confidence: number;
  canonicalTopic?: string;
  patterns: RegExp[];
}> = [
  { label: 'Multimodal Reasoning', group: 'topics', confidence: 0.95, canonicalTopic: 'Multimodal', patterns: [/multimodal reasoning/i, /多模态推理/] },
  { label: 'Medical Imaging', group: 'topics', confidence: 0.9, canonicalTopic: 'Medical imaging', patterns: [/medical imaging/i, /医学影像/] },
  { label: 'Robotics', group: 'topics', confidence: 0.88, canonicalTopic: 'Robotics', patterns: [/robotics?/i, /机器人/] },
  { label: 'Inverse Design', group: 'topics', confidence: 0.96, canonicalTopic: 'Inverse Design', patterns: [/inverse design/i, /反向设计/] },
  { label: 'Materials Discovery', group: 'topics', confidence: 0.9, canonicalTopic: 'Materials', patterns: [/materials?/i, /材料/] },
  { label: 'LLM Agents', group: 'topics', confidence: 0.93, canonicalTopic: 'Scientific Agents', patterns: [/llm agents?/i, /research agents?/i, /智能体/] },
];

export const recommendedResearchProfileTopics = [
  'I want to conduct experiments related to the LLM benchmark.',
  'AI model distillation without mathematical analysis',
  'I am looking for evaluation papers on retrieval-augmented generation.',
  'Multimodal reasoning for scientific literature review',
  'Medical imaging foundation models for diagnosis support',
  'Agent workflows for paper reproduction and experiment planning',
];

function normalizeToken(token: string) {
  const cleaned = token.trim().replace(/\s+/g, ' ');
  if (!cleaned) {
    return '';
  }

  if (/[A-Z]/.test(cleaned) || /[\u4e00-\u9fff]/.test(cleaned)) {
    return cleaned;
  }

  return cleaned
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function makeProfileItem(
  label: string,
  group: ResearchProfileGroupKey,
  confidence: number,
  canonicalTopic?: string,
): ResearchProfileItem {
  return {
    id: `${group}-${label.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '-')}`,
    label,
    group,
    confidence,
    selected: confidence >= 0.8,
    canonicalTopic,
  };
}

export function getFeedTags(subjectId: string | null, tags: string[]) {
  const subjectTags = aiFeedSubjects.find((subject) => subject.id === subjectId)?.seedTags ?? [];
  return Array.from(new Set([...subjectTags, ...tags]));
}

export function parseInterestInput(input: string): string[] {
  const text = input.trim();
  if (!text) {
    return [];
  }

  const matchedTags = knownInterestMatchers
    .filter((item) => item.patterns.some((pattern) => pattern.test(text)))
    .map((item) => item.tag);

  const freeTokens = text
    .split(/[\n,，;；/、|]+/)
    .map((token) => normalizeToken(token))
    .filter((token) => token.length > 1);

  return Array.from(new Set([...matchedTags, ...freeTokens])).slice(0, 8);
}

export function buildResearchProfile(input: string): ResearchProfileGroup[] {
  const text = input.trim();
  const groups: Record<ResearchProfileGroupKey, ResearchProfileItem[]> = {
    topics: [],
  };

  if (!text) {
    return Object.entries(groups).map(([key, items]) => ({ key: key as ResearchProfileGroupKey, items }));
  }

  const seen = new Set<string>();

  for (const matcher of groupedMatchers) {
    if (matcher.patterns.some((pattern) => pattern.test(text))) {
      const item = makeProfileItem(matcher.label, matcher.group, matcher.confidence, matcher.canonicalTopic);
      if (!seen.has(item.id)) {
        groups[matcher.group].push(item);
        seen.add(item.id);
      }
    }
  }

  return (['topics'] as ResearchProfileGroupKey[]).map((key) => ({
    key,
    items: groups[key].slice(0, 10),
  }));
}

export function getSelectedProfileLabels(groups: ResearchProfileGroup[]): string[] {
  return groups.flatMap((group) => group.items.filter((item) => item.selected).map((item) => item.label));
}

function scoreText(text: string, tags: string[]) {
  const haystack = text.toLowerCase();
  return tags.reduce((score, tag) => {
    const needle = tag.toLowerCase();
    return haystack.includes(needle) ? score + 3 : score;
  }, 0);
}

function matchCount(text: string, tags: string[]) {
  const haystack = text.toLowerCase();
  return tags.reduce((count, tag) => {
    const needle = tag.toLowerCase();
    return haystack.includes(needle) ? count + 1 : count;
  }, 0);
}

function scoreTrend(trend: AITrendItem, tags: string[], preferences: FeedPreferenceState) {
  let score =
    scoreText(`${trend.title} ${trend.summary} ${trend.relevanceReason} ${trend.keywords.join(' ')}`, tags) +
    (trend.followed ? 1 : 0);

  if (preferences.preferBreakthroughs && (trend.stage === 'Breakout' || trend.stage === 'Rising')) {
    score += 2;
  }

  if (preferences.reduceRepeatedTopics) {
    score += new Set(trend.keywords).size / 10;
  }

  if (preferences.sourceSelection === 'arxiv' && (trend.stage === 'Rising' || trend.stage === 'Breakout')) {
    score += 1.5;
  }

  if (preferences.sourceSelection === 'journals' && (trend.stage === 'Stable' || trend.stage === 'Cooling')) {
    score += 1.5;
  }

  return score;
}

function scorePaper(paper: FeedPaperItem, tags: string[], preferences: FeedPreferenceState) {
  let score =
    scoreText(`${paper.title} ${paper.summary} ${paper.relevanceReason} ${paper.badges.join(' ')}`, tags) +
    (paper.saved ? 1 : 0);

  if (preferences.preferBenchmarks && paper.badges.some((badge) => /benchmark/i.test(badge))) {
    score += 2;
  }

  if (preferences.preferNewerPapers && paper.date.startsWith('2026')) {
    score += 2;
  }

  if (preferences.sourceSelection === 'arxiv' && /arxiv/i.test(paper.source)) {
    score += 3;
  }

  if (preferences.sourceSelection === 'journals' && !/arxiv/i.test(paper.source)) {
    score += 3;
  }

  return score;
}

function buildPaperWhyMatches(
  paper: FeedPaperItem,
  subjectLabel: string | null,
  subjectTags: string[],
  interests: string[],
): string[] {
  const searchableText = `${paper.title} ${paper.summary} ${paper.relevanceReason} ${paper.badges.join(' ')} ${paper.source}`;
  const reasons: string[] = [];

  if (subjectLabel && matchCount(searchableText, subjectTags) > 0) {
    reasons.push(`Based on your selected subject: ${subjectLabel}`);
  }

  const matchedInterests = interests.filter((interest) =>
    searchableText.toLowerCase().includes(interest.toLowerCase()),
  );
  if (matchedInterests.length > 0) {
    reasons.push(`Matches your interests in ${matchedInterests.slice(0, 2).join(' and ')}`);
  }

  reasons.push(`From ${paper.source}`);
  return reasons;
}

export function getOnboardingPreview(
  tags: string[],
  preferences: FeedPreferenceState,
  subjectId?: string | null,
  selectedSources: string[] = [],
): {
  trends: AITrendItem[];
  papers: FeedPaperItem[];
  filterSummary: FeedFilterSummary;
} {
  const subject = aiFeedSubjects.find((item) => item.id === (subjectId ?? null)) ?? null;
  const subjectTags = subject?.seedTags ?? [];
  const allTags = getFeedTags(subjectId ?? null, tags);
  const rankedTrends = [...aiFeedsAllTrends].sort(
    (left, right) => scoreTrend(right, allTags, preferences) - scoreTrend(left, allTags, preferences),
  );

  const recalledPapers = aiFeedsRecommendedPapers.filter((paper) => {
    if (selectedSources.length > 0) {
      const mappedSourceId = feedSourceCatalog.find((source) => source.label === paper.source)?.id ?? (paper.source === 'arXiv' ? 'arxiv' : null);
      if (!mappedSourceId || !selectedSources.includes(mappedSourceId)) {
        return false;
      }
    }

    if (preferences.sourceSelection === 'arxiv' && !/arxiv/i.test(paper.source)) {
      return false;
    }

    if (preferences.sourceSelection === 'journals' && /arxiv/i.test(paper.source)) {
      return false;
    }

    if (!subjectTags.length) {
      return true;
    }

    const searchableText = `${paper.title} ${paper.summary} ${paper.relevanceReason} ${paper.badges.join(' ')}`;
    const subjectMatch = matchCount(searchableText, subjectTags);
    if (subjectMatch > 0) {
      return true;
    }

    if (tags.length > 0) {
      return matchCount(searchableText, tags) > 0;
    }

    return false;
  });

  const rankedPapers = recalledPapers
    .sort((left, right) => scorePaper(right, allTags, preferences) - scorePaper(left, allTags, preferences))
    .map((paper) => ({
      ...paper,
      whyMatches: buildPaperWhyMatches(paper, subject?.label ?? null, subjectTags, tags),
    }));

  return {
    trends: rankedTrends.slice(0, 3),
    papers: rankedPapers.slice(0, 4),
    filterSummary: {
      subject: subject?.label ?? null,
      interests: tags,
      sources:
        selectedSources.length > 0
          ? selectedSources
              .map((sourceId) => feedSourceCatalog.find((source) => source.id === sourceId)?.label ?? sourceId)
          : preferences.sourceSelection === 'both'
            ? ['arXiv', 'Journals']
            : preferences.sourceSelection === 'arxiv'
              ? ['arXiv']
              : ['Journals'],
    },
  };
}
