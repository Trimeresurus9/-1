import React, { useState } from 'react';
import { Search, SlidersHorizontal, Share2, FileText } from 'lucide-react';
import { FilterOptions } from '../types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function SearchBar({ value, onChange, filters, onFiltersChange }: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="A voice-based algorithm can predict type 2 diabetes status in USA adults: related papers"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
          />
          <button className="p-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Sort by</label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="citations">Citations</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Year</label>
              <select className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All years</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
              <select className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>All categories</option>
                <option>Machine Learning</option>
                <option>Computer Vision</option>
                <option>NLP</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}