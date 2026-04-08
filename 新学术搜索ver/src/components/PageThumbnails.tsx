import React from 'react';

interface PageThumbnailsProps {
  currentPage: number;
  totalPages: number;
  onPageClick: (page: number) => void;
}

export function PageThumbnails({ currentPage, totalPages, onPageClick }: PageThumbnailsProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-3">
      <div className="grid grid-cols-2 gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageClick(page)}
            className={`aspect-[3/4] bg-white border-2 rounded overflow-hidden hover:border-blue-400 transition-colors relative group ${
              page === currentPage ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
          >
            {/* Thumbnail Preview */}
            <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-2">
              {/* Simulated page content */}
              <div className="w-full space-y-1">
                <div className="h-1 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-1 bg-gray-300 rounded w-full"></div>
                <div className="h-1 bg-gray-300 rounded w-5/6 mx-auto"></div>
                <div className="h-0.5 bg-gray-200 rounded w-full mt-2"></div>
                <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                <div className="h-0.5 bg-gray-200 rounded w-4/5"></div>
                <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                <div className="h-0.5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-0.5 bg-gray-200 rounded w-full"></div>
                <div className="h-0.5 bg-gray-200 rounded w-5/6"></div>
              </div>
              
              {/* Page number overlay */}
              <div className="absolute bottom-1 left-0 right-0 text-center">
                <span className={`text-xs font-medium ${
                  page === currentPage ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {page}
                </span>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-opacity pointer-events-none"></div>
          </button>
        ))}
      </div>
    </div>
  );
}
