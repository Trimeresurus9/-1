import React from 'react';

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  baseColor?: string;
  shineColor?: string;
}

const shinyTextKeyframes = `
  @keyframes shiny-text-sweep {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: -100% 50%;
    }
  }
`;

export function ShinyText({
  text,
  className,
  speed = 2.8,
  baseColor = 'rgba(255, 255, 255, 0.72)',
  shineColor = 'rgba(255, 255, 255, 1)',
}: ShinyTextProps) {
  return (
    <>
      <style>{shinyTextKeyframes}</style>
      <span
        className={className}
        style={{
          color: 'transparent',
          backgroundImage: `linear-gradient(120deg, ${baseColor} 40%, ${shineColor} 50%, ${baseColor} 60%)`,
          backgroundSize: '200% 100%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          animation: `shiny-text-sweep ${speed}s linear infinite`,
        }}
      >
        {text}
      </span>
    </>
  );
}
