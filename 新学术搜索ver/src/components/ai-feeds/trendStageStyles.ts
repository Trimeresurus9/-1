import type { AITrendStage } from '../../data/mockAiFeeds';

export const trendStageStyles: Record<AITrendStage, string> = {
  Emerging: 'border-sky-200 bg-sky-50 text-sky-700',
  Rising: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Breakout: 'border-amber-200 bg-amber-50 text-amber-700',
  Stable: 'border-slate-200 bg-slate-100 text-slate-700',
  Cooling: 'border-rose-200 bg-rose-50 text-rose-700',
};
