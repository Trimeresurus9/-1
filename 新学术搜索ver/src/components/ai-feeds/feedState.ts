export type SectionStatus = 'loading' | 'ready' | 'empty' | 'error';

export interface AIFeedsDemoState {
  onboarding: SectionStatus;
  trends: SectionStatus;
  papers: SectionStatus;
  trendDetail: SectionStatus;
  paperPreview: SectionStatus;
  firstTime: boolean;
  lowCreditsPause: boolean;
  lowCreditsWarning: boolean;
}

function parseStatus(value: string | null): SectionStatus | null {
  if (value === 'loading' || value === 'ready' || value === 'empty' || value === 'error') {
    return value;
  }
  return null;
}

export function getAIFeedsDemoState(search: string): AIFeedsDemoState {
  const params = new URLSearchParams(search);
  const preset = params.get('feedsState');

  const base: AIFeedsDemoState = {
    onboarding: 'ready',
    trends: 'ready',
    papers: 'ready',
    trendDetail: 'ready',
    paperPreview: 'ready',
    firstTime: false,
    lowCreditsPause: false,
    lowCreditsWarning: false,
  };

  if (preset === 'loading') {
    base.onboarding = 'loading';
    base.trends = 'loading';
    base.papers = 'loading';
  } else if (preset === 'empty') {
    base.onboarding = 'empty';
    base.trends = 'empty';
    base.papers = 'empty';
  } else if (preset === 'error') {
    base.onboarding = 'error';
    base.trends = 'error';
    base.papers = 'error';
  } else if (preset === 'first-time') {
    base.firstTime = true;
  }

  return {
    onboarding: parseStatus(params.get('onboardingState')) ?? base.onboarding,
    trends: parseStatus(params.get('trendsState')) ?? base.trends,
    papers: parseStatus(params.get('papersState')) ?? base.papers,
    trendDetail: parseStatus(params.get('trendDetailState')) ?? base.trendDetail,
    paperPreview: parseStatus(params.get('paperPreviewState')) ?? base.paperPreview,
    firstTime: params.get('firstTime') === '1' ? true : base.firstTime,
    lowCreditsPause: params.get('lowCredits') === '1' ? true : base.lowCreditsPause,
    lowCreditsWarning: params.get('lowCreditsWarning') === '1' ? true : base.lowCreditsWarning,
  };
}
