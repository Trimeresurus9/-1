export type TrendFetchMode = 'success' | 'empty' | 'error';

export interface TrendPaper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  citations: number;
  summary: string;
  relevanceNote: string;
}

export interface TrendRecommendation {
  id: string;
  title: string;
  domain: string;
  stage: 'Emerging' | 'Scaling' | 'Maturing';
  summary: string;
  whyNow: string[];
  signals: string[];
  keywords: string[];
  momentumScore: number;
  weeklyGrowth: number;
  monthlyMentions: number;
  paperCount: number;
  citationVelocity: number;
  updatedAt: string;
  trajectory: number[];
  papers: TrendPaper[];
  following: boolean;
  uninterested: boolean;
}

const trendRecommendations: TrendRecommendation[] = [
  {
    id: 'test-time-adaptation',
    title: 'Test-time adaptation for multimodal foundation models',
    domain: 'Robustness',
    stage: 'Emerging',
    summary:
      'Recent work is shifting from static evaluation to deployment-aware adaptation, especially for multimodal models exposed to domain drift, missing modalities, and low-resource edge environments.',
    whyNow: [
      'Benchmarks are increasingly exposing brittleness under domain shift rather than IID test settings.',
      'Multimodal systems in healthcare and robotics need adaptation without full retraining cycles.',
      'Parameter-efficient adaptation methods make online updates tractable for production teams.',
    ],
    signals: [
      'Growth in workshop submissions on online adaptation and test-time learning.',
      'More papers reporting modality dropout and temporal drift benchmarks.',
      'Open-source repos now bundle adaptation recipes alongside pretrained checkpoints.',
    ],
    keywords: ['TTA', 'multimodal', 'distribution shift', 'parameter-efficient tuning'],
    momentumScore: 91,
    weeklyGrowth: 18,
    monthlyMentions: 126,
    paperCount: 42,
    citationVelocity: 8.7,
    updatedAt: 'Updated 4h ago',
    trajectory: [32, 38, 44, 58, 65, 78, 84],
    papers: [
      {
        id: 'tta-1',
        title: 'Continual Test-Time Adaptation for Vision-Language Models Under Missing Modalities',
        authors: ['M. Han', 'R. Patel', 'Y. Zhou'],
        venue: 'ICLR',
        year: 2026,
        citations: 19,
        summary:
          'Introduces a modality-aware adaptation pipeline that updates lightweight routing parameters while preserving zero-shot behavior on stable examples.',
        relevanceNote: 'Representative because it ties deployment constraints directly to multimodal adaptation objectives.',
      },
      {
        id: 'tta-2',
        title: 'Online Entropy Regularization for Test-Time Alignment in Foundation Models',
        authors: ['J. Kim', 'L. Ortega'],
        venue: 'NeurIPS',
        year: 2025,
        citations: 41,
        summary:
          'Presents a stable optimization recipe for online alignment with bounded forgetting, evaluated on streaming domain shifts.',
        relevanceNote: 'Frequently cited in recent robustness surveys and benchmark leaderboards.',
      },
      {
        id: 'tta-3',
        title: 'Benchmarking Temporal Drift in Multimodal Test-Time Learning',
        authors: ['S. Gupta', 'E. Moore', 'H. Li'],
        venue: 'arXiv',
        year: 2026,
        citations: 7,
        summary:
          'Builds a benchmark suite focused on temporal and sensor drift, highlighting failure modes missed by static test-time adaptation datasets.',
        relevanceNote: 'Useful as a benchmark anchor when planning replication or evaluation work.',
      },
    ],
    following: true,
    uninterested: false,
  },
  {
    id: 'agentic-evaluation',
    title: 'Agentic evaluation for long-horizon research assistants',
    domain: 'Evaluation',
    stage: 'Scaling',
    summary:
      'Evaluation is moving beyond single-turn QA metrics toward multi-step task completion, trace quality, and evidence-grounded decision making for research copilots.',
    whyNow: [
      'Research assistants are now expected to plan, retrieve, compare evidence, and produce artifacts.',
      'Static benchmark scores do not explain failure modes in multi-step academic workflows.',
      'Labs are publishing trace-based evaluation protocols that can be reused for product QA.',
    ],
    signals: [
      'Rise in benchmark releases focused on planning traces and evidence attribution.',
      'Industrial blogs increasingly report evaluator pipelines instead of standalone model scores.',
      'Paper appendices now include task decomposition and rubric design details.',
    ],
    keywords: ['agentic systems', 'benchmarking', 'trace evaluation', 'research assistant'],
    momentumScore: 88,
    weeklyGrowth: 14,
    monthlyMentions: 109,
    paperCount: 35,
    citationVelocity: 7.9,
    updatedAt: 'Updated 7h ago',
    trajectory: [28, 34, 45, 49, 57, 69, 76],
    papers: [
      {
        id: 'agent-1',
        title: 'Evaluating Research Agents with Evidence Trace Fidelity',
        authors: ['A. Chen', 'P. Raman', 'D. Zhao'],
        venue: 'ACL',
        year: 2026,
        citations: 13,
        summary:
          'Defines an evidence trace fidelity metric that scores whether intermediate steps are supported by retrieved sources and whether final outputs preserve those claims.',
        relevanceNote: 'A strong starting paper for product teams designing QA rubrics.',
      },
      {
        id: 'agent-2',
        title: 'Long-Horizon Benchmarks for Scholarly Task Agents',
        authors: ['T. Nguyen', 'B. Singh'],
        venue: 'arXiv',
        year: 2025,
        citations: 31,
        summary:
          'Introduces long-horizon tasks spanning search, synthesis, critique, and structured report generation with human-aligned evaluation dimensions.',
        relevanceNote: 'Representative because it moves evaluation closer to real literature workflows.',
      },
      {
        id: 'agent-3',
        title: 'Rubric-Driven Assessment of Multi-Step Academic Assistants',
        authors: ['C. Martin', 'H. Ito'],
        venue: 'EMNLP Findings',
        year: 2025,
        citations: 22,
        summary:
          'Shows how rubric-driven grading surfaces model differences that are hidden by final-answer-only metrics.',
        relevanceNote: 'Useful if the next step is building a product evaluation loop.',
      },
    ],
    following: false,
    uninterested: false,
  },
  {
    id: 'small-data-medical-vision',
    title: 'Small-data adaptation in medical vision foundation models',
    domain: 'Medical AI',
    stage: 'Scaling',
    summary:
      'A growing cluster of work targets adaptation methods that remain competitive under extremely limited labeled medical imaging data, often with frozen backbones and retrieval support.',
    whyNow: [
      'Clinical teams have strong demand for customization but limited annotation budgets.',
      'Foundation backbones trained on natural images are being re-evaluated for medical transfer.',
      'Retrieval-augmented and prompt-based methods reduce the need for full fine-tuning.',
    ],
    signals: [
      'More challenge tracks explicitly cap labeled examples per site.',
      'Papers increasingly report external validation across hospitals rather than single-site results.',
      'Emerging consensus around parameter-efficient adaptation baselines in radiology benchmarks.',
    ],
    keywords: ['medical imaging', 'few-shot transfer', 'retrieval augmentation', 'external validation'],
    momentumScore: 84,
    weeklyGrowth: 11,
    monthlyMentions: 97,
    paperCount: 29,
    citationVelocity: 6.1,
    updatedAt: 'Updated 10h ago',
    trajectory: [24, 27, 35, 40, 51, 58, 62],
    papers: [
      {
        id: 'med-1',
        title: 'Parameter-Efficient Adaptation of Vision Foundation Models for Cross-Site Radiology',
        authors: ['R. Lopez', 'K. Shen', 'M. Amini'],
        venue: 'MICCAI',
        year: 2025,
        citations: 47,
        summary:
          'Compares LoRA, adapters, and prompt tuning across multiple hospital sites, showing robust gains under strict label budgets.',
        relevanceNote: 'Good anchor paper for cross-site generalization concerns.',
      },
      {
        id: 'med-2',
        title: 'Retrieval-Augmented Few-Shot Classification for Chest Imaging',
        authors: ['N. Ibrahim', 'S. Roy'],
        venue: 'Nature Scientific Reports',
        year: 2026,
        citations: 11,
        summary:
          'Combines retrieval over historical studies with a frozen image-text backbone to improve calibration under sparse supervision.',
        relevanceNote: 'Representative of the retrieval-supported adaptation direction.',
      },
      {
        id: 'med-3',
        title: 'External Validation Protocols for Foundation Models in Medical Imaging',
        authors: ['J. Keller', 'F. Wu'],
        venue: 'arXiv',
        year: 2025,
        citations: 18,
        summary:
          'Argues for deployment-style validation and provides a taxonomy for site, scanner, and prevalence shift evaluation.',
        relevanceNote: 'Useful context when deciding how to benchmark the trend.',
      },
    ],
    following: false,
    uninterested: false,
  },
  {
    id: 'efficient-post-training',
    title: 'Efficient post-training for specialist academic copilots',
    domain: 'LLM Systems',
    stage: 'Maturing',
    summary:
      'The field is converging on compact post-training recipes that improve evidence use, style control, and tool selection without full instruction-tuning pipelines.',
    whyNow: [
      'Product teams want domain-specific assistants without the cost of repeated full SFT cycles.',
      'Post-training methods are now evaluated directly on retrieval and citation quality tasks.',
      'Smaller specialist models are becoming attractive for privacy-sensitive academic deployments.',
    ],
    signals: [
      'More papers compare DPO-style objectives against lightweight supervised refresh stages.',
      'Benchmarks increasingly include citation formatting, evidence selection, and abstention quality.',
      'New open checkpoints target domain-specialized scholarly assistants rather than generic chat.',
    ],
    keywords: ['post-training', 'DPO', 'domain adaptation', 'evidence grounding'],
    momentumScore: 79,
    weeklyGrowth: 9,
    monthlyMentions: 88,
    paperCount: 31,
    citationVelocity: 5.8,
    updatedAt: 'Updated 15h ago',
    trajectory: [22, 26, 30, 38, 44, 52, 59],
    papers: [
      {
        id: 'post-1',
        title: 'Post-Training Academic Assistants with Evidence-Calibrated Preferences',
        authors: ['E. Park', 'V. Rao'],
        venue: 'COLM',
        year: 2026,
        citations: 9,
        summary:
          'Optimizes citation-aware preferences that penalize unsupported claims while preserving concise scientific style.',
        relevanceNote: 'Strong match for scholarly copilots rather than generic assistants.',
      },
      {
        id: 'post-2',
        title: 'Lightweight Domain Post-Training for Retrieval-Centered Language Models',
        authors: ['D. Foster', 'L. Wang'],
        venue: 'NAACL',
        year: 2025,
        citations: 26,
        summary:
          'Shows that small post-training stages can materially improve retrieval tool usage with limited domain data.',
        relevanceNote: 'Representative of practical, lower-cost product adaptation recipes.',
      },
      {
        id: 'post-3',
        title: 'Abstention-Aware Preference Optimization in Scientific QA',
        authors: ['Y. Sato', 'M. Green'],
        venue: 'arXiv',
        year: 2026,
        citations: 6,
        summary:
          'Targets calibrated refusal and uncertainty reporting in scientific question answering settings.',
        relevanceNote: 'Relevant when the trend is framed around reliability instead of raw answer rate.',
      },
    ],
    following: true,
    uninterested: false,
  },
];

export async function fetchTrendRecommendations(
  mode: TrendFetchMode = 'success',
): Promise<TrendRecommendation[]> {
  // TODO: Replace this mock fetch with the real AI Feeds trends API client.
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (mode === 'error') {
    throw new Error('Unable to load trend recommendations.');
  }

  if (mode === 'empty') {
    return [];
  }

  return trendRecommendations.map((trend) => ({
    ...trend,
    papers: trend.papers.map((paper) => ({ ...paper })),
  }));
}
