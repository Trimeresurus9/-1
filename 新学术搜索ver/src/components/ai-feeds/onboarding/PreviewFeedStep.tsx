import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, EyeOff, RotateCcw, Sparkles } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';
import { cn } from '../../ui/utils';
import { useLanguage } from '../../../contexts/LanguageContext';
import { PaperPreviewPanel } from '../PaperPreviewPanel';
import { OnboardingTrendPreviewDrawer } from './OnboardingTrendPreviewDrawer';
import { trendStageStyles } from '../trendStageStyles';
import { feedActionClassName, feedMetaClassName, feedMutedNoteClassName, feedPanelClassName, feedSectionDescriptionClassName, feedSectionTitleClassName, feedSurfaceClassName } from '../feedStyles';
import type { AITrendItem } from '../../../data/mockAiFeeds';
import type { FeedPaperItem } from '../RecommendedPapers';

export function PreviewFeedStep({
  status,
  tags,
  trends,
  papers,
  savedPaperIds,
  onToggleSave,
  onBack,
  onRetry,
  onContinue,
}: {
  status: 'loading' | 'ready' | 'empty' | 'error';
  tags: string[];
  trends: AITrendItem[];
  papers: FeedPaperItem[];
  savedPaperIds: Set<string>;
  onToggleSave: (paperId: string) => void;
  onBack: () => void;
  onRetry: () => void;
  onContinue: () => void;
}) {
  const { t } = useLanguage();
  const [selectedTrend, setSelectedTrend] = useState<AITrendItem | null>(null);
  const [trendOpen, setTrendOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<FeedPaperItem | null>(null);
  const [paperOpen, setPaperOpen] = useState(false);
  const [hiddenPaperIds, setHiddenPaperIds] = useState<Set<string>>(new Set());
  const [lastHiddenPaper, setLastHiddenPaper] = useState<FeedPaperItem | null>(null);

  const visiblePapers = useMemo(
    () => papers.filter((paper) => !hiddenPaperIds.has(paper.id)).slice(0, 5),
    [hiddenPaperIds, papers],
  );

  useEffect(() => {
    if (!lastHiddenPaper) {
      return;
    }

    const timer = window.setTimeout(() => setLastHiddenPaper(null), 2600);
    return () => window.clearTimeout(timer);
  }, [lastHiddenPaper]);

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <Card className={`${feedPanelClassName} gap-0`}>
          <CardContent className="flex flex-col gap-4 p-6 md:p-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-700">
              <Sparkles className="h-4 w-4" />
              {t('aiFeeds.onboarding.step4.loadingBadge')}
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-semibold tracking-tight text-foreground">{t('aiFeeds.onboarding.step4.loadingTitle')}</div>
              <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.step4.loadingDescription')}</p>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`trend-preview-skeleton-${index}`} className={`${feedSurfaceClassName} gap-0`}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`paper-preview-skeleton-${index}`} className={`${feedSurfaceClassName} gap-0`}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <Card className={`${feedPanelClassName} gap-0`}>
        <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="space-y-2">
            <div className="text-lg font-semibold text-foreground">{t('aiFeeds.onboarding.step4.errorTitle')}</div>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">{t('aiFeeds.onboarding.step4.errorDescription')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className={feedActionClassName} onClick={onRetry}>
              {t('aiFeeds.retry')}
            </Button>
            <Button type="button" variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              {t('aiFeeds.onboarding.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'empty') {
    return (
      <Card className={`${feedPanelClassName} gap-0`}>
        <CardContent className="space-y-5 p-6 md:p-7">
          <div className="space-y-2">
            <div className="text-lg font-semibold text-foreground">{t('aiFeeds.onboarding.step4.emptyTitle')}</div>
            <p className="text-sm leading-6 text-muted-foreground">{t('aiFeeds.onboarding.step4.emptyDescription')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              t('aiFeeds.onboarding.examples.multimodalReasoning'),
              t('aiFeeds.onboarding.examples.ragEvaluation'),
              t('aiFeeds.onboarding.examples.inverseDesign'),
            ].map((example) => (
              <Badge key={example} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                {example}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              {t('aiFeeds.onboarding.back')}
            </Button>
            <Button type="button" variant="outline" className={feedActionClassName} onClick={onRetry}>
              {t('aiFeeds.retry')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {lastHiddenPaper ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm">
            <div className="text-muted-foreground">
              <span className="font-medium text-foreground">{lastHiddenPaper.title}</span> {t('aiFeeds.onboarding.undoHiddenPaper')}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hover:bg-accent active:scale-[0.98]"
              onClick={() => {
                setHiddenPaperIds((current) => {
                  const next = new Set(current);
                  next.delete(lastHiddenPaper.id);
                  return next;
                });
                setLastHiddenPaper(null);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              {t('aiFeeds.undo')}
            </Button>
          </div>
        ) : null}
        <Card className={`${feedPanelClassName} gap-0`}>
          <CardContent className="flex flex-col gap-4 p-6 md:p-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
              <Sparkles className="h-4 w-4" />
              {t('aiFeeds.onboarding.step4.feedback')}
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-semibold tracking-tight text-foreground">{t('aiFeeds.onboarding.step4.title')}</div>
              <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.step4.description')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 6).map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">{t('aiFeeds.onboarding.step4.refineHint')}</div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className={feedSectionTitleClassName}>{t('aiFeeds.onboarding.step4.trendsTitle')}</h2>
            <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.step4.trendsDescription')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trends.slice(0, 3).map((trend) => (
              <Card
                key={trend.id}
                className={cn(`${feedSurfaceClassName} gap-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md`)}
              >
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="outline" className={`rounded-full px-3 py-1 text-[11px] tracking-[0.12em] ${trendStageStyles[trend.stage]}`}>
                      {trend.stage}
                    </Badge>
                    <div className={feedMetaClassName}>{trend.window}</div>
                  </div>
                  <button type="button" className="space-y-3 text-left" onClick={() => {
                    setSelectedTrend(trend);
                    setTrendOpen(true);
                  }}>
                    <h3 className="text-base font-semibold leading-6 text-foreground">{trend.title}</h3>
                    <p className="text-sm leading-6 text-foreground/80">{trend.summary}</p>
                  </button>
                  <div className="rounded-2xl bg-muted/45 p-3">
                    <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {t('aiFeeds.onboarding.step4.whyRelevant')}
                    </div>
                    <div className={feedMutedNoteClassName}>{trend.relevanceReason}</div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className={feedMetaClassName}>{trend.paperCount} papers</div>
                    <Button type="button" variant="outline" size="sm" className={feedActionClassName} onClick={() => {
                      setSelectedTrend(trend);
                      setTrendOpen(true);
                    }}>
                      {t('aiFeeds.viewTrend')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className={feedSectionTitleClassName}>{t('aiFeeds.onboarding.step4.papersTitle')}</h2>
            <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.step4.papersDescription')}</p>
          </div>
          <div className="space-y-3">
            {visiblePapers.map((paper) => (
              <Card key={paper.id} className={`${feedSurfaceClassName} gap-0 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 transition-all duration-200 hover:border-foreground/15 hover:shadow-sm`}>
                <CardContent className="p-5">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => {
                      setSelectedPaper(paper);
                      setPaperOpen(true);
                    }}
                  >
                    <div className={cn('mb-2 flex flex-wrap items-center gap-2', feedMetaClassName)}>
                      <span>{paper.source}</span>
                      <span>•</span>
                      <span>{paper.date}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold leading-6 text-foreground sm:text-base">{paper.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-foreground/80">{paper.summary}</p>
                  </button>
                  <div className="mt-3 rounded-2xl bg-muted/45 p-3">
                    <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {t('aiFeeds.onboarding.step4.whyRelevant')}
                    </div>
                    <div className={feedMutedNoteClassName}>{paper.relevanceReason}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant={savedPaperIds.has(paper.id) ? 'default' : 'outline'}
                      size="sm"
                      className={cn(savedPaperIds.has(paper.id) ? 'bg-primary hover:bg-primary/90 shadow-sm' : feedActionClassName, 'active:scale-[0.98]')}
                      onClick={() => onToggleSave(paper.id)}
                    >
                      <Bookmark className="h-4 w-4" />
                      {savedPaperIds.has(paper.id) ? t('aiFeeds.savedForLater') : t('aiFeeds.saveForLater')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={feedActionClassName}
                      onClick={() =>
                        setHiddenPaperIds((current) => {
                          const next = new Set(current);
                          next.add(paper.id);
                          setLastHiddenPaper(paper);
                          return next;
                        })
                      }
                    >
                      <EyeOff className="h-4 w-4" />
                      {t('aiFeeds.onboarding.step4.hide')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

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
      </div>

      <OnboardingTrendPreviewDrawer trend={selectedTrend} open={trendOpen} onOpenChange={setTrendOpen} />
      <PaperPreviewPanel paper={selectedPaper} open={paperOpen} onOpenChange={setPaperOpen} />
    </>
  );
}
