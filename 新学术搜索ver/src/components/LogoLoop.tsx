import React from 'react';
import partnerLogoPrimary from '../assets/fa745d526ea9ecf0301c6464b5897d1c96cb2f95.png';
import partnerLogoSecondary from '../assets/3ce02a66a6df7d8cd1f86de17846e94de4e9df61.png';

type MarketingLanguage = 'zh' | 'en';

interface LogoLoopProps {
  language: MarketingLanguage;
}

export function LogoLoop({ language }: LogoLoopProps) {
  const isZh = language === 'zh';
  const logos = [
    {
      src: partnerLogoPrimary,
      alt: isZh ? '合作伙伴 Logo 1' : 'Partner logo 1',
    },
    {
      src: partnerLogoSecondary,
      alt: isZh ? '合作伙伴 Logo 2' : 'Partner logo 2',
    },
  ];

  return (
    <section className="rounded-[2rem] bg-white/22 px-0 py-8 backdrop-blur-xl">
      <div className="px-6 pb-5 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          {isZh ? '合作伙伴' : 'Partners'}
        </h2>
      </div>

      <div className="grid gap-5 px-6 md:grid-cols-2">
        {logos.map((logo) => (
          <div
            key={logo.src}
            className="flex h-28 items-center justify-center rounded-2xl bg-white/80 px-6"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
