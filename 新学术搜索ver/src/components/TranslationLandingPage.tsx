import React from 'react';
import { ArrowLeftRight, Languages, PanelsLeftRight } from 'lucide-react';

type MarketingLanguage = 'zh' | 'en';

interface TranslationLandingPageProps {
  language: MarketingLanguage;
  onPrimaryAction: () => void;
}

const featureCards = [
  {
    icon: Languages,
    zhEyebrow: '多维翻译',
    enEyebrow: 'Multi-layer translation',
    zhTitle: '全文翻译与划词解释',
    enTitle: 'Full-text translation and inline explanation',
    zhBody: '支持全文中英互译、划词翻译与术语解释，遇到生涩表述和专业概念时可以直接在阅读过程中完成理解。',
    enBody: 'Translate full papers, translate selected passages, and explain technical terms inline so difficult concepts can be understood without leaving the reading flow.',
    preview: 'split',
  },
  {
    icon: PanelsLeftRight,
    zhEyebrow: '沉浸批注',
    enEyebrow: 'Immersive annotation',
    zhTitle: 'PDF 高亮与墨迹批注',
    enTitle: 'PDF highlighting and ink annotation',
    zhBody: '在阅读关键论文时直接高亮核心观点、添加墨迹批注与阅读记录，把精读过程沉淀成可回看的个人知识记忆。',
    enBody: 'Highlight key passages, add ink annotations, and preserve reading traces directly in PDFs so close reading turns into reusable personal knowledge.',
    preview: 'jump',
  },
  {
    icon: ArrowLeftRight,
    zhEyebrow: 'LaTeX 提取',
    enEyebrow: 'LaTeX extraction',
    zhTitle: '公式与表格一键转 LaTeX',
    enTitle: 'One-click LaTeX for formulas and tables',
    zhBody: '复杂公式和数据表格可直接提取为 LaTeX 代码，减少手工重敲与排版错误，让论文写作和实验记录更高效。',
    enBody: 'Convert formulas and tables into LaTeX with one click so you can avoid manual retyping and move faster in writing and experiment documentation.',
    preview: 'languages',
  },
];

