import React from 'react';

interface TextTypeProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  startDelay?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
}

export function TextType({
  text,
  className,
  typingSpeed = 55,
  startDelay = 120,
  showCursor = true,
  cursorCharacter = '|',
}: TextTypeProps) {
  const characters = React.useMemo(() => Array.from(text), [text]);
  const [visibleLength, setVisibleLength] = React.useState(0);

  React.useEffect(() => {
    setVisibleLength(0);

    if (!characters.length) {
      return;
    }

    let timeoutId: number | undefined;

    const tick = (nextIndex: number) => {
      timeoutId = window.setTimeout(() => {
        setVisibleLength(nextIndex);

        if (nextIndex < characters.length) {
          tick(nextIndex + 1);
        }
      }, nextIndex === 1 ? startDelay : typingSpeed);
    };

    tick(1);

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [characters, startDelay, typingSpeed]);

  const visibleText = characters.slice(0, visibleLength).join('');
  const shouldShowCursor = showCursor && visibleLength < characters.length;

  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      <span className="invisible whitespace-pre">
        {text}
        {showCursor ? cursorCharacter : ''}
      </span>
      <span className="absolute inset-0 whitespace-pre">
        {visibleText}
        {shouldShowCursor ? <span className="ml-0.5 inline-block animate-pulse">{cursorCharacter}</span> : null}
      </span>
    </span>
  );
}
