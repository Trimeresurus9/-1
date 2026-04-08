import React from 'react';
import { Sparkles } from 'lucide-react';

export interface TodayBriefData {
  label: string;
  summary: string;
}

export function TodayBriefBanner({
  brief,
}: {
  brief: TodayBriefData;
}) {
  return (
    <section className="rounded-2xl border border-sky-100 bg-sky-50/80 px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/90 text-sky-700 shadow-sm">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium text-sky-900">{brief.label}</div>
          <p className="text-sm leading-6 text-sky-900/80">{brief.summary}</p>
        </div>
      </div>
    </section>
  );
}
