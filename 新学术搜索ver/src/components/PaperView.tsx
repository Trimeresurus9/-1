import React from 'react';
import { Paper } from '../types';
import { mockSentencePairs } from '../data/mockSentences';

interface PaperViewProps {
  paper: Paper;
  currentPage: number;
  pdfScale: number;
}

export function PaperView({ paper, currentPage, pdfScale }: PaperViewProps) {
  const pdfPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  
  // Group sentences by page
  const sentencesByPage: Record<number, any[]> = {};
  mockSentencePairs.forEach(sentence => {
    if (!sentencesByPage[sentence.page]) {
      sentencesByPage[sentence.page] = [];
    }
    sentencesByPage[sentence.page].push(sentence);
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100">
      <div className="py-6 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {pdfPages.map((page) => (
            <div
              key={page}
              data-page={page}
              className="bg-white shadow-lg"
              style={{
                transform: `scale(${pdfScale})`,
                transformOrigin: 'top center',
                marginBottom: `${(pdfScale - 1) * 300}px`,
              }}
            >
              {/* PDF Page Content */}
              <div className="aspect-[8.5/11] border border-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 p-12 overflow-hidden">
                  <div className="space-y-2 text-justify">
                    {sentencesByPage[page]?.map((sentence) => {
                      const baseClasses = 'text-xs text-gray-800 leading-relaxed inline';
                      
                      if (sentence.elementId.includes('title')) {
                        return (
                          <span
                            key={sentence.id}
                            className={`${baseClasses} text-lg font-bold text-gray-900 block text-center mb-4`}
                          >
                            {sentence.original}
                          </span>
                        );
                      } else if (sentence.elementId.includes('author')) {
                        return (
                          <span
                            key={sentence.id}
                            className={`${baseClasses} text-xs text-gray-700 block text-center mb-4`}
                          >
                            {sentence.original}
                          </span>
                        );
                      } else if (sentence.elementId.includes('heading')) {
                        return (
                          <span
                            key={sentence.id}
                            className={`${baseClasses} text-sm font-bold text-gray-900 block mt-4 mb-2`}
                          >
                            {sentence.original}
                          </span>
                        );
                      } else {
                        return (
                          <span
                            key={sentence.id}
                            className={baseClasses}
                          >
                            {sentence.original}{' '}
                          </span>
                        );
                      }
                    })}
                  </div>
                </div>

                {/* Page Number */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <span className="text-xs text-gray-400">- {page} -</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}