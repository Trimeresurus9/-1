export const onboardingStepIds = ['describe', 'journals', 'review'] as const;

export type OnboardingStepId = typeof onboardingStepIds[number];

export const onboardingStepMeta: Array<{
  id: OnboardingStepId;
  titleKey: string;
  shortKey: string;
}> = [
  {
    id: 'describe',
    titleKey: 'aiFeeds.onboarding.step1.title',
    shortKey: 'aiFeeds.onboarding.step1.short',
  },
  {
    id: 'journals',
    titleKey: 'aiFeeds.onboarding.step2.title',
    shortKey: 'aiFeeds.onboarding.step2.short',
  },
  {
    id: 'review',
    titleKey: 'aiFeeds.onboarding.step3.title',
    shortKey: 'aiFeeds.onboarding.step3.short',
  },
];