export function TranslationLandingPage({
  language,
  onPrimaryAction,
}: TranslationLandingPageProps) {
  const isZh = language === 'zh';
  const titleTag = isZh
    ? 'AI 辅助阅读 - 翻译、批注与 LaTeX 提取 | WisPaper'
    : 'AI-Assisted Reading - Translation, Annotation, and LaTeX Extraction | WisPaper';
  const metaDescription = isZh
    ? 'WisPaper AI 辅助阅读支持全文翻译、划词解释、PDF 高亮批注以及公式表格转 LaTeX，帮助你更高效地完成论文精读与知识沉淀。'
    : 'WisPaper AI-Assisted Reading supports full-text translation, inline explanation, PDF annotation, and one-click LaTeX extraction for faster deep reading and knowledge capture.';

  React.useEffect(() => {
    document.title = titleTag;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', metaDescription);

    const syncMeta = (selector: string, content: string) => {
      const element = document.querySelector(selector);
      if (element instanceof HTMLMetaElement) {
        element.setAttribute('content', content);
      }
    };

    syncMeta('meta[property="og:title"]', titleTag);
    syncMeta('meta[name="twitter:title"]', titleTag);
    syncMeta('meta[property="og:description"]', metaDescription);
    syncMeta('meta[name="twitter:description"]', metaDescription);
  }, [metaDescription, titleTag]);

  return (
    <div className="pb-8 text-slate-900">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),radial-gradient(circle_at_80%_18%,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.94),_rgba(248,250,252,0.98))] px-8 py-12 md:px-12 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),radial-gradient(circle_at_80%_18%,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.94),_rgba(248,250,252,0.98))]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
            {isZh ? 'AI 辅助阅读' : 'AI-Assisted Reading'}
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            {isZh ? '沉浸式的智能文献阅读体验' : 'An immersive intelligent literature reading experience'}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl leading-8 text-slate-700">
            {isZh
              ? '支持全文翻译、划词解释、PDF 批注、核心内容提炼以及公式表格转 LaTeX，让跨语言阅读与深度精读更顺滑。'
              : 'Built for full-text translation, inline explanation, PDF annotation, content extraction, and LaTeX conversion so multilingual close reading becomes much smoother.'}
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <span>{isZh ? '免费开始体验' : 'Start for Free'}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,_rgba(239,249,255,0.72),_rgba(255,255,255,1))] px-8 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            {isZh ? '核心能力' : 'Core Capabilities'}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {featureCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <article
                key={card.enTitle}
                className={`rounded-[2rem] border border-slate-200/80 px-7 py-8 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.18)] ${
                  index !== 1
                    ? 'bg-[linear-gradient(180deg,_rgba(239,246,255,0.92),_rgba(255,255,255,1))]'
                    : 'bg-white'
                }`}
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[1.8rem] bg-[#275df0] text-white shadow-[0_20px_44px_-30px_rgba(39,93,240,0.55)]">
                  <Icon className="h-11 w-11" strokeWidth={1.8} />
                </div>

                <div className="mt-6 flex justify-center">
                  <span className="rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-[#275df0]">
                    {isZh ? card.zhEyebrow : card.enEyebrow}
                  </span>
                </div>

                <h3 className="mt-7 text-center text-[2rem] font-black tracking-tight text-slate-950">
                  {isZh ? card.zhTitle : card.enTitle}
                </h3>
                <p className="mx-auto mt-5 max-w-[24ch] text-center text-lg leading-9 text-slate-600">
                  {isZh ? card.zhBody : card.enBody}
                </p>

                {card.preview === 'split' ? (
                  <div className="mt-8 rounded-[2rem] border border-cyan-100 bg-white/84 p-5">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                      <div className="rounded-[1.6rem] bg-slate-50 p-4 text-center">
                        <p className="text-lg font-semibold text-slate-700">{isZh ? '原文' : 'Source'}</p>
                        <div className="mt-4 space-y-3">
                          <div className="h-3 rounded-full bg-slate-200" />
                          <div className="h-3 w-5/6 rounded-full bg-slate-200" />
                          <div className="h-10 rounded-2xl bg-cyan-100" />
                        </div>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#275df0] text-white shadow-[0_12px_32px_-18px_rgba(39,93,240,0.55)]">
                        <ArrowLeftRight className="h-5 w-5" />
                      </div>
                      <div className="rounded-[1.6rem] bg-slate-50 p-4 text-center">
                        <p className="text-lg font-semibold text-slate-700">{isZh ? '解释 / 译文' : 'Explanation / Translation'}</p>
                        <div className="mt-4 space-y-3">
                          <div className="h-3 rounded-full bg-slate-200" />
                          <div className="h-3 w-5/6 rounded-full bg-slate-200" />
                          <div className="h-10 rounded-2xl bg-emerald-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {card.preview === 'jump' ? (
                  <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-8">
                    <div className="mx-auto flex w-fit items-center gap-4 rounded-full bg-white px-4 py-3 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.18)]">
                      <span className="rounded-2xl bg-slate-50 px-5 py-3 text-xl font-semibold text-slate-700">A12</span>
                      <span className="rounded-full bg-slate-900 px-5 py-3 text-lg font-semibold text-white">
                        {isZh ? '批注模式' : 'Annotate'}
                      </span>
                      <span className="rounded-2xl bg-slate-50 px-5 py-3 text-xl font-semibold text-slate-700">B12</span>
                    </div>
                  </div>
                ) : null}

                {card.preview === 'languages' ? (
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {(isZh
                      ? ['公式', '表格', 'LaTeX', '笔记', '论文']
                      : ['Formula', 'Table', 'LaTeX', 'Notes', 'Paper']
                    ).map((item) => (
                      <span key={item} className="rounded-full border border-cyan-200 bg-white px-4 py-2 text-lg font-medium text-[#275df0]">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white px-8 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            {isZh ? '让阅读辅助真正服务于论文理解与写作' : 'Make reading assistance serve understanding and writing'}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600">
            {isZh
              ? 'AI 辅助阅读不只是把原文翻译成另一种语言，而是把翻译、解释、批注和 LaTeX 提取连接成一条连续的阅读与写作工作流。先检索，再精读，再沉淀，再进入论文写作与实验准备。'
              : 'AI-Assisted Reading is not just about translating text. It connects translation, explanation, annotation, and LaTeX extraction into one continuous workflow for reading, synthesis, writing, and experiment preparation.'}
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <span>{isZh ? '开始 AI 辅助阅读' : 'Start AI-Assisted Reading'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
