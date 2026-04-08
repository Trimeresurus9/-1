import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { useLanguage } from '../../../contexts/LanguageContext';
import { feedPanelClassName, feedSectionDescriptionClassName } from '../feedStyles';

export function OnboardingCompleteStep({
  interestsCount,
  trendsCount,
  papersCount,
  onEnterFeed,
  onEditInterests,
}: {
  interestsCount: number;
  trendsCount: number;
  papersCount: number;
  onEnterFeed: () => void;
  onEditInterests: () => void;
}) {
  const { t } = useLanguage();

  return (
    <Card className={`${feedPanelClassName} gap-0`}>
      <CardContent className="space-y-6 p-6 md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-semibold tracking-tight text-foreground">
            {t('aiFeeds.onboarding.complete.title')}
          </div>
          <p className={feedSectionDescriptionClassName}>
            {t('aiFeeds.onboarding.complete.description')}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="text-xl font-semibold text-foreground">{interestsCount}</div>
            <div className="mt-1 text-sm text-muted-foreground">{t('aiFeeds.onboarding.complete.interests')}</div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="text-xl font-semibold text-foreground">{trendsCount}</div>
            <div className="mt-1 text-sm text-muted-foreground">{t('aiFeeds.onboarding.complete.trends')}</div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="text-xl font-semibold text-foreground">{papersCount}</div>
            <div className="mt-1 text-sm text-muted-foreground">{t('aiFeeds.onboarding.complete.papers')}</div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={onEditInterests}>
            <ArrowLeft className="h-4 w-4" />
            {t('aiFeeds.onboarding.complete.editInterests')}
          </Button>
          <Button type="button" onClick={onEnterFeed}>
            {t('aiFeeds.onboarding.complete.enterFeed')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
