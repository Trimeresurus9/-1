import React from 'react';
import { Play, Settings2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../contexts/LanguageContext';
import { feedActionClassName, feedSurfaceClassName } from './feedStyles';
import { cn } from '../ui/utils';

export function AIFeedsServiceStart({
  subject,
  interests,
  sources,
  onStart,
  onNotNow,
  onEditSetup,
}: {
  subject: string | null;
  interests: string[];
  sources: string;
  onStart: () => void;
  onNotNow: () => void;
  onEditSetup: () => void;
}) {
  const { t } = useLanguage();
  const servicePoints = [
    t('aiFeeds.serviceStart.point.background'),
    t('aiFeeds.serviceStart.point.credits'),
    t('aiFeeds.serviceStart.point.leavePage'),
    t('aiFeeds.serviceStart.point.pauseAnytime'),
    t('aiFeeds.serviceStart.point.lowCredits'),
  ];

  return (
    <div className="space-y-6">
      <Card className={cn('gap-0 rounded-[28px]', feedSurfaceClassName)}>
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.35fr)_360px] lg:p-7">
          <section className="space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                {t('aiFeeds.serviceStart.eyebrow')}
              </Badge>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {t('aiFeeds.serviceStart.title')}
                </h2>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {t('aiFeeds.serviceStart.description')}
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {t('aiFeeds.serviceStart.disclaimer')}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {servicePoints.map((point) => (
                <div key={point} className="rounded-2xl border border-border/70 bg-muted/25 px-4 py-4 text-sm leading-6 text-foreground/88">
                  {point}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" className="min-w-[180px]" onClick={onStart}>
                <Play className="h-4 w-4" />
                {t('aiFeeds.serviceStart.start')}
              </Button>
              <Button type="button" variant="ghost" onClick={onNotNow}>
                {t('aiFeeds.serviceStart.notNow')}
              </Button>
              <Button type="button" variant="outline" className={feedActionClassName} onClick={onEditSetup}>
                <Settings2 className="h-4 w-4" />
                {t('aiFeeds.serviceStart.editSetup')}
              </Button>
            </div>
          </section>

          <aside className="space-y-4 rounded-[24px] border border-border/70 bg-muted/20 p-5">
            <div className="space-y-1">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {t('aiFeeds.serviceStart.setupTitle')}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {t('aiFeeds.serviceStart.setupDescription')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t('aiFeeds.subject')}</div>
                <div className="mt-1 text-sm font-medium text-foreground">{subject ?? t('aiFeeds.subjectNotSet')}</div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t('aiFeeds.filters.interests')}</div>
                <div className="mt-1 text-sm text-foreground">
                  {interests.length ? interests.join(', ') : t('aiFeeds.serviceStart.notConfigured')}
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t('aiFeeds.filters.sources')}</div>
                <div className="mt-1 text-sm text-foreground">{sources}</div>
              </div>
            </div>
          </aside>
        </CardContent>
      </Card>
    </div>
  );
}
