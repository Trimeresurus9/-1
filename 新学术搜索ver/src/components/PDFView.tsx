import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Paper } from '../types';

interface PDFViewProps {
  paper: Paper;
}

export function PDFView({ paper }: PDFViewProps) {
  const [pdfScale, setPdfScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
      {/* PDF Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-gray-900">PDF Viewer</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="上一页"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600 min-w-[80px] text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="下一页"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPdfScale(Math.max(0.5, pdfScale - 0.1))}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="缩小"
          >
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-xs text-gray-600 w-12 text-center">
            {Math.round(pdfScale * 100)}%
          </span>
          <button
            onClick={() => setPdfScale(Math.min(2, pdfScale + 0.1))}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="放大"
          >
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="下载PDF"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="bg-white shadow-lg mx-auto"
            style={{
              transform: `scale(${pdfScale})`,
              transformOrigin: 'top center',
              marginBottom: `${(pdfScale - 1) * 500}px`,
            }}
          >
            {/* PDF Page Mockup */}
            <div className="aspect-[8.5/11] border border-gray-300 relative">
              <div className="absolute inset-0 p-12">
                {/* Title */}
                {currentPage === 1 && (
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                      {paper.title}
                    </h1>
                    <p className="text-sm text-gray-600 mb-2">
                      {paper.authors.slice(0, 5).join(', ')}
                    </p>
                    {paper.authors.length > 5 && (
                      <p className="text-sm text-gray-600">
                        {paper.authors.slice(5).join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Abstract Section */}
                {currentPage === 1 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">Abstract</h2>
                    <p className="text-sm text-gray-800 leading-relaxed mb-3">
                      {paper.abstract}
                    </p>
                  </div>
                )}

                {/* Content for other pages */}
                {currentPage > 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      {currentPage === 2 && '1. Introduction'}
                      {currentPage === 3 && '2. Model Architecture'}
                      {currentPage === 4 && '3. Attention Mechanism'}
                      {currentPage === 5 && '4. Experiments'}
                      {currentPage === 6 && '5. Results'}
                      {currentPage === 7 && '6. Discussion'}
                      {currentPage === 8 && '7. Conclusion'}
                    </h2>
                    <div className="space-y-3">
                      {[...Array(8)].map((_, i) => (
                        <p key={i} className="text-sm text-gray-800 leading-relaxed">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                          nisi ut aliquip ex ea commodo consequat.
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Page Number */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-xs text-gray-400">- {currentPage} -</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
