import React, { useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, Bookmark, ExternalLink, FileLock2, ListPlus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../ui/utils';
import {
  getTrendPaperPreviewDetail,
  type TrendPaperPreviewDetail,
  type TrendPaperRole,
} from '../../data/mockAiFeeds';
import type { SectionStatus } from './feedState';
import { feedActionClassName, feedMetaClassName } from './feedStyles';
import { useLanguage } from '../../contexts/LanguageContext';

export interface PreviewablePaper {
  id: string;
  previewId?: string;
  title: string;
  authors: string;
  date: string;
  venue: string;
  roleLabel: TrendPaperRole;
}

function getPaperRoleLabel(role: TrendPaperRole, t: (key: string) => string) {
  if (role === 'Foundational') return t('aiFeeds.paperRole.foundational');
  if (role === 'Incremental') return t('aiFeeds.paperRole.incremental');
  if (role === 'Evaluation') return t('aiFeeds.paperRole.evaluation');
  return t('aiFeeds.paperRole.application');
}

const recommendationStyles: Record<TrendPaperPreviewDetail['recommendation'], string> = {
  'Worth a deep read': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Worth skimming': 'border-amber-200 bg-amber-50 text-amber-700',
  'Save for later': 'border-slate-200 bg-slate-100 text-slate-700',
};

function PaperPreviewSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
      </div>
    </div>
  );
}

function PaperPreviewEmpty() {
  const { t } = useLanguage();
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
      {t('aiFeeds.preview.empty')}
    </div>
  );
}

