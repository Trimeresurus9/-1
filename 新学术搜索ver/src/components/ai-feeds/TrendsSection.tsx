import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { TrendCard } from './TrendCard';
import type { AITrendItem } from '../../data/mockAiFeeds';
import type { SectionStatus } from './feedState';
import { useLanguage } from '../../contexts/LanguageContext';

function TrendsSectionSkeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={`trend-skeleton-${index}`} className="border-border/70 bg-background shadow-sm">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TrendsSectionEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed border-border bg-background shadow-sm">
      <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {action ? <div className="mt-5">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

export function TrendsSection({
  title,
  description,
  trends,
  onViewTrend,
  onToggleFollow,
  onDismiss,
  dismissingIds,
  status = 'ready',
  limit,
  columns = 'three',
  onRetry,
  onManageInterests,
}: {
  title: string;
  description: string;
  trends: AITrendItem[];
  onViewTrend: (trend: AITrendItem) => void;
  onToggleFollow: (trendId: string) => void;
  onDismiss: (trendId: string) => void;
  dismissingIds: Set<string>;
  status?: SectionStatus;
  limit?: number;
  columns?: 'two' | 'three';
  onRetry?: () => void;
  onManageInterests?: () => void;
}) {
  const { t } = useLanguage();
  const visibleTrends = typeof limit === 'number' ? trends.slice(0, limit) : trends;
  const gridClassName =
    columns === 'two'
      ? 'grid gap-4 md:grid-cols-2'
      : 'grid gap-4 md:grid-cols-2 2xl:grid-cols-3';

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {status === 'loading' ? <TrendsSectionSkeleton count={limit ?? 6} /> : null}

      {status === 'error' ? (
        <TrendsSectionEmpty
          title={t('aiFeeds.trends.loadingError')}
          description={t('aiFeeds.trends.loadingErrorDescription')}
          action={(
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button type="button" variant="outline" className="border-border/70 hover:bg-accent active:scale-[0.98]" onClick={onRetry}>
                <RefreshCcw className="h-4 w-4" />
              {t('aiFeeds.retry')}
              </Button>
            </div>
          )}
        />
      ) : null}

      {status === 'empty' ? (
        <TrendsSectionEmpty
          title={t('aiFeeds.trends.emptyTitle')}
          description={t('aiFeeds.trends.emptyDescription')}
          action={(
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button type="button" variant="outline" className="border-border/70 hover:bg-accent active:scale-[0.98]" onClick={onRetry}>
                <RefreshCcw className="h-4 w-4" />
                {t('aiFeeds.refresh')}
              </Button>
              <Button type="button" variant="ghost" className="hover:bg-accent active:scale-[0.98]" onClick={onManageInterests}>
                {t('aiFeeds.manageInterests')}
              </Button>
            </div>
          )}
        />
      ) : null}

      {status === 'ready' && visibleTrends.length > 0 ? (
        <div className={gridClassName}>
          {visibleTrends.map((trend) => (
            <TrendCard
              key={trend.id}
              trend={trend}
              dismissing={dismissingIds.has(trend.id)}
              onViewTrend={() => onViewTrend(trend)}
              onToggleFollow={() => onToggleFollow(trend.id)}
              onDismiss={() => onDismiss(trend.id)}
            />
          ))}
        </div>
      ) : null}

      {status === 'ready' && visibleTrends.length === 0 ? (
        <TrendsSectionEmpty
          title={t('aiFeeds.trends.emptyTitle')}
          description={t('aiFeeds.trends.emptyDescription')}
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>{t('aiFeeds.trends.allDismissed')}</span>
              </div>
              <Button type="button" variant="outline" className="border-border/70 hover:bg-accent active:scale-[0.98]" onClick={onRetry}>
                <RefreshCcw className="h-4 w-4" />
                {t('aiFeeds.refresh')}
              </Button>
              <Button type="button" variant="ghost" className="hover:bg-accent active:scale-[0.98]" onClick={onManageInterests}>
                {t('aiFeeds.manageInterests')}
              </Button>
            </div>
          }
        />
      ) : null}
    </section>
  );
}
