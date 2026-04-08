import React from 'react';
import { PauseCircle, PlayCircle, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../contexts/LanguageContext';
import { feedActionClassName, feedSurfaceClassName } from './feedStyles';
import { cn } from '../ui/utils';

export function AIFeedsRunningStatus({
  mode = 'running',
  lastUpdatedLabel,
  creditsUsedToday,
  onPrimaryAction,
  onSecondaryAction,
  secondaryActionDisabled = false,
}: {
  mode?: 'not-started' | 'running' | 'paused-user' | 'paused-system';
  lastUpdatedLabel: string;
  creditsUsedToday: number;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  secondaryActionDisabled?: boolean;
}) {
  const { t } = useLanguage();
  const isNotStarted = mode === 'not-started';
  const isPaused = mode !== 'running';
  const isSystemPaused = mode === 'paused-system';
  const statusLabel = isNotStarted
    ? t('aiFeeds.notStarted.status')
    : isSystemPaused
      ? t('aiFeeds.systemPaused.status')
      : isPaused
        ? t('aiFeeds.paused.status')
        : t('aiFeeds.running.status');
  const reasonLabel = isNotStarted
    ? t('aiFeeds.notStarted.reason')
    : isSystemPaused
      ? t('aiFeeds.systemPaused.reason')
      : isPaused
        ? t('aiFeeds.paused.reason')
        : t('aiFeeds.running.activity');
  const titleLabel = isNotStarted
    ? t('aiFeeds.notStarted.title')
    : isSystemPaused
      ? t('aiFeeds.systemPaused.title')
      : isPaused
        ? t('aiFeeds.paused.title')
        : t('aiFeeds.running.title');
  const descriptionLabel = isNotStarted
    ? t('aiFeeds.notStarted.description')
    : isSystemPaused
      ? t('aiFeeds.systemPaused.description')
      : isPaused
        ? t('aiFeeds.paused.description')
        : t('aiFeeds.running.description');
  const primaryLabel = isNotStarted
    ? t('aiFeeds.notStarted.start')
    : isSystemPaused
      ? t('aiFeeds.systemPaused.manageCredits')
      : isPaused
        ? t('aiFeeds.paused.resume')
        : t('aiFeeds.running.pause');
  const secondaryLabel = isNotStarted
    ? t('aiFeeds.notStarted.editSetup')
    : isSystemPaused
      ? t('aiFeeds.systemPaused.resumeWhenAvailable')
      : null;

  return (
    <Card className={cn('gap-0 rounded-[24px]', feedSurfaceClassName)}>
      <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn('rounded-full px-3 py-1 text-white', isNotStarted ? 'bg-zinc-700 hover:bg-zinc-700' : isSystemPaused ? 'bg-amber-600 hover:bg-amber-600' : isPaused ? 'bg-slate-600 hover:bg-slate-600' : 'bg-emerald-600 hover:bg-emerald-600')}>
              {statusLabel}
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {reasonLabel}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="text-base font-semibold text-foreground">{titleLabel}</div>
            <p className="text-sm leading-6 text-muted-foreground">
              {descriptionLabel}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:min-w-[430px]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-muted/25 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {isNotStarted ? t('aiFeeds.notStarted.lastUpdated') : isSystemPaused ? t('aiFeeds.systemPaused.lastUpdated') : isPaused ? t('aiFeeds.paused.lastUpdated') : t('aiFeeds.running.lastUpdated')}
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">{lastUpdatedLabel}</div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/25 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {isNotStarted ? t('aiFeeds.notStarted.creditsUsed') : isSystemPaused ? t('aiFeeds.systemPaused.creditsUsed') : isPaused ? t('aiFeeds.paused.creditsUsed') : t('aiFeeds.running.creditsUsed')}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-amber-600" />
                {creditsUsedToday}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
            {secondaryLabel && onSecondaryAction ? (
              <Button type="button" variant="ghost" onClick={onSecondaryAction} disabled={secondaryActionDisabled}>
                <PlayCircle className="h-4 w-4" />
                {secondaryLabel}
              </Button>
            ) : null}
            <Button type="button" variant="outline" className={feedActionClassName} onClick={onPrimaryAction}>
              {isNotStarted ? <PlayCircle className="h-4 w-4" /> : isSystemPaused ? <Wallet className="h-4 w-4" /> : isPaused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
              {primaryLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