export function PaperPreviewPanel({
  paper,
  open,
  onOpenChange,
  statusOverride = 'ready',
}: {
  paper: PreviewablePaper | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statusOverride?: SectionStatus;
}) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading');
  const [detail, setDetail] = useState<TrendPaperPreviewDetail | null>(null);
  const [saved, setSaved] = useState(false);
  const [queued, setQueued] = useState(false);

  useEffect(() => {
    if (!open || !paper) {
      return;
    }

    if (statusOverride !== 'ready') {
      setStatus(statusOverride === 'error' ? 'empty' : statusOverride);
      setDetail(null);
      return;
    }

    setStatus('loading');
    setDetail(null);
    setSaved(false);
    setQueued(false);
    const timer = window.setTimeout(() => {
      const nextDetail = getTrendPaperPreviewDetail(paper.previewId ?? paper.id);
      setDetail(nextDetail);
      setSaved(nextDetail?.saved ?? false);
      setQueued(nextDetail?.queued ?? false);
      setStatus(nextDetail ? 'ready' : 'empty');
    }, 220);

    return () => window.clearTimeout(timer);
  }, [open, paper?.id, paper?.previewId, statusOverride]);

  const recommendationClassName = useMemo(() => {
    if (!detail) {
      return '';
    }
    return recommendationStyles[detail.recommendation];
  }, [detail]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-2xl border-border/70 p-6">
        {paper ? (
          <div className="space-y-6">
            <DialogHeader className="pr-8 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.12em]">
                  {getPaperRoleLabel(paper.roleLabel, t)}
                </Badge>
                {detail ? (
                  <Badge variant="outline" className={cn('rounded-full px-3 py-1 text-[11px] tracking-[0.12em]', recommendationClassName)}>
                    {detail.recommendation === 'Worth a deep read'
                      ? t('aiFeeds.preview.recommendation.deepRead')
                      : detail.recommendation === 'Worth skimming'
                        ? t('aiFeeds.preview.recommendation.skimming')
                        : t('aiFeeds.preview.recommendation.later')}
                  </Badge>
                ) : null}
              </div>
              <DialogTitle className="text-xl leading-7 break-words text-foreground">{paper.title}</DialogTitle>
              <DialogDescription className={cn('space-y-1 leading-6', feedMetaClassName)}>
                <div>{paper.venue} • {paper.date}</div>
                <div>{paper.authors}</div>
              </DialogDescription>
            </DialogHeader>

            {status === 'loading' ? <PaperPreviewSkeleton /> : null}

            {status === 'empty' ? <PaperPreviewEmpty /> : null}

            {statusOverride === 'error' ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 p-5 text-sm leading-6 text-muted-foreground">
                {t('aiFeeds.preview.unavailable')}
              </div>
            ) : null}

            {status === 'ready' && detail && statusOverride === 'ready' ? (
              <div className="space-y-6">
                <section className="space-y-3">
                  <div className="text-sm font-medium text-foreground">{t('aiFeeds.preview.pdfPreview')}</div>
                  {detail.openAccess ? (
                    <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm">
                      <div className="border-b border-border/70 bg-muted/30 px-4 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {t('aiFeeds.preview.openAccessPdf')}
                      </div>
                      <div className="flex min-h-[220px] items-center justify-center bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] p-6">
                        <div className="w-full max-w-[280px] rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="mb-4 h-3 w-24 rounded bg-slate-200" />
                          <div className="space-y-2">
                            <div className="h-2 rounded bg-slate-100" />
                            <div className="h-2 rounded bg-slate-100" />
                            <div className="h-2 w-4/5 rounded bg-slate-100" />
                          </div>
                          <div className="mt-5 space-y-2">
                            <div className="h-2 rounded bg-slate-100" />
                            <div className="h-2 w-5/6 rounded bg-slate-100" />
                            <div className="h-2 w-3/4 rounded bg-slate-100" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                      <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-500 shadow-sm">
                          <FileLock2 className="h-8 w-8" />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-foreground">{t('aiFeeds.preview.noOpenAccessPdf')}</div>
                          <div className="text-sm leading-6 text-muted-foreground">{t('aiFeeds.preview.noOpenAccessDescription')}</div>
                        </div>
                        <Badge variant="outline" className="rounded-full border-slate-300 bg-white px-3 py-1 text-[11px] tracking-[0.12em] text-slate-600">
                          {t('aiFeeds.preview.noOpenAccessBadge')}
                        </Badge>
                      </div>
                    </div>
                  )}
                </section>

                <section className="space-y-3">
                  <div className="text-sm font-medium text-foreground">{t('aiFeeds.preview.whyInTrend')}</div>
                  <div className="rounded-2xl bg-muted/60 p-4 text-sm leading-6 text-muted-foreground">
                    {detail.whyInTrend}
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="text-sm font-medium text-foreground">{t('aiFeeds.preview.aiSummary')}</div>
                  <div className="space-y-2">
                    {detail.aiSummary.map((paragraph, index) => (
                      <p key={`ai-summary-${paper.id}-${index}`} className="text-sm leading-6 text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <div className="text-sm font-medium text-foreground">{t('aiFeeds.preview.keyTakeaways')}</div>
                  <div className="space-y-2">
                    {detail.keyTakeaways.map((takeaway) => (
                      <div key={takeaway} className="rounded-2xl border border-border/70 px-4 py-3 text-sm leading-6 text-foreground/85">
                        {takeaway}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                  <Button
                    type="button"
                    variant={saved ? 'default' : 'outline'}
                    className={cn(saved ? 'bg-primary hover:bg-primary/90 shadow-sm' : feedActionClassName, 'active:scale-[0.98]')}
                    onClick={() => setSaved((current) => !current)}
                  >
                    <Bookmark className="h-4 w-4" />
                    {saved ? t('aiFeeds.savedForLater') : t('aiFeeds.saveForLater')}
                  </Button>
                  <Button
                    type="button"
                    variant={queued ? 'default' : 'outline'}
                    className={cn(queued ? 'bg-primary hover:bg-primary/90 shadow-sm' : feedActionClassName, 'active:scale-[0.98]')}
                    onClick={() => setQueued((current) => !current)}
                  >
                    <ListPlus className="h-4 w-4" />
                    {queued ? t('aiFeeds.addedToQueue') : t('aiFeeds.addToReadingQueue')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={feedActionClassName}
                    disabled={!detail.openAccess}
                  >
                    <BookOpenCheck className="h-4 w-4" />
                    {detail.openAccess ? t('aiFeeds.viewFullPaper') : t('aiFeeds.preview.noOpenAccessButton')}
                    {detail.openAccess ? <ExternalLink className="h-4 w-4" /> : null}
                  </Button>
                </section>
              </div>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
