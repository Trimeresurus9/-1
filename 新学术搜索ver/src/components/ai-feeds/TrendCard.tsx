import React from 'react';
import { ArrowUpRight, EyeOff, Files, Plus, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '../ui/utils';
import type { AITrendItem } from '../../data/mockAiFeeds';
import { trendStageStyles } from './trendStageStyles';
import {
  feedActionClassName,
  feedMetaClassName,
  feedMutedNoteClassName,
  feedSurfaceClassName,
} from './feedStyles';
import { useLanguage } from '../../contexts/LanguageContext';

export function TrendCard({
  trend,
  onViewTrend,
  onToggleFollow,
  onDismiss,
  dismissing = false,
}: {
  trend: AITrendItem;
  onViewTrend: () => void;
  onToggleFollow: () => void;
  onDismiss: () => void;
  dismissing?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <Card
      className={cn(
        `group h-full cursor-pointer ${feedSurfaceClassName} transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md`,
        dismissing && 'scale-[0.98] opacity-0',
      )}
      onClick={onViewTrend}
    >
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge
            variant="outline"
            className={cn('rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.12em]', trendStageStyles[trend.stage])}
          >
            {trend.stage}
          </Badge>
          <div className={cn('flex items-center gap-1', feedMetaClassName)}>
            <Files className="h-3.5 w-3.5" />
            <span>{trend.paperCount} papers</span>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <h3 className="text-[15px] font-semibold leading-6 text-foreground sm:text-base">{trend.title}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-foreground/78">{trend.summary}</p>
        </div>

        <div className={cn('mt-4 flex flex-wrap items-center gap-2', feedMetaClassName)}>
          <span className="rounded-full bg-muted px-2.5 py-1 font-medium">{trend.window}</span>
          {trend.keywords.slice(0, 3).map((keyword) => (
            <span key={keyword} className="rounded-full border border-border/70 px-2.5 py-1">
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted/60 px-3 py-2.5">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className={feedMutedNoteClassName}>{trend.relevanceReason}</span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={feedActionClassName}
              onClick={(event) => {
                event.stopPropagation();
                onViewTrend();
              }}
            >
              {t('aiFeeds.viewTrend')}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={trend.followed ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'active:scale-[0.98]',
                trend.followed ? 'bg-primary hover:bg-primary/90 shadow-sm' : feedActionClassName,
              )}
              onClick={(event) => {
                event.stopPropagation();
                onToggleFollow();
              }}
            >
              <Plus className="h-4 w-4" />
              {trend.followed ? t('aiFeeds.following') : t('aiFeeds.follow')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:bg-accent hover:text-foreground active:scale-[0.98]"
              onClick={(event) => {
                event.stopPropagation();
                onDismiss();
              }}
            >
              <EyeOff className="h-4 w-4" />
              {t('aiFeeds.notInterested')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
