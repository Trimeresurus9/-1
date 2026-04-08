import React, { useEffect, useMemo, useState } from 'react';
import { Check, Plus, Search } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import {
  feedSourceCatalog,
  feedSourceCategories,
  recommendedResearchProfileTopics,
} from './onboardingHelpers';
import { useLanguage } from '../../contexts/LanguageContext';
import { EmailVerificationSection } from './EmailVerificationSection';
import { isValidEmail } from '../../utils/email';

type PersonalizeTab = 'latest' | 'ai-subscription';

function SourceSelectionSection({
  selectedCategory,
  onSelectCategory,
  sourceQuery,
  onSourceQueryChange,
  selectedSources,
  onToggleSource,
  paginatedSources,
  sourcePage,
  sourcePageCount,
  onSourcePageChange,
  onApply,
  disableApply,
}: {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sourceQuery: string;
  onSourceQueryChange: (value: string) => void;
  selectedSources: string[];
  onToggleSource: (sourceId: string) => void;
  paginatedSources: typeof feedSourceCatalog;
  sourcePage: number;
  sourcePageCount: number;
  onSourcePageChange: (page: number) => void;
  onApply: () => void;
  disableApply: boolean;
}) {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-4 rounded-2xl border border-border/70 bg-background p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-foreground">{t('aiFeeds.manageSetup.sourcesTitle')}</div>
          <Button type="button" size="sm" disabled={disableApply} onClick={onApply}>
            {t('aiFeeds.manageSetup.apply')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {feedSourceCategories.map((category) => (
            <Button
              key={category.id}
              type="button"
              variant={category.id === selectedCategory ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => onSelectCategory(category.id)}
            >
              {t(`aiFeeds.sourceCategory.${category.id}`)}
            </Button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={sourceQuery}
            onChange={(event) => onSourceQueryChange(event.target.value)}
            placeholder={t('aiFeeds.manageSetup.sourcesSearch')}
            className="pl-10"
          />
        </div>

        {selectedSources.length ? (
          <div className="flex flex-wrap gap-2">
            {selectedSources.map((sourceId) => {
              const source = feedSourceCatalog.find((item) => item.id === sourceId);
              if (!source) {
                return null;
              }
              return (
                <Badge key={source.id} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  {source.label}
                </Badge>
              );
            })}
          </div>
        ) : null}

        <div className="grid gap-3 lg:grid-cols-2">
          {paginatedSources.map((source) => {
            const selected = selectedSources.includes(source.id);
            return (
              <button
                key={source.id}
                type="button"
                onClick={() => onToggleSource(source.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                  selected
                    ? 'border-foreground/25 bg-foreground/[0.03] shadow-sm'
                    : 'border-border/70 bg-muted/20 hover:border-foreground/15 hover:bg-muted/35'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-semibold text-white shadow-sm"
                    style={{ background: source.cover }}
                  >
                    {source.coverLabel}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="truncate text-sm font-semibold leading-5 text-foreground">{source.label}</div>
                        {source.id !== 'arxiv' ? (
                          <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em]">
                            JCR Q1
                          </Badge>
                        ) : null}
                      </div>
                      {selected ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : null}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {t(source.type === 'preprint' ? 'aiFeeds.sourceType.preprint' : 'aiFeeds.sourceType.journalVenue')}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {sourcePageCount > 1 ? (
          <Pagination className="justify-end pt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={sourcePage === 1 ? 'pointer-events-none opacity-50' : ''}
                  onClick={(event) => {
                    event.preventDefault();
                    onSourcePageChange(Math.max(1, sourcePage - 1));
                  }}
                />
              </PaginationItem>
              {Array.from({ length: sourcePageCount }, (_, index) => index + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === sourcePage}
                    onClick={(event) => {
                      event.preventDefault();
                      onSourcePageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={sourcePage === sourcePageCount ? 'pointer-events-none opacity-50' : ''}
                  onClick={(event) => {
                    event.preventDefault();
                    onSourcePageChange(Math.min(sourcePageCount, sourcePage + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
    </>
  );
}

export function ManageFeedSetupDialog({
  open,
  onOpenChange,
  initialTab,
  latestSelectedSources,
  subscriptionInterests,
  subscriptionSelectedSources,
  serviceStatus,
  pushEnabled,
  email,
  verifiedEmail,
  frequency,
  pendingInterest,
  onTogglePush,
  onToggleService,
  onApplyLatest,
  onApplySubscription,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab: PersonalizeTab;
  latestSelectedSources: string[];
  subscriptionInterests: string[];
  subscriptionSelectedSources: string[];
  serviceStatus: 'not-started' | 'running' | 'paused-user' | 'paused-system';
  pushEnabled: boolean;
  email: string;
  verifiedEmail: string;
  frequency: 'daily' | 'none';
  pendingInterest?: string | null;
  onTogglePush: (checked: boolean) => void;
  onToggleService: () => void;
  onApplyLatest: (next: { selectedSources: string[] }) => void;
  onApplySubscription: (next: { interests: string[]; selectedSources: string[]; email: string; verifiedEmail: string; frequency: 'daily' | 'none' }) => void;
}) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<PersonalizeTab>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState(feedSourceCategories[0]?.id ?? 'chemistry');
  const [latestSourceQuery, setLatestSourceQuery] = useState('');
  const [subscriptionSourceQuery, setSubscriptionSourceQuery] = useState('');
  const [latestSourcePage, setLatestSourcePage] = useState(1);
  const [subscriptionSourcePage, setSubscriptionSourcePage] = useState(1);
  const [interestQuery, setInterestQuery] = useState('');
  const [draftLatestSources, setDraftLatestSources] = useState<string[]>(latestSelectedSources);
  const [draftSubscriptionSources, setDraftSubscriptionSources] = useState<string[]>(subscriptionSelectedSources);
  const [draftInterests, setDraftInterests] = useState<string[]>(subscriptionInterests);
  const [draftEmail, setDraftEmail] = useState(email);
  const [verifiedDraftEmail, setVerifiedDraftEmail] = useState(verifiedEmail);
  const [draftFrequency, setDraftFrequency] = useState<'daily' | 'none'>(frequency);
  const sourcesPerPage = 7;

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveTab(initialTab);
    setSelectedCategory(feedSourceCategories[0]?.id ?? 'chemistry');
    setLatestSourceQuery('');
    setSubscriptionSourceQuery('');
    setLatestSourcePage(1);
    setSubscriptionSourcePage(1);
    setInterestQuery('');
    setDraftLatestSources(latestSelectedSources);
    setDraftSubscriptionSources(subscriptionSelectedSources);
    setDraftInterests(subscriptionInterests);
    setDraftEmail(email);
    setVerifiedDraftEmail(verifiedEmail);
    setDraftFrequency(frequency);
  }, [open, initialTab, latestSelectedSources, subscriptionSelectedSources, subscriptionInterests, email, verifiedEmail, frequency]);

  useEffect(() => {
    if (!open || !pendingInterest) {
      return;
    }

    setActiveTab('ai-subscription');
    setDraftInterests((current) => (current.includes(pendingInterest) ? current : [...current, pendingInterest]));
  }, [open, pendingInterest]);

  const visibleLatestSources = useMemo(() => {
    const query = latestSourceQuery.trim().toLowerCase();
    return feedSourceCatalog.filter((source) => {
      if (!source.categories.includes(selectedCategory)) {
        return false;
      }
      const haystack = `${source.label} ${source.subtitle}`.toLowerCase();
      return !query || haystack.includes(query);
    });
  }, [latestSourceQuery, selectedCategory]);

  const visibleSubscriptionSources = useMemo(() => {
    const query = subscriptionSourceQuery.trim().toLowerCase();
    return feedSourceCatalog.filter((source) => {
      if (!source.categories.includes(selectedCategory)) {
        return false;
      }
      const haystack = `${source.label} ${source.subtitle}`.toLowerCase();
      return !query || haystack.includes(query);
    });
  }, [selectedCategory, subscriptionSourceQuery]);

  useEffect(() => {
    setLatestSourcePage(1);
  }, [latestSourceQuery, selectedCategory]);

  useEffect(() => {
    setSubscriptionSourcePage(1);
  }, [subscriptionSourceQuery, selectedCategory]);

  const latestSourcePageCount = Math.max(1, Math.ceil(visibleLatestSources.length / sourcesPerPage));
  const subscriptionSourcePageCount = Math.max(1, Math.ceil(visibleSubscriptionSources.length / sourcesPerPage));

  const paginatedLatestSources = useMemo(() => {
    const startIndex = (latestSourcePage - 1) * sourcesPerPage;
    return visibleLatestSources.slice(startIndex, startIndex + sourcesPerPage);
  }, [latestSourcePage, visibleLatestSources]);

  const paginatedSubscriptionSources = useMemo(() => {
    const startIndex = (subscriptionSourcePage - 1) * sourcesPerPage;
    return visibleSubscriptionSources.slice(startIndex, startIndex + sourcesPerPage);
  }, [subscriptionSourcePage, visibleSubscriptionSources]);

  const latestHasChanges =
    draftLatestSources.length !== latestSelectedSources.length ||
    draftLatestSources.some((sourceId) => !latestSelectedSources.includes(sourceId));

  const subscriptionHasChanges =
    draftInterests.length !== subscriptionInterests.length ||
    draftInterests.some((interest) => !subscriptionInterests.includes(interest)) ||
    draftSubscriptionSources.length !== subscriptionSelectedSources.length ||
    draftSubscriptionSources.some((sourceId) => !subscriptionSelectedSources.includes(sourceId)) ||
    draftEmail.trim() !== email ||
    verifiedDraftEmail !== verifiedEmail ||
    draftFrequency !== frequency;

  const latestCanApply = draftLatestSources.length > 0;
  const subscriptionCanApply =
    draftSubscriptionSources.length > 0 &&
    (!pushEnabled ||
      (draftInterests.length > 0 &&
        (draftFrequency === 'none' ||
          (draftEmail.trim().length > 0 &&
            isValidEmail(draftEmail) &&
            verifiedDraftEmail === draftEmail.trim()))));

  const handleAddInterest = () => {
    const nextInterest = interestQuery.trim();
    if (!nextInterest || draftInterests.includes(nextInterest)) {
      return;
    }
    setDraftInterests((current) => [...current, nextInterest]);
    setInterestQuery('');
  };

  const quickInterestTags = useMemo(
    () => Array.from(new Set(recommendedResearchProfileTopics)).filter((interest) => !draftInterests.includes(interest)).slice(0, 4),
    [draftInterests],
  );

  const serviceActionLabel =
    serviceStatus === 'running'
      ? t('aiFeeds.manageSetup.pauseService')
      : serviceStatus === 'not-started'
        ? t('aiFeeds.manageSetup.startService')
        : t('aiFeeds.manageSetup.resumeService');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] max-h-[90vh] !w-[min(96vw,1600px)] !max-w-[1600px] overflow-hidden rounded-2xl p-0">
        <DialogHeader className="border-b border-border/70 px-6 py-5">
          <DialogTitle>{t('aiFeeds.manageSetup.personalizeTitle')}</DialogTitle>
        </DialogHeader>

        <div className="h-[calc(90vh-88px)] overflow-y-auto p-6">
          <section className="mx-auto w-full max-w-none space-y-5">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PersonalizeTab)} className="gap-5">
              <TabsList className="w-full justify-start rounded-2xl border border-border/70 bg-background p-1">
                <TabsTrigger value="latest" className="rounded-xl px-4 py-2 data-[state=active]:shadow-sm">
                  {t('aiFeeds.tab.latest')}
                </TabsTrigger>
                <TabsTrigger value="ai-subscription" className="rounded-xl px-4 py-2 data-[state=active]:shadow-sm">
                  {t('aiFeeds.tab.forYou')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="latest" className="mt-0 space-y-5">
                <SourceSelectionSection
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  sourceQuery={latestSourceQuery}
                  onSourceQueryChange={setLatestSourceQuery}
                  selectedSources={draftLatestSources}
                  onToggleSource={(sourceId) =>
                    setDraftLatestSources((current) =>
                      current.includes(sourceId) ? current.filter((item) => item !== sourceId) : [...current, sourceId],
                    )
                  }
                  paginatedSources={paginatedLatestSources}
                  sourcePage={latestSourcePage}
                  sourcePageCount={latestSourcePageCount}
                  onSourcePageChange={setLatestSourcePage}
                  onApply={() => onApplyLatest({ selectedSources: draftLatestSources })}
                  disableApply={!latestHasChanges || !latestCanApply}
                />
              </TabsContent>

              <TabsContent value="ai-subscription" className="mt-0 space-y-5">
                <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background p-5">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">{t('aiFeeds.manageSetup.subscriptionTitle')}</div>
                    <div className="text-sm text-muted-foreground">{t('aiFeeds.manageSetup.subscriptionHint')}</div>
                  </div>
                  <Switch checked={pushEnabled} onCheckedChange={onTogglePush} />
                </div>

                {pushEnabled ? (
                  <>
                    <SourceSelectionSection
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      sourceQuery={subscriptionSourceQuery}
                      onSourceQueryChange={setSubscriptionSourceQuery}
                      selectedSources={draftSubscriptionSources}
                      onToggleSource={(sourceId) =>
                        setDraftSubscriptionSources((current) =>
                          current.includes(sourceId) ? current.filter((item) => item !== sourceId) : [...current, sourceId],
                        )
                      }
                      paginatedSources={paginatedSubscriptionSources}
                      sourcePage={subscriptionSourcePage}
                      sourcePageCount={subscriptionSourcePageCount}
                      onSourcePageChange={setSubscriptionSourcePage}
                      onApply={() =>
                        onApplySubscription({
                          interests: draftInterests,
                          selectedSources: draftSubscriptionSources,
                          email: draftEmail.trim(),
                          verifiedEmail: verifiedDraftEmail,
                          frequency: draftFrequency,
                        })
                      }
                      disableApply={!subscriptionHasChanges || !subscriptionCanApply}
                    />

                    <div className="space-y-4 rounded-2xl border border-border/70 bg-background p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-foreground">{t('aiFeeds.manageSetup.interestsTitle')}</div>
                        <Button
                          type="button"
                          size="sm"
                          disabled={!subscriptionHasChanges || !subscriptionCanApply}
                          onClick={() =>
                            onApplySubscription({
                              interests: draftInterests,
                              selectedSources: draftSubscriptionSources,
                              email: draftEmail.trim(),
                              verifiedEmail: verifiedDraftEmail,
                              frequency: draftFrequency,
                            })
                          }
                        >
                          {t('aiFeeds.manageSetup.apply')}
                        </Button>
                      </div>

                      {draftInterests.length ? (
                        <div className="flex flex-wrap gap-2">
                          {draftInterests.map((interest) => (
                            <Badge key={interest} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                              <span>{interest}</span>
                              <button
                                type="button"
                                className="ml-1 text-muted-foreground transition-colors hover:text-foreground"
                                onClick={() => setDraftInterests((current) => current.filter((item) => item !== interest))}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      <div className="flex items-center gap-2">
                        <Input
                          value={interestQuery}
                          onChange={(event) => setInterestQuery(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault();
                              handleAddInterest();
                            }
                          }}
                          placeholder={t('aiFeeds.manageSetup.interestsInputPlaceholder')}
                        />
                        <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={handleAddInterest}>
                          {t('aiFeeds.manageSetup.addInterest')}
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {quickInterestTags.map((interest) => (
                          <Button
                            key={interest}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => setDraftInterests((current) => [...current, interest])}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            {interest}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <EmailVerificationSection
                      enabled={draftFrequency === 'daily'}
                      onEnabledChange={(checked) => setDraftFrequency(checked ? 'daily' : 'none')}
                      email={draftEmail}
                      onEmailChange={setDraftEmail}
                      verifiedEmail={verifiedDraftEmail}
                      onVerifiedEmailChange={setVerifiedDraftEmail}
                    />
                  </>
                ) : null}
              </TabsContent>
            </Tabs>
          </section>
        </div>
        <DialogFooter className="border-t border-border/70 px-6 py-4">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={onToggleService}>
              {serviceActionLabel}
            </Button>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                {t('aiFeeds.manageSetup.cancel')}
              </Button>
              <Button
                type="button"
                disabled={activeTab === 'latest' ? !latestHasChanges || !latestCanApply : !subscriptionHasChanges || !subscriptionCanApply}
                onClick={() =>
                  activeTab === 'latest'
                    ? onApplyLatest({ selectedSources: draftLatestSources })
                    : onApplySubscription({
                        interests: draftInterests,
                        selectedSources: draftSubscriptionSources,
                        email: draftEmail.trim(),
                        verifiedEmail: verifiedDraftEmail,
                        frequency: draftFrequency,
                      })
                }
              >
                {t('aiFeeds.manageSetup.apply')}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
