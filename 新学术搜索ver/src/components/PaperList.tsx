import React from 'react';
import { PaperCard } from './PaperCard';
import { Paper } from '../types';
import { FileSearch } from 'lucide-react';

interface PaperListProps {
  papers: Paper[];
  selectedPaper: Paper | null;
  onSelectPaper: (paper: Paper) => void;
}

export function PaperList({ papers, selectedPaper, onSelectPaper }: PaperListProps) {
  if (papers.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No papers found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          isSelected={selectedPaper?.id === paper.id}
          onSelect={() => onSelectPaper(paper)}
        />
      ))}
    </div>
  );
}
