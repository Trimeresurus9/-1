import React, { useState } from 'react';
import { Search, ChevronRight, ChevronDown, Plus, Home, FolderOpen } from 'lucide-react';
import { Paper } from '../types';

interface MyLibraryProps {
  papers: Paper[];
  onPaperClick: (paper: Paper) => void;
}

export function MyLibrary({ papers, onPaperClick }: MyLibraryProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (date: string) => {
    return date;
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Title"
              className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Creator"
              className="w-32 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Year"
              className="w-20 text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-2">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600">
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Authors</div>
            <div className="col-span-2">Created At</div>
            <div className="col-span-1">Publication</div>
            <div className="col-span-1">Status</div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="px-6">
            {papers.slice(0, 7).map((paper, index) => (
              <div
                key={paper.id}
                className="border-b border-gray-100 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center text-sm">
                  {/* Title */}
                  <div className="col-span-5 flex items-start gap-2">
                    <button
                      onClick={() => toggleRow(paper.id)}
                      className="mt-0.5 text-gray-400 hover:text-gray-600 flex-shrink-0"
                    >
                      {expandedRows.has(paper.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onPaperClick(paper)}
                      className="text-left text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {paper.title}
                    </button>
                  </div>

                  {/* Authors */}
                  <div className="col-span-3 text-gray-700">
                    {paper.authors.slice(0, 2).join(', ')}
                    {paper.authors.length > 2 && ' etc.'}
                  </div>

                  {/* Created At */}
                  <div className="col-span-2 text-gray-600">
                    {formatDate(paper.date)}
                  </div>

                  {/* Publication */}
                  <div className="col-span-1 text-gray-600 truncate">
                    arXiv (Cornell...
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Item Count */}
          <div className="px-6 py-4 text-right">
            <span className="text-sm text-gray-500">This view has 7 items</span>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-center gap-4">
          <button className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded text-sm font-medium">
            1
          </button>
          <span className="text-sm text-gray-600">100 / page</span>
        </div>
      </div>
    </div>
  );
}