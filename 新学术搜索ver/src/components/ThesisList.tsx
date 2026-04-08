import React from 'react';
import { GraduationCap, ExternalLink, Download, Eye } from 'lucide-react';

interface Thesis {
  id: string;
  title: string;
  author: string;
  supervisor: string;
  department: string;
  degree: string;
  year: number;
  abstract: string;
  keywords: string[];
  views: number;
  downloads: number;
}

interface ThesisListProps {
  theses: Thesis[];
  onThesisClick?: (thesis: Thesis) => void;
}

export function ThesisList({ theses, onThesisClick }: ThesisListProps) {
  return (
    <div className="space-y-4">
      {theses.map((thesis) => (
        <div
          key={thesis.id}
          className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-5 cursor-pointer"
          onClick={() => onThesisClick?.(thesis)}
        >
          <div className="flex gap-4">
            {/* Thesis Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            {/* Thesis Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                    {thesis.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
                    <span>作者：{thesis.author}</span>
                    <span>导师：{thesis.supervisor}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{thesis.department}</span>
                    <span>·</span>
                    <span>{thesis.degree}</span>
                    <span>·</span>
                    <span>{thesis.year}年</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-2">
                {thesis.abstract}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {thesis.keywords.slice(0, 4).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{thesis.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>{thesis.downloads}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {theses.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无学位论文</h3>
          <p className="text-gray-600">请尝试其他搜索条件</p>
        </div>
      )}
    </div>
  );
}
