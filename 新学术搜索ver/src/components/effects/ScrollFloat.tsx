import React from "react";

type ScrollFloatProps = {
  children: React.ReactNode;
  /**
   * Maximum upward translation (px) applied while scrolling down.
   * Defaults to 32px.
   */
  maxLiftPx?: number;
  /**
   * Lift speed relative to scroll delta. Higher means more movement.
   * Defaults to 0.18.
   */
  liftFactor?: number;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * A lightweight "scroll-float" effect: the content gently lifts upward
 * as the page scrolls down from its initial position.
 */
export function ScrollFloat({
  children,
  maxLiftPx = 32,
  liftFactor = 0.18,
  className,
}: ScrollFloatProps) {
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  const startScrollYRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const getScrollY = () =>
      window.scrollY ?? document.documentElement.scrollTop ?? 0;

    startScrollYRef.current = getScrollY();

    const update = () => {
      rafRef.current = null;
      const start = startScrollYRef.current ?? 0;
      const delta = getScrollY() - start;
      const lift = clamp(-delta * liftFactor, -maxLiftPx, 0);

      setStyle({
        transform: `translate3d(0, ${lift.toFixed(2)}px, 0)`,
        willChange: "transform",
      });
    };

    const onScrollOrResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [liftFactor, maxLiftPx]);

  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
}

