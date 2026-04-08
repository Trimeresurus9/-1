import React from 'react';
import { ArrowLeft, ArrowRight, BookOpenText, Files, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../ui/utils';
import { useLanguage } from '../../../contexts/LanguageContext';
import { feedPanelClassName, feedSectionDescriptionClassName, feedMetaClassName } from '../feedStyles';
import type { FeedPreferenceState } from '../PersonalizationPanel';

const sourceOptions: Array<{
  value: FeedPreferenceState['sourceSelection'];
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descriptionKey: string;
}> = [
  {
    value: 'arxiv',
    icon: Files,
    titleKey: 'aiFeeds.onboarding.step2.option.arxiv.title',
    descriptionKey: 'aiFeeds.onboarding.step2.option.arxiv.description',
  },
  {
    value: 'moreLater',
    icon: BookOpenText,
    titleKey: 'aiFeeds.onboarding.step2.option.journals.title',
    descriptionKey: 'aiFeeds.onboarding.step2.option.journals.description',
  },
  {
    value: 'balanced',
    icon: Sparkles,
    titleKey: 'aiFeeds.onboarding.step2.option.balanced.title',
    descriptionKey: 'aiFeeds.onboarding.step2.option.balanced.description',
  },
];

export function JournalSelectionStep({
  value,
  onChange,
  onBack,
  onContinue,
}: {
  value: FeedPreferenceState['sourceSelection'] | 'balanced';
  onChange: (value: FeedPreferenceState['sourceSelection'] | 'balanced') => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { t } = useLanguage();

  return (
    <Card className={`${feedPanelClassName} gap-0`}>
      <CardHeader className="gap-2 pb-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t('aiFeeds.onboarding.stepLabel').replace('{n}', '2')}
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
          {t('aiFeeds.onboarding.step2.title')}
        </CardTitle>
        <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.step2.description')}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          {sourceOptions.map((option) => {
            const Icon = option.icon;
            const selected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={cn(
                  'rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-sm',
                  selected
                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                    : 'border-border/70 bg-background',
                )}
                onClick={() => onChange(option.value)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/60 text-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="mt-4 text-sm font-semibold text-foreground">{t(option.titleKey)}</div>
                <div className={cn('mt-2 leading-6', feedMetaClassName)}>{t(option.descriptionKey)}</div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          {t('aiFeeds.onboarding.step2.helper')}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            {t('aiFeeds.onboarding.back')}
          </Button>
          <Button type="button" onClick={onContinue}>
            {t('aiFeeds.onboarding.continue')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
