import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Check, ChevronDown, Loader2, Pencil, Plus, RotateCcw, Sparkles, X } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { cn } from '../../ui/utils';
import { useLanguage } from '../../../contexts/LanguageContext';
import { feedActionClassName, feedPanelClassName, feedSectionDescriptionClassName, feedMetaClassName } from '../feedStyles';
import type { ResearchProfileGroup, ResearchProfileGroupKey, ResearchProfileItem } from '../onboardingHelpers';

const groupOrder: ResearchProfileGroupKey[] = ['topics'];

function EditableProfileChip({
  item,
  onToggle,
  onRemove,
  onUpdate,
}: {
  item: ResearchProfileItem;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (nextLabel: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.label);

  return editing ? (
    <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-background px-3 py-1.5">
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="h-7 min-w-28 border-0 px-0 py-0 shadow-none focus-visible:ring-0"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onUpdate(draft.trim() || item.label);
            setEditing(false);
          }
          if (event.key === 'Escape') {
            setDraft(item.label);
            setEditing(false);
          }
        }}
        autoFocus
      />
      <button
        type="button"
        className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => {
          onUpdate(draft.trim() || item.label);
          setEditing(false);
        }}
      >
        <Check className="h-3.5 w-3.5" />
      </button>
    </div>
  ) : (
    <Badge
      variant="secondary"
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-all',
        item.selected
          ? 'border-primary/25 bg-primary/8 text-foreground'
          : 'border-border/70 bg-background text-muted-foreground',
      )}
    >
      <button type="button" className="inline-flex items-center gap-2" onClick={onToggle}>
        <span>{item.label}</span>
        {item.selected ? <span className="text-[10px] uppercase tracking-[0.12em] text-primary">AI</span> : null}
      </button>
      <button
        type="button"
        className="ml-1 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => {
          setDraft(item.label);
          setEditing(true);
        }}
      >
        <Pencil className="h-3 w-3" />
      </button>
      <button type="button" className="ml-1 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground" onClick={onRemove}>
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

