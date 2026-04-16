import React from 'react';
import { ArrowLeftRight, Languages, PanelsLeftRight } from 'lucide-react';

type MarketingLanguage = 'zh' | 'en';

interface TranslationLandingPageProps {
  language: MarketingLanguage;
  onPrimaryAction: () => void;
}

const featureCards = [
  {
    icon: PanelsLeftRight,
    zhEyebrow: '对照模式',
    enEyebrow: 'Compare mode',
    zhTitle: '左右对比模式',
    enTitle: 'Side-by-side bilingual reading',
    zhBody: '原文与译文并排展示，阅读时可以同步比对句式、术语和上下文，不需要频繁来回切换。',
    enBody: 'Read the source and translation side by side so you can compare wording, terminology, and context without constant switching.',
    preview: 'split',
  },
  {
    icon: ArrowLeftRight,
    zhEyebrow: '双向跳转',
    enEyebrow: 'Bidirectional jump',
    zhTitle: '原文译文双向跳转',
    enTitle: 'Jump between source and translation',
    zhBody: '点击原文或译文中的任意句段，即可快速定位对应内容，特别适合校对、精读和术语核查。',
    enBody: 'Click any sentence in the source or translation to jump to its counterpart, which is ideal for checking, close reading, and terminology review.',
    preview: 'jump',
  },
  {
    icon: Languages,
    zhEyebrow: '五种语言',
    enEyebrow: 'Five languages',
    zhTitle: '五种语言支持',
    enTitle: 'Support for five languages',
    zhBody: '支持中文、英文、日文、韩文和印尼语，方便不同语言背景的用户共享同一份内容。',
    enBody: 'Supports Chinese, English, Japanese, Korean, and Bahasa Indonesia so teams can read and share the same content across languages.',
    preview: 'languages',
  },
];

export function TranslationLandingPage({
  language,
  onPrimaryAction,
}: TranslationLandingPageProps) {
  const isZh = language === 'zh';
  const titleTag = isZh
    ? 'Translation - 学术论文翻译、双语对照阅读与论文精读工具 | WisPaper'
    : 'Translation - Academic Paper Translation and Bilingual Reading Tool | WisPaper';
  const metaDescription = isZh
    ? 'WisPaper Translation 提供学术论文翻译、双语对照阅读、术语核查与跨语言定位能力，适合作为论文精读工具、文献综述工具和学术阅读辅助入口。'
    : 'WisPaper Translation supports academic paper translation, bilingual side-by-side reading, term checking, and cross-language navigation for deep paper reading and review workflows.';

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
            Translation
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            {isZh ? '沉浸式的翻译阅读体验' : 'An immersive translation reading experience'}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl leading-8 text-slate-700">
            {isZh
              ? '围绕双语阅读、对照理解和跨语言定位而设计，让译文阅读、论文精读和术语核查更顺手。'
              : 'Designed for bilingual reading, cross-language understanding, and fast alignment so translation, close reading, and term checking feel more natural.'}
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
            {isZh ? '功能特色' : 'Core Features'}
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
                        <p className="text-lg font-semibold text-slate-700">{isZh ? '译文' : 'Translation'}</p>
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
                        {isZh ? '双向定位' : 'Jump'}
                      </span>
                      <span className="rounded-2xl bg-slate-50 px-5 py-3 text-xl font-semibold text-slate-700">B12</span>
                    </div>
                  </div>
                ) : null}

                {card.preview === 'languages' ? (
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {(isZh
                      ? ['中文', 'English', '日本語', '한국어', 'Bahasa Indonesia']
                      : ['Chinese', 'English', '日本語', '한국어', 'Bahasa Indonesia']
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
            {isZh ? '让翻译阅读真正服务于论文理解' : 'Make translation serve paper understanding'}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600">
            {isZh
              ? 'Translation 不只是把原文转成另一种语言，而是帮助你在学术论文翻译、论文精读工具和文献综述工具之间建立更顺畅的阅读路径。先搜索，再对照阅读，再继续判断与沉淀。'
              : 'Translation is not just about converting text into another language. It helps connect academic paper translation, close reading, and literature review workflows into one smoother path.'}
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <span>{isZh ? '开始翻译阅读' : 'Start Reading with Translation'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
