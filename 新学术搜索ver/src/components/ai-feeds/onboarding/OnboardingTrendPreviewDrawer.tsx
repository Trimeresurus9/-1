import React, { useMemo } from 'react';
import { ArrowRight, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../ui/sheet';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getAITrendDetail, type AITrendItem } from '../../../data/mockAiFeeds';
import { trendStageStyles } from '../trendStageStyles';
import { feedActionClassName, feedMetaClassName } from '../feedStyles';

export function OnboardingTrendPreviewDrawer({
  trend,
  open,
  onOpenChange,
}: {
  trend: AITrendItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLanguage();
  const detail = useMemo(() => (trend ? getAITrendDetail(trend.id) : null), [trend]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto border-l border-border/70 sm:max-w-2xl">
        {trend ? (
          <div className="flex h-full flex-col">
            <SheetHeader className="space-y-3 border-b border-border/70 p-6 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={`rounded-full px-3 py-1 text-[11px] tracking-[0.12em] ${trendStageStyles[trend.stage]}`}>
                  {trend.stage}
                </Badge>
                <span className={feedMetaClassName}>{trend.window}</span>
              </div>
              <SheetTitle className="pr-10 text-xl leading-7 text-foreground">{trend.title}</SheetTitle>
              <SheetDescription className="pr-10 text-sm leading-6 text-muted-foreground">
                {trend.summary}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 p-6">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>{t('aiFeeds.onboarding.step3.whyRelevant')}</span>
                </div>
                <div className="rounded-2xl bg-muted/50 p-4 text-sm leading-6 text-muted-foreground">
                  {trend.relevanceReason}
                </div>
              </section>

              {detail ? (
                <>
                  <section className="space-y-3">
                    <div className="text-sm font-medium text-foreground">{t('aiFeeds.detail.overview')}</div>
                    <div className="rounded-2xl border border-border/70 bg-background p-4 text-sm leading-6 text-muted-foreground">
                      <p>{detail.definition}</p>
                      {detail.explanation.slice(0, 2).map((paragraph) => (
                        <p key={paragraph} className="mt-3">{paragraph}</p>
                      ))}
                    </div>
                  </section>

                  <section className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border/70 bg-background p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <Lightbulb className="h-4 w-4" />
                        <span>{t('aiFeeds.detail.paperGrowth')}</span>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{detail.paperGrowthSummary}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-background p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{t('aiFeeds.detail.authorSignal')}</span>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{detail.authorSignalSummary}</p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <div className="text-sm font-medium text-foreground">{t('aiFeeds.detail.representativePapers')}</div>
                    <div className="space-y-3">
                      {detail.papers.slice(0, 3).map((paper) => (
                        <div key={paper.id} className="rounded-2xl border border-border/70 bg-background p-4">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{paper.roleLabel}</span>
                            <span>•</span>
                            <span>{paper.venue}</span>
                            <span>•</span>
                            <span>{paper.date}</span>
                          </div>
                          <div className="mt-2 text-sm font-semibold leading-6 text-foreground">{paper.title}</div>
                          <div className="mt-1 text-sm text-muted-foreground">{paper.authors}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : null}
            </div>

            <div className="border-t border-border/70 p-4">
              <Button type="button" variant="outline" className={feedActionClassName} onClick={() => onOpenChange(false)}>
                {t('aiFeeds.viewTrend')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
