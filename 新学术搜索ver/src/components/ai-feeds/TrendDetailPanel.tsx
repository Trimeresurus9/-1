import React from 'react';
import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  EyeOff,
  Flame,
  FolderOpen,
  LineChart,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { TrendPaper, TrendRecommendation } from '../../data/mockTrends';

interface TrendDetailPanelProps {
  trend: TrendRecommendation | null;
  onToggleFollow: (trendId: string) => void;
  onToggleUninterested: (trendId: string) => void;
  onOpenPaper: (paper: TrendPaper) => void;
}

function TrendTrajectory({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-36 items-end gap-2">
      {values.map((value, index) => (
        <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-xl bg-slate-900/85"
            style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
          />
          <span className="text-[11px] text-slate-400">D{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

export function TrendDetailPanel({
  trend,
  onToggleFollow,
  onToggleUninterested,
  onOpenPaper,
}: TrendDetailPanelProps) {
  if (!trend) {
    return (
      <Card className="border-slate-200 bg-white">
        <CardContent className="flex min-h-[520px] items-center justify-center p-8">
          <div className="max-w-sm text-center">
            <div className="text-sm font-medium text-slate-900">Select a trend</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a trend from the recommendation list to inspect the rationale, signal summary, and representative papers.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="space-y-3 border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-full border-slate-300 bg-slate-50 text-slate-600">
            {trend.domain}
          </Badge>
          <Badge variant="outline" className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700">
            {trend.stage}
          </Badge>
          <span className="text-xs text-slate-500">{trend.updatedAt}</span>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl leading-7 text-slate-900">{trend.title}</CardTitle>
          <p className="text-sm leading-7 text-slate-600">{trend.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={trend.following ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleFollow(trend.id)}
          >
            {trend.following ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {trend.following ? 'Following' : 'Follow trend'}
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600" onClick={() => onToggleUninterested(trend.id)}>
            <EyeOff className="h-4 w-4" />
            Not interested
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">Momentum score</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{trend.momentumScore}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">Weekly growth</div>
            <div className="mt-1 flex items-center gap-1 text-2xl font-semibold text-slate-900">
              <Flame className="h-4 w-4 text-amber-500" />
              +{trend.weeklyGrowth}%
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">Citation velocity</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{trend.citationVelocity}</div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-900">
            <LineChart className="h-4 w-4" />
            <span>Trend trajectory</span>
          </div>
          <TrendTrajectory values={trend.trajectory} />
        </section>

        <section>
          <div className="text-sm font-medium text-slate-900">Why this direction is warming up</div>
          <div className="mt-3 space-y-3">
            {trend.whyNow.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-sm font-medium text-slate-900">Signals observed</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {trend.signals.map((signal) => (
              <div key={signal} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                {signal}
              </div>
            ))}
          </div>
        </section>

        <Separator className="bg-slate-200" />

        <section>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900">
            <FolderOpen className="h-4 w-4" />
            <span>Representative papers</span>
          </div>
          <div className="space-y-3">
            {trend.papers.map((paper) => (
              <div key={paper.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{paper.venue}</span>
                  <span>•</span>
                  <span>{paper.year}</span>
                  <span>•</span>
                  <span>{paper.citations} citations</span>
                </div>
                <div className="mt-2 text-sm font-semibold leading-6 text-slate-900">{paper.title}</div>
                <div className="mt-1 text-sm text-slate-500">{paper.authors.join(', ')}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{paper.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => onOpenPaper(paper)}>
                    View abstract
                  </Button>
                  <button className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900">
                    <span>Open paper</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
