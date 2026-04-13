import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../ui/utils';

interface CardNavItem {
  value: string;
  label: string;
}

export function CardNavTabs({
  items,
  value,
  onValueChange,
  className,
}: {
  items: CardNavItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, height: 0, top: 0 });

  const activeItem = useMemo(
    () => items.find((item) => item.value === value) ?? items[0],
    [items, value],
  );

  useEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current;
      const activeButton = activeItem ? itemRefs.current[activeItem.value] : null;
      if (!container || !activeButton) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeButton.getBoundingClientRect();

      setIndicator({
        left: activeRect.left - containerRect.left,
        top: activeRect.top - containerRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeItem, items]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-flex w-full max-w-[520px] flex-wrap items-center gap-2 rounded-[28px] border border-border/70 bg-white/90 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f6f7fb_100%)] shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-all duration-300 ease-out"
        style={{
          left: indicator.left,
          top: indicator.top,
          width: indicator.width,
          height: indicator.height,
        }}
      />

      {items.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            ref={(node) => {
              itemRefs.current[item.value] = node;
            }}
            type="button"
            onClick={() => onValueChange(item.value)}
            className={cn(
              'relative z-10 inline-flex min-w-[96px] flex-1 items-center justify-center rounded-[20px] px-5 py-3 text-base font-semibold tracking-tight transition-colors duration-200',
              active ? 'text-slate-950' : 'text-slate-500 hover:text-slate-900',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
