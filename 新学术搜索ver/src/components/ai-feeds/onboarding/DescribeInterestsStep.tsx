import React, { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Textarea } from '../../ui/textarea';
import { cn } from '../../ui/utils';
import { useLanguage } from '../../../contexts/LanguageContext';
import { feedPanelClassName, feedSectionDescriptionClassName } from '../feedStyles';

const examplePromptKeys = [
  'aiFeeds.onboarding.examples.multimodalReasoning',
  'aiFeeds.onboarding.examples.llmAgents',
  'aiFeeds.onboarding.examples.ragEvaluation',
  'aiFeeds.onboarding.examples.robotics',
  'aiFeeds.onboarding.examples.medicalImaging',
  'aiFeeds.onboarding.examples.inverseDesign',
];

export function DescribeInterestsStep({
  value,
  onChange,
  onContinue,
  onSkip,
}: {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const { t } = useLanguage();
  const [focused, setFocused] = useState(false);
  const hasValue = value.trim().length > 0;
  const promptChips = useMemo(
    () => examplePromptKeys.map((key) => ({ key, label: t(key) })),
    [t],
  );

  const placeholder = [
    t('aiFeeds.onboarding.step1.placeholder1'),
    t('aiFeeds.onboarding.step1.placeholder2'),
    t('aiFeeds.onboarding.step1.placeholder3'),
  ].join('\n');

  const helperText = hasValue
    ? t('aiFeeds.onboarding.step1.helperFilled')
    : t('aiFeeds.onboarding.step1.helperEmpty');

  const insertPrompt = (prompt: string) => {
    const nextValue = value.trim()
      ? /[,;\n]$/.test(value.trim())
        ? `${value} ${prompt}`
        : `${value}, ${prompt}`
      : prompt;

    onChange(nextValue);
  };

  return (
    <Card className={`${feedPanelClassName} gap-0`}>
      <CardHeader className="gap-3 pb-5 md:pb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t('aiFeeds.onboarding.stepLabel').replace('{n}', '1')}
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
            {t('aiFeeds.onboarding.step1.title')}
          </CardTitle>
          <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.step1.description')}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div
          className={cn(
            'rounded-3xl border bg-background transition-all',
            focused
              ? 'border-primary/40 shadow-[0_0_0_4px_rgba(59,130,246,0.12)]'
              : hasValue
                ? 'border-primary/30 shadow-[0_0_0_4px_rgba(59,130,246,0.08)]'
              : 'border-border/70 hover:border-foreground/15',
          )}
        >
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="min-h-44 rounded-3xl border-0 bg-transparent px-5 py-4 text-[15px] leading-7 shadow-none focus-visible:ring-0"
            placeholder={placeholder}
          />
          <div className="flex items-center justify-between gap-3 border-t border-border/60 px-5 py-3 text-sm">
            <div className={cn('transition-colors', hasValue ? 'text-foreground/75' : 'text-muted-foreground')}>
              {helperText}
            </div>
            <div className="shrink-0 text-xs text-muted-foreground">
              {hasValue ? t('aiFeeds.onboarding.step1.readyState') : t('aiFeeds.onboarding.step1.waitingState')}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t('aiFeeds.onboarding.tryExamples')}
          </div>
          <div className="flex flex-wrap gap-2">
            {promptChips.map(({ key, label }) => {
              return (
                <button
                  key={key}
                  type="button"
                  className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-accent hover:text-foreground active:scale-[0.98]"
                  onClick={() => insertPrompt(label)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
          <Button type="button" variant="ghost" className="justify-center hover:bg-accent active:scale-[0.98]" onClick={onSkip}>
            {t('aiFeeds.onboarding.step1.skipCta')}
          </Button>
          <Button type="button" className="active:scale-[0.98]" onClick={onContinue} disabled={!value.trim()}>
            {t('aiFeeds.onboarding.continue')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
