import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn } from '../../ui/utils';
import { feedPanelClassName, feedSectionDescriptionClassName } from '../feedStyles';
import type { FeedPreferenceState } from '../PersonalizationPanel';

const segmentedItemClassName =
  'h-auto min-h-14 flex-1 flex-col items-start gap-1 whitespace-normal rounded-xl border border-transparent bg-background px-4 py-3 text-left data-[state=on]:border-primary/30 data-[state=on]:bg-primary/5 data-[state=on]:text-foreground';

function PreferenceGroup({
  title,
  options,
  value,
  onValueChange,
}: {
  title: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onValueChange(nextValue);
          }
        }}
        variant="outline"
        className="grid w-full grid-cols-1 gap-3 rounded-none border-0 shadow-none sm:grid-cols-2"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} className={segmentedItemClassName}>
            <span className="text-sm font-medium">{option.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </section>
  );
}

export function FineTuneStep({
  preferences,
  onPreferenceChange,
  onBack,
  onComplete,
}: {
  preferences: FeedPreferenceState;
  onPreferenceChange: (nextPreferences: FeedPreferenceState) => void;
  onBack: () => void;
  onComplete: () => void;
}) {
  const { t } = useLanguage();
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    setShowNotice(true);
    const timer = window.setTimeout(() => setShowNotice(false), 1800);
    return () => window.clearTimeout(timer);
  }, [
    preferences.explorationMode,
    preferences.focusMode,
    preferences.freshness,
    preferences.researchStyle,
    preferences.sourceSelection,
  ]);

  const updatePreferences = (patch: Partial<FeedPreferenceState>) => {
    const next = { ...preferences, ...patch };

    next.preferNewerPapers = next.freshness === 'newest';
    next.preferBreakthroughs = next.researchStyle === 'breakthroughs';
    next.reduceRepeatedTopics = next.explorationMode === 'adjacent';

    onPreferenceChange(next);
  };

  return (
    <Card className={`${feedPanelClassName} gap-0`}>
      <CardHeader className="gap-2 pb-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t('aiFeeds.onboarding.stepLabel').replace('{n}', '4')}
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
          {t('aiFeeds.onboarding.step4.title')}
        </CardTitle>
        <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.step4.description')}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {showNotice ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {t('aiFeeds.onboarding.step4.updated')}
          </div>
        ) : null}

        <PreferenceGroup
          title={t('aiFeeds.onboarding.step4.freshness')}
          value={preferences.freshness}
          onValueChange={(value) => updatePreferences({ freshness: value as FeedPreferenceState['freshness'] })}
          options={[
            { value: 'newest', label: t('aiFeeds.onboarding.step4.freshnessNewest') },
            { value: 'balanced', label: t('aiFeeds.onboarding.step4.freshnessBalanced') },
          ]}
        />

        <PreferenceGroup
          title={t('aiFeeds.onboarding.step4.focus')}
          value={preferences.focusMode}
          onValueChange={(value) => updatePreferences({ focusMode: value as FeedPreferenceState['focusMode'] })}
          options={[
            { value: 'papers', label: t('aiFeeds.onboarding.step4.focusPapersOnly') },
            { value: 'papersAndTrends', label: t('aiFeeds.onboarding.step4.focusPapersAndTrends') },
          ]}
        />

        <PreferenceGroup
          title={t('aiFeeds.onboarding.step4.researchStyle')}
          value={preferences.researchStyle}
          onValueChange={(value) => updatePreferences({ researchStyle: value as FeedPreferenceState['researchStyle'] })}
          options={[
            { value: 'breakthroughs', label: t('aiFeeds.onboarding.step4.styleBreakthroughs') },
            { value: 'practical', label: t('aiFeeds.onboarding.step4.stylePractical') },
          ]}
        />

        <PreferenceGroup
          title={t('aiFeeds.onboarding.step4.exploration')}
          value={preferences.explorationMode}
          onValueChange={(value) => updatePreferences({ explorationMode: value as FeedPreferenceState['explorationMode'] })}
          options={[
            { value: 'focused', label: t('aiFeeds.onboarding.step4.explorationFocused') },
            { value: 'adjacent', label: t('aiFeeds.onboarding.step4.explorationAdjacent') },
          ]}
        />

        <Collapsible>
          <div className="rounded-2xl border border-dashed border-border/70 bg-background">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
              <div>
                <div className="text-sm font-semibold text-foreground">{t('aiFeeds.onboarding.step4.sourceSelection')}</div>
                <div className="text-xs leading-5 text-muted-foreground">{t('aiFeeds.onboarding.step4.sourceSelectionDescription')}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t border-border/70 px-4 py-4">
              <PreferenceGroup
                title={t('aiFeeds.onboarding.step4.sourceSelection')}
                value={preferences.sourceSelection}
                onValueChange={(value) => updatePreferences({ sourceSelection: value as FeedPreferenceState['sourceSelection'] })}
                options={[
                  { value: 'arxiv', label: t('aiFeeds.onboarding.step4.sourceArxiv') },
                  { value: 'moreLater', label: t('aiFeeds.onboarding.step4.sourceLater') },
                ]}
              />
            </CollapsibleContent>
          </div>
        </Collapsible>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            {t('aiFeeds.onboarding.back')}
          </Button>
          <Button type="button" onClick={onComplete}>
            {t('aiFeeds.onboarding.step4.enterMyFeed')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
