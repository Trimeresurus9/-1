import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { feedActionClassName, feedMetaClassName, feedSurfaceClassName } from './feedStyles';
import { useLanguage } from '../../contexts/LanguageContext';

export interface FeedPreferenceState {
  preferNewerPapers: boolean;
  preferBreakthroughs: boolean;
  preferBenchmarks: boolean;
  reduceRepeatedTopics: boolean;
  freshness: 'newest' | 'balanced';
  focusMode: 'papers' | 'papersAndTrends';
  researchStyle: 'breakthroughs' | 'practical';
  explorationMode: 'focused' | 'adjacent';
  sourceSelection: 'arxiv' | 'journals' | 'both';
}

export interface FeedbackSummary {
  followedTrendsCount: number;
  dismissedTrendsCount: number;
  savedPapersCount: number;
}

export function PersonalizationPanel({
  subject,
  tags,
  selectedSourceLabels,
  preferences,
  feedbackSummary,
  isFirstTimeUser = false,
  onRemoveTag,
  onPreferenceChange,
  onReset,
  onManageSetup,
}: {
  subject?: string | null;
  tags: string[];
  selectedSourceLabels: string[];
  preferences: FeedPreferenceState;
  feedbackSummary: FeedbackSummary;
  isFirstTimeUser?: boolean;
  onRemoveTag: (tag: string) => void;
  onPreferenceChange: (key: keyof FeedPreferenceState, value: boolean) => void;
  onReset: () => void;
  onManageSetup: () => void;
}) {
  const { t } = useLanguage();
  const preferenceLabels: Array<{ key: keyof FeedPreferenceState; label: string }> = [
    { key: 'preferNewerPapers', label: t('aiFeeds.preferNewerPapers') },
    { key: 'preferBreakthroughs', label: t('aiFeeds.preferBreakthroughs') },
    { key: 'preferBenchmarks', label: t('aiFeeds.preferBenchmarks') },
    { key: 'reduceRepeatedTopics', label: t('aiFeeds.reduceRepeatedTopics') },
  ];
  return (
    <Card className={`gap-0 ${feedSurfaceClassName} bg-background/95`}>
      <CardHeader className="gap-2 pb-4">
        <CardTitle className="text-base font-semibold text-foreground">{t('aiFeeds.tuneYourFeed')}</CardTitle>
        <p className={feedMetaClassName}>{t('aiFeeds.tuneYourFeedDescription')}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('aiFeeds.subject')}</div>
          <div className="rounded-xl bg-muted/50 px-3 py-3 text-sm leading-6 text-foreground">
            {subject ?? t('aiFeeds.subjectNotSet')}
          </div>
        </section>

        <section className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('aiFeeds.currentFocus')}</div>
          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  <span>{tag}</span>
                  <button
                    type="button"
                    className="ml-1 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => onRemoveTag(tag)}
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-muted/50 px-3 py-3 text-sm leading-6 text-muted-foreground">
              {isFirstTimeUser ? t('aiFeeds.pickTopics') : t('aiFeeds.noInterestTags')}
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('aiFeeds.sources')}</div>
          <div className="rounded-xl bg-muted/50 px-3 py-3 text-sm leading-6 text-foreground">
            {selectedSourceLabels.length
              ? selectedSourceLabels.join(', ')
              : preferences.sourceSelection === 'arxiv'
              ? t('aiFeeds.sourcesArxiv')
              : preferences.sourceSelection === 'journals'
                ? t('aiFeeds.sourcesJournals')
                : t('aiFeeds.sourcesBalanced')}
          </div>
        </section>

        <section className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('aiFeeds.preferences')}</div>
          <div className="space-y-3">
            {preferenceLabels.map((item) => (
              <label key={item.key} className="flex items-center justify-between gap-3 text-sm text-foreground">
                <span>{item.label}</span>
                <Switch
                  checked={preferences[item.key]}
                  onCheckedChange={(checked) => onPreferenceChange(item.key, checked)}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{t('aiFeeds.recentFeedback')}</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-muted/50 px-3 py-3 text-center">
              <div className="text-lg font-semibold text-foreground">{feedbackSummary.followedTrendsCount}</div>
              <div className="text-[11px] leading-4 text-muted-foreground">{t('aiFeeds.followed')}</div>
            </div>
            <div className="rounded-xl bg-muted/50 px-3 py-3 text-center">
              <div className="text-lg font-semibold text-foreground">{feedbackSummary.dismissedTrendsCount}</div>
              <div className="text-[11px] leading-4 text-muted-foreground">{t('aiFeeds.dismissed')}</div>
            </div>
            <div className="rounded-xl bg-muted/50 px-3 py-3 text-center">
              <div className="text-lg font-semibold text-foreground">{feedbackSummary.savedPapersCount}</div>
              <div className="text-[11px] leading-4 text-muted-foreground">{t('aiFeeds.saved')}</div>
            </div>
          </div>
        </section>

        <section className="flex flex-wrap gap-2 border-t border-border/70 pt-4">
          <Button type="button" variant="ghost" size="sm" className="hover:bg-accent active:scale-[0.98]" onClick={onReset}>
            {t('aiFeeds.resetPreferences')}
          </Button>
          <Button type="button" variant="outline" size="sm" className={feedActionClassName} onClick={onManageSetup}>
            {t('aiFeeds.manageInterests')}
          </Button>
        </section>
      </CardContent>
    </Card>
  );
}
