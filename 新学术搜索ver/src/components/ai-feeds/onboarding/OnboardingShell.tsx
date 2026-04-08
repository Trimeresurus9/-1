import React from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { cn } from '../../ui/utils';
import { useLanguage } from '../../../contexts/LanguageContext';
import { feedActionClassName, feedPanelClassName, feedSectionDescriptionClassName, feedSectionTitleClassName } from '../feedStyles';
import { onboardingStepMeta, type OnboardingStepId } from './onboardingConfig';
import type { SectionStatus } from '../feedState';

function OnboardingLoadingState() {
  return (
    <Card className={`${feedPanelClassName} overflow-hidden`}>
      <CardContent className="space-y-6 p-6 md:p-8">
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`onboarding-chip-${index}`} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export function OnboardingShell({
  step,
  status,
  onBack,
  onSkip,
  onRetry,
  hideHeaderSkip = false,
  children,
}: {
  step: OnboardingStepId;
  status: SectionStatus;
  onBack?: () => void;
  onSkip?: () => void;
  onRetry?: () => void;
  hideHeaderSkip?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const stepIndex = onboardingStepMeta.findIndex((item) => item.id === step);
  const isFinalStep = stepIndex === onboardingStepMeta.length - 1;

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className={feedSectionTitleClassName}>{t('aiFeeds.onboarding.title')}</div>
            <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.description')}</p>
          </div>
          {onSkip && !hideHeaderSkip ? (
            <Button type="button" variant="ghost" size="sm" className="hover:bg-accent active:scale-[0.98]" onClick={onSkip}>
              {isFinalStep ? t('aiFeeds.onboarding.skipToFeed') : t('aiFeeds.onboarding.skip')}
              {!isFinalStep ? <ArrowRight className="h-4 w-4" /> : null}
            </Button>
          ) : null}
        </div>

        <div className="grid gap-2 sm:grid-cols-4">
          {onboardingStepMeta.map((item, index) => {
            const active = index === stepIndex;
            const completed = index < stepIndex;

            return (
              <div
                key={item.id}
                className={cn(
                  'rounded-2xl border px-4 py-3 transition-colors',
                  completed
                    ? 'border-primary/20 bg-primary/5'
                    : active
                      ? 'border-primary/30 bg-background shadow-sm'
                      : 'border-border/70 bg-muted/35',
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                      completed || active ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground',
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {t('aiFeeds.onboarding.stepLabel').replace('{n}', String(index + 1))}
                    </div>
                    <div className={cn('text-sm font-medium', active || completed ? 'text-foreground' : 'text-muted-foreground')}>
                      {t(item.shortKey)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {status === 'loading' ? <OnboardingLoadingState /> : null}

      {status === 'error' ? (
        <Card className={feedPanelClassName}>
          <CardContent className="p-6 md:p-8">
            <Alert className="border-border/70">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('aiFeeds.onboarding.errorTitle')}</AlertTitle>
              <AlertDescription>
                <p>{t('aiFeeds.onboarding.errorDescription')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" className={feedActionClassName} onClick={onRetry}>
                    {t('aiFeeds.retry')}
                  </Button>
                  {onBack ? (
                    <Button type="button" variant="ghost" className="hover:bg-accent active:scale-[0.98]" onClick={onBack}>
                      <ArrowLeft className="h-4 w-4" />
                      {t('aiFeeds.onboarding.back')}
                    </Button>
                  ) : null}
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ) : null}

      {status === 'empty' ? (
        <Card className={`${feedPanelClassName} border-dashed`}>
          <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-4 p-8 text-center">
            <Loader2 className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-2">
              <div className="text-base font-semibold text-foreground">{t('aiFeeds.onboarding.emptyTitle')}</div>
              <p className="max-w-lg text-sm leading-6 text-muted-foreground">{t('aiFeeds.onboarding.emptyDescription')}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {onBack ? (
                <Button type="button" variant="ghost" className="hover:bg-accent active:scale-[0.98]" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                  {t('aiFeeds.onboarding.back')}
                </Button>
              ) : null}
              <Button type="button" variant="outline" className={feedActionClassName} onClick={onRetry}>
                {t('aiFeeds.retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {status === 'ready' ? children : null}
    </section>
  );
}
