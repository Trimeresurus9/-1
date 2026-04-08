import React, { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../ui/utils';
import type { SectionStatus } from './feedState';
import { aiFeedSubjects } from './onboardingHelpers';
import { useLanguage } from '../../contexts/LanguageContext';

export function AIFeedsOnboarding({
  status = 'ready',
  onRetry,
  onComplete,
}: {
  status?: SectionStatus;
  onRetry?: () => void;
  onComplete: (payload: { subjectId: string }) => void;
}) {
  const { t } = useLanguage();
  const [selectedSubjectId, setSelectedSubjectId] = useState(aiFeedSubjects[0]?.id ?? '');

  const selectedSubject = useMemo(
    () => aiFeedSubjects.find((subject) => subject.id === selectedSubjectId) ?? null,
    [selectedSubjectId],
  );

  if (status === 'loading') {
    return (
      <Card className="border-border/70 bg-background shadow-sm">
        <CardContent className="space-y-3 p-6">
          <div className="text-sm font-medium text-foreground">{t('aiFeeds.onboarding.subjectLoadingTitle')}</div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {t('aiFeeds.onboarding.subjectLoadingDescription')}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="border-border/70 bg-background shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">{t('aiFeeds.onboarding.errorTitle')}</div>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {t('aiFeeds.onboarding.errorDescription')}
            </p>
          </div>
          <Button type="button" variant="outline" onClick={onRetry}>
            {t('aiFeeds.retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/70 bg-background shadow-sm">
      <CardContent className="space-y-6 p-6 sm:p-7">
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t('aiFeeds.onboarding.subjectEyebrow')}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {t('aiFeeds.onboarding.subjectTitle')}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {t('aiFeeds.onboarding.subjectDescription')}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {aiFeedSubjects.map((subject) => {
            const selected = subject.id === selectedSubjectId;
            return (
              <button
                key={subject.id}
                type="button"
                className={cn(
                  'rounded-2xl border px-4 py-4 text-left transition-all duration-200',
                  selected
                    ? 'border-foreground/25 bg-foreground/[0.03] shadow-sm'
                    : 'border-border/70 bg-muted/20 hover:border-foreground/15 hover:bg-muted/35',
                )}
                onClick={() => setSelectedSubjectId(subject.id)}
              >
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-foreground">{subject.label}</div>
                  <p className="text-sm leading-6 text-muted-foreground">{subject.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium text-foreground">
              {selectedSubject?.label ?? t('aiFeeds.onboarding.subjectPlaceholder')}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {t('aiFeeds.onboarding.subjectEnterHint')}
            </p>
          </div>
          <Button
            type="button"
            className="min-w-[180px] active:scale-[0.98]"
            onClick={() => selectedSubject && onComplete({ subjectId: selectedSubject.id })}
            disabled={!selectedSubject}
          >
            {t('aiFeeds.onboarding.enter')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
