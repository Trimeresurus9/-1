import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface SeoCard {
  title: string;
  body: string;
}

interface MarketingSeoPageProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  titleTag: string;
  metaDescription: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  pills?: string[];
  overview: SeoCard[];
  highlights: SeoCard[];
}

export function MarketingSeoPage({
  badge,
  title,
  subtitle,
  description,
  titleTag,
  metaDescription,
  primaryLabel,
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
  pills = [],
  overview,
  highlights,
}: MarketingSeoPageProps) {
  React.useEffect(() => {
    document.title = titleTag;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', metaDescription);
  }, [metaDescription, titleTag]);

  return (
    <div className="space-y-10 pb-8 text-slate-900">
      <section className="hero-grid surface-glow relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white px-8 py-10 shadow-[0_32px_120px_-70px_rgba(15,23,42,0.45)] md:px-12 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,250,252,0.96))]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
            {badge}
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl leading-8 text-slate-700">{subtitle}</p>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-500">{description}</p>

          {pills.length > 0 ? (
            <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
              {pills.map((pill) => (
                <span key={pill} className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700">
                  {pill}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <span>{primaryLabel}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            {secondaryLabel && onSecondaryAction ? (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {secondaryLabel}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {overview.map((item) => (
          <article key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-[0_40px_120px_-80px_rgba(15,23,42,0.95)]">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Why It Matters</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">为 SEO 入口准备的功能介绍页</h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-cyan-500/20 p-1 text-cyan-200">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