export function ReviewResearchProfileStep({
  status,
  groups,
  recommendedTopics,
  addDraft,
  onAddDraftChange,
  onAddChip,
  onToggleChip,
  onRemoveChip,
  onUpdateChip,
  onAddRecommendedTopic,
  onBack,
  onContinue,
}: {
  status: 'loading' | 'ready' | 'empty' | 'error';
  groups: ResearchProfileGroup[];
  recommendedTopics: string[];
  addDraft: string;
  onAddDraftChange: (value: string) => void;
  onAddChip: () => void;
  onToggleChip: (group: ResearchProfileGroupKey, itemId: string) => void;
  onRemoveChip: (group: ResearchProfileGroupKey, itemId: string) => void;
  onUpdateChip: (group: ResearchProfileGroupKey, itemId: string, nextLabel: string) => void;
  onAddRecommendedTopic: (label: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { t } = useLanguage();
  const [lastRemoved, setLastRemoved] = useState<{ item: ResearchProfileItem } | null>(null);
  const groupMap = useMemo(
    () => new Map(groups.map((group) => [group.key, group.items])),
    [groups],
  );
  const selectedCount = groups.reduce((count, group) => count + group.items.filter((item) => item.selected).length, 0);

  useEffect(() => {
    if (!lastRemoved) {
      return;
    }

    const timer = window.setTimeout(() => setLastRemoved(null), 2600);
    return () => window.clearTimeout(timer);
  }, [lastRemoved]);

  if (status === 'loading') {
    return (
      <Card className={`${feedPanelClassName} gap-0`}>
        <CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div className="space-y-2">
            <div className="text-lg font-semibold text-foreground">{t('aiFeeds.onboarding.step2.loadingTitle')}</div>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">{t('aiFeeds.onboarding.step2.loadingDescription')}</p>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">{t('aiFeeds.onboarding.step2.loadingDescriptionSecondary')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className={`${feedPanelClassName} gap-0`}>
        <CardContent className="flex min-h-[360px] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <div className="text-lg font-semibold text-foreground">{t('aiFeeds.onboarding.step2.errorTitle')}</div>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">{t('aiFeeds.onboarding.step2.errorDescription')}</p>
          </div>
          <Button type="button" variant="outline" className={feedActionClassName} onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            {t('aiFeeds.onboarding.back')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === 'empty') {
    return (
      <Card className={`${feedPanelClassName} gap-0`}>
        <CardHeader className="gap-2 pb-5">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t('aiFeeds.onboarding.stepLabel').replace('{n}', '2')}
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
            {t('aiFeeds.onboarding.step2.title')}
          </CardTitle>
          <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.step2.description')}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6">
            <div className="space-y-2">
              <div className="text-base font-semibold text-foreground">{t('aiFeeds.onboarding.step2.emptyStateTitle')}</div>
              <p className="text-sm leading-6 text-muted-foreground">{t('aiFeeds.onboarding.step2.emptyStateDescription')}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {recommendedTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-accent hover:text-foreground active:scale-[0.98]"
                  onClick={() => onAddRecommendedTopic(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
              {t('aiFeeds.onboarding.back')}
            </Button>
            <Button type="button" onClick={onContinue} disabled={selectedCount === 0}>
              {t('aiFeeds.onboarding.step3.enterFeed')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${feedPanelClassName} gap-0`}>
      <CardHeader className="gap-2 pb-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t('aiFeeds.onboarding.stepLabel').replace('{n}', '2')}
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
          {t('aiFeeds.onboarding.step2.title')}
        </CardTitle>
        <p className={feedSectionDescriptionClassName}>{t('aiFeeds.onboarding.step2.description')}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {lastRemoved ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm">
            <div className="text-muted-foreground">
              <span className="font-medium text-foreground">{lastRemoved.item.label}</span> {t('aiFeeds.onboarding.undoRemovedInterest')}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hover:bg-accent active:scale-[0.98]"
              onClick={() => {
                onAddRecommendedTopic(lastRemoved.item.label);
                setLastRemoved(null);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              {t('aiFeeds.undo')}
            </Button>
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
          <div className="space-y-1">
            <div className="text-sm font-medium text-foreground">{t('aiFeeds.onboarding.step2.selectedSummary').replace('{count}', String(selectedCount))}</div>
            <div className={feedMetaClassName}>{t('aiFeeds.onboarding.step2.selectedHint')}</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700">
            <Sparkles className="h-3.5 w-3.5" />
            {t('aiFeeds.onboarding.step2.aiAssisted')}
          </div>
        </div>

        <div className="space-y-5">
          {groupOrder.map((groupKey) => {
            const items = groupMap.get(groupKey) ?? [];
            return (
              <section key={groupKey} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t(`aiFeeds.onboarding.step2.group.${groupKey}`)}</div>
                    <div className={feedMetaClassName}>{t(`aiFeeds.onboarding.step2.group.${groupKey}Description`)}</div>
                  </div>
                  <div className={feedMetaClassName}>{items.length}</div>
                </div>
                <div className="flex min-h-16 flex-wrap gap-2 rounded-2xl border border-border/70 bg-background p-3">
                  {items.length ? (
                    items.map((item) => (
                      <EditableProfileChip
                        key={item.id}
                        item={item}
                        onToggle={() => onToggleChip(groupKey, item.id)}
                        onRemove={() => {
                          setLastRemoved({ item });
                          onRemoveChip(groupKey, item.id);
                        }}
                        onUpdate={(nextLabel) => onUpdateChip(groupKey, item.id, nextLabel)}
                      />
                    ))
                  ) : (
                    <div className="flex items-center text-sm text-muted-foreground">
                      {t('aiFeeds.onboarding.step2.groupEmpty')}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/15 p-4">
          <div className="mb-3 text-sm font-semibold text-foreground">{t('aiFeeds.onboarding.step2.addChipTitle')}</div>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              value={addDraft}
              onChange={(event) => onAddDraftChange(event.target.value)}
              placeholder={t('aiFeeds.onboarding.step2.addPlaceholder')}
              className="rounded-xl"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  onAddChip();
                }
              }}
            />
            <Button type="button" variant="outline" className={feedActionClassName} onClick={onAddChip}>
              <Plus className="h-4 w-4" />
              {t('aiFeeds.onboarding.addTopic')}
            </Button>
          </div>
        </div>

        <Collapsible>
          <div className="rounded-2xl border border-dashed border-border/70 bg-background">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
              <div>
                <div className="text-sm font-medium text-foreground">{t('aiFeeds.onboarding.step2.browseTaxonomy')}</div>
                <div className={feedMetaClassName}>{t('aiFeeds.onboarding.step2.browseTaxonomyDescription')}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t border-border/70 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {['Multimodal', 'Benchmark', 'Scientific Agents', 'Materials', 'Evaluation', 'Medical Imaging'].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className="rounded-full border border-border/70 bg-muted/20 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-accent hover:text-foreground active:scale-[0.98]"
                    onClick={() => onAddRecommendedTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            {t('aiFeeds.onboarding.back')}
          </Button>
          <Button type="button" onClick={onContinue} disabled={selectedCount === 0}>
            {t('aiFeeds.onboarding.step3.enterFeed')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
