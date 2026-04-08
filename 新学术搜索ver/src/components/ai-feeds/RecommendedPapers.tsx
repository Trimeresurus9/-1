import React, { useMemo, useState } from 'react';
import { Bookmark, Check, FileLock2, Plus, ThumbsDown, ThumbsUp, TrendingUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { PaperPreviewPanel, type PreviewablePaper } from './PaperPreviewPanel';
import { Skeleton } from '../ui/skeleton';
import type { SectionStatus } from './feedState';
import { getTrendPaperPreviewDetail } from '../../data/mockAiFeeds';
import {
  feedActionClassName,
  feedMetaClassName,
  feedSectionDescriptionClassName,
  feedSectionTitleClassName,
  feedSurfaceClassName,
} from './feedStyles';
import { useLanguage } from '../../contexts/LanguageContext';
import type { FeedFilterSummary } from './onboardingHelpers';

export interface FeedPaperItem extends PreviewablePaper {
  id: string;
  title: string;
  summary: string;
  source: string;
  badges: string[];
  relevanceReason: string;
  saved?: boolean;
  likeCount?: number;
  liked?: boolean;
  dislikeCount?: number;
  disliked?: boolean;
  whyMatches?: string[];
}

function PreviewDocumentSheet({ paper, compact = false }: { paper: FeedPaperItem; compact?: boolean }) {
  const previewLines = [
    paper.summary,
    paper.relevanceReason,
    `${paper.authors} • ${paper.date}`,
  ];

  return (
    <div className={cn('rounded-[18px] border border-border/70 bg-background', compact ? 'px-3 py-3.5' : 'px-4 py-4.5')}>
      <div className={cn(compact ? 'space-y-3' : 'space-y-4')}>
        <div className="space-y-1.5">
          <div className={cn('uppercase tracking-[0.18em] text-muted-foreground', compact ? 'text-[11px]' : 'text-xs')}>{paper.source}</div>
          <div className={cn('line-clamp-2 font-semibold text-foreground', compact ? 'text-sm leading-5' : 'text-base leading-6')}>
            {paper.title}
          </div>
        </div>
        <div className={cn(compact ? 'space-y-1.5' : 'space-y-2')}>
          {previewLines.map((line, index) => (
            <div
              key={`${paper.id}-line-${index}`}
              className={cn('rounded-full bg-muted', compact ? 'h-2' : 'h-2.5')}
              style={{ width: `${100 - index * 12}%` }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {paper.badges.slice(0, 2).map((badge) => (
            <Badge
              key={`${paper.id}-${badge}`}
              variant="secondary"
              className={cn('rounded-full', compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1 text-xs')}
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaperDocumentPreview({ paper }: { paper: FeedPaperItem }) {
  const { t } = useLanguage();
  const previewDetail = useMemo(
    () => getTrendPaperPreviewDetail(paper.previewId ?? paper.id),
    [paper.id, paper.previewId],
  );
  const [hoverState, setHoverState] = useState<{
    active: boolean;
    clientX: number;
    clientY: number;
    relativeX: number;
    relativeY: number;
  }>({
    active: false,
    clientX: 0,
    clientY: 0,
    relativeX: 50,
    relativeY: 50,
  });

  return (
    <>
      <div
        className="relative overflow-hidden rounded-[22px] border border-border/70 bg-white p-3 shadow-sm transition-all duration-200"
        onMouseEnter={(event) => {
          event.stopPropagation();
          const rect = event.currentTarget.getBoundingClientRect();
          setHoverState({
            active: true,
            clientX: event.clientX,
            clientY: event.clientY,
            relativeX: ((event.clientX - rect.left) / rect.width) * 100,
            relativeY: ((event.clientY - rect.top) / rect.height) * 100,
          });
        }}
        onMouseMove={(event) => {
          event.stopPropagation();
          const rect = event.currentTarget.getBoundingClientRect();
          setHoverState({
            active: true,
            clientX: event.clientX,
            clientY: event.clientY,
            relativeX: ((event.clientX - rect.left) / rect.width) * 100,
            relativeY: ((event.clientY - rect.top) / rect.height) * 100,
          });
        }}
        onMouseLeave={() => {
          setHoverState((current) => ({ ...current, active: false }));
        }}
      >
        {previewDetail?.openAccess === false ? (
          <div className="flex min-h-[176px] flex-col items-center justify-center gap-3 rounded-[18px] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-500 shadow-sm">
              <FileLock2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-foreground">{t('aiFeeds.preview.noOpenAccessPdf')}</div>
              <div className="text-xs leading-5 text-muted-foreground">{t('aiFeeds.preview.noOpenAccessDescription')}</div>
            </div>
            <Badge variant="outline" className="rounded-full border-slate-300 bg-white px-3 py-1 text-[11px] tracking-[0.12em] text-slate-600">
              {t('aiFeeds.preview.noOpenAccessBadge')}
            </Badge>
          </div>
        ) : (
          <PreviewDocumentSheet paper={paper} compact />
        )}
      </div>

      {hoverState.active && previewDetail?.openAccess !== false ? (
        <div
          className="pointer-events-none fixed z-50 hidden rounded-[28px] border border-border/80 bg-white/96 p-3 shadow-2xl backdrop-blur-sm lg:block"
          style={{
            left: Math.min(hoverState.clientX + 28, window.innerWidth - 620),
            top: Math.max(24, Math.min(hoverState.clientY - 220, window.innerHeight - 560)),
            width: Math.min(560, Math.round(window.innerWidth * 0.3)),
          }}
        >
          <div className="mb-2 px-1">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{t('aiFeeds.preview.zoom')}</div>
          </div>
          <div className="overflow-hidden rounded-[22px] border border-border/70 bg-background">
            <div
              style={{
                transform: 'scale(1.85)',
                transformOrigin: `${hoverState.relativeX}% ${hoverState.relativeY}%`,
              }}
              className="transition-transform duration-75"
            >
              <PreviewDocumentSheet paper={paper} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getSourceQuartileLabel(source: string) {
  const normalizedSource = source.toLowerCase();

  if (normalizedSource.includes('arxiv')) {
    return null;
  }

  if (normalizedSource.includes('naacl')) {
    return 'JCR Q2';
  }

  if (
    normalizedSource.includes('neurips') ||
    normalizedSource.includes('chi') ||
    normalizedSource.includes('kdd') ||
    normalizedSource.includes('www') ||
    normalizedSource.includes('sigir')
  ) {
    return 'JCR Q1';
  }

  return 'JCR Q1';
}

function formatPaperGroupDate(date: string) {
  const trimmed = date.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-');
    return `${year} - ${month} - ${day}`;
  }

  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const [year, month] = trimmed.split('-');
    return `${year} - ${month} - 01`;
  }

  if (/^\d{4}$/.test(trimmed)) {
    return `${trimmed} - 01 - 01`;
  }

  return trimmed;
}

export function RecommendedPapers({
  papers,
  filterSummary,
  savedPaperIds,
  selectedInterests,
  onToggleSave,
  onAddInterest,
  title,
  description,
  showHeader = true,
  showFilterSummary = true,
  actionSlot,
  status = 'ready',
  onRefresh,
  onManageInterests,
  onResetFilters,
  dailyCreditsUsed = 0,
  showDateDividers = true,
  showCreditsInDateDivider = true,
}: {
  papers: FeedPaperItem[];
  filterSummary: FeedFilterSummary;
  savedPaperIds: Set<string>;
  selectedInterests: string[];
  onToggleSave: (paperId: string) => void;
  onAddInterest: (interest: string) => void;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFilterSummary?: boolean;
  actionSlot?: React.ReactNode;
  status?: SectionStatus;
  onRefresh?: () => void;
  onManageInterests?: () => void;
  onResetFilters?: () => void;
  dailyCreditsUsed?: number;
  showDateDividers?: boolean;
  showCreditsInDateDivider?: boolean;
}) {
  const { t } = useLanguage();
  const [selectedPaper, setSelectedPaper] = useState<FeedPaperItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [expandedInterestId, setExpandedInterestId] = useState<string | null>(null);
  const [likedPaperIds, setLikedPaperIds] = useState<Set<string>>(
    () => new Set(papers.filter((paper) => paper.liked).map((paper) => paper.id)),
  );
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
    () =>
      papers.reduce<Record<string, number>>((accumulator, paper) => {
        accumulator[paper.id] = paper.likeCount ?? 0;
        return accumulator;
      }, {}),
  );
  const [dislikedPaperIds, setDislikedPaperIds] = useState<Set<string>>(
    () => new Set(papers.filter((paper) => paper.disliked).map((paper) => paper.id)),
  );
  const [dislikeCounts, setDislikeCounts] = useState<Record<string, number>>(
    () =>
      papers.reduce<Record<string, number>>((accumulator, paper) => {
        accumulator[paper.id] = paper.dislikeCount ?? 0;
        return accumulator;
      }, {}),
  );

  const handleToggleLike = (paper: FeedPaperItem) => {
    const isLiked = likedPaperIds.has(paper.id);

    setLikedPaperIds((current) => {
      const next = new Set(current);
      if (next.has(paper.id)) {
        next.delete(paper.id);
      } else {
        next.add(paper.id);
      }
      return next;
    });

    setLikeCounts((current) => ({
      ...current,
      [paper.id]: Math.max(0, (current[paper.id] ?? paper.likeCount ?? 0) + (isLiked ? -1 : 1)),
    }));
  };

  const handleToggleDislike = (paper: FeedPaperItem) => {
    const isDisliked = dislikedPaperIds.has(paper.id);

    setDislikedPaperIds((current) => {
      const next = new Set(current);
      if (next.has(paper.id)) {
        next.delete(paper.id);
      } else {
        next.add(paper.id);
      }
      return next;
    });

    setDislikeCounts((current) => ({
      ...current,
      [paper.id]: Math.max(0, (current[paper.id] ?? paper.dislikeCount ?? 0) + (isDisliked ? -1 : 1)),
    }));
  };

  const openPaper = (paper: FeedPaperItem) => {
    setSelectedPaper(paper);
    setPreviewOpen(true);
  };

  const buildInterestId = (paperId: string, badge: string) => `${paperId}:${badge}`;
  const paperGroups = useMemo(() => {
    const groups: Array<{ date: string; papers: FeedPaperItem[] }> = [];
    for (const paper of papers) {
      const lastGroup = groups[groups.length - 1];
      if (!lastGroup || lastGroup.date !== paper.date) {
        groups.push({ date: paper.date, papers: [paper] });
      } else {
        lastGroup.papers.push(paper);
      }
    }
    return groups;
  }, [papers]);

  if (status === 'loading') {
    return (
      <section className="space-y-3">
        {showHeader ? (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className={feedSectionTitleClassName}>{title ?? t('aiFeeds.recommendedPapers.title')}</h2>
              <p className={feedSectionDescriptionClassName}>{description ?? t('aiFeeds.recommendedPapers.loading')}</p>
            </div>
            {actionSlot}
          </div>
        ) : null}
        <div className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={`paper-skeleton-${index}`} className="gap-0 rounded-[24px] border-border/70 bg-background shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-11/12" />
                    <Skeleton className="h-5 w-10/12" />
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-24 rounded-full" />
                      <Skeleton className="h-7 w-24 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-20 rounded-full" />
                      <Skeleton className="h-9 w-28 rounded-full" />
                      <Skeleton className="h-9 w-24 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-[220px] w-full rounded-[22px]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (status === 'empty' || (status === 'ready' && papers.length === 0)) {
    return (
      <section className="space-y-3">
        {showHeader ? (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className={feedSectionTitleClassName}>{title ?? t('aiFeeds.recommendedPapers.title')}</h2>
              <p className={feedSectionDescriptionClassName}>{description ?? t('aiFeeds.recommendedPapers.description')}</p>
            </div>
            {actionSlot}
          </div>
        ) : null}
        {showFilterSummary ? (
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">{t('aiFeeds.filters.subject')}: {filterSummary.subject ?? t('aiFeeds.subjectNotSet')}</Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">{t('aiFeeds.filters.interests')}: {filterSummary.interests.length ? filterSummary.interests.join(', ') : t('aiFeeds.filters.none')}</Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">{t('aiFeeds.filters.sources')}: {filterSummary.sources.join(', ')}</Badge>
          </div>
        ) : null}
        <Card className="gap-0 border-dashed border-border bg-background shadow-sm">
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">{t('aiFeeds.recommendedPapers.empty')}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{t('aiFeeds.recommendedPapers.emptyDescriptionFiltered')}</p>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Button type="button" variant="ghost" className="hover:bg-accent active:scale-[0.98]" onClick={onManageInterests}>
                {t('aiFeeds.resetFilters')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="space-y-3">
        {showHeader ? (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className={feedSectionTitleClassName}>{title ?? t('aiFeeds.recommendedPapers.title')}</h2>
              <p className={feedSectionDescriptionClassName}>{description ?? t('aiFeeds.recommendedPapers.description')}</p>
            </div>
            {actionSlot}
          </div>
        ) : null}
        <Card className="gap-0 border-dashed border-border bg-background shadow-sm">
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">{t('aiFeeds.recommendedPapers.error')}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{t('aiFeeds.recommendedPapers.errorDescription')}</p>
            </div>
            <div className="mt-5">
              <Button type="button" variant="outline" className={feedActionClassName} onClick={onRefresh}>
                {t('aiFeeds.retry')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <>
      <section className="space-y-3">
        {showHeader ? (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className={feedSectionTitleClassName}>{title ?? t('aiFeeds.recommendedPapers.title')}</h2>
              <p className={feedSectionDescriptionClassName}>{description ?? t('aiFeeds.recommendedPapers.description')}</p>
            </div>
            {actionSlot}
          </div>
        ) : null}
        {showFilterSummary ? (
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">{t('aiFeeds.filters.subject')}: {filterSummary.subject ?? t('aiFeeds.subjectNotSet')}</Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">{t('aiFeeds.filters.interests')}: {filterSummary.interests.length ? filterSummary.interests.join(', ') : t('aiFeeds.filters.none')}</Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">{t('aiFeeds.filters.sources')}: {filterSummary.sources.join(', ')}</Badge>
          </div>
        ) : null}

        <div className="space-y-2.5">
          {paperGroups.map((group, groupIndex) => (
            <div key={`paper-group-${group.date}-${groupIndex}`} className="space-y-2.5">
              {showDateDividers ? (
                <div className="flex items-center gap-4 py-1">
                  <div className="h-px flex-1 bg-border/80" />
                  <div className="shrink-0 text-center">
                    <div className="text-xs font-semibold tracking-[0.08em] text-muted-foreground">{formatPaperGroupDate(group.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {groupIndex === 0
                        ? showCreditsInDateDivider
                          ? t('aiFeeds.manageSetup.groupTodayWithCredits', { count: String(group.papers.length), credits: String(dailyCreditsUsed) })
                          : t('aiFeeds.manageSetup.groupToday', { count: String(group.papers.length) })
                        : t('aiFeeds.manageSetup.groupUpdatedCount', { count: String(group.papers.length) })}
                    </div>
                  </div>
                  <div className="h-px flex-1 bg-border/80" />
                </div>
              ) : null}

              {group.papers.map((paper) => (
                <Card
                  key={paper.id}
                  className={cn(
                    `group gap-0 rounded-[24px] ${feedSurfaceClassName} cursor-pointer transition-all duration-200 hover:border-foreground/20 hover:bg-background/95 hover:shadow-md`,
                  )}
                  onClick={() => openPaper(paper)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openPaper(paper);
                    }
                  }}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
                      <div className="min-w-0 space-y-3">
                        <div className="space-y-1.5">
                          <h3 className="line-clamp-2 text-[24px] font-semibold tracking-tight leading-[1.2] text-foreground transition-colors group-hover:text-foreground/88 sm:text-[26px]">
                            {paper.title}
                          </h3>

                          <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm', feedMetaClassName)}>
                            <span>{paper.date}</span>
                            <span className="text-border">•</span>
                            <span className="truncate">{paper.authors}</span>
                            <span className="text-border">•</span>
                            <span>{paper.source}</span>
                            {getSourceQuartileLabel(paper.source) ? (
                              <>
                                <span className="text-border">•</span>
                                <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em]">
                                  {getSourceQuartileLabel(paper.source)}
                                </Badge>
                              </>
                            ) : null}
                          </div>
                        </div>

                        <p className="line-clamp-3 text-[15px] leading-6.5 text-foreground/72">
                          {paper.summary}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {paper.badges.slice(0, 4).map((badge) => (
                            (() => {
                              const normalizedBadge = badge.trim();
                              const chipId = buildInterestId(paper.id, normalizedBadge);
                              const isExpanded = expandedInterestId === chipId;
                              const isSelectedInterest = selectedInterests.includes(normalizedBadge);

                              return (
                                <button
                                  key={`${paper.id}-${badge}`}
                                  type="button"
                                  className={cn(
                                    'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors',
                                    isSelectedInterest
                                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                      : 'border-border/80 bg-muted/35 text-foreground/80 hover:border-foreground/20 hover:bg-muted/60',
                                  )}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    if (isSelectedInterest) {
                                      return;
                                    }
                                    setExpandedInterestId((current) => (current === chipId ? null : chipId));
                                  }}
                                  aria-pressed={isExpanded || isSelectedInterest}
                                >
                                  <span>#{normalizedBadge.toLowerCase().replace(/\s+/g, '-')}</span>
                                  {isSelectedInterest ? (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                      <Check className="h-3.5 w-3.5" />
                                    </span>
                                  ) : isExpanded ? (
                                    <span
                                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        onAddInterest(normalizedBadge);
                                        setExpandedInterestId(null);
                                      }}
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </span>
                                  ) : null}
                                </button>
                              );
                            })()
                          ))}
                        </div>

                        <div className="flex items-end justify-between gap-3 pt-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              type="button"
                              variant={likedPaperIds.has(paper.id) ? 'secondary' : 'outline'}
                              size="sm"
                              className="h-9 rounded-full border-border/70 px-3.5"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleToggleLike(paper);
                              }}
                            >
                              <ThumbsUp className={cn('h-4 w-4', likedPaperIds.has(paper.id) ? 'fill-current' : '')} />
                              {likeCounts[paper.id] ?? paper.likeCount ?? 0}
                            </Button>
                            <Button
                              type="button"
                              variant={dislikedPaperIds.has(paper.id) ? 'secondary' : 'outline'}
                              size="sm"
                              className="h-9 rounded-full border-border/70 px-3.5"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleToggleDislike(paper);
                              }}
                            >
                              <ThumbsDown className={cn('h-4 w-4', dislikedPaperIds.has(paper.id) ? 'fill-current' : '')} />
                              {dislikeCounts[paper.id] ?? paper.dislikeCount ?? 0}
                            </Button>
                            <Button
                              type="button"
                              variant={savedPaperIds.has(paper.id) ? 'secondary' : 'outline'}
                              size="sm"
                              className="h-9 rounded-full border-border/70 px-3.5"
                              onClick={(event) => {
                                event.stopPropagation();
                                onToggleSave(paper.id);
                              }}
                            >
                              <Bookmark className="h-4 w-4" />
                              {t('aiFeeds.bookmark')}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end gap-2.5 lg:justify-end">
                        <div className="w-full max-w-[280px] shrink-0">
                          <PaperDocumentPreview paper={paper} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </section>
      <PaperPreviewPanel paper={selectedPaper} open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}
