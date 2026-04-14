import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

type MarketingLanguage = 'zh' | 'en';

interface HomeFaqSectionProps {
  language: MarketingLanguage;
  onViewMore?: () => void;
}

const faqItems = [
  {
    zhQuestion: '什么是 WisPaper?',
    enQuestion: 'What is WisPaper?',
    zhAnswer: 'WisPaper 是一款基于“意图验证”的 AI 学术搜索引擎。它不只是简单的文献搜索引擎，而是一个能听懂大白话的科研助手。它能自动拆解您的需求，扫描海量元数据，为您筛选出真正高价值的 1% 核心文献，帮您告别低效的论文苦读。',
    enAnswer: 'WisPaper is an AI academic search engine built around intent validation. It goes beyond basic paper search by understanding natural-language research needs, scanning large-scale metadata, and surfacing the highest-value core papers.',
  },
  {
    zhQuestion: 'WisPaper 会产生 AI 幻觉吗?',
    enQuestion: 'Does WisPaper produce AI hallucinations?',
    zhAnswer: '不会。与 ChatGPT、Gemini、Claude 等通用生成式 AI 不同，我们严格基于真实发表的论文元数据进行检索和验证。每一次推荐都有据可查，确保引用来源真实可靠。',
    enAnswer: 'No. Unlike general-purpose generative AI systems, WisPaper retrieves and validates against published paper metadata, so every recommendation stays grounded in traceable academic sources.',
  },
  {
    zhQuestion: '“意图验证”和普通搜索有什么区别?',
    enQuestion: 'How is intent validation different from normal search?',
    zhAnswer: '普通搜索匹配关键词，如“LLM”；意图验证理解您的研究逻辑，如“LLM 在医疗领域的失败案例”，并帮您预读和筛选结果。',
    enAnswer: 'Normal search matches keywords like “LLM”, while intent validation interprets the underlying research logic, such as “failure cases of LLMs in healthcare”, then pre-reads and filters the results for you.',
  },
  {
    zhQuestion: 'WisPaper对科研流程有什么帮助？',
    enQuestion: 'How does WisPaper help the research workflow?',
    zhAnswer: 'Wispaper 包含AI Survey、灵感发现等功能，用户可以利用这些功能快速了解领域前沿进展、发现研究缺口，甚至进行实验复现。这种集成简化了前期调研流程，确保研究人员能够节省重复性认知劳动，把精力留给真正有价值的探索。',
    enAnswer: 'WisPaper includes features such as AI Survey and Idea Discovery, helping users quickly understand frontier progress in a field, identify research gaps, and even support experiment reproduction. This integrated workflow simplifies early-stage research, reduces repetitive cognitive work, and lets researchers focus their energy on exploration that creates real value.',
  },
  {
    zhQuestion: '免费版有什么限制?',
    enQuestion: 'What are the limits of the free plan?',
    zhAnswer: '免费账户依然可以通过登录和新手任务获取积分，可以使用搜索、问答等大部分功能，但不能体验 AI Survey 等最新功能。更多信息可以通过 Pricing 页面获取。',
    enAnswer: 'Free accounts can still earn credits through sign-in and onboarding tasks, and they can use most core features such as search and QA, but they do not include access to the newest capabilities like AI Survey. See the Pricing page for more details.',
  },
];

export function HomeFaqSection({ language, onViewMore }: HomeFaqSectionProps) {
  const isZh = language === 'zh';
  const [expandedIndexes, setExpandedIndexes] = React.useState<number[]>([]);

  return (
    <section className="rounded-[2rem] bg-white/22 px-6 py-8 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-4xl font-bold tracking-tight text-slate-950">
          {isZh ? '常见问题' : 'FAQ'}
        </h2>

        <div className="mt-8 space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = expandedIndexes.includes(index);

            return (
              <article key={item.enQuestion} className="overflow-hidden rounded-3xl bg-[#eef3f9]/85">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedIndexes((current) =>
                      current.includes(index)
                        ? current.filter((itemIndex) => itemIndex !== index)
                        : [...current, index],
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 px-8 py-7 text-left"
                >
                  <span className="text-xl leading-tight text-slate-800 md:text-[1.35rem]">
                    {isZh ? item.zhQuestion : item.enQuestion}
                  </span>
                  <ChevronDown
                    className={`h-7 w-7 shrink-0 text-slate-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen ? (
                  <div className="border-t border-slate-200/70 px-8 pb-7 pt-5 text-base leading-8 text-slate-600">
                    {isZh ? item.zhAnswer : item.enAnswer}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {onViewMore ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onViewMore}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>{isZh ? '查看更多' : 'View More'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
