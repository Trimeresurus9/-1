import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface SearchMoreButtonProps {
  onSearchMore: () => void;
  isLoading?: boolean;
}

export function SearchMoreButton({ onSearchMore, isLoading = false }: SearchMoreButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Determine scroll direction
          if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
            // Scrolling down and past threshold
            setScrollDirection('down');
            setIsVisible(true);
          } else if (currentScrollY < lastScrollY.current) {
            // Scrolling up
            setScrollDirection('up');
            setIsVisible(false);
          }
          
          // Hide if at top
          if (currentScrollY < 100) {
            setIsVisible(false);
          }
          
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Backdrop gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      
      {/* Button Container */}
      <div className="relative px-6 pb-6 pt-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onSearchMore}
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-base font-medium">搜索中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-base font-medium">继续搜索更多文献</span>
                <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
          
          {/* Helper text */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              已加载 20 篇文献 · 向下滚动显示更多
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
