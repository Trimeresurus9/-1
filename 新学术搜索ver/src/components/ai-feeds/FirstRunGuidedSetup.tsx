import React, { useMemo, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { cn } from '../ui/utils';
import { aiFeedSubjects, recommendedResearchProfileTopics } from './onboardingHelpers';
import type { FeedPreferenceState } from './PersonalizationPanel';
import { useLanguage } from '../../contexts/LanguageContext';

export function FirstRunGuidedSetup({
  subjectId,
  interests,
  sourceSelection,
  onAddInterest,
  onRemoveInterest,
  onSelectSource,
}: {
  subjectId: string | null;
  interests: string[];
  sourceSelection: FeedPreferenceState['sourceSelection'];
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (interest: string) => void;
  onSelectSource: (source: FeedPreferenceState['sourceSelection']) => void;
}) {
  const { t } = useLanguage();
  const [draftInterest, setDraftInterest] = useState('');

  const subject = useMemo(
    () => aiFeedSubjects.find((item) => item.id === subjectId) ?? null,
    [subjectId],
  );

  const suggestedInterests = useMemo(
    () =>
      Array.from(new Set([...(subject?.seedTags ?? []), ...recommendedResearchProfileTopics])).filter(
        (item) => !interests.includes(item),
      ),
    [interests, subject],
  );

  const interestsDone = interests.length > 0;
  const sourcesDone = sourceSelection !== 'both';
  const completedSteps = Number(interestsDone) + Number(sourcesDone);

  const handleAddDraft = () => {
    const next = draftInterest.trim();
    if (!next) {
      return;
    }
    onAddInterest(next);
    setDraftInterest('');
  };

  return (
    <Card className="border-border/70 bg-background shadow-sm">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {t('aiFeeds.guidedSetup.eyebrow')}
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {t('aiFeeds.guidedSetup.title')}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {t('aiFeeds.guidedSetup.description')}
            </p>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs">
            {t('aiFeeds.guidedSetup.progress', { count: completedSteps.toString() })}
          </Badge>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <section className="space-y-4 rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Check className={cn('h-4 w-4', interestsDone ? 'text-emerald-600' : 'text-muted-foreground')} />
                {t('aiFeeds.guidedSetup.interestsTitle')}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {subject
                  ? t('aiFeeds.guidedSetup.interestsDescriptionWithSubject', { subject: subject.label })
                  : t('aiFeeds.guidedSetup.interestsDescription')}
              </p>
            </div>

            {interests.length ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                    <span>{interest}</span>
                    <button
                      type="button"
                      className="ml-1 text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => onRemoveInterest(interest)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">{t('aiFeeds.guidedSetup.interestsEmpty')}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {suggestedInterests.slice(0, 6).map((interest) => (
                <Button
                  key={interest}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => onAddInterest(interest)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {interest}
                </Button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={draftInterest}
                onChange={(event) => setDraftInterest(event.target.value)}
                placeholder={t('aiFeeds.guidedSetup.interestsInputPlaceholder')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddDraft();
                  }
                }}
              />
              <Button type="button" onClick={handleAddDraft} disabled={!draftInterest.trim()}>
                {t('aiFeeds.guidedSetup.addInterest')}
              </Button>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Check className={cn('h-4 w-4', sourcesDone ? 'text-emerald-600' : 'text-muted-foreground')} />
                {t('aiFeeds.guidedSetup.sourcesTitle')}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {t('aiFeeds.guidedSetup.sourcesDescription')}
              </p>
            </div>

            <div className="grid gap-2">
              {([
                {
                  key: 'arxiv',
                  title: t('aiFeeds.guidedSetup.source.arxivTitle'),
                  description: t('aiFeeds.guidedSetup.source.arxivDescription'),
                },
                {
                  key: 'journals',
                  title: t('aiFeeds.guidedSetup.source.journalsTitle'),
                  description: t('aiFeeds.guidedSetup.source.journalsDescription'),
                },
                {
                  key: 'both',
                  title: t('aiFeeds.guidedSetup.source.balancedTitle'),
                  description: t('aiFeeds.guidedSetup.source.balancedDescription'),
                },
              ] as const).map((option) => {
                const selected = option.key === sourceSelection;
                return (
                  <button
                    key={option.key}
                    type="button"
                    className={cn(
                      'rounded-2xl border px-4 py-3 text-left transition-all duration-200',
                      selected
                        ? 'border-foreground/25 bg-foreground/[0.03] shadow-sm'
                        : 'border-border/70 bg-background hover:border-foreground/15 hover:bg-muted/25',
                    )}
                    onClick={() => onSelectSource(option.key)}
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground">{option.title}</div>
                      <p className="text-sm leading-6 text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
