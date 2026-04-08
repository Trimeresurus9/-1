import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Plus, Sparkles, Users, X } from 'lucide-react';
import { Drawer, DrawerContent } from '../ui/drawer';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../ui/utils';
import {
  getAITrendDetail,
  type AITrendItem,
  type TrendPaperGroup,
  type TrendRange,
  type TrendRepresentativePaper,
} from '../../data/mockAiFeeds';
import { trendStageStyles } from './trendStageStyles';
import { PaperPreviewPanel } from './PaperPreviewPanel';
import type { SectionStatus } from './feedState';
import { feedActionClassName, feedMetaClassName, feedMutedNoteClassName } from './feedStyles';
import { useLanguage } from '../../contexts/LanguageContext';

const rangeOptions: TrendRange[] = ['7d', '30d', '90d'];
const paperGroups: TrendPaperGroup[] = ['Foundational', 'Latest', 'Highly Relevant'];

function getTrendStageLabel(stage: AITrendItem['stage'], t: (key: string) => string) {
  if (stage === 'Emerging') return t('aiFeeds.trendStage.emerging');
  if (stage === 'Rising') return t('aiFeeds.trendStage.rising');
  if (stage === 'Breakout') return t('aiFeeds.trendStage.breakout');
  if (stage === 'Stable') return t('aiFeeds.trendStage.stable');
  return t('aiFeeds.trendStage.cooling');
}

function getPaperRoleLabel(role: TrendRepresentativePaper['roleLabel'], t: (key: string) => string) {
  if (role === 'Foundational') return t('aiFeeds.paperRole.foundational');
  if (role === 'Incremental') return t('aiFeeds.paperRole.incremental');
  if (role === 'Evaluation') return t('aiFeeds.paperRole.evaluation');
  return t('aiFeeds.paperRole.application');
}

function HeatBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-24 items-end gap-1.5">
      {values.map((value, index) => (
        <div key={`heat-${index}-${value}`} className="flex-1 rounded-full bg-slate-200/90">
          <div
            className="w-full rounded-full bg-slate-900/80 transition-all duration-200"
            style={{ height: `${Math.max(14, (value / max) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function TrendDetailDrawer({
  trend,
  open,
  onOpenChange,
  onToggleFollow,
  onDismiss,
  status = 'ready',
  onRetry,
  onManageInterests,
  paperPreviewStatus = 'ready',
}: {
  trend: AITrendItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFollow: () => void;
  onDismiss: () => void;
  status?: SectionStatus;
  onRetry?: () => void;
  onManageInterests?: () => void;
  paperPreviewStatus?: SectionStatus;
}) {
  const { t } = useLanguage();
  const [selectedRange, setSelectedRange] = useState<TrendRange>('30d');
  const [selectedPaper, setSelectedPaper] = useState<TrendRepresentativePaper | null>(null);
  const [paperDialogOpen, setPaperDialogOpen] = useState(false);

  const detail = useMemo(() => (trend ? getAITrendDetail(trend.id) : null), [trend]);

  useEffect(() => {
    setSelectedRange('30d');
    setSelectedPaper(null);
    setPaperDialogOpen(false);
  }, [trend?.id]);

  const groupedPapers = useMemo(() => {
    if (!detail) {
      return {
        Foundational: [],
        Latest: [],
        'Highly Relevant': [],
      } as Record<TrendPaperGroup, TrendRepresentativePaper[]>;
    }

    return paperGroups.reduce((acc, group) => {
      acc[group] = detail.papers.filter((paper) => paper.group === group);
      return acc;
    }, {} as Record<TrendPaperGroup, TrendRepresentativePaper[]>);
  }, [detail]);

  const heatValues = detail?.heatByRange[selectedRange] ?? [];

  return (
    <>
      <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-full w-full border-l border-border bg-background sm:max-w-2xl">
          {status === 'loading' ? (
            <div className="flex h-full flex-col">
              <div className="space-y-4 border-b border-border px-6 py-5">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="space-y-6 px-6 py-6">
                <Skeleton className="h-28 w-full rounded-2xl" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-28 w-full rounded-2xl" />
                  <Skeleton className="h-28 w-full rounded-2xl" />
                </div>
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            </div>
          ) : null}

          {status === 'empty' ? (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{t('aiFeeds.detail.noDetail')}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t('aiFeeds.detail.noDetailDescription')}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <Button type="button" variant="outline" className={feedActionClassName} onClick={onRetry}>
                  {t('aiFeeds.refresh')}
                </Button>
                <Button type="button" variant="ghost" className="hover:bg-accent active:scale-[0.98]" onClick={onManageInterests}>
                  {t('aiFeeds.manageInterests')}
                </Button>
              </div>
            </div>
          ) : null}

          {status === 'error' ? (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{t('aiFeeds.detail.loadError')}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {t('aiFeeds.detail.loadErrorDescription')}
                </p>
              </div>
              <div className="mt-5">
                <Button type="button" variant="outline" className={feedActionClassName} onClick={onRetry}>
                  {t('aiFeeds.retry')}
                </Button>
              </div>
            </div>
          ) : null}

          {status === 'ready' && trend && detail ? (
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-border/80 px-5 py-5 sm:px-6">
                <div className="space-y-3">
                  <Badge
                    variant="outline"
                    className={cn('w-fit rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.12em]', trendStageStyles[trend.stage])}
                  >
                    {getTrendStageLabel(trend.stage, t)}
                  </Badge>
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold leading-7 text-foreground sm:text-2xl">{trend.title}</h2>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">{detail.definition}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-full hover:bg-accent active:scale-[0.98]"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-7 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                <section className="space-y-3">
                  <div className="text-sm font-medium text-foreground">{t('aiFeeds.detail.overview')}</div>
                  <p className="text-sm leading-6 text-foreground/85">{trend.summary}</p>
                  <div className="space-y-2">
                    {detail.explanation.map((paragraph, index) => (
                      <p key={`explanation-${index}`} className="text-sm leading-6 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-start gap-2 rounded-2xl bg-muted/60 px-4 py-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className={feedMutedNoteClassName}>{trend.relevanceReason}</span>
                  </div>
                </section>

                <Separator />

                <section className="space-y-4">
                  <div className="text-sm font-medium text-foreground">{t('aiFeeds.detail.signals')}</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-muted/60 p-4">
                      <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t('aiFeeds.detail.paperGrowth')}</div>
                      <p className="mt-2 text-sm leading-6 text-foreground/85">{detail.paperGrowthSummary}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/60 p-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {t('aiFeeds.detail.authorSignal')}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-foreground/85">{detail.authorSignalSummary}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trend.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </section>

                <Separator />

                <section className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">{t('aiFeeds.detail.heat')}</div>
                      <p className="text-sm text-muted-foreground">{t('aiFeeds.detail.heatDescription')}</p>
                    </div>
                    <Tabs value={selectedRange} onValueChange={(value) => setSelectedRange(value as TrendRange)} className="gap-0">
                      <TabsList className="rounded-xl border border-border/70 bg-background p-1">
                        {rangeOptions.map((range) => (
                          <TabsTrigger key={range} value={range} className="rounded-lg px-3 py-1.5 text-xs data-[state=active]:shadow-sm">
                            {range}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <HeatBars values={heatValues} />
                  </div>
                </section>

                <Separator />

                <section className="space-y-5">
                  <div className="text-sm font-medium text-foreground">{t('aiFeeds.detail.representativePapers')}</div>
                  {paperGroups.map((group) => (
                    <div key={group} className="space-y-3">
                      <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{group === 'Foundational' ? t('aiFeeds.detail.foundational') : group === 'Latest' ? t('aiFeeds.detail.latest') : t('aiFeeds.detail.highlyRelevant')}</div>
                      <div className="space-y-3">
                        {groupedPapers[group].map((paper) => (
                          <div key={paper.id} className="rounded-2xl border border-border/70 px-4 py-4 transition-colors hover:border-foreground/15">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="space-y-2">
                                <div className="text-sm font-medium leading-6 text-foreground">{paper.title}</div>
                                <div className={feedMetaClassName}>{paper.authors} • {paper.venue} • {paper.date}</div>
                                <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.12em]">
                                  {getPaperRoleLabel(paper.roleLabel, t)}
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className={feedActionClassName}
                                onClick={() => {
                                  setSelectedPaper(paper);
                                  setPaperDialogOpen(true);
                                }}
                              >
                                {t('aiFeeds.openPaper')}
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-4 sm:px-6">
                <Button
                  type="button"
                  variant={trend.followed ? 'default' : 'outline'}
                  className={cn(
                    'active:scale-[0.98]',
                    trend.followed ? 'bg-primary hover:bg-primary/90 shadow-sm' : feedActionClassName,
                  )}
                  onClick={onToggleFollow}
                >
                  {trend.followed ? t('aiFeeds.following') : t('aiFeeds.followTrend')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={feedActionClassName}
                >
                  <Plus className="h-4 w-4" />
                  {t('aiFeeds.addToTracker')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground active:scale-[0.98]"
                  onClick={() => {
                    onDismiss();
                    onOpenChange(false);
                  }}
                >
                  {t('aiFeeds.notInterested')}
                </Button>
              </div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>

      <PaperPreviewPanel
        paper={selectedPaper}
        open={paperDialogOpen}
        onOpenChange={setPaperDialogOpen}
        statusOverride={paperPreviewStatus}
      />
    </>
  );
}
