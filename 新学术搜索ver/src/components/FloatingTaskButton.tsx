import React from 'react';
import { Sparkles } from 'lucide-react';

interface FloatingTaskButtonProps {
  onClick: () => void;
}

export function FloatingTaskButton({ onClick }: FloatingTaskButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group"
    >
      <Sparkles className="w-5 h-5 animate-pulse" />
      <span className="font-medium text-sm">新手任务</span>
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce border-2 border-white">
        5
      </div>
    </button>
  );
}