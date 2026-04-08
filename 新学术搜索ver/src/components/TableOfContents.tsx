import React from 'react';
import { DocumentElement } from '../types';
import { FileText, ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  elements: DocumentElement[];
  paperId: string;
}

export function TableOfContents({ elements, paperId }: TableOfContentsProps) {
  // Mock headings for summary view
  const mockHeadings = [
    { id: 'intro', title: 'I Introduction', level: 1 },
    { id: 'related', title: 'II Related Work', level: 1 },
    { id: 'theory', title: 'III Theory', level: 1 },
    { id: 'theory-a', title: 'III-A Denoising Diff...', level: 2 },
    { id: 'theory-b', title: 'III-B SynDiff', level: 2 },
    { id: 'theory-b1', title: 'III-B1 Adversarial Diff...', level: 3 },
    { id: 'theory-b2', title: 'III-B2 Network Arch...', level: 3 },
    { id: 'theory-b3', title: 'III-B3 Learning Proced...', level: 3 },
    { id: 'methods', title: 'IV Methods', level: 1 },
    { id: 'methods-a', title: 'IV-A Datasets', level: 2 },
    { id: 'methods-a1', title: 'IV-A1 IXI Dataset', level: 3 },
    { id: 'methods-a2', title: 'IV-A2 BraTS Dataset', level: 3 },
    { id: 'methods-a3', title: 'IV-A3 Duke MRI-CT D...', level: 3 },
    { id: 'methods-b', title: 'IV-B Computing Met...', level: 2 },
    { id: 'methods-b1', title: 'IV-B1 SynDiff', level: 3 },
  ];

  const headings = elements.length > 0 
    ? elements.filter(el => el.type === 'heading' || el.type === 'title')
    : mockHeadings;

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="py-2">
        <nav className="space-y-0.5">
          {headings.map((heading, index) => {
            const isTitle = heading.type === 'title';
            const level = heading.level || 1;
            const indent = isTitle ? 0 : (level - 1) * 12;
            const displayTitle = heading.title || heading.content;

            return (
              <button
                key={heading.id || `heading-${index}`}
                onClick={() => scrollToElement(heading.id || `heading-${index}`)}
                className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                style={{ paddingLeft: `${8 + indent * 8}px` }}
              >
                <span className={`line-clamp-1 ${level === 1 ? 'font-semibold text-gray-900' : ''}`}>
                  {displayTitle}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}