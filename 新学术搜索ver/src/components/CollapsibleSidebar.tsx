import React, { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CollapsibleSidebarProps {
  children: ReactNode;
  side: 'left' | 'right';
  isCollapsed: boolean;
  onToggle: () => void;
  width?: string;
}

export function CollapsibleSidebar({ 
  children, 
  side, 
  isCollapsed, 
  onToggle,
  width = 'w-64'
}: CollapsibleSidebarProps) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  const CollapsedIcon = side === 'left' ? ChevronRight : ChevronLeft;
  
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? 'w-0' : width
        } transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
          side === 'left' ? 'border-r' : 'border-l'
        } border-gray-200 bg-white relative`}
      >
        {/* Content */}
        <div className={`${width} h-full`}>
          {children}
        </div>
        
        {/* Toggle Button - Inside sidebar when expanded */}
        {!isCollapsed && (
          <button
            onClick={onToggle}
            className={`absolute top-4 ${
              side === 'left' ? '-right-3' : '-left-3'
            } z-10 p-1.5 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-colors`}
            title={`收起${side === 'left' ? '目录' : '评论'}`}
          >
            <Icon className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </aside>

      {/* Floating Toggle Button - When collapsed */}
      {isCollapsed && (
        <button
          onClick={onToggle}
          className={`fixed ${
            side === 'left' ? 'left-0' : 'right-0'
          } top-1/2 -translate-y-1/2 z-20 p-2 bg-white border ${
            side === 'left' ? 'border-l-0 rounded-r-lg' : 'border-r-0 rounded-l-lg'
          } border-gray-300 shadow-lg hover:bg-gray-50 transition-all hover:shadow-xl`}
          title={`展开${side === 'left' ? '目录' : '评论'}`}
        >
          <CollapsedIcon className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </>
  );
}
